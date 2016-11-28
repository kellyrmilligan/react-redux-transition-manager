import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import reactRouterFetch from 'react-router-fetch'
import { toggleAppFetching, getFetching } from '../redux/is-app-fetching'

const TransitionManager = class TransitionManager extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillReceiveProps (nextProps) {
    const current = `${this.props.location.pathname}${this.props.location.search}`
    const next = `${nextProps.location.pathname}${nextProps.location.search}`

    if (current === next) {
      return
    }
    this.fetchRoutes(nextProps)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.isAppFetching.isAppFetching
  }

  fetchRoutes (nextProps) {
    const { dispatch } = this.props
    dispatch(toggleAppFetching())
    // pass error compnent as a prop to show if transition has an error? yiiiisssss!!!
    // pass loading component? how can do this and keep the children from previous route?
    reactRouterFetch({
      components: nextProps.routes.map((route) => route.component),
      params: nextProps.params,
      location: nextProps.location
    }, false, {
      dispatch,
      getState: this.context.store.getState
    })
      .then(() => {
        dispatch(toggleAppFetching())
      },
      () => {
        dispatch(toggleAppFetching())
      })
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    isAppFetching: getFetching(state),
    location: ownProps.location,
    params: ownProps.params,
    routes: ownProps.routes
  }
}

export default connect(
  mapStateToProps
)(TransitionManager)
