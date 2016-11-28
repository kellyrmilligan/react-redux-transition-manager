import { createSelector } from 'reselect'

// action type
export const TOGGLE_IS_APP_FETCHING = 'TOGGLE_IS_APP_FETCHING'

// action
export function toggleAppFetching () {
  return {
    type: TOGGLE_IS_APP_FETCHING
  }
}

// reducer
function isAppFetchingReducer (state = { isAppFetching: false }, action) {
  switch (action.type) {
    case TOGGLE_IS_APP_FETCHING:
      return {
        isAppFetching: !state.isAppFetching
      }
    default:
      return state
  }
}

// selector
const isAppFetchingSelector = (state) => state.isAppFetching

export const getFetching = createSelector(
  isAppFetchingSelector,
  (isAppFetchingState) => isAppFetchingState
)

export default isAppFetchingReducer
