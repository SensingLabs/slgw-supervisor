<template>
  <div id="app">
    <FirstRun v-if="!mqttcheck" />
  </div>
</template>

<script>
import FirstRun from './components/FirstRun.vue'

export default {
  name: 'App',
  components: {
    FirstRun
  },
  data: () => ({
    mqttcheck: false
  }),
  async mounted() {
    let _response = await fetch('http://localhost:9999/settings/mqtt', {
      method: 'GET',
      mode: 'cors'
    })
    let data = await _response.json()
    this.mqttcheck = data.check
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
