<template>
  <div id="box">
    <div id="toplist">
      <div class="topleft">
        <listcover class="cover"></listcover>
      </div>
      <div class="topright">
        <list class="list"></list>
        <div class="to-top" v-on:click="gotoTop()"></div>
      </div>
    </div>
  </div>
</template>

<script>
import listcover from '@/components/toplist/Listcover'
import list from '@/components/toplist/list'
export default {
  data () {
    return {
      scrollTop: 0,
      timer: '',
      timerFlag: true
    }
  },
  methods: {
    handleScroll () {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log(this.scrollTop)
      if (this.scrollTop >= 600) {
        document.querySelector('.to-top').style.display = 'block'
      } else {
        document.querySelector('.to-top').style.display = 'none'
      }
    },
    gotoTop () {
      window.pageYOffset = document.documentElement.scrollTop = document.body.scrollTop = 0
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll, true)
    console.log('asdsadsad')
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  components: {
    listcover,
    list
  }
}
</script>

<style lang="scss" scoped>
#box {
  width: 930px;
  margin: 0 auto;
  #toplist {
    width: 940px;
    position: relative;
    .topleft {
      display: inline-block;
      position: absolute;
      width: 240px;
    }
    .topright {
      display: inline-block;
      position: absolute;
      width: 660px;
      height: 200px;
      left: 280px;
      top: 40px;
      border: 2px solid rgb(185, 182, 182);
      border-left: 0;
      border-right: 0;
      background: #eeebeb;
      box-sizing: border-box;
    }
    .to-top {
      position: fixed;
      display: none;
      bottom: 20%;
      right: 40px;
      width: 64px;
      height: 64px;
      margin-left: 100px;
      // background: red;
      background-image: url("../assets/img/totop.png");
    }
    .to-top:hover {
      animation: bublu 1s;
      // background: red;
    }
    @keyframes bublu {
      0% {
        transform: scale(0.8, 0.8);
      }
      50% {
        transform: scale(0.5, 0.5);
      }
      75% {
        transform: scale(2.5, 1.5);
      }
      100% {
        transform: scale(1, 1);
      }
    }
  }
}
</style>
