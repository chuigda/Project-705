import React from 'react'
import {
  TextField,
  Button
} from '@mui/material'
import { withSnackbar } from 'notistack'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { mobius } from '../utils/mobius'
import { saveCreds } from '../utils/credUtil'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { userName: '', password: '' }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()

    const self = this
    const { userName, password } = self.state
    const impl = async () => {
      const { success, message, result } = await mobius.post('/api/login').data({
        userName, password
      }).do()
      if (success) {
        saveCreds(result)
        self.props.history.replace('/index')
      } else {
        this.props.enqueueSnackbar(`登录错误: ${message}`)
      }
    }
    impl().then(() => {}).catch(err => this.props.enqueueSnackbar(`${err}`))
  }

  render() {
    return (
      <>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <TextField
            required
            id="userName"
            label="用户名"
            value={this.state.userName}
            onInput={ e => this.setState({ userName: e.target.value }) }
            />
          <TextField
            required
            id="password"
            label="密码"
            value={this.state.password}
            onInput={ e => this.setState({ password: e.target.value }) }/>
          <Button type="submit" onClick={this.handleSubmit}>Login</Button>
        </form>
      </>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
}

export default withSnackbar(withRouter(Login))
