// TODO: configurations shared by frontend and backend are stored in this json file
// in order to make these configurations work for both ESM and CJS
import { typeAssert } from '../utils/typeAssert'
import cfgattr from './cfgattr.json'

typeAssert(cfgattr, {
  dev: {
    backendUrl: 'string'
  },
  pro: {
    backendUrl: 'string'
  },
  creds: [
    {
      storageName: 'string',
      key: 'string',
      header: 'string'
    }
  ]
})

export const backendUrl = (() => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return cfgattr.dev.backendUrl
    default:
      return cfgattr.pro.backendUrl
  }
})()

export const userCreds = cfgattr.creds

// TODO: setup custom logged-out actions
// Giving a hint message, redirect the page, force page update or so
export const loggedOutActions = () => {
  window.location.href = '/logged-out'
}
