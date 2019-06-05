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
        slot="lastFrameDate"
        slot-scope="item"
      >
        <span :class="classLF(item.item.lastFrameDate)">{{ agoLF(item.item.lastFrameDate) }} ago</span>
      </template>
      <template
        slot="frameCountUp"
        slot-scope="item"
      >
        {{ item.item.frameCountUp }} / {{ item.item.frameCountDown }}
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
      firmwareVersion: { label: 'Version' },
      lastFrameDate: { label: 'Last' },
      lastDown: { label: 'Down' },
      missedFrames: { label: 'Missed' },
      lastFrameRSSI: { label: 'RF Level' },
      frameCountUp: { label: 'FCnt Up / Down' },
      devEUI: { label: 'ID' }
    },
    interfaces: []
  }),
  created() {
    this.update()
  },
  methods: {
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
