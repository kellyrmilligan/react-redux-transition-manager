react-transition-manager
=====================
Higher order component to enable loading states between route transitions


inspired by https://github.com/ReactTraining/react-router/issues/2101


in your top level component, wrap it's contents with transition manger like so...

```js

import React from 'react'
import TransitionManager from 'react-redux-transition-manager'

const App = (props) =>
  <TransitionManager {...props}
    onFetchStart={() => console.log('fetch started')}
    onFetchEnd={() => console.log('fetch end')}
    FetchingIndicator={<div className"Fetching">Loading awesomeness...</div>}
    ErrorIndicator={<div className="OOPS">Something went wrong</div>}
  >
    <div className="App">
      {props.children}
    </div>
  </TransitionManager>

export default App
```

in your entry file, import the redux action for signifying that fetching is happening. this has to happen above the component somewhere, in this example it's happening on history change.

```js
import { applyRouterMiddleware, Router, browserHistory, match } from 'react-router'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { toggleAppFetching } from 'react-redux-transition-manager/redux/is-app-fetching'

  const store = createStore(bootstrapState.preloadedState)//function to configure your reducers, etc
  const history = syncHistoryWithStore(browserHistory, store)

  let isInitial = true

  history.listen((location) => {
    //track stuff here
    if (!isInitial) {
      store.dispatch(toggleAppFetching())
    }
    isInitial = false
  })

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    render(
          <Provider store={store}>
            <Router routes={routes} history={history} render={applyRouterMiddleware(useScroll())} />
          </Provider>,
          document.getElementById('react-root'),
          () => {}
        )
  })
})
```



## TODO
- loading component to render
- error component to render
