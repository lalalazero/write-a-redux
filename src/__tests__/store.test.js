


import { combineReducer, createStore, applyMiddlewares } from '../index'

test('createStore', () => {
    let store = createStore(0)
    expect(store.getState()).toEqual(0)
})

test('reducer', () => {
    let reducer = (state = 0, action) => {
        switch (action.type) {
            case 'add': return state + 1;
            case 'minus': return state - 1;
            default: return state
        }
    }
    let store = createStore(0, reducer)
    expect(store.getState()).toEqual(0)
    let fn = jest.fn()
    store.subscribe(fn)
    store.dispatch({ type: 'add' })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(store.getState()).toEqual(1)

})

test('combine reducers', () => {
    let counter = (state = 0, action) => {
        switch (action.type) {
            case 'add': return state + action.payload;
            case 'minus': return state - action.payload;
            default: return state
        }
    }
    let user = (state = { name: 'jack', age: 10 }, action) => {
        switch (action.type) {
            case 'setName': {
                return { ...state, name: action.payload }
            }
            case 'setAge': {
                return { ...state, age: action.payload }
            }
            default: return state;
        }
    }
    let reducer = combineReducer({
        counter,
        user
    })
    let store = createStore({}, reducer)
    expect(store.getState()).toEqual({ counter: 0, user: { name: 'jack', age: 10 } })
    store.dispatch({
        type: 'add',
        payload: 2
    })
    store.dispatch({
        type: 'setAge',
        payload: 18
    })
    expect(store.getState()).toEqual({ counter: 2, user: { name: 'jack', age: 18 } })
})


test('applymiddleware', () => {
    let steps = []
    const A = ({ getState, dispatch }) => next => action => {
        steps.push(1)
        next(action)
        steps.push(6)
    }
    const B = ({ getState, dispatch }) => next => action => {
        steps.push(2)
        next(action)
        steps.push(5)
    }
    const C = ({ getState, dispatch }) => next => action => {
        steps.push(3)
        next(action)
        steps.push(4)
    }
    const middlewares = [A, B, C]
    let counter = (state = 0, action) => {
        switch (action.type) {
            case 'add': return state + action.payload;
            case 'minus': return state - action.payload;
            default: return state
        }
    }
    let user = (state = { name: 'jack', age: 10 }, action) => {
        switch (action.type) {
            case 'setName': {
                return { ...state, name: action.payload }
            }
            case 'setAge': {
                return { ...state, age: action.payload }
            }
            default: return state;
        }
    }
    let reducer = combineReducer({
        counter,
        user
    })
    let store = createStore({}, reducer, applyMiddlewares(middlewares))
    expect(store.getState()).toEqual({ counter: 0, user: { name: 'jack', age: 10 } })
    store.dispatch({
        type: 'add',
        payload: 2
    })
    expect(steps.join('')).toEqual('123456')
    store.dispatch({
        type: 'setAge',
        payload: 18
    })
    expect(store.getState()).toEqual({ counter: 2, user: { name: 'jack', age: 18 } })
    expect(steps.join('')).toEqual('123456123456')

})
