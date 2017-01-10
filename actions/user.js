import axios from "axios"

// callback(err, success)
export function registerUser(id, username, email, _csrf, callback) {
  return function(dispatch) {
    dispatch({type: "REGISTER_USER"})
    axios.post("/signup", { id, username, email, _csrf })
      .then((res) => {
        const taken = res.data
        if (taken.username || taken.email) {
          dispatch({type: "REGISTER_USER_TAKEN", payload: taken})
          callback(null, false)
        } else {
          dispatch({type: "REGISTER_USER_SUCCESS"})
          callback(null, true)
        }
      })
      .catch((err) => {
        dispatch({type: "REGISTER_USER_ERROR", payload: err})
        callback(err, false)
      })
  }
}
