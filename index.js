function combineReducer(obj){
    return function mergedReducer(state, action){
        let nextState = state 
        let keys = Object.keys(obj)
        for(let i = 0; i < keys.length; i++){
            const nextKey = keys[i]
            const nextReducer = obj[nextKey]
            const nextStateForKey = nextReducer(nextState[nextKey], action)
            nextState[nextKey] = nextStateForKey
        }
        return nextState
    }
}

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
    dispatch({ type: Symbol() }) // 获取每个 reducer 返回的 default state
    return {
        getState,
        subscribe,
        dispatch
    }
}
function countReducer(count = 0, action) {
    switch (action.type) {
        case 'increment': return count + action.payload;
        case 'decrement': return count - action.payload;
        default: return count
    }
}

let mergedReducer = combineReducer({
    count: countReducer
})

let store = createStore({}, mergedReducer)
function fn() {
    console.log('state has change')
    console.log(store.getState())
}
store.subscribe(fn)
store.dispatch({ type: 'increment', payload: 12 })
store.dispatch({ type: 'decrement', payload: 6 })
store.dispatch({ type: 'increment', payload: 2 })
store.dispatch({ type: 'decrement', payload: 4 })