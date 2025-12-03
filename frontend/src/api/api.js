import axios from 'axios'

// const API_BASE_URL = 'http://localhost:3001/api'
const API_BASE_URL = 'https://xexit-61fy.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const userAPI = {
  submitResignation: (data) => api.post('/user/resign', data),
  submitResponses: (data) => api.post('/user/responses', data),
}

export const adminAPI = {
  getResignations: () => api.get('/admin/resignations'),
  concludeResignation: (data) => api.put('/admin/conclude_resignation', data),
  getExitResponses: () => api.get('/admin/exit_responses'),
}

export default api