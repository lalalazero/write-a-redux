function combineReducer(obj) {
    return function mergedReducer(state, action) {
        let nextState = state
        let keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            const nextKey = keys[i]
            const nextReducer = obj[nextKey]
            const nextStateForKey = nextReducer(nextState[nextKey], action)
            nextState[nextKey] = nextStateForKey
        }
        return nextState
    }
}

function applyMiddlewares(middlewares) {
    return function rewriteStore(oldCreateStore) {
        return function newCreateStore(initState, reducer) {
            let store = oldCreateStore(initState, reducer)
            let { getState, dispatch }= store
            middlewares = middlewares.map(middleware => middleware({ getState, dispatch }))
            middlewares.reverse().map(middleware => dispatch = middleware(dispatch))
            store.dispatch = dispatch
            return store
        }
    }
}

function createStore(initState, reducer, rewriteStore) {
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

const A = ({ getState, dispatch }) => next => action => {
    console.log('a do something')
    console.log(getState())
    next(action)
    console.log('a back')
}
const B = ({ getState, dispatch }) => next => action => {
    console.log('b do something')
    next(action)
    console.log('b back')
}
const C = ({ getState, dispatch }) => next => action => {
    console.log('c do something')
    next(action)
    console.log('c back')
}

const middlewares = [A,B,C]

let store = createStore({}, mergedReducer, applyMiddlewares(middlewares))
function fn() {
    console.log('state has change')
    console.log(store.getState())
}
store.subscribe(fn)
store.dispatch({ type: 'increment', payload: 12 })
// store.dispatch({ type: 'decrement', payload: 6 })
// store.dispatch({ type: 'increment', payload: 2 })
// store.dispatch({ type: 'decrement', payload: 4 })