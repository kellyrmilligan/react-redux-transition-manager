const isAppLoading = (state = { loading: false, err: null }, action) => {
  switch (action.type) {
    case 'TOGGLE_IS_APP_LOADING':
      return {
        loading: !state.loading,
        err: action.error ? action.payload : null
      }
    default:
      return state
  }
}

export default isAppLoading
