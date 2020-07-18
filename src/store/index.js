import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isPlaylistShow: true
  },
  mutations: {
    hidePlaylist (state, data) {
      state.isPlaylistShow = data
    }
  },
  actions: {

  },
  modules: {
  }
})
