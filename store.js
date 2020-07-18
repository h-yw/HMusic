import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isPlaylistShow: true
  },
  mutations: {
  },
  actions: {
    getPlaylistDetailAction: function (i) {
      var id = this.$route.params.id
      axios.get('/playlist/detail?id=' + id).then(res => {
        console.log(res.data)
      })
    }
  },
  modules: {
  }
})
