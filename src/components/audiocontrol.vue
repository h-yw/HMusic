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
        <div class="pl-probar" ref="probar">
          <span class="pl-turn-dot" @mousedown.stop="changePro($event)"></span>
        </div>
      </div>
      <div class="pl-info">
        <span>{{currentmusic.name}}-</span>
        <router-link
          v-for="(artist, index) in artists= currentmusic.artists===undefined?currentmusic.ar:(currentmusic.artists===undefined?currentmusic.artist:currentmusic.artists)"
          :key="artist.id+index+'-to-singer'"
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
      <div class="pl-type">
        <span class="bg-oneloop-32" @click.stop="changetype($event)"></span>
      </div>
      <div class="pl-vol">
        <span class="bg-note-32"></span>
        <div class="pl-vol-barwrap">
          <span class="pl-vol-btn" @mousedown.stop="changeVol($event)"></span>
          <div class="pl-vol-bar"></div>
        </div>
      </div>
      <div class="pl-slist">
        <span class="bg-list-32">
          <i>{{musicdatas.length}}</i>
        </span>
        <div class="pl-list-screen">
          <ul>
            <li v-for="(musicdata, index) in musicdatas" :key="index">
              <div class="li-name">
                <span class="bg-play-32" @click.stop="getsongsId(musicdata.id,$event)"></span>
                <span class="li-s-name">{{musicdata.name}}</span>
              </div>
              <div class="li-artist">
                <router-link
                  :to="{name:'singer',query:{id:artist.id}}"
                  v-for="(artist, index) in  datas=musicdata.artists===undefined?musicdata.ar:musicdata.artists"
                  :key="artist.id+index+'-li'"
                >{{artist.name}}</router-link>
              </div>
              <div
                class="li-time"
              >{{musicdata.lMusic ===undefined ?getPlaytime('128000',musicdata.l.size):formatTime(musicdata.lMusic.playTime/1000)}}</div>
            </li>
          </ul>
        </div>
      </div>
      <audio
        @canplay="canplayListener"
        @ended="playendListener"
        ref="audio"
        :src="musicurl"
        style="display:none"
      ></audio>
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
      musicdatas: [],
      currentmusic: '',
      musicid: '',
      pltype: true,
      looptype: true,
      musicids: [],
      checkurl: false,
      loopid: 0,
      currentId: ''
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
        this.progress(this.audioobj.duration, this.$refs.probar, this.$refs.playbtn)
        console.log('true', this.audioobj.paused)
        this.audioobj.play()
      } else {
        this.$refs.playbtn.setAttribute('class', 'pl-pause')
        console.log('false', this.audioobj.paused)
        this.audioobj.pause()
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
      // console.log(time)
      var step = 100 / time
      // var dot = 15 / time
      this.playtimer = setInterval(() => {
        this.protime += 1
        this.probarlength += step
        el.children[0].style.left = this.probarlength - 3.75 + '%'
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
      this.cleanTimeAndBar()
      this.$refs.playbtn.setAttribute('class', 'pl-play')
      this.audioobj.play()
      this.progress(this.audioobj.duration, this.$refs.probar, this.$refs.playbtn)
    },
    playendListener () {
      this.cleanTimeAndBar()
      if (this.looptype) {
        this.currentId = this.currentmusic.id
      } else {
        this.loopid += 1
        if (this.loopid > this.musicids.length - 1) {
          this.loopid = 0
        }
        this.currentId = this.musicids[this.loopid]
        this.currentmusic = this.musicdatas[this.loopid]
      }
      this.checkMusic(this.currentId).then(resp => {
        if (resp.message === 'ok') {
          this.getMusicUrl(this.currentId).then(res => {
            this.$set(this.$data, 'musicurl', res.data.data[0].url)
          })
        } else {
        }
      })
      this.progress(this.audioobj.duration, this.$refs.probar, this.$refs.playbtn)
      this.audioobj.play()
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
          _this.audioobj.volume = (75 - y) / 75
          event.target.nextSibling.style.height = ((75 - y) / 75 * 100) + '%'
        }
      }
      event.target.parentNode.onmouseleave = function () {
        event.target.parentNode.onmousemove = null
      }
    },
    changePro (event) {
      //   var _this = this
      //   var offsetX = event.clientX - event.target.offsetLeft
      //   var x = 0
      //   this.cleanTimeAndBar()
      //   this.audioobj.pause()
      //   // clearInterval(_this.playtimer)
      //   event.target.parentNode.onmousemove = function (ev) {
      //     ev.stopPropagation()
      //     x = ev.clientX - offsetX
      //     if (x <= 0) {
      //       event.target.style.left = 0 + 'px'
      //       _this.audioobj.currentTime = 0
      //       // _this.protime = 0
      //       // _this.probarlength = 0
      //       // console.log('cccc', _this.protime, _this.probarlength)
      //       // this.playtimer = null
      //     } else if (x >= 385) {
      //       event.target.style.left = 385 + 'px'
      //       _this.cleanTimeAndBar()
      //       // console.log('cccc', _this.protime, _this.probarlength)
      //     } else {
      //       event.target.style.left = x + 'px'
      //       _this.$refs.probar.style.width = x / 400 + '%'
      //       _this.protime = _this.audioobj.currentTime = Math.ceil(_this.audioobj.duration * x / 400)
      //       _this.probarlength = 100 * x / 400
      //       console.log('cccc', x, _this.protime, _this.probarlength)
      //     }
      //   }
      //   event.target.onmouseleave = function () {
      //     event.target.parentNode.onmousemove = null
      //     _this.audioobj.play()
      //     _this.progress(_this.audioobj.duration, _this.$refs.probar, _this.$refs.playbtn)
      //   }
    },
    changetype (ev) {
      this.looptype = !this.looptype
      if (this.looptype) {
        alert(this.looptype)
        ev.target.setAttribute('class', 'bg-oneloop-32')
      } else {
        ev.target.setAttribute('class', 'bg-loop-32')
      }
    },
    getsongsId (id, ev) {
      console.log(id, ev.target.parentNode.parentNode)
      ev.target.parentNode.parentNode.setAttribute('class', 'bg-play-active')
      this.getMusicUrl(id).then(res => {
        this.$set(this.$data, 'musicurl', res.data.data[0].url)
      })
    },
    cleanTimeAndBar () {
      clearInterval(this.playtimer)
      this.protime = 0
      this.probarlength = 0
      this.playtimer = null
    },
    getPlaytime (bps, size) {
      var t = parseInt(size) / 1024 * 8 / parseInt(bps.substr(0, 3)) / 60
      var m = 0
      var s = 0
      if (parseInt(t) > 10) {
        m = parseInt(t).toString()
      } else {
        m = parseInt(t).toString().replace('', 0).substr(-2)
      }
      // console.log(m)
      if ((t % 1 * 60) >= 10.0) {
        s = (t % 1 * 60).toFixed()
      } else {
        s = parseInt(t % 1 * 60).toString().replace('', 0).substr(-2)
      }
      return m + ':' + s
    },
    checkMusic (id) {
      return new Promise((resolve, reject) => {
        axios.get('/check/music?id=' + id).then(res => {
          resolve(res.data)
        })
      })
    }
  },
  computed: {
    storeState () {
      return this.$store.state.musicdatas
    }
  },
  mounted () {
    if (this.$refs.audio !== undefined) {
      this.$set(this.$data, 'audioobj', this.$refs.audio)
      this.audioobj.volume = 0.5
    }
    this.$bus.off('message')
    this.$bus.on('message', res => {
      this.cleanTimeAndBar()
      this.$set(this.$data, 'currentmusic', res)
      if (this.musicdatas.indexOf(res) === -1) {
        this.musicdatas.push(res)
        this.musicids.push(res.id)
      }
      this.checkMusic(res.id).then(resp => {
        if (resp.message === 'ok') {
          this.getMusicUrl(res.id).then(res => {
            this.$set(this.$data, 'musicurl', res.data.data[0].url)
          })
        } else {
        }
      })
    })
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
    transform: translate(-335px);
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
      border: 1px solid rgb(54, 47, 47);
      top: 35px;
      margin-left: 100px;
      border-radius: 5px;
      .pl-probar {
        height: 100%;
        width: 0;
        background: #3654fd;
        border-top-right-radius: 5px;
        border-end-end-radius: 5px;
        .pl-turn-dot {
          position: absolute;
          display: none;
          // left: -2px;
          top: -2px;
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
    .pl-probarwrap:hover .pl-turn-dot {
      display: inline-block;
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
        background: #534b3b;
        box-sizing: border-box;
        z-index: 9999;
        .pl-vol-bar {
          position: absolute;
          // top: 0px;
          bottom: 0px;
          width: 100%;
          height: 50%;
          background: #ffca17;
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
    .pl-slist {
      position: absolute;
      left: 605px;
      top: 5px;
      min-width: 60px;
      border: 1px solid #b2dbfc;
      border-radius: 20px;
      height: 25px;
      background: #9cc0dd;
      z-index: 9998;
      .bg-list-32 {
        display: inline-block;
        min-width: 40px;
        // height: 30px;
        text-align: right;
        line-height: 25px;
        // border-right: 1px solid black;
        i {
          position: absolute;
          display: block;
          left: 30px;
          font-size: 12px;
        }
      }
      .pl-list-screen {
        display: none;
        position: absolute;
        width: 400px;
        height: 200px;
        background: #baccdb;
        top: -200px;
        left: -362px;
        overflow-y: scroll;
        ul {
          padding: 10px;
          li {
            width: 100%;
            height: 30px;
            // border-bottom: 1px solid black;
            line-height: 30px;
            div {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .li-name {
              position: absolute;
              display: inline-block;
              left: 20px;
              height: 32px;
              width: 200px;
              font-size: 13px;
              line-height: 32px;
              text-align: left;
              .bg-play-32 {
                display: inline-block;
                width: 32px;
                height: 32px;
                float: left;
              }
              .li-s-name {
                display: inline-block;
                margin-left: 10px;
                width: 168px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              // background-size: cover;
            }
            .li-name:hover {
              cursor: pointer;
            }
            .li-artist {
              position: absolute;
              display: inline-block;
              width: 80px;
              right: 70px;
              a {
                font-size: 13px;
              }
              a:hover {
                text-decoration: underline;
              }
            }
            .li-time {
              position: absolute;
              display: inline-block;
              width: 50px;
              right: 10px;
              font-size: 12px;
            }
          }
          li:hover {
            background: #9cc0dd;
          }
          .bg-play-active {
            background: #9cc0dd;
          }
        }
      }
    }
    .pl-slist:hover .pl-list-screen {
      display: block;
    }
    .pl-type {
      position: absolute;
      left: 574px;
      top: 35px;
      span {
        display: inline-block;
        // width: 16px;
        // height: 16px;
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
