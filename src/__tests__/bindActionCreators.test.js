import { createStore, combineReducer, bindActionCreators } from '../index'

test('bindActionCreators', () => {
    let counter = (state = 0, action) => {
        switch (action.type) {
            case 'add': return state + action.payload
            case 'minus': return state - action.payload
            default: return state
        }
    }
    let reducer = combineReducer({
        count: counter
    })
    let store = createStore({}, reducer)
    expect(store.getState()).toEqual({ count: 0 })
    let add = (payload = 1) => ({
        type: 'add',
        payload
    })
    let minus = (payload = 1) => ({
        type: 'minus',
        payload
    })

    let boundActionAdd = bindActionCreators(add, store.dispatch)
    boundActionAdd()
    expect(store.getState()).toEqual({ count: 1 })
    boundActionAdd(3)
    expect(store.getState()).toEqual({ count: 4 })

    let boundActionMinus = bindActionCreators({ minus }, store.dispatch)
    boundActionMinus.minus()
    expect(store.getState()).toEqual({ count: 3 })
    boundActionMinus.minus(3)
    expect(store.getState()).toEqual({ count: 0 })
})