import { Component } from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {registerUser} from "../actions/user"
import Router from 'next/router'

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: ''
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value})
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.dispatch(registerUser(
      this.props.user._id,
      this.state.username,
      this.state.email,
      this.props.csrfToken,
      (err, success) => {
        if (err)
          return console.log("Error registering new user")
        if (success) {
          Router.push("/dashboard")
        }
      })
    )
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Esta cuenta de steam aun no esta registrada</p>
        <input type="text" name="username" placeholder="Nombre de usuario" value={this.state.username} onChange={this.handleUsernameChange} />
        <b hidden={!this.props.usernameTaken}>{this.props.usernameTaken} ya esta en uso</b><br/>
        <input type="text" name="email" placeholder="Correo electronico" value={this.state.email} onChange={this.handleEmailChange} />
        <b hidden={!this.props.emailTaken}>{this.props.emailTaken} ya esta en uso</b><br/>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

function mapStateToProps(state) {
    return {
        usernameTaken: state.taken.username,
        emailTaken: state.taken.email
    }
}

export default connect(mapStateToProps)(SignupForm)
