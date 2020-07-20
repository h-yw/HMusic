import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isPlaylistShow: true,
    musicdatas: ''
  },
  mutations: {
    hidePlaylist (state, data) {
      state.isPlaylistShow = data
    },
    getMusicIdMut (state, data) {
      state.musicdatas = data
      console.log('store', data)
    }
  },
  actions: {

  },
  modules: {
  }
})
