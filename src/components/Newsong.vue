<template>
  <div id="newsong">
    <div class="contitle">新歌速递</div>
    <div class="type" v-if="state">
      <span v-on:click="setType(listtype=0)">全部</span>
      <span v-on:click="setType(listtype=7)">华语</span>
      <span v-on:click="setType(listtype=96)">欧美</span>
      <span v-on:click="setType(listtype=8)">日本</span>
      <span v-on:click="setType(listtype=16)">韩国</span>
      <!-- <audio :src="musicurl" autoplay controls></audio> -->
    </div>
    <div id="s">
      <ul ref="songul">
        <li v-for="(newsong, index) in newsonglist" :key="index">
          <div id="song" :songid="newsong.id" v-on:click="playAudio(newsong.id)">
            <div id="dimg">
              <img :src="newsong.album.blurPicUrl+'?param=140y140'" alt />
            </div>
            <div id="dname">
              <span>{{newsong.name}}-{{newsong.artists[0].name}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div id="slide">
      <button class="btn-down" v-on:click="slideUp()">👆</button>
      <button class="btn-up" v-on:click="slideDown()">👇</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    state: Boolean
  },
  data () {
    return {
      newsonglist: [],
      slidedown: 0,
      slidetime: 0,
      slidetimetmp: 0,
      listtype: 0,
      musicurl: ''
    }
  },
  methods: {
    slideDown () {
      // var uh = parseInt(getComputedStyle(this.$refs.songul).height)
      // var
      // console.log(uh)
      if (this.slidetimetmp > 0) {
        this.slidedown += -612
        this.$refs.songul.style.top = this.slidedown + 'px'
        this.slidetimetmp -= 1
      }
      console.log('down slidetimetmp,slidetime:', this.slidetimetmp, this.slidetime)
    },
    slideUp () {
      if (this.slidetimetmp !== this.slidetime && this.slidetimetmp < this.slidetime) {
        this.slidedown += 612
        this.$refs.songul.style.top = this.slidedown + 'px'
        this.slidetimetmp += 1
        console.log(' up slidetimetmp,slidetime:', this.slidetimetmp, this.slidetime)
      }
    },
    setType () {
      axios.get('/top/song?type=' + this.listtype).then(res => {
        this.newsonglist = res.data.data
        this.slidetime = parseInt(this.newsonglist.length / 15)
        this.slidetimetmp = parseInt(this.newsonglist.length / 15)
      })
    },
    playAudio (id) {
      this.$store.commit('getMusicIdMut', id)
    }
  },
  beforeMount () {
    axios.get('/top/song?type=' + this.listtype).then(res => {
      this.newsonglist = res.data.data
      this.slidetime = parseInt(this.newsonglist.length / 15)
      this.slidetimetmp = parseInt(this.newsonglist.length / 15)
    })
  }
}
</script>
<style lang="scss" scoped>
#newsong {
  position: relative;
  width: 850px;
  height: 665px;
  background: #e9e9e9;
  margin: 0 auto;
  margin-top: 40px;
  border-top-right-radius: 10px;
  border-start-start-radius: 10px;
  // overflow: hidden;
  #s {
    position: relative;
    width: 100%;
    height: 630px;
    overflow: hidden;
  }
  .contitle {
    // position: absolute;
    display: inline-block;
    margin-left: 10px;
    font-size: 20px;
    text-align: center;
    line-height: 40px;
    font-size: 30px;
  }
  .type {
    display: inline-block;
    margin-left: 20px;
    span {
      display: inline-block;
      box-sizing: border-box;
      margin-right: 20px;
      cursor: pointer;
      border-radius: 4px;
    }
    span:hover {
      background: #c20c0c;
      color: white;
    }
  }
  ul {
    position: absolute;
    width: 800px; //660px;
    height: 630px;
    margin-top: 10px;
    margin-left: -30px;
    // background: pink;
    z-index: 1;
    box-sizing: border-box;
    li {
      // background: blue;
      margin: 0 auto;
      float: left;
      display: block;
      width: 110px;
      height: 204px;
      margin-left: 40px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 15px;
      cursor: pointer;
      box-sizing: border-box;
      #song {
        width: 120px;
        margin-top: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
      }
      img {
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 5px;
        margin: 0 auto;
        box-sizing: border-box;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      }
      #dimg {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      #dname {
        margin-top: 10px;
        width: 100%;
        height: 65px;
        border-end-end-radius: 10px;
        border-bottom-left-radius: 10px;
        box-sizing: border-box;
        text-indent: 4px;
        span {
          display: inline-block;
          margin: 0 2px;
        }
      }
    }
  }
  #slide {
    position: absolute;
    width: 20px;
    height: 100px;
    z-index: 20;
    right: 60px;
    top: 135px;

    .btn-down {
      display: block;
      width: 50px;
      height: 100px;
      // margin-right: 100px;
      box-sizing: border-box;
      border-radius: 5px;
      font-size: 30px;
    }
    .btn-up {
      display: block;
      width: 50px;
      height: 100px;
      margin-top: 200px;
      border-radius: 5px;
      font-size: 30px;
    }
  }
}
</style>
