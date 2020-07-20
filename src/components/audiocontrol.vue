<template>
  <div id="playcon">
    <!-- asdsda -->
    <div id="conbox">
      <div class="pl-control">
        <a class="pl-last" title="下一首"></a>
        <a ref="playbtn" class="pl-pause" title="播放/暂停" @click.stop="play()"></a>
        <a class="pl-next" title="上一首"></a>
      </div>
      <div class="pl-probarwrap">
        <div class="pl-probar" ref="probar"></div>
      </div>
      <div class="pl-time">
        <span>
          <i>{{formatTime(protime)}}</i>
          /{{formatTime (this.audioobj.duration)!==NaN?formatTime (this.audioobj.duration):'00:00'}}
        </span>
      </div>
      <audio ref="audio" :src="musicurl" controls style="display:none"></audio>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      audioobj: {},
      isplay: false,
      protime: 0,
      playtimer: null,
      probarlength: 0,
      musicurl: '',
      musicid: ''
    }
  },
  methods: {
    play () {
      if (this.audioobj.paused) {
        this.$refs.playbtn.setAttribute('class', 'pl-play')
        this.progress(this.audioobj.duration, this.$refs.probar, this.playObj)
        console.log('true', this.audioobj.paused)
        this.audioobj.play()
        this.isplay = !this.isplay
      } else {
        this.$refs.playbtn.setAttribute('class', 'pl-pause')
        console.log('false', this.audioobj.paused)
        this.audioobj.pause()
        this.isplay = !this.isplay
        clearInterval(this.playtimer)
        this.playtimer = null
      }
    },
    formatTime (time) {
      time = time / 60
      var m = 0
      var s = 0
      if (parseInt(time) > 10) {
        m = parseInt(time).toString()
      } else {
        m = parseInt(time).toString().replace('', 0).substr(-2)
      }
      // console.log(m)
      if ((time % 1 * 60) >= 10.0) {
        s = (time % 1 * 60).toFixed()
      } else {
        s = parseInt(time % 1 * 60).toString().replace('', 0).substr(-2)
      }
      return m + ':' + s
    },
    progress (time, el, el2) {
      console.log(time)
      var step = 100 / time
      this.playtimer = setInterval(() => {
        this.protime += 1
        this.probarlength += step
        el.style.width = this.probarlength + '%'
        if (this.protime >= this.audioobj.duration) {
          clearInterval(this.playtimer)
          this.protime = 0
          this.probarlength = 0
          this.playtimer = null
          el2.setAttribute('class', 'pl-pause')
        }
      }, 1000)
    },
    getMusicUrl (id) {
      return axios.get('/song/url?id=' + id)
    },
    canplayListener () {
      this.audioobj.addEventListener('canplay', () => {
        console.log('OK')
        this.$refs.playbtn.setAttribute('class', 'pl-play')
        this.audioobj.play()
        this.progress(this.audioobj.duration, this.$refs.probar, this.$refs.playbtn)
      })
    }
  },
  computed: {
    storeState () {
      return this.$store.state.musicdatas
    },
    readynum () {
      return this.audioobj.readyState
    }
  },
  watch: {
    storeState (val, old) {
      this.$set(this.$data, 'musicid', val)
      this.getMusicUrl(val).then(res => {
        this.$set(this.$data, 'musicurl', res.data.data[0].url)
        console.log(this.audioobj)
      })
      console.log(val, old)
    }
  },
  mounted () {
    if (this.$refs.audio !== undefined) {
      this.$set(this.$data, 'audioobj', this.$refs.audio)
      console.log(this.audioobj.duration)
      this.canplayListener()
    }
  }
}
</script>
<style lang="scss">
#playcon {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background: #cad8e4;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  #conbox {
    position: relative;
    width: 100%;
    left: 50%;
    transform: translate(-285px);
    // height: 70px;
    .pl-control {
      position: absolute;
      height: 100%;
      top: 19px;
      a {
        display: inline-block;
      }
      a:hover {
        cursor: pointer;
      }
    }
    .pl-probarwrap {
      position: absolute;
      width: 400px;
      height: 10px;
      border: 1px solid black;
      top: 30px;
      margin-left: 100px;
      border-radius: 5px;
      .pl-probar {
        height: 100%;
        width: 0;
        background: #333333;
        border-top-right-radius: 5px;
        border-end-end-radius: 5px;
      }
    }
    .pl-time {
      position: absolute;
      height: 13.6px;
      font-size: 12px;
      top: 28.2px;
      left: 505px;
      color: gray;
      span {
        i {
          color: black;
        }
        font-style: normal;
      }
    }
  }
}
.pl-next {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -63px -62px;
}
.pl-last {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -121px -10px;
}
.pl-list {
  width: 38px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -10px -10px;
}
.pl-search {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -121px -62px;
}
.pl-play {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -10px -114px;
}
.pl-oneloop {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -62px -114px;
}
.pl-mute {
  width: 33px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -68px -10px;
}
.pl-looplist {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -114px -114px;
}
.pl-random {
  width: 33px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -10px -62px;
}
.pl-voice {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -173px -10px;
}
.pl-pause {
  width: 32px;
  height: 32px;
  background: url("../assets/img/audiocontrol.png") -173px -62px;
}
</style>
