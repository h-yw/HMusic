<template>
  <div id="banner">
    <div id="bannerlist">
      <ul>
        <li
          v-for="(banner, index) in banners"
          :key="index"
          :style="{ backgroundImage:'url('+banner.imageUrl+'?param=982y380)',opacity: active?0:1}"
        >
          <a :href="banner.url"></a>
        </li>
      </ul>
    </div>
    <div id="dotlist">
      <ul v-on:click="selectDot($event)">
        <li v-for="n in dotnum " :key="n" :class="n==1?'active':''"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      banners: [],
      dotnum: 0,
      titleColor: [],
      currentIndex: 0,
      timer: null,
      active: false,
      dotactive: false
    }
  },
  methods: {
    selectDot: function (event) {
      console.log(event.target)
    }

  },
  beforeMount () {
    axios.get('/banner').then(res => {
      console.log(res.data)
      this.banners = res.data.banners
      this.dotnum = res.data.banners.length
      // for (var i = 0; i < this.banners.length; i++) {
      //   this.titleColor[i] = this.banners[i].titleColor
      // }
    }).catch(err => {
      console.log('err: ', err)
    })
  }

}
</script>
<style lang="scss" scoped>
#banner {
  position: relative;
  width: 100%;
  height: 380px;
  #bannerlist {
    position: relative;
    width: 982px;
    height: 100%;
    margin: 0 auto;
    background: center 0 no-repeat;
    ul {
      width: 100%;
      height: 100%;
      li {
        width: 100%;
        height: 100%;
        list-style: none;
        cursor: pointer;
        background-position: center center;
        background: center no-repeat;
        position: absolute;
        left: 0;
        top: 5px;
        // opacity: 0;
        z-index: 1;
        a {
          display: block;
          width: 100%;
          height: 100%;
        }
        .active {
          z-index: 10;
        }
      }
    }
  }
  #dotlist {
    width: 100%;
    position: relative;
    bottom: 10px;
    // left: 50%;
    z-index: 20;
    // margin: 0 auto;
    ul {
      position: absolute;
      left: 50%;
      margin-left: -105px;
      bottom: 10px;
      li {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;

        // margin: 0 6px;
        margin-left: 15px;
        // background: red;
        cursor: pointer;
        box-sizing: border-box;
      }
      li:first-of-type {
        margin-left: 0;
      }
    }
    .active {
      background: #b90b0b;
    }
  }
}
</style>
