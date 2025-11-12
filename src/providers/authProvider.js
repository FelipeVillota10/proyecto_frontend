import api, { setAuthToken } from '@/services/api.js'; // ajusta la ruta si tu estructura es otra

// Token en memoria (mejor frente a XSS)
let accessToken = null;

function setAccessToken(at) {
  accessToken = at;
  setAuthToken(at); // actualizar header por defecto para api (axios)
}

function getAccessToken() {
  return accessToken;
}

// --- Al cargar el provider, intenta recuperar token guardado en localStorage ---
const existingToken = localStorage.getItem('token');
if (existingToken) {
  // sincroniza memoria + axios header
  setAccessToken(existingToken);
}

async function login(credenciales) {
  try {
    // Mapeo: backend espera { email, password }
    const payload = {
      email: credenciales.email,
      password: credenciales.contrasena // aquí convertimos
    };

    const resp = await api.post('/auth/login', payload);
    const data = resp.data;

    // Guardar tokens (compatibilidad con accessToken o token)
    const token = data.accessToken || data.token;
    if (token) {
      setAccessToken(token);                 // guarda en memoria + setAuthToken() actualiza headers
      localStorage.setItem('token', token);  // persiste para recargas
    }

    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    // Opcional: pedir /auth/me si quieres obtener datos de usuario
    // const me = await api.get('/auth/me');

    return {
      exito: true,
      datos: {
        mensaje: 'Login exitoso',
        usuario: { email: credenciales.email }, // puedes reemplazar con me.data si pides /auth/me
        raw: data
      }
    };
  } catch (err) {
    console.error('authProvider.login error', err);
    const message = err.response?.data || err.message || 'Error en login';
    return { exito: false, error: message };
  }
}

async function refreshAccessToken() {
  try {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) throw new Error('No hay refresh token');

    const resp = await api.post('/auth/refresh', { refreshToken: rt });
    const newAt = resp.data.accessToken || resp.data.token;

    if (!newAt) throw new Error('No se recibió nuevo accessToken');

    setAccessToken(newAt);
    localStorage.setItem('token', newAt); // actualizar persistencia
    return newAt;
  } catch (err) {
    console.error('refresh failed', err);
    throw err;
  }
}

async function logout() {
  // tomamos el refresh token antes de borrarlo
  const rt = localStorage.getItem('refreshToken');

  try {
    if (rt) {
      await api.post('/auth/logout', { refreshToken: rt });
    } else {
      try {
        await api.post('/auth/logout', {});
      } catch (e) {
        // ignore
      }
    }
  } catch (err) {
    console.warn('Error al solicitar logout en servidor:', err?.response?.data ?? err.message ?? err);
  } finally {
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
  }
}

export default {
  login,
  logout,
  getAccessToken,
  setAccessToken,
  refreshAccessToken
};