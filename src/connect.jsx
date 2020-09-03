import React, { Component } from 'react'
import { StoreContext } from './Provider'
import shallowequal from 'shallowequal'

function getDisplayName(WrapComponent) {
    return WrapComponent.displayName | WrapComponent.name | 'Component'
}

export default function connect(mapStateToProps = state => state, mapDispatchToProps = dispatch => { }) {
    return function wrapHOC(WrapComponent) {
        return class extends Component {
            static contextType = StoreContext
            static displayName = `Connect ${getDisplayName(WrapComponent)}`
            constructor(props, context) {
                super(props, context)
                this.store = context
                this.state = mapStateToProps(this.store.getState())
                this.actions = mapDispatchToProps(this.store.dispatch)
            }
            componentDidMount() {
                this.unsub = this.store.subscribe(() => {
                    this.setState(mapStateToProps(this.store.getState()))
                })
            }
            shouldComponentUpdate(nextProps, nextState) {
                return !shallowequal(nextProps, this.props) || !shallowequal(nextState, this.state)
            }
            componentWillUnmount() {
                this.unsub()
            }
            render() {
                return <WrapComponent {...this.state} {...this.props} {...this.actions}></WrapComponent>
            }
        }
    }
}