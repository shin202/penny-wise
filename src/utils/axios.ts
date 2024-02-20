import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import nProgress from 'nprogress'
import { setupCache } from 'axios-cache-interceptor'
import { useAuth } from '@/stores/auth.store'

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

const onFulfilledRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  nProgress.start()
  return config
}

const onRejectedRequestInterceptor = (error: any) => {
  nProgress.done()
  return Promise.reject(error)
}

const onFulfilledResponseInterceptor = (response: AxiosResponse) => {
  nProgress.done()
  return response.data
}

const onRejectedResponseInterceptor = async (error: AxiosError) => {
  const { response, config } = error

  if (response?.status !== 401) {
    nProgress.done()
    return Promise.reject(error.response?.data)
  }

  try {
    const { data } = await axios.get('/auth/refresh', {
      baseURL: '/api',
      withCredentials: true
    })

    const { accessToken } = <{ accessToken: string }>data.data

    const auth = useAuth()
    auth.setAccessToken(accessToken)

    config!.headers.Authorization = `Bearer ${accessToken}`
    nProgress.done()

    return instance(config!)
  } catch (e: any) {
    nProgress.done()
    localStorage.removeItem('auth')
    return Promise.reject(e.response.data)
  }
}

const cacheTtl = 60 * 1000 // 1 minute

export const httpRequest = setupCache(instance, {
  debug: console.log,
  ttl: cacheTtl
})

httpRequest.interceptors.request.use(onFulfilledRequestInterceptor, onRejectedRequestInterceptor)
httpRequest.interceptors.response.use(onFulfilledResponseInterceptor, onRejectedResponseInterceptor)
