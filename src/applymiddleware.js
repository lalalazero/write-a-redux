export default function applyMiddlewares(middlewares) {
    return function rewriteStore(oldCreateStore) {
        return function newCreateStore(initState, reducer) {
            let store = oldCreateStore(initState, reducer)
            let { getState, dispatch } = store
            middlewares = middlewares.map(middleware => middleware({ getState, dispatch }))
            middlewares.reverse().map(middleware => dispatch = middleware(dispatch))
            store.dispatch = dispatch
            return store
        }
    }
}