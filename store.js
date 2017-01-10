import { applyMiddleware, combineReducers, createStore } from "redux"

import logger from "redux-logger"
import thunk from "redux-thunk"
const middleware = applyMiddleware(thunk, logger())

// If inialState == null then use default reducer values
export const initStore = (reducer, initialState, isServer) => {
  if (isServer && typeof window === 'undefined') {
    if (initialState)
      return createStore(reducer, initialState, middleware)
    return createStore(reducer, middleware)
  } else {
    if (!window.store) {
      if (initialState) {
        window.store = createStore(reducer, initialState, middleware)
      } else {
        window.store = createStore(reducer, middleware)
      }
    }
    return window.store
  }
}