export default function createStore(initState, reducer = (state) => state, rewriteStore) {
    if (rewriteStore && typeof rewriteStore === 'function') {
        return rewriteStore(createStore)(initState, reducer)
    }
    let state = initState
    let listeners = []
    function getState() {
        return state
    }
    function dispatch(action) {
        state = reducer(state, action)
        notify()
    }
    function subscribe(fn) {
        listeners.push(fn)
    }
    function notify() {
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
        }
    }
    dispatch({ type: Symbol() }) // 获取每个 reducer 返回的 default state
    return {
        getState,
        subscribe,
        dispatch
    }
}