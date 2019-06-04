<template>
  <b-container id="first-run">
    <b-card
      header="First Run"
      bg-variant="dark"
      text-variant="white"
    >
      <mqtt-config />
    </b-card>
    <br>
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
