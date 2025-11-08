<template>
  <div class="usuarios">
    <h1>Registro de Usuarios</h1>

    <div class="form">
      <h3>Crear usuario</h3>

      <!-- nombre -->
      <input
        v-model="form.nombre"
        placeholder="Nombre"
        maxlength="100"
        @blur="touch('nombre')"
        :class="{ 'required-error': touched.nombre && !validNombre }"
      />
      <div v-if="touched.nombre && !form.nombre" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.nombre && form.nombre && !validNombre" class="field-error">Solo letras y espacios (máx. 100 caracteres)</div>

      <!-- apellido -->
      <input
        v-model="form.apellido"
        placeholder="Apellido"
        maxlength="100"
        @blur="touch('apellido')"
        :class="{ 'required-error': touched.apellido && !validApellido }"
      />
      <div v-if="touched.apellido && !form.apellido" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.apellido && form.apellido && !validApellido" class="field-error">Solo letras y espacios (máx. 100 caracteres)</div>

      <!-- tipo documento -->
      <input
        v-model.trim="form.tipoDocumento"
        placeholder="Tipo de documento"
        maxlength="50"
        @blur="touch('tipoDocumento')"
        :class="{ 'required-error': touched.tipoDocumento && !validTipoDocumento }"
      />
      <div v-if="touched.tipoDocumento && !form.tipoDocumento" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.tipoDocumento && form.tipoDocumento && !validTipoDocumento" class="field-error">Solo letras y espacios (máx. 50 caracteres)</div>

      <!-- número documento -->
      <input
        v-model="form.numDocumento"
        placeholder="Número de documento"
        @input="onlyDigits('numDocumento')"
        @blur="touch('numDocumento')"
        :class="{ 'required-error': touched.numDocumento && !validNumDocumento }"
      />
      <div v-if="touched.numDocumento && !form.numDocumento" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.numDocumento && form.numDocumento && !validNumDocumento" class="field-error">Solo números</div>

      <!-- teléfono -->
      <input
        v-model="form.telefono"
        placeholder="Teléfono"
        @input="onlyDigits('telefono')"
        @blur="touch('telefono')"
        :class="{ 'required-error': touched.telefono && !validTelefono }"
      />
      <div v-if="touched.telefono && !form.telefono" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.telefono && form.telefono && !validTelefono" class="field-error">Solo números</div>

      <!-- departamento -->
      <input
        v-model.trim="form.departamento"
        placeholder="Departamento"
        maxlength="100"
        @blur="touch('departamento')"
        :class="{ 'required-error': touched.departamento && !validDepartamento }"
      />
      <div v-if="touched.departamento && !form.departamento" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.departamento && form.departamento && !validDepartamento" class="field-error">Solo letras y espacios (máx. 100 caracteres)</div>

      <!-- ciudad -->
      <input
        v-model.trim="form.ciudad"
        placeholder="Ciudad"
        maxlength="100"
        @blur="touch('ciudad')"
        :class="{ 'required-error': touched.ciudad && !validCiudad }"
      />
      <div v-if="touched.ciudad && !form.ciudad" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.ciudad && form.ciudad && !validCiudad" class="field-error">Solo letras y espacios (máx. 100 caracteres)</div>

      <!-- dirección -->
      <input
        v-model="form.direccion"
        placeholder="Dirección"
        @blur="touch('direccion')"
        :class="{ 'required-error': touched.direccion && !validDireccion }"
      />
      <div v-if="touched.direccion && !form.direccion" class="field-error">Este campo es obligatorio para el envio de su pedido</div>

      <!-- email -->
      <input
        v-model.trim="form.email"
        placeholder="Email"
        type="email"
        @blur="touch('email')"
        :class="{ 'required-error': touched.email && !validEmail }"
      />
      <div v-if="touched.email && !form.email" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.email && form.email && !validEmail" class="field-error">Email inválido</div>

      <!-- contraseña -->
      <input
        v-model="form.contrasena"
        placeholder="Contraseña"
        type="password"
        @blur="touch('contrasena')"
        :class="{ 'required-error': touched.contrasena && !validContrasena }"
      />
      <div v-if="touched.contrasena && !form.contrasena" class="field-error">Este campo es obligatorio</div>
      <div v-else-if="touched.contrasena && form.contrasena && !validContrasena" class="field-error">La contraseña debe tener entre 10 y 20 caracteres, incluir al menos un número y un carácter especial</div>

      <div class="actions">
        <button @click="crearUsuario" :disabled="loading || !isValid">Crear</button>
        <button @click="reset" :disabled="loading">Limpiar</button>
        <button @click="volverALogin" class="back-button">← Volver al Login</button>
      </div>
    </div>

    <hr />

    <div v-if="loading">Cargando...</div>
    <div v-if="success" class="success">Usuario creado correctamente.</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import api from '../services/api.js'

export default {
  name: 'Usuarios',
  data() {
    return {
      usuarios: [],
      loading: false,
      success: false,
      errorMessage: '',
      form: {
        nombre: '',
        apellido: '',
        tipoDocumento: '',
        numDocumento: '',
        telefono: '',
        departamento: '',
        ciudad: '',
        direccion: '',
        email: '',
        contrasena: ''
      },
      touched: {
        nombre: false,
        apellido: false,
        tipoDocumento: false,
        numDocumento: false,
        telefono: false,
        departamento: false,
        ciudad: false,
        direccion: false,
        email: false,
        contrasena: false
      }
    }
  },
  computed: {
    validNombre() {
      const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
      return this.form.nombre && this.form.nombre.trim().length > 0 && regex.test(this.form.nombre.trim()) && this.form.nombre.trim().length <= 100
    },
    validApellido() {
      const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
      return this.form.apellido && this.form.apellido.trim().length > 0 && regex.test(this.form.apellido.trim()) && this.form.apellido.trim().length <= 100
    },
    validTipoDocumento() {
      const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
      const val = this.form.tipoDocumento.trim()
      return val.length > 0 && regex.test(val) && val.length <= 50
    },
    validNumDocumento() {
      return typeof this.form.numDocumento === 'string' && /^\d+$/.test(this.form.numDocumento) && this.form.numDocumento.length > 0
    },
    validTelefono() {
      return typeof this.form.telefono === 'string' && /^\d+$/.test(this.form.telefono) && this.form.telefono.length > 0
    },
    validDepartamento() {
      const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
      const val = this.form.departamento.trim()
      return val.length > 0 && regex.test(val) && val.length <= 100
    },
    validCiudad() {
      const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
      const val = this.form.ciudad.trim()
      return val.length > 0 && regex.test(val) && val.length <= 100
    },
    validDireccion() {
      return String(this.form.direccion).trim().length > 0
    },
    validEmail() {
      return /\S+@\S+\.\S+/.test(String(this.form.email))
    },
    validContrasena() {
      const s = String(this.form.contrasena)
      const lenOk = s.length >= 10 && s.length <= 20
      const hasDigit = /\d/.test(s)
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(s)
      return lenOk && hasDigit && hasSpecial
    },
    isValid() {
      return this.validNombre &&
        this.validApellido &&
        this.validTipoDocumento &&
        this.validNumDocumento &&
        this.validTelefono &&
        this.validDepartamento &&
        this.validCiudad &&
        this.validDireccion &&
        this.validEmail &&
        this.validContrasena
    }
  },
  methods: {
    touch(field) {
      if (field in this.touched) this.touched[field] = true
    },
    onlyDigits(field) {
      this.form[field] = String(this.form[field] ?? '').replace(/\D+/g, '')
    },
    resetTouched() {
      Object.keys(this.touched).forEach(k => this.touched[k] = false)
    },
    reset() {
      const initialForm = {
        nombre: '',
        apellido: '',
        tipoDocumento: '',
        numDocumento: '',
        telefono: '',
        departamento: '',
        ciudad: '',
        direccion: '',
        email: '',
        contrasena: ''
      }
      Object.keys(initialForm).forEach(k => this.form[k] = initialForm[k])
      this.success = false
      this.errorMessage = ''
      this.resetTouched()
    },
    volverALogin() {
      this.$router.push('/')
    },
    async crearUsuario() {
      Object.keys(this.touched).forEach(k => this.touched[k] = true)

      if (!this.isValid) {
        this.errorMessage = 'Formulario incompleto o inválido'
        return
      }

      this.loading = true
      this.success = false
      this.errorMessage = ''

      const payload = {
        nombre: this.form.nombre.trim(),
        apellido: this.form.apellido.trim(),
        tipoDocumento: this.form.tipoDocumento.trim(),
        numDocumento: Number(this.form.numDocumento),
        telefono: Number(this.form.telefono),
        departamento: this.form.departamento.trim(),
        ciudad: this.form.ciudad.trim(),
        direccion: this.form.direccion.trim(),
        email: this.form.email.trim(),
        contrasena: this.form.contrasena
      }

      try {
        await api.post('/usuario/save', payload)
        this.success = true
        setTimeout(() => {
          this.reset()
          this.$router.push({ name: 'Login' })
        }, 3000)
        
      } catch (e) {
        this.errorMessage = 'Error al crear usuario: ' + (e.response?.data || e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.usuarios { 
  max-width: 900px; 
  margin: auto; 
  padding: 20px;
}
.form input, .form select { 
  display: block; 
  margin: 10px 0; 
  padding: 10px; 
  width: 100%; 
  max-width: 400px;
  box-sizing: border-box; 
  border: 1px solid #ccc;
  border-radius: 4px;
}
button { 
  padding: 10px 15px; 
  margin: 5px; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.actions button {
  background: #2196F3;
  color: white;
}
.actions button:disabled {
  background: #ccc;
}
.back-button {
  background: #666 !important;
}
.required-error {
  background: #fff8b3;
  border: 1px solid #f1c40f;
  outline: none;
}
.field-error {
  color: #7a4d00;
  font-size: 13px;
  margin-top: -4px;
  margin-bottom: 6px;
}
.success { 
  color: green; 
  margin-top: 8px; 
}
.error { 
  color: red; 
  margin-top: 8px; 
}
</style>