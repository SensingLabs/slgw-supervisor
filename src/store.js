import Vue from 'vue'
import Vuex from 'vuex'

let apiroot = 'http://localhost:9999'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    },
    gateways: []
  },
  mutations: {
    setGateways(state, payload) {
      state.gateways = payload
    },
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, _message) {
      state.socket.message = _message
      let message = JSON.parse(_message.data)
      if (null != message.gatewayId) {
        let index = state.gateways.findIndex(elt => elt.gatewayId === message.gatewayId)
        if (-1 < index) {
          Vue.set(state.gateways, index, message)
        } else {
          state.gateways.push(message)
        }
      }
      if (null != message.command) {
        if (message.command.path === '/API/ngrok/start') {
          let index = state.gateways.findIndex(elt => elt.gatewayId === message.gwid)
          if (-1 < index) {
            state.gateways[index].ngrok = message.response.url
          }
        }
        if (message.command.path === '/API/ngrok/stop') {
          let index = state.gateways.findIndex(elt => elt.gatewayId === message.gwid)
          if (-1 < index) {
            state.gateways[index].ngrok = ''
          }
        }
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true
    }
  },
  actions: {
    async gatewaysFetch(context) {
      let _response = await fetch(apiroot + '/data/gateways', {
        method: 'GET',
        mode: 'cors'
      })
      let gateways = await _response.json()
      context.commit('setGateways', gateways)
    },
    async startNgrok(context, { gwid }) {
      await fetch(apiroot + '/start/ngrok/' + gwid, {
        method: 'PUT',
        mode: 'cors'
      })
    },
    async stopNgrok(context, { gwid }) {
      await fetch(apiroot + '/stop/ngrok/' + gwid, {
        method: 'PUT',
        mode: 'cors'
      })
    },
    async sendNgrok(context, { gwid, ngroktoken }) {
      await fetch(apiroot + '/save/ngrok/' + gwid + '/?ngroktoken=' + ngroktoken, {
        method: 'PUT',
        mode: 'cors'
      })
    }
  }
})
