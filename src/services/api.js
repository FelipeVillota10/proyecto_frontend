import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // tu backend
  headers: { 'Content-Type': 'application/json' }
});

// helper para setear el header Authorization
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default api;