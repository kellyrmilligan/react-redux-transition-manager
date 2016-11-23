import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import routeResolver from 'route-resolver'
import toggleIsAppLoading from 'actions/toggle-is-app-loading'

const TransitionManager = class TransitionManager extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.isAppLoading
  }

  componentWillReceiveProps (nextProps) {
    const current = `${this.props.location.pathname}${this.props.location.search}`
    const next = `${nextProps.location.pathname}${nextProps.location.search}`

    if (current === next) {
      return
    }
    this.fetchRoutes(nextProps)
  }

  fetchRoutes (nextProps) {
    this.props.dispatch(toggleIsAppLoading())
    // todo, how can we add a hook to a loading indicator that's generic?
    routeResolver({
      components: nextProps.routes.map((route) => route.component),
      params: nextProps.params,
      location: nextProps.location
    }, false, {
      dispatch: this.props.dispatch,
      getState: this.context.store.getState
    })
      .then(() => {
        this.props.dispatch(toggleIsAppLoading())
      },
      (err) => {
        this.props.dispatch(toggleIsAppLoading(err))
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
    isAppLoading: state.isAppLoading,
    location: ownProps.location,
    params: ownProps.params,
    routes: ownProps.routes
  }
}

export default connect(
  mapStateToProps
)(TransitionManager)
