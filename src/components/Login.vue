<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Iniciar Sesión</h2>
      
      <form @submit.prevent="iniciarSesion">
        <div class="form-group">
          <label>Email:</label>
          <input 
            v-model="credenciales.email"
            type="email" 
            placeholder="ejemplo@correo.com"
            required
            :class="{ 'error': errores.email }"
          >
          <span v-if="errores.email" class="error-message">{{ errores.email }}</span>
        </div>

        <div class="form-group">
          <label>Contraseña:</label>
          <div class="password-container">
            <input 
              v-model="credenciales.contrasena"
              :type="mostrarContrasena ? 'text' : 'password'"
              placeholder="Mínimo 10 caracteres"
              required
              :class="{ 'error': errores.contrasena }"
              maxlength="20"
            >
            <button type="button" @click="mostrarContrasena = !mostrarContrasena" class="toggle-password">
              {{ mostrarContrasena ? '👁' : '⌣' }}
            </button>
          </div>
          <span v-if="errores.contrasena" class="error-message">{{ errores.contrasena }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox">
            <input type="checkbox" v-model="recordarSesion">
            Recordar sesión
          </label>
          <label class="checkbox">
            <input type="checkbox" v-model="autorizarDatos" required>
            Autorizar el uso de datos
          </label>
        </div>

        <button type="submit" :disabled="cargando" class="login-button">
          {{ cargando ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <div class="links">
          <a href="#" @click.prevent="irARegistro">Regístrate</a>
          <a href="#" @click.prevent="irARecuperar">¿Olvidaste tu contraseña?</a>
        </div>
      </form>

      <div v-if="errorGeneral" class="error-general">
        {{ errorGeneral }}
      </div>

      <div v-if="mensajeExito" class="success-message">
        {{ mensajeExito }}
      </div>
    </div>
  </div>
</template>

<script>
import authProvider from '@/providers/authProvider.js' // ajusta si no usas @ alias

const SPECIAL_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/

export default {
  name: 'Login',
  data() {
    return {
      credenciales: {
        email: '',
        contrasena: ''
      },
      mostrarContrasena: false,
      recordarSesion: false,
      autorizarDatos: false,
      cargando: false,
      errores: {},
      errorGeneral: '',
      mensajeExito: ''
    }
  },
  methods: {
    async iniciarSesion() {
      this.errores = {}
      this.errorGeneral = ''
      this.mensajeExito = ''
      this.cargando = true

      // validaciones UI
      if (!this.autorizarDatos) {
        this.errorGeneral = 'Debe autorizar el uso de datos para continuar'
        this.cargando = false
        return
      }      

      if (!this.validarEmail(this.credenciales.email)) {
        this.errores.email = 'La dirección de usuario no es válida'
        this.cargando = false
        return
      }

      if (!this.validarContrasena(this.credenciales.contrasena)) {
        this.errores.contrasena = 'La contraseña debe tener 10-20 caracteres, al menos un número y un caracter especial'
        this.cargando = false
        return
      }

      try {
        const resultado = await authProvider.login(this.credenciales)

        if (resultado.exito) {
          this.mensajeExito = resultado.datos.mensaje || 'Login exitoso'
          this.$router.push('/dashboard')
        } else {
          if (typeof resultado.error === 'string') {
            this.errorGeneral = resultado.error
          } else {
            const err = resultado.error
            this.errorGeneral = err?.response?.data?.message || err?.message || 'Credenciales inválidas'
          }
        }
      } catch (err) {
        console.error('Error inesperado en login', err)
        this.errorGeneral = err?.response?.data?.message || err?.message || 'Error en el proceso de autenticación'
      } finally {
        this.cargando = false
      }
    },

    validarEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },

    validarContrasena(contrasena) {
      const s = String(contrasena ?? '')
      const lenOk = s.length >= 10 && s.length <= 20
      const hasDigit = /\d/.test(s)
      const hasSpecial = SPECIAL_REGEX.test(s)
      return lenOk && hasDigit && hasSpecial
    },

    irARegistro() {
      this.$router.push('/usuarios')
    },

    irARecuperar() {
      alert('Funcionalidad de recuperación coming soon!')
    }
  },

  mounted() {
    console.log('Componente Login montado')
  }
}
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
}

input.error {
  border-color: #ff9800;
  background-color: #fff3e0;
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.error-message {
  color: #ff9800;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-options {
  margin: 1rem 0;
}

.checkbox {
  display: flex;
  align-items: center;
  margin: 0 !important;
  padding: 0 !important;
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}


.login-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.links {
  margin-top: 1.5rem;
  text-align: center;
}

.links a {
  display: block;
  color: #000000;
  text-decoration: none;
  margin: 0.5rem 0;
  transition: color 0.3s;
}

.links a:hover {
  color: #000000;
  text-decoration: underline;
}

.error-general {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
  border-left: 4px solid #c62828;
}

.success-message {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
  border-left: 4px solid #2e7d32;
}
</style>