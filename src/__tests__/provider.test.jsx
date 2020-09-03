import React, { useContext } from 'react'
import testRenderer from 'react-test-renderer'
import { Provider, createStore } from '../index'
import { StoreContext } from '../Provider'

test('context', (done) => {
    const store = createStore({})
    const App = () => {
        const storeContext = useContext(StoreContext)
        expect(storeContext).toBe(store)
        done()
        return <div>app</div>
    }

    testRenderer.create(
        <Provider store={store}>
            <App />
        </Provider>
    )

})