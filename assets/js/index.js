// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import 'phoenix_html'
import { Poll } from './poll'
import { Team } from './team'
import { ChannelPoll } from './channel_poll'
import { StripeProvider } from 'react-stripe-elements';

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import rootSaga from './sagas'
import configureStore from './store'
import { MuiThemeProvider } from 'material-ui/styles/'
import theme from './theme/'
import axios from 'axios';
import { CONFIGURATION } from './config/index'

import App from './app'

/*eslint-disable*/
const poll = new Poll()
const team = new Team()
const channelPoll = new ChannelPoll()
/*eslint-enable*/

const initialState = {}
const history = createBrowserHistory()
const store = configureStore(initialState, history)
store.runSaga(rootSaga)

const setupInterceptors = (reactStore) => {
  axios.interceptors.response.use((response) => response,
  (error) => {
      // catches the errors (all of them)
    if (error) {
      console.error(error)
      reactStore.dispatch({ type: "SOMETHING TERRIBLY WRONG HAPPENED :()" });
    }
    return Promise.reject(error);
  });
};

setupInterceptors(store);

if (document.getElementById('app')) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <StripeProvider apiKey={CONFIGURATION.stripePublishableKey}>
            <App />
          </StripeProvider>
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
    , document.getElementById('app')
  )
}
