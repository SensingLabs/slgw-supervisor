<template>
  <div id="mqtt-config">
    <h4 class="card-title">
      MQTT
    </h4>
    <b-row class="justify-content-center">
      <b-col lg="8">
        <b-form-group label="Connection URL">
          <b-form-input
            v-model="mqtturl"
            size="sm"
          />
        </b-form-group>
      </b-col>
      <b-col lg="4">
        <b-form-group label="ClientID">
          <b-form-input
            v-model="clientid"
            size="sm"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col lg="5">
        <b-form-group label="Status topic (sub)">
          <b-form-input
            v-model="stopic"
            size="sm"
          />
        </b-form-group>
      </b-col>
      <b-col lg="5">
        <b-form-group label="Command topic (pub)">
          <b-form-input
            v-model="ctopic"
            size="sm"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col lg="4">
        <b-form-group label="Certificats">
          <b-form-textarea
            v-model="cert"
            rows="21"
            class="smalltext"
            size="sm"
          />
        </b-form-group>
      </b-col>
      <b-col lg="4">
        <b-form-group label="Private Key">
          <b-form-textarea
            v-model="key"
            rows="21"
            class="smalltext"
            size="sm"
          />
        </b-form-group>
      </b-col>
      <b-col lg="4">
        <b-form-group label="CA Root">
          <b-form-textarea
            v-model="ca"
            rows="21"
            class="smalltext"
            size="sm"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="justify-content-center">
      <b-col lg="10">
        <b-button
          variant="danger"
          size="sm"
          @click="purgeDB"
        >
          Purge Database
        </b-button>
        &nbsp;<span class="text-info">{{ message }}</span>
      </b-col>
      <b-col>
        <span class="float-right">
          <b-button
            variant="info"
            size="sm"
            @click="$parent.$parent.mqttcheck = true"
          >
            Back
          </b-button>
          &nbsp;
          <b-button
            variant="warning"
            size="sm"
            @click="save"
          >
            Save
          </b-button>
        </span>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  name: 'MqttConfig',
  data: () => ({
    mqtturl: '',
    clientid: '',
    stopic: '',
    ctopic: '',
    cert: '',
    key: '',
    ca: '',
    message: '',
    checkpolling: null
  }),
  beforeDestroy() {
    clearInterval(this.checkpolling)
  },

  async mounted() {
    let _response = await fetch(this.$store.state.apiroot + '/settings/mqtt', {
      method: 'GET',
      mode: 'cors'
    })
    let data = await _response.json()
    if (null != data) {
      for (let key in data) {
        if (key !== '_id') this[key] = data[key]
      }
    }
  },
  methods: {
    async purgeDB() {
      await fetch(this.$store.state.apiroot + '/data', {
        method: 'DELETE',
        mode: 'cors'
      })
      this.message = 'Database purged'
      setTimeout(() => {
        this.message = ''
      }, 5000)
    },
    async save() {
      await fetch(this.$store.state.apiroot + '/settings/mqtt', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this._data)
      })
      this.pollData()
      this.message = 'Setting saved. Waiting for connection...'
      setTimeout(() => {
        this.message = 'Connection not established, please check your settings.'
      }, 30000)
    },
    pollData() {
      this.checkpolling = setInterval(async () => {
        let _response = await fetch(
          this.$store.state.apiroot + '/settings/mqtt',
          {
            method: 'GET',
            mode: 'cors'
          }
        )
        let data = await _response.json()
        this.$parent.$parent.mqttcheck = data.check
      }, 5000)
    }
  }
}
</script>
<style>
.smalltext {
  font-size: 7px !important;
  font-family: monospace;
}
legend {
  color: #f0ad4e !important;
}
</style>
