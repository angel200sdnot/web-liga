import { initStore } from '../store'
import { Provider } from 'react-redux'
import Router from 'next/router'
import Layout from '../layouts/main'

Router.onRouteChangeStart = (url) => console.log("route change start", url)
Router.onRouteChangeComplete = (url) => console.log("route change complete", url)
Router.onRouteChangeError = (url) => console.log("route change error", url)

export default class MyPage extends React.Component {
  static getInitialProps ({ req }) {
    const user = req ? req.user : null
    return { user }
  }

  render () {
    return (
      <div>
        <Layout user={this.props.user}>
          <p>Hola {this.props.user.steamname}</p> 
        </Layout>
      </div>
    )
  }
}