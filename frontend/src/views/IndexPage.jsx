import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import { withSnackbar } from 'notistack'

import { mobius } from '../utils/mobius'
import { purgeCreds } from '../utils/credUtil'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: 'loading' }

    this.onLogout = this.onLogout.bind(this)
    this.onReload = this.onReload.bind(this)
  }

  componentDidMount() {
    const self = this
    const impl = async () => {
      const { success, message, result } = await mobius.get('/api/info').priv(true).do()
      if (!success) {
        this.props.enqueueSnackbar(`获取数据失败: ${message}`)
      }
      self.setState({ text: result })
    }
    impl().then(() => {}).catch(err => this.props.enqueueSnackbar(`获取数据失败: ${err}`))
  }

  onReload() {
    const self = this
    const impl = async () => {
      const { success, message, result } = await mobius.get('/api/info2').priv(true).do()
      if (!success) {
        this.props.enqueueSnackbar(`获取数据失败: ${message}`)
      }
      self.setState({ text: result })
    }
    impl().then(() => {}).catch(err => this.props.enqueueSnackbar(`获取数据失败: ${err}`))
  }

  onLogout() {
    purgeCreds()
    this.props.history.replace('/login')
  }

  render() {
    return (
      <>
      </>
    )
  }
}

Index.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
}

export default withSnackbar(withRouter(Index))
