import api from './axiosConfig.js'

export const authApi = {
  login: (data) =>
    api.post('/auth/login', data).then(r => r.data.data),

  register: (data) =>
    api.post('/auth/register', data).then(r => r.data.data),

  getProfile: () =>
    api.get('/auth/me').then(r => r.data.data),
}
