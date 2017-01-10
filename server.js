import bodyParser from 'body-parser'
import csrf from 'csurf'
import express from 'express'
import mongoose from 'mongoose'
import next from 'next'
import passport from 'passport'
import session from 'express-session'
import { Strategy as SteamStrategy } from 'passport-steam'
import { findById, initialize, register } from './database/user'

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 5000
let address, db, morgan
if (dev) {
  address = 'http://localhost:' + port
  db = "mongodb://localhost:27017/web-liga"
  morgan = require('morgan')
} else {
  address = "https://web-liga.herokuapp.com"
  db = "mongodb://heroku:58565254Heroku@ds151078.mlab.com:51078/web-liga"
}

// MongoDB
const MongoStore = require('connect-mongo')(session)
mongoose.Promise = global.Promise
mongoose.connect(db, (err) => {
  if (err) throw err
  console.log("Connected to MongoDB")
})

// Steam passport
passport.serializeUser(function(id, done) {
  done(null, id)
})

passport.deserializeUser(function(id, done) {
  findById(id, (err, user) => {
    if (err)
      console.log("Error deserializing user", err)
    done(null, user)
  })
})

passport.use(new SteamStrategy({
    returnURL: address + '/auth/steam/return',
    realm: address,
    apiKey: 'DBDC643CA768279DF0F2B1624C857477'
  },
  function(identifier, profile, done) {
    initialize(profile, (err, user) => {
      if (err)
        console.log("Error updating profile", err)
      return done(null, user._id)
    })
  }
))

// CSRF Protection
const csrfProtection = csrf()

// NextJS
const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()
app.prepare()
  .then(() => {
    //Express
    const server = express()

    server.get('/_*', (req, res) => {
      return handle(req, res)
    })

    server.get('/favicon.ico', (req, res) => {
      return handle(req,res)
    })

    if (dev)
      server.use(morgan('dev'))

    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: false }))

    server.use(session({
      secret: 'foo',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 30 * 60 * 1000 },
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    }))

    server.use(passport.initialize())
    server.use(passport.session())

    server.use(csrfProtection)

    server.get('/login', ensureNotAuthenticated, ensureNotRegistered, (req, res) => {
      return handle(req, res)
    })

    server.get('/logout', (req, res) => {
      req.session.destroy(function (err) {
        res.redirect('/')
      });
    })

    server.get('/auth/steam',
      passport.authenticate('steam', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('/')
      })

    server.get('/auth/steam/return',
      passport.authenticate('steam', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('/')
      })

    server.get('/signup', ensureAuthenticated, ensureNotRegistered, (req, res) => {
      return handle(req, res)
    })

    server.post('/signup', (req, res) => {
      register(req.body.id,
        req.body.username,
        req.body.email,
        (err, taken) => {
          if (err)
            return res.sendStatus(500).send('Something broke!')
          return res.send(taken)
        })
    })

    server.get('*', ensureAuthenticated, ensureRegistered, (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log('> Ready on ' + address)
    })
  })

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next()
  res.redirect('/login')
}

function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return res.redirect('/')
  next()
}

function ensureRegistered(req, res, next) {
  if (req.user) {
    if (req.user.username)
      return next()
  }
  res.redirect('/signup')
}

function ensureNotRegistered(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.username)
      return res.redirect('/')
  }
  next()
}
