import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:1337',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    if (typeof localStorage === 'object' && localStorage.getItem('base-token')) {
      config.headers.Authorization = `Bearer ${localStorage?.getItem('base-token')}`
    }
    return config
  },
  function (error) {
    console.log('error is: ', error)
    return Promise.reject(error)
  }
)
