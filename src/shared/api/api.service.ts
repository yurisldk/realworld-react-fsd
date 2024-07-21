const BASE_URL = 'https://api.realworld.io/api'

export function getUrl(path?: string) {
  return BASE_URL.concat(path || '')
}

class AuthHeaderService {
  private header = new Headers()

  constructor() {
    this.init()
  }

  getHeader() {
    return Object.fromEntries(this.header)
  }

  setHeader(value: string) {
    this.header.set('Authorization', `Bearer ${value}`)
  }

  resetHeader() {
    this.header.delete('Authorization')
  }

  private init() {
    const token = this.getTokenFromLocalStorage()
    if (token) {
      this.setHeader(token)
    }
  }

  private getTokenFromLocalStorage(): string | null {
    const sessionData = localStorage.getItem('session')

    if (!sessionData) return null

    try {
      const sessionObject = JSON.parse(sessionData) as {
        state: { session: { token: string } }
      }
      return sessionObject.state.session.token
    } catch (error) {
      return null
    }
  }
}

export const authHeaderService = new AuthHeaderService()
