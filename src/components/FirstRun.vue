<template>
  <b-container id="first-run">
    <b-card header="First Run">
      <mqtt-config />
      <hr>
    </b-card>
  </b-container>
</template>
<script>
import MqttConfig from './MQTTConfig.vue'
export default {
  name: 'FirstRun',
  components: {
    MqttConfig
  }
}
</script>
<style>
hr {
  border-color: #444;
}
</style>
