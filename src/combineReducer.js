export default function combineReducer(obj) {
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