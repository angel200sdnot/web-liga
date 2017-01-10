export default function reducer(state={
    taken: {
      username: null,
      email: null
    },
    checking: false,
    error: null
  }, action) {

    switch (action.type) {
      case "REGISTER_USER": {
        return {...state, checking: true}
      }
      case "REGISTER_USER_SUCCESS": {
        return {...state, checking: false}
      }
      case "REGISTER_USER_TAKEN": {
        return {...state, checking: false, taken: action.payload}
      }
      case "REGISTER_USER_FAILED": {
        return {...state, checking: false, error: action.payload}
      }
    }

    return state
}