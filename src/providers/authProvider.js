import api, { setAuthToken } from '@/services/api.js'; // ajusta la ruta si tu estructura es otra

// Token en memoria (mejor frente a XSS)
let accessToken = null;

function setAccessToken(at) {
  accessToken = at;
  setAuthToken(at); // actualizar header por defecto para api
}

function getAccessToken() {
  return accessToken;
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

    // Guardar tokens
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      // opcional: guardar refresh token (menos seguro que cookie HttpOnly)
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    // Si quieres, pide info de usuario /auth/me aquí (si tu backend lo expone)
    // const me = await api.get('/auth/me');

    return {
      exito: true,
      datos: {
        mensaje: 'Login exitoso',
        usuario: { email: credenciales.email }, // puedes cambiar si pides /auth/me
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
    const newAt = resp.data.accessToken;
    setAccessToken(newAt);
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
  }
}

export default {
  login,
  logout,
  getAccessToken,
  setAccessToken,
  refreshAccessToken
};