/* eslint-disable no-shadow, func-names */

import axios from 'axios'
import { backendUrl, loggedOutActions } from '../config/config'
import { credHeaders, purgeCreds } from './credUtil'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Accept': 'application/json, text/plain, */*'
}

const axiosService = axios.create({
  baseURL: backendUrl,
  timeout: 60000,
  withCredentials: false,
})

axiosService.interceptors.response.use(
  response => {
    if (response.status === 401) {
      purgeCreds()
      loggedOutActions()
    }
    return response
  },
  error => Promise.reject(error)
)

export const AxiosRequest = (function () {
  function AxiosRequest(method, url) {
    this.method = method
    this.url = url
    this.priviledged = false
    this.headerObject = {}
    this.paramsObject = {}
    this.dataObject = null
  }

  AxiosRequest.prototype.priv = function (priviledged) {
    this.priviledged = priviledged
    return this
  }

  AxiosRequest.prototype.headers = function (headers) {
    this.headerObject = headers
    return this
  }

  AxiosRequest.prototype.params = function (params) {
    this.params = params
    return this
  }

  AxiosRequest.prototype.data = function (data) {
    this.dataObject = data
    return this
  }

  AxiosRequest.prototype.do = async function () {
    if (this.priviledged) {
      const creds = credHeaders()
      if (creds == null) {
        loggedOutActions()
      }

      const result = await axiosService.request({
        method: this.method,
        url: this.url,
        data: this.dataObject ? this.dataObject : undefined,
        params: this.paramsObject,
        headers: {
          ...this.headerObject,
          ...creds,
          ...corsHeaders
        }
      })
      return result.data
    } else {
      const result = await axiosService.request({
        method: this.method,
        url: this.url,
        data: this.dataObject ? this.dataObject : undefined,
        params: this.paramsObject,
        headers: {
          ...this.headerObject,
          ...corsHeaders
        }
      })
      return result.data
    }
  }

  return AxiosRequest
}())

export const mobius = {
  get: (url) => new AxiosRequest('get', url),
  post: (url) => new AxiosRequest('post', url),
  put: (url) => new AxiosRequest('put', url),
  delete: (url) => new AxiosRequest('delete', url)
}
