<template>
  <div id="app">
    <h1 v-if="false">App.vue cargado</h1>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('App.vue montado, ruta actual:', this.$route?.path)
  }
}
</script>
