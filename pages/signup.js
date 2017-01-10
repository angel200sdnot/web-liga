import React from 'react'
import { Provider } from 'react-redux'
import { initStore } from '../store'
import userReducer from '../reducers/user'
import SignupForm from '../components/signup-form'
import Layout from '../layouts/main'

export default class Signup extends React.Component {
  static getInitialProps({ req }) {
    const user = req ? req.user : null
    const csrfToken = req.csrfToken()
    const isServer = !!req
    const store = initStore(userReducer, null, isServer)
    return { csrfToken, initialState: store.getState(), isServer, user }
  }

  constructor (props) {
    super(props)
    this.store = initStore(userReducer, props.initialState, props.isServer)
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <Provider store={this.store}>
        <Layout user={this.props.user}>
          <SignupForm csrfToken={this.props.csrfToken} user={this.props.user}/>
        </Layout>
      </Provider>
    )
  }
}