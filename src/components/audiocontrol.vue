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
      <div class="pl-info">
        <span>{{musicdata.name}}-</span>
        <router-link
          v-for="(artist, index) in musicdata.artists"
          :key="index"
          :to="{name:'singer',query:{id:artist.id}}"
          :title="artist.name"
        >{{artist.name}}</router-link>
      </div>
      <div class="pl-time">
        <span>
          <i>{{formatTime(protime)}}</i>
          /{{formatTime (this.audioobj.duration)}}
        </span>
      </div>
      <!-- <div class="pl-type">
        <a class="pl-oneloop"></a>
      </div>-->
      <div class="pl-vol">
        <span class="bg-note-32"></span>
        <div class="pl-vol-barwrap">
          <span class="pl-vol-btn" @mousedown.stop="changeVol($event)"></span>
          <div class="pl-vol-bar"></div>
        </div>
      </div>
      <audio ref="audio" :src="musicurl" style="display:none"></audio>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import '@/assets/css/icon.css'
export default {
  data () {
    return {
      audioobj: {},
      isplay: false,
      protime: 0,
      playtimer: null,
      probarlength: 0,
      musicurl: '',
      musicdata: '',
      pltype: true
    }
  },
  methods: {
    play () {
      if (this.audioobj.src === 'http://localhost:3001/') {
        alert('播放列表为空！')
        return
      }
      console.log('this.audioobj.src', this.audioobj.src)
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
      // console.log('time', time)
      if (time === undefined || time === 0 || isNaN(time)) {
        return '00:00'
      }
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
          this.cleanTimeAndBar()
          el.style.width = '0'
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
    },
    changeVol (event) {
      // el.stopPropagation()
      var _this = this
      var offsetY = event.clientY - event.target.offsetTop
      var y = 0
      // console.log(event.target.nextSibling)
      event.target.parentNode.onmousemove = function (ev) {
        ev.stopPropagation()
        y = ev.clientY - offsetY
        if (y <= 0) {
          event.target.style.top = '0'
          event.target.nextSibling.style.height = '100%'
        } else if (y >= 75) {
          event.target.style.top = '75px'
          event.target.nextSibling.style.height = '0'
        } else {
          event.target.style.top = y + 'px'
          console.log((75 - y) / 75, y)
          _this.audioobj.volume = (75 - y) / 7
          event.target.nextSibling.style.height = ((75 - y) / 75 * 100) + '%'
        }
      }
      event.target.onmouseup = function () {
        console.log('taiqi')
        event.target.parentNode.onmousemove = null
      }
    },
    cleanTimeAndBar () {
      clearInterval(this.playtimer)
      this.protime = 0
      this.probarlength = 0
      this.playtimer = null
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
      this.$set(this.$data, 'musicdata', val)
      clearInterval(this.playtimer)
      this.cleanTimeAndBar()
      // if (val === old) {
      //   val = old
      // }
      this.getMusicUrl(this.musicdata.id).then(res => {
        this.$set(this.$data, 'musicurl', res.data.data[0].url)
        // console.log(this.audioobj)
      })
      // console.log(val, old)
    }
  },
  mounted () {
    if (this.$refs.audio !== undefined) {
      this.$set(this.$data, 'audioobj', this.$refs.audio)
      // console.log(this.audioobj.duration)
      this.canplayListener()
      this.audioobj.volume = 0.5
    }
    // console.log('for', this.formatTime(this.audioobj.duration))
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
  z-index: 9990;
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
      top: 35px;
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
    .pl-info {
      position: absolute;
      top: 15px;
      left: 100px;
      font-size: 12px;
      width: 170px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      a:hover {
        text-decoration: underline;
      }
    }
    .pl-time {
      position: absolute;
      height: 13.6px;
      font-size: 12px;
      top: 33.2px;
      left: 505px;
      color: gray;
      span {
        i {
          color: black;
        }
        font-style: normal;
      }
    }
    .pl-vol {
      position: absolute;
      left: 574px;
      span {
        display: inline-block;
      }
      .pl-vol-barwrap {
        display: none;
        position: absolute;
        height: 100px;
        width: 25px;
        border: 7.5px solid rgb(83, 82, 82);
        border-top: 5px solid rgb(83, 82, 82);
        border-bottom: 5px solid rgb(83, 82, 82);
        top: -90px;
        left: 20px;
        background: rgb(36, 32, 32);
        box-sizing: border-box;
        .pl-vol-bar {
          position: absolute;
          // top: 0px;
          bottom: 0px;
          width: 100%;
          height: 50%;
          background: white;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        .pl-vol-btn {
          position: absolute;
          display: inline-block;
          left: -2px;
          top: 50%;
          width: 15px;
          height: 15px;
          border: 3px solid rgb(79, 197, 243);
          background: red;
          border-radius: 50%;
          box-sizing: border-box;
          z-index: 9999;
        }
      }
    }
    .pl-vol:hover .pl-vol-barwrap {
      display: block;
    }
    // .pl-type {
    //   position: absolute;
    //   left: 574px;
    //   top: 35px;
    //   a {
    //     display: inline-block;
    //     // width: 16px;
    //     // height: 16px;
    //   }
    // }
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
