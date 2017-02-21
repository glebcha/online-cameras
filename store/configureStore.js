import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { apiMiddleware } from 'redux-api-middleware'
import rootReducer from '../reducers'

export default function configureStore(initialState, history) {
    const env = process.env.NODE_ENV
    const dev = env === 'development'
    const logger = createLogger()
    const middleware = [thunkMiddleware, apiMiddleware]

    if(dev) middleware.push(logger)

    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middleware)
    )

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}
