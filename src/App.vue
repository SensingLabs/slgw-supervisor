<template>
  <div id="app">
    <FirstRun v-if="!mqttcheck" />
    <Gateways v-if="mqttcheck" />
  </div>
</template>

<script>
import FirstRun from './components/FirstRun.vue'
import Gateways from './components/Gateways.vue'

export default {
  name: 'App',
  components: {
    FirstRun,
    Gateways
  },
  data: () => ({
    mqttcheck: false
  }),
  async mounted() {
    let _response = await fetch(this.$store.state.apiroot + '/settings/mqtt', {
      method: 'GET',
      mode: 'cors'
    })
    let data = await _response.json()
    this.mqttcheck = data.check
  }
}
</script>
