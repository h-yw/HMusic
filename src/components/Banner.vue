<template>
  <div
    id="banner"
    :style="'background:url('+banners[backgroundnum].imageUrl+'?imageView&blur=40x20)'"
  >
    <div id="bannerlist">
      <ul>
        <li v-for="(banner, index) in banners" :key="index">
          <!-- :style="{ backgroundImage:'url('+banner.imageUrl+'?param=982y380)'}" -->
          <img ref="imgli" :src="banner.imageUrl+'?param=982y380'" alt />
          <a :href="banner.url"></a>
        </li>
      </ul>
    </div>
    <div id="dotlist">
      <ul v-on:click="selectDot($event)">
        <li ref="dots" v-for="n in dotnum " :key="n" :class="n===0?'active':''"></li>
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
      dotactive: false,
      backgroundnum: 0,
      count: 0
    }
  },
  methods: {
    selectDot: function (event) {
      for (let index = 0; index < event.target.parentNode.children.length; index++) {
        if (event.target === event.target.parentNode.children[index] && event.target.tagName === 'LI') {
          for (let i = 0; i < this.$refs.imgli.length; i++) {
            if (i === index) {
              this.$set(this.$data, 'count', i)
              this.count = i
              this.$refs.imgli[i].setAttribute('style', 'opacity:1')
            } else {
              this.$refs.imgli[i].setAttribute('style', 'opacity:0')
            }
          }
          event.target.setAttribute('class', 'active')
        } else {
          event.target.parentNode.children[index].removeAttribute('class')
        }
      }
    }
  },
  mounted () {
    axios.get('/banner').then(res => {
      // console.log(res.data)
      this.banners = res.data.banners
      this.dotnum = res.data.banners.length
    }).catch(err => {
      console.log('err: ', err)
    })
    console.log('mounted')
    // this.count = 0
    this.timer = setInterval(() => {
      this.$set(this.$data, 'backgroundnum', this.count)
      this.$refs.imgli[this.count].setAttribute('style', 'opacity:1')
      this.$refs.dots[this.count].setAttribute('class', 'active')
      for (let i = 0; i < this.$refs.imgli.length; i++) {
        if (i !== this.count) {
          this.$refs.imgli[i].setAttribute('style', 'opacity:0')
          this.$refs.dots[i].removeAttribute('class')
        }
      }
      this.count += 1
      console.log(this.count)
      if (this.count === this.$refs.imgli.length) {
        this.count = 0
        // clearInterval(this.timer)
        // this.timer = null
        console.log('clear', this.count)
      }
    }, 3000)
  },
  updated () {
  },
  beforeDestroy () {
    clearInterval(this.timer)
    console.log('dddd')
    this.timer = null
  }
}
</script>
<style lang="scss" scoped>
#banner {
  position: relative;
  width: 100%;
  height: 380px;
  background-size: 6000px;
  background-position: center center;
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
        // top: 5px;
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
