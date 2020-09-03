import React, { Component } from 'react'

export const StoreContext = React.createContext()

export default class Provider extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <StoreContext.Provider value={this.props.store}>
            {this.props.children}
        </StoreContext.Provider>
    }
}