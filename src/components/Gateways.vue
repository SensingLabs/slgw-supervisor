<template>
  <div id="gateways">
    <b-table
      :items="this.gateways"
      :fields="gwfields"
      small
    >
      <template
        slot="show_details"
        slot-scope="row"
      >
        <b-button
          size="sm"
          @click.stop="row.toggleDetails"
        >
          {{ row.detailsShowing ? '-' : '+' }}
        </b-button>
      </template>
      <template
        slot="devices"
        slot-scope="item"
      >
        <b-badge class="badge-info">
          {{ item.item.devices.length }}
        </b-badge>
        <b-badge
          v-if="0 < getWarnDev(item.item.devices)"
          class="badge-warning"
        >
          {{ getWarnDev(item.item.devices) }}
        </b-badge>
        <b-badge
          v-if="0 < getDangerDev(item.item.devices)"
          class="badge-danger"
        >
          {{ getDangerDev(item.item.devices) }}
        </b-badge>
      </template>
      <template
        slot="uptime"
        slot-scope="item"
      >
        {{ getHumDur(item.item.uptime) }} ago
      </template>
      <template
        slot="rootfs"
        slot-scope="item"
      >
        <div class="progress">
          <div
            :class="getHDClass(item.item.rootfs)"
            role="progressbar"
            :style="getHDWidth(item.item.rootfs)"
          />
        </div>
      </template>
      <template
        slot="freemem"
        slot-scope="item"
      >
        <div class="progress">
          <div
            role="progressbar"
            class="progress-bar bg-info"
            :style="getMemWidth(item.item)"
          />
        </div>
      </template>
      <template
        slot="loadavg"
        slot-scope="item"
      >
        <b-badge class="badge badge-light">
          {{ Math.floor(item.item.loadavg[0] * 100) / 100 }}<sub> 1 min</sub>
          {{ Math.floor(item.item.loadavg[1] * 100) / 100 }}<sub> 5 min</sub>
          {{ Math.floor(item.item.loadavg[2] * 100) / 100 }}<sub> 15 min</sub>
        </b-badge>
      </template>
      <template
        slot="ngrok"
        slot-scope="item"
      >
        <div class="text-center">
          <b-link
            v-if="item.item.ngrok !== ''"
            :href="item.item.ngrok"
            target="_blank"
          >
            <u>open</u>
          </b-link>
          <b-button
            v-else
            variant="light"
            class="badge-pill"
            size="sm"
            @click="ngrok(item.item.gatewayId)"
          >
            start
          </b-button>
        </div>
      </template>
      <template
        slot="row-details"
        slot-scope="row"
      >
        <gw-details :item="row.item" />
      </template>
    </b-table>
    <br>
    <b-container
      class="bg-dark"
      fluid
      style="position: fixed;bottom: 0; height:20px"
    >
      <b-row>
        <b-col>
          <small>Gateways count : <b>{{ gateways ? gateways.length : 0 }}</b></small>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import moment from 'moment'
import gwDetails from './gwDetails'
export default {
  name: 'Gateways',
  components: { gwDetails },
  data: () => ({
    gateways: null,
    gwfields: {
      show_details: { label: '' },
      gatewayId: { label: 'HWID' },
      name: { label: 'Name' },
      devices: { label: 'Devices' },
      uptime: { label: 'Started' },
      rootfs: { label: 'Free storage' },
      ngrok: { label: 'Remote Link' },
      loadavg: { label: 'CPU Loads' }
    }
  }),
  async mounted() {
    this.update()
  },
  methods: {
    async ngrok(gwid) {
      await fetch('/start/ngrok/' + gwid, {
        method: 'PUT',
        mode: 'cors'
      })
      setTimeout(this.update, 2000)
    },
    getWarnDev(devs) {
      let c = 0
      for (let dev of devs) {
        let lf = moment.duration(moment().diff(moment(dev.lastFrameDate)))
        if (moment.duration(1, 'days') < lf && moment.duration(1, 'weeks') > lf) c++
      }
      return c
    },
    getDangerDev(devs) {
      let c = 0
      for (let dev of devs) {
        let lf = moment.duration(moment().diff(moment(dev.lastFrameDate)))
        if (moment.duration(1, 'weeks') < lf) c++
      }
      return c
    },
    getHumDur(val) {
      return moment.duration(val, 'seconds').humanize()
    },
    getMemWidth(val) {
      return 'width:' + (100 * val.freemem) / val.totalmem + '%;'
    },
    getHDWidth(val) {
      return 'width:' + (100 * val.free) / val.total + '%;'
    },
    getHDClass(val) {
      let free = (100 * val.free) / val.total
      if (free < 10) return 'progress-bar bg-danger'
      else if (free < 25) return 'progress-bar bg-warning'
      else return 'progress-bar bg-success'
    },
    async update() {
      let _response = await fetch('/data/gateways', {
        method: 'GET',
        mode: 'cors'
      })
      this.gateways = await _response.json()
    }
  }
}
</script>
