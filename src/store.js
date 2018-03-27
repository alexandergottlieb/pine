import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}


const middleware = process.env.NODE_ENV !== 'production'
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk)

export default createStore(reducer, middleware);
