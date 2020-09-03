function bindActionCreator(actionCreator, dispatch) {
    if (typeof actionCreator === 'function') {
        return function () { return dispatch(actionCreator.apply(undefined, arguments)) }
    }
}

export default function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }
    if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error('actionCreators should be a function or a object.')
    }
    const keys = Object.keys(actionCreators)
    const boundActions = {}
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
            boundActions[key] = bindActionCreator(actionCreator, dispatch)
        }
    }
    return boundActions
}