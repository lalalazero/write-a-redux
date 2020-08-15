function createStore(initState) {
    let state = initState
    let listeners = []
    function getState() {
        return state
    }
    function setState(newState) {
        state = newState
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
        setState,
        subscribe
    }
}

let store = createStore({ count: 0 })
function fn() {
    console.log('state has change')
    console.log(store.getState())
}
store.subscribe(fn)
console.log(store.getState())
store.setState({ count: 1 })
