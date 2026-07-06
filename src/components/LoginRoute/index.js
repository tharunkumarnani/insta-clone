import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginRoute extends Component {
  state = {errMsg: '', username: '', password: ''}

  onSubmitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const loginApi = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const res = await fetch(loginApi, options)
    const data = await res.json()
    if (res.ok === true) {
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 7})
      const {history} = this.props
      const {replace} = history
      replace('/')
    } else {
      this.setState({errMsg: data.error_msg})
    }
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  render() {
    const {errMsg, username, password} = this.state
    return (
      <div className="login-page">
        <img
          alt="website login"
          className="insta-banner"
          src="https://res.cloudinary.com/dcbox8yto/image/upload/v1766592436/instaShare/Illustration_1_aifpor.png"
        />
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <img
            alt="website logo"
            className="logo"
            src="https://res.cloudinary.com/dcbox8yto/image/upload/v1766593471/instaShare/logo_aixmqo.png"
          />
          <h1 className="insta-heading">Insta Share</h1>
          <label className="label-style" htmlFor="username">
            USERNAME
          </label>
          <input
            onChange={this.onChangeUsername}
            className="input-style"
            id="username"
            type="text"
            placeholder="username"
            value={username}
          />

          <label className="label-style" htmlFor="password">
            PASSWORD
          </label>
          <input
            onChange={this.onChangePassword}
            className="input-style"
            id="password"
            type="password"
            value={password}
          />
          {errMsg && <p className="err-msg">{errMsg}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default LoginRoute
