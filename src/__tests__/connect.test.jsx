import React, { Component } from 'react'
import { Provider, createStore, connect } from '../index'
import { mount } from 'enzyme'

let StatelessApp
let store
let Connected
let wrapper
let reducer = (state, action) => {
    switch (action.type) {
        case 'add': {
            return { ...state, count: state.count + 1 }
        }
        case 'minus': {
            return { ...state, count: state.count - 1 }
        }
        default: return state
    }
}
let mapDispatch = dispatch => ({
    add: () => dispatch({ type: 'add' }),
    minus: () => dispatch({ type: 'minus' })
})

class StatefulApp extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div>{this.props.msg}</div>
    }
}

describe('stateless', () => {
    beforeEach(() => {
        StatelessApp = ({ msg, count, add, minus }) => <div>
            <p>{msg}/{count}</p>
            <button id='add' onClick={add}>add</button>
            <button id='minus' onClick={minus}>minus</button>
        </div>;
        Connected = connect(state => state, mapDispatch)(StatelessApp);
        store = createStore({ msg: 'hello', count: 0 }, reducer);
        wrapper = mount(
            <Provider store={store}>
                <Connected />
            </Provider>
        );
    })

    test('map state to props', () => {
        expect(wrapper.find('p').text()).toBe('hello/0')
    })
    test('map dispatch to props and rerender', () => {
        wrapper.find('#add').simulate('click')
        expect(wrapper.find('p').text()).toBe('hello/1')
    })
    test('rerender when subscribe props change', () => {
        store.dispatch({
            type: 'minus'
        })
        expect(wrapper.find('p').text()).toBe('hello/-1')
    })
    test('won`t rerender when unsubscribe props change', () => {
        let fn = jest.fn()
        StatelessApp = ({ msg, count, add, minus }) => {
            fn()
            return <div>
                <p>{msg}/{count}</p>
                <button id='add' onClick={add}>add</button>
                <button id='minus' onClick={minus}>minus</button>
            </div>
        };
        Connected = connect(state => ({ msg: state.msg }))(StatelessApp)
        store = createStore({ msg: 'hello', count: 0 }, reducer);
        wrapper = mount(
            <Provider store={store}>
                <Connected />
            </Provider>
        )
        store.dispatch({
            type: 'minus'
        })
        expect(wrapper.find('p').text()).toBe('hello/')
        expect(fn).toBeCalledTimes(1)

    })

})

describe('stateful', () => {
    beforeEach(() => {
        Connected = connect(state => state)(StatefulApp)
        store = createStore({ msg: 'hello', count: 0 });
        wrapper = mount(
            <Provider store={store}>
                <Connected />
            </Provider>
        );
    })

})

