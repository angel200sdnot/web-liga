export default class Footer extends React.Component {
  render () {
    if (this.props.user) {
      return <a href="/logout">Desconectarse</a>
    } else {
      return <a href="/auth/steam">Conectarse con Steam</a>
    }
  }
}