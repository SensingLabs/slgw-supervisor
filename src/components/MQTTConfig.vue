<template>
  <div id="mqtt-config">
    <h3 class="text-muted">
      MQTT
    </h3>
    <b-row class="justify-content-center">
      <b-col lg="8">
        <b-form-group label="Connection URL">
          <b-form-input v-model="url" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col lg="5">
        <b-form-group label="Status topic (sub)">
          <b-form-input v-model="stopic" />
        </b-form-group>
      </b-col>
      <b-col lg="5">
        <b-form-group label="Command topic (pub)">
          <b-form-input v-model="ctopic" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col lg="10">
        &nbsp;
      </b-col>
      <b-col>
        <b-button @click="save">
          Save
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  name: 'MqttConfig',
  data: () => ({
    url: '',
    stopic: '',
    ctopic: ''
  }),
  method: {
    async save() {
      await fetch('http://localhost:8888/settings/mqtt', {
        method: 'PUT',
        mode: 'cors',
        body: this.data
      })
    }
  },
  async mounted() {
    let _data = await fetch('http://localhost:8888/settings/mqtt', {
      method: 'GET',
      mode: 'cors'
    })
    this.url = _data.url
    this.stopic = _data.stopic
    this.ctopic = _data.ctopic
  }
}
</script>
<style>
legend {
  color: #f39c12;
}
</style>
