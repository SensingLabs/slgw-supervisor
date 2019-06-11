<template lang="html">
  <b-card id="gw-details">
    <h4>
      Devices
    </h4>
    <b-table
      :items="item.devices"
      :fields="devfields"
    >
      <template
        slot="firmwareType"
        slot-scope="item"
      >
        <b-badge class="badge-pill badge-dark">
          {{ item.item.firmwareType }}
        </b-badge>
        <sub> {{ item.item.firmwareVersion }}</sub>
      </template>
      <template
        slot="lastFrameDate"
        slot-scope="item"
      >
        <span :class="classLF(item.item.lastFrameDate)">{{ agoLF(item.item.lastFrameDate) }} ago</span>
      </template>
      <template
        slot="frameCountUp"
        slot-scope="item"
      >
        ↓ {{ item.item.frameCountDown }} ↑
        {{ item.item.frameCountUp }}
        /
        <span class="text-warning">
          {{ item.item.missedFrames }}
        </span>
      </template>
      <template
        slot="lastFrameRSSI"
        slot-scope="item"
      >
        <b-progress variant="info">
          <b-progress-bar :value="signalLevel(item.item)">
            <span class="text-white small">{{ item.item.lastFrameRSSI }} / {{ item.item.lastFrameLSNR }}</span>
          </b-progress-bar>
        </b-progress>
      </template>
    </b-table>
    <br>
    <h4>
      Details
    </h4>
    <p>
      Last received status : {{ agoLF(item.timestamp) }} ago <sub>{{ item.timestamp }}</sub>
    </p>

    <br>
    <b-row>
      <b-col lg="6">
        <h5>
          Interfaces
        </h5>
        <b-table
          small
          :items="interfaces"
          :fields="iffields"
        />
      </b-col>
      <b-col>
        <h5>
          Storage
        </h5>
        <p>
          Free {{ Math.floor(item.rootfs.free / 1048576) }} / Total {{ Math.floor(item.rootfs.total / 1048576) }} MB
        </p>
      </b-col>
      <b-col>
        <h5>
          Memory
        </h5>
        <p>Free {{ Math.floor(item.freemem / 1048576) }} / Total {{ Math.floor(item.totalmem / 1048576) }} MB</p>
      </b-col>
    </b-row>
    <h4>
      Actions
    </h4>
    <b-row>
      <b-col lg="2">
        <h5>Custom VPN</h5>
        <p>
          <b-button
            variant="success"
            size="sm"
            @click="remoteService('start/custom')"
          >
            Start
          </b-button>
          &nbsp;
          <b-button
            variant="danger"
            size="sm"
            @click="remoteService('stop/custom')"
          >
            Stop
          </b-button>
        </p>
        <h5>SL Remote</h5>
        <p>
          <b-button
            variant="success"
            size="sm"
            @click="remoteService('start/vpn')"
          >
            Start
          </b-button>
          &nbsp;
          <b-button
            variant="danger"
            size="sm"
            @click="remoteService('stop/vpn')"
          >
            Stop
          </b-button>
        </p>
      </b-col>
      <b-col lg="4">
        <h5>ngrok</h5>
        <p>
          <b-button
            variant="success"
            size="sm"
            @click="remoteService('start/ngrok')"
          >
            Start
          </b-button>
          &nbsp;
          <b-button
            variant="danger"
            size="sm"
            @click="remoteService('stop/ngrok')"
          >
            Stop
          </b-button>
        </p>
        <p><b-form-input size="sm" /></p>

        <p>
          <b-button
            variant="info"
            size="sm"
          >
            Send NGROK token
          </b-button>
          &nbsp;
        </p>
        <p>
          <b-link
            v-if="item.ngrok !== ''"
            :href="item.ngrok"
            target="_blank"
          >
            <u> {{ item.ngrok }}</u>
          </b-link>
        </p>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
import moment from 'moment'
export default {
  name: 'GwDetails',
  props: ['item'],
  data: () => ({
    iffields: {
      name: {
        label: 'Interface'
      },
      ip: {
        label: 'Address'
      },
      mac: {
        label: 'MAC'
      }
    },
    devfields: {
      name: { label: 'Name' },
      firmwareType: { label: 'Model' },
      lastFrameDate: { label: 'Last' },
      lastDown: { label: 'Down' },
      lastFrameRSSI: { label: 'RF Level' },
      frameCountUp: { label: 'FCnt / Missed' },
      devEUI: { label: 'Device ID' }
    },
    interfaces: []
  }),
  created() {
    this.update()
  },
  methods: {
    async remoteService(action) {
      await fetch('/' + action + '/' + this.item.gatewayId, {
        method: 'PUT',
        mode: 'cors'
      })
      setTimeout(this.$parent.$parent.update, 2000)
    },
    signalLevel(item) {
      if (!item.lastFrameRSSI) return 0
      let composite = 1 * item.lastFrameRSSI
      let quality = Math.floor((10 * composite + 1300) / 11)
      return quality
    },
    agoLF(val) {
      let lf = moment.duration(moment().diff(moment(val)))
      return lf.humanize()
    },
    classLF(val) {
      let lf = moment.duration(moment().diff(moment(val)))
      if (moment.duration(1, 'weeks') < lf) return 'text-danger'
      if (moment.duration(1, 'days') < lf) return 'text-warning'
      return 'text-success'
    },
    update() {
      this.interfaces = []
      for (let _i in this.item.interfaces) {
        for (let _a in this.item.interfaces[_i]) {
          if ('lo' !== _i && this.item.interfaces[_i][_a].family !== 'IPv6') {
            this.interfaces.push({
              name: _i,
              ip: this.item.interfaces[_i][_a].address,
              mac: this.item.interfaces[_i][_a].mac
            })
          }
        }
      }
      for (let _d in this.item.devices) {
        delete this.item.devices[_d]._id
      }
    }
  }
}
</script>
<style>
.badge-dark {
  background-color: #919aa1;
}
</style>
