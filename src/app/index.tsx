import axios from 'axios'
import ReactDOM from 'react-dom/client'
import { realworld, handleGenericError } from '~shared/api'
import { useSessionStore } from '~shared/session'
import { Provider } from './providers'
import './main.css'

window.addEventListener('error', (event) => {
  if (axios.isAxiosError(event.error)) {
    event.preventDefault()
  }
})

realworld.interceptors.request.use(
  (config) => {
    const { session } = useSessionStore.getState()
    if (session) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${session.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

realworld.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    return Promise.reject(handleGenericError(error))
  },
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider />,
)
