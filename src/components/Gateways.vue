<template>
  <div id="gateways">
    <b-table
      :items="gateways"
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
        slot="version"
        slot-scope="item"
      >
        <small>{{ item.item.version }} / {{ item.item.rfversion }}</small>
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
        slot="timestamp"
        slot-scope="item"
      >
        <vue-moments-ago
          prefix=""
          suffix="ago"
          lang="en"
          :date="item.item.timestamp"
        />
      </template>
      <template
        slot="row-details"
        slot-scope="row"
      >
        <gw-details :gwitem="row.item" />
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
        <b-col
          v-if="gateways.length < 1"
          class="text-center text-info"
          style="margin-top:3px"
        >
          Waiting for statuses...
        </b-col>
        <b-col>
          <font-awesome-icon
            class="float-right"
            icon="cog"
            style="margin-top:2px"
            @click="$parent.mqttcheck = false"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import moment from 'moment'
import gwDetails from './gwDetails'
import { mapState } from 'vuex'
import VueMomentsAgo from 'vue-moments-ago'

export default {
  name: 'Gateways',
  components: { gwDetails, VueMomentsAgo },
  data: () => ({
    gwfields: {
      show_details: { label: '' },
      gatewayId: { label: 'HWID' },
      name: { label: 'Name' },
      version: { label: 'Version' },
      devices: { label: 'Devices' },
      uptime: { label: 'Started' },
      rootfs: { label: 'Free storage' },
      ngrok: { label: 'Remote Link' },
      timestamp: { label: 'Status' }
    }
  }),
  computed: mapState(['gateways']),
  async mounted() {
    this.$store.dispatch('gatewaysFetch')
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  methods: {
    ngrok(gwid) {
      this.$store.dispatch('startNgrok', { gwid })
    },
    getWarnDev(devs) {
      let c = 0
      for (let dev of devs) {
        let lf = moment.duration(moment().diff(moment(dev.lastFrameDate)))
        if (
          moment.duration(1, 'days') < lf &&
          moment.duration(1, 'weeks') > lf
        ) {
          c++
        }
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
    }
  }
}
</script>
