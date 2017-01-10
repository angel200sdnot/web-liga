import parallel from 'async/parallel'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  _id: {
    type: String
  },
  steamname: {
    type: String,
  },
  steamavatar: [{
    value: {
      type: String
    }
  }],
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  profileurl: {
    type: String
  }
});

let User
try {
  User = mongoose.model("User")
} catch (err) {
  User = mongoose.model("User", userSchema)
}

export function findById(id, callback) {
  User.findById(id)
    .then((user) => {
      callback(null, user)
    })
    .catch((err) => {
      callback(err, null)
    })
}

export function initialize(user, callback) {
  const update = {
    _id: user.id,
    steamname: user.displayName,
    steamavatar: user.photos,
    profileurl: user._json.profileurl
  }
  const options = { new: true, upsert: true }
  User.findByIdAndUpdate(user.id, update, options)
    .then((user) => {
      callback(null, user)
    })
    .catch((err) => {
      callback(err, null)
    })
}

export function register(id, username, email, callback) {
  let taken = {
    username: null,
    email: null
  }
  parallel([
    (callback) => {
      User.findOne({username})
        .then((user) => {
          callback(null, user)
        })
        .catch((err) => {
          callback(err, null)
        })
    },
    (callback) => {
      User.findOne({email})
        .then((user) => {
          callback(null, user)
        })
        .catch((err) => {
          callback(err, null)
        })
    }
  ], (err, result) => {
    if (err) {
      return callback(err, null)
    }
    if (result[0])
      taken.username = username
    if (result[1])
      taken.email = email
    if (taken.username || taken.email) {
      return callback(null, taken)
    }
    User.update({_id: id}, { username, email })
      .then((raw) => {
        callback(null, taken)
      })
      .catch((err) => {
        callback(err, null)
      })
  })
}
