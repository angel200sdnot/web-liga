import Link from 'next/link'

export default class Header extends React.Component {
  render () {
    if (this.props.user) {
      return (
        <div>
          <p>
            {this.props.user.steamname} <img src={this.props.user.steamavatar[0].value} alt='Tu avatar de steam' />  <Link href="/dashboard" as="/dashboard"><a>Cuenta</a></Link>
          </p>
        </div>
      )
    } else {
      return <p>Desconectado</p>
    }
  }
}