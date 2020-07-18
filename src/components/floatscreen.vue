<template>
  <div id="float-screen" v-if="isShow">
    <div class="mask"></div>
    <div class="f-b">
      <div class="close" @click="closeScreen">
        <svg
          t="1595005772214"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2354"
          width="32"
          height="32"
        >
          <path
            d="M589.704 501.674L998.27 93.107c20.652-20.653 20.652-54.556 0-75.209l-2.237-2.237c-20.652-20.652-54.556-20.652-75.208 0L512.258 424.745 103.691 15.489c-20.652-20.652-54.556-20.652-75.208 0l-2.238 2.237c-21.168 20.652-21.168 54.556 0 75.208l408.568 408.74L26.245 910.24c-20.652 20.652-20.652 54.556 0 75.208l2.238 2.238c20.652 20.652 54.556 20.652 75.208 0l408.567-408.568 408.568 408.568c20.652 20.652 54.556 20.652 75.208 0l2.237-2.238c20.652-20.652 20.652-54.556 0-75.208L589.704 501.674z"
            fill="#2C2C2C"
            p-id="2355"
          />
        </svg>
      </div>
      <listoftable :singerhot="singerhot"></listoftable>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
import listoftable from '../components/utils/listoftable'
export default {
  data () {
    return {
      singerhot: {},
      data: [],
      isShow: false,
      typeid: ''
    }
  },
  props: ['propdatas', 'isShowScreen', 'idformalbum'],
  components: {
    listoftable
  },
  methods: {
    closeScreen () {
      this.isShow = false
      // this.$bus.emit('ShowoFloatscreen', false)
    },
    getAxiosObj (id) {
      return Axios.get('/album?id=' + id)
    }
  },
  mounted () {
    console.log('idformalbum', this.idformalbum)
    // var id = ''
    if (this.idformalbum !== undefined && this.idformalbum !== '') {
      this.typeid = this.idformalbum
      this.$set(this.$data, 'isShow', true)
      // this.isShow = true
    }
    if (this.propdatas !== undefined && this.idformalbum !== '') {
      this.typeid = this.propdatas
    }
    if (this.$props.isShowScreen !== undefined && this.idformalbum !== '') {
      this.isShow = this.$props.isShowScreen
    }

    // this.propdatas
    console.log('this.propdatas', this.propdatas)
    this.getAxiosObj(this.typeid).then(res => {
      res.data.songs.forEach(el => {
        this.data.push({
          artist: {
            id: el.ar[0].id,
            name: el.ar[0].name
          },
          id: el.id,
          name: el.name,
          l: {
            size: el.l !== null ? el.l.size : '0'
          },
          al: {
            id: el.al.id,
            name: el.al.name
          }

        })
      })
      this.$set(this.singerhot, 'hotSongs', this.data)
      // console.log(this.$bus.emit('sendDatas', this.data))
      console.log('f', this.data)
    })
  }
}
</script>

<style lang="scss" scoped>
#float-screen {
  .f-b {
    position: fixed;
    top: 50%;
    left: 50%;
    background: white;
    z-index: 8888;
    transform: translate(-50%, -50%);
    padding-top: 10px;
  }
  .mask {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: black;
    transform: translate(-50%, -50%);
    z-index: 888;
    opacity: 0.5;
    border-radius: 10px;
    border: 5px solid gray;
    box-shadow: -8px 8px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .close {
    float: right;
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    text-align: center;
    svg {
      margin-top: 8px;
    }
  }
  .close:hover {
    background: url(../assets/img/close.png) no-repeat;
    background-position: 8px 8px;
    svg {
      opacity: 0;
      animation: opless 0.5s linear;
    }
    @keyframes opless {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 0;
      }
    }
    animation: closing 0.5s linear;
  }
  @keyframes closing {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
