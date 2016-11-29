import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import reactRouterFetch from 'react-router-fetch'
import { toggleAppFetching, getFetching } from '../redux/is-app-fetching'
import ReactDOM, { unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer } from 'react-dom'

const TransitionManager = class TransitionManager extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static propTypes = {
    onFetchStart: PropTypes.func,
    onFetchEnd: PropTypes.func,
    onError: PropTypes.func,
    FetchingIndicator: PropTypes.element,
    ErrorIndicator: PropTypes.element
  }

  componentDidMount () {
    this.node = document.createElement('div')
    document.body.appendChild(this.node)
  }

  componentWillReceiveProps (nextProps) {
    const current = `${this.props.location.pathname}${this.props.location.search}`
    const next = `${nextProps.location.pathname}${nextProps.location.search}`
    const { isAppFetching, onError } = nextProps
    if (isAppFetching.error && onError) onError(isAppFetching.payload)
    if (current === next) {
      return
    }

    this.fetchRoutes(nextProps)
    this.renderLoading(nextProps)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.isAppFetching.isAppFetching
  }

  renderLoading (props) {
    document.body.classList.add('TransitionManager-body-is-fetching')
    this.portal = renderSubtreeIntoContainer(this, this.props.FetchingIndicator, this.node)
  }

  unMountLoading () {
    ReactDOM.unmountComponentAtNode(this.node)
    document.body.classList.remove('TransitionManager-body-is-fetching')
  }

  fetchRoutes (nextProps) {
    const { dispatch, onFetchStart, onFetchEnd } = this.props
    if (onFetchStart) onFetchStart()
    reactRouterFetch({
      components: nextProps.routes.map((route) => route.component),
      params: nextProps.params,
      location: nextProps.location
    }, false, {
      dispatch,
      getState: this.context.store.getState
    })
      .then(() => {
        this.unMountLoading()
        if (onFetchEnd) onFetchEnd()
        dispatch(toggleAppFetching())
      },
      (err) => {
        this.unMountLoading()
        if (onFetchEnd) onFetchEnd()
        dispatch(toggleAppFetching(err))
      })
  }

  render () {
    const { onError: ErrorIndicator, isAppFetching } = this.props
    if (isAppFetching.error) return <ErrorIndicator {...this.props} />
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
