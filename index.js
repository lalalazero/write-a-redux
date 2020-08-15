function createStore(initState, reducer) {
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
    return {
        getState,
        subscribe,
        dispatch
    }
}
function reducer(state, action) {
    switch (action.type) {
        case 'increment': return { count: state.count + action.payload };
        case 'decrement': return { count: state.count - action.payload };
        default: return state
    }
}
let store = createStore({ count: 0 }, reducer)
function fn() {
    console.log('state has change')
    console.log(store.getState())
}
store.subscribe(fn)
store.dispatch({ type: 'increment', payload: 12 })
store.dispatch({ type: 'decrement', payload: 6 })
