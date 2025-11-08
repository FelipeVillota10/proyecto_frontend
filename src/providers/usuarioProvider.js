import api from '@/services/api.js'
class UsuarioProvider {
    async guardarUsuario(usuarioData) {
        try {
            console.log('Provider: Enviando datos al backend', usuarioData)
            const response = await api.post('/usuario/save', usuarioData)
            console.log('Provider: Respuesta recibida', response.data)
            return {
                exito: true,
                datos: response.data,
                error: null
            }
        } catch (error) {
            console.error('Provider: Error al guardar usuario', error)
            return {
                exito: false,
                datos: null,
                error: 'Error al guardar el usuario'
            }
        }
    }

    async obtenerUsuarios() {
        try {
            console.log('Provider: Solicitando usuarios al backend')
            const response = await api.get('/usuario/all')
            console.log('Provider: Usuarios recibidos', response.data)
            return {
                exito: true,
                datos: response.data,
                error: null
            }
        } catch (error) {
            console.error('Provider: Error al obtener usuarios', error)
            return {
                exito: false,
                datos: [],
                error: 'Error al cargar los usuarios'
            }
        }
    }
}

export default new UsuarioProvider()