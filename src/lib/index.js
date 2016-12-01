import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import reactRouterFetch from 'react-router-fetch'
import { toggleAppFetching, getFetching } from '../redux/is-app-fetching'
import ReactDOM, { unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer } from 'react-dom'

const FetchingIndicatorWrapper = ({ Indicator, shouldShow }) => (
  <div style={{ display: shouldShow ? 'block' : 'none' }}>
    {React.cloneElement(Indicator, { shouldShow })}
  </div>
)

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

  state = {
    isAppFetching: false
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
    this.renderLoading(true)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextState.isAppFetching
  }

  renderLoading (shoudShow) {
    const { FetchingIndicator } = this.props
    if (shoudShow) {
      document.body.classList.add('TransitionManager-body-is-fetching')
      this.portal = renderSubtreeIntoContainer(this, <FetchingIndicatorWrapper Indicator={FetchingIndicator} shouldShow={shoudShow} />, this.node)
    } else {
      document.body.classList.remove('TransitionManager-body-is-fetching')
      this.portal = renderSubtreeIntoContainer(this, <FetchingIndicatorWrapper Indicator={FetchingIndicator} shouldShow={shoudShow} />, this.node)
    }
  }

  componentWillUnmount () {
    if (this.node) {
      ReactDOM.unmountComponentAtNode(this.node)
      document.body.removeChild(this.node)
    }
    this.portal = null
    this.node = null
  }

  fetchRoutes (nextProps) {
    const { dispatch, onFetchStart, onFetchEnd } = this.props
    if (onFetchStart) onFetchStart()
    dispatch(toggleAppFetching())
    this.setState({
      isAppFetching: !this.state.isAppFetching
    }, () => {
      reactRouterFetch({
        components: nextProps.routes.map((route) => route.component),
        params: nextProps.params,
        location: nextProps.location
      }, false, {
        dispatch,
        getState: this.context.store.getState
      })
        .then(() => {
          this.setState({
            isAppFetching: !this.state.isAppFetching
          }, () => {
            this.renderLoading(false)
            if (onFetchEnd) onFetchEnd()
            dispatch(toggleAppFetching())
          })
        },
        (err) => {
          this.setState({
            isAppFetching: !this.state.isAppFetching
          }, () => {
            this.renderLoading(false)
            if (onFetchEnd) onFetchEnd(err)
            dispatch(toggleAppFetching(err))
          })
        })
    })
  }

  render () {
    const { ErrorIndicator, isAppFetching } = this.props
    if (isAppFetching.error) {
      return (
        <div>
          {React.cloneElement(ErrorIndicator, {...this.props})}
        </div>
      )
    }
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
