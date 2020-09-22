const axios = require('axios')

let instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

class Api {
  register = (name, email, password) => {
    return instance.post('/register',
      { name: name, email: email, password: password })
  }

  login = (email, password) => {
    return instance.post('/login', { email: email, password: password })
  }

  logout = () => {
    return instance.post('/logout')
  }
}

export default new Api()