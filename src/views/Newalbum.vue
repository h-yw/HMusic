<template>
  <div>
    <div id="album">
      <div id="head">
        <span class="h-s">新碟上架</span>
      </div>
      <ul>
        <li v-for="album in albums" :key="album.id">
          <div class="al-cd">
            <div class="al-img">
              <div class="cd-p">
                <div class="cd"></div>
              </div>
              <div class="b" @click="showScreen(album.id)">
                <img :src="album.picUrl+'?param=200y200'" alt />
              </div>
            </div>
            <div class="al-intr">
              <span class="al-name">{{album.name}}</span>
              <br />
              <router-link :to="{name:'singer',query:{id:album.artist.id}}" tag="a">
                <span>{{album.artist.name}}</span>
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <floatscreen :propdatas="propdatas" :isShowScreen="isShowScreen" v-if="isShowoFloatscreen"></floatscreen>
  </div>
</template>

<script>
import axios from 'axios'
import floatscreen from '../components/floatscreen'
export default {
  data () {
    return {
      albums: [],
      isShowoFloatscreen: false,
      propdatas: '',
      isShowScreen: false
    }
  },
  methods: {
    getAxiosObj ({ limit, offset }) {
      limit = arguments[0] || '50'
      // offset= arguments[1] || '-1'
      var params = ''
      if (!arguments[0]) {
        params = 'limit=' + limit + '&offset=' + offset
      } else {
        params = '?'
        var keys = Object.getOwnPropertyNames(arguments[0])
        keys.forEach(el => {
          params += el + '=' + arguments[0][el] + '&'
        })
      }
      return axios.get('/top/album' + params.replace(/&$/, ''))
    },
    showScreen (id) {
      console.log(id)
      this.isShowoFloatscreen = false // !this.isShowoFloatscreen
      this.$set(this.$data, 'propdatas', id)
      this.isShowScreen = true
    }
  },
  updated () {
    this.isShowoFloatscreen = true
  },
  mounted () {
    this.getAxiosObj({}).then(res => {
      if (res.data.albums.length !== 0) {
        this.albums = res.data.albums
      } else {
        alert('专辑都失踪了吗?')
      }
    })
  },
  components: {
    floatscreen
  }
}

</script>

<style lang="scss" scoped>
#float-screen {
  /deep/ .f-b {
    border-radius: 10px;
    tbody {
      overflow-y: scroll;
    }
  }
}

#head {
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
  .h-s {
    display: inline-block;
    height: 100%;
    padding-left: 50px;
    font-size: 30px;
    border-bottom: 5px solid red;
    margin-left: 50px;
  }
}
#album {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(218, 214, 214, 0.466);
  ul {
    max-width: 1000px;
    overflow: hidden;
    clear: both;
    padding-top: 30px;
    li {
      float: left;
      width: 250px;
      height: 300px;
      margin-bottom: 40px;
      margin-left: 50px;
      text-align: center;
      .al-cd {
        margin: 0 auto;
        // border: 1px solid black;
        border-right: 0;
        height: 300px;
        width: 250px;
        // background: rgba(172, 170, 170, 0.774);
        box-sizing: border-box;
        box-shadow: -8px 8px 12px 0 rgba(0, 0, 0, 0.1);
        .b {
          position: absolute;
          width: 210px;
          height: 210px;
          border-radius: 10px;
          box-shadow: -8px 8px 12px 0 rgba(0, 0, 0, 0.1);
          img {
            display: inline-block;
            // width: 210px;
            // height: 210px;
            // background: black;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
              0 0 6px rgba(0, 0, 0, 0.04);
            border: 1px solid black;
            border-radius: 10px;
          }
        }
        .b:hover {
          cursor: pointer;
        }
        .al-img {
          width: 250px;
          height: 200px;
          background: no-repeat;
          position: relative;
          z-index: 99;
          line-height: 300px;
          top: 10px;
          // position: relative;
          .cd {
            position: absolute;
            width: 165px;
            height: 165px;
            background-image: url(../assets/img/cd.png);
            background-size: cover;
            top: 20px;
            left: 110px;
            z-index: -1;
          }
        }
        .al-intr {
          padding-top: 20px;
          overflow: hidden;
          white-space: nowrap;
          .al-name {
            display: inline-block;
            width: 100%;
            font-size: 20px;
            box-sizing: border-box;
            margin-left: 10px;
            margin-top: 10px;
            text-align: left;
          }
          a {
            text-align: left;
            display: inline-block;
            padding-top: 10px;
            width: 100%;
            box-sizing: border-box;
            margin-left: 10px;
            // padding-left: 20px;
            span {
              display: inline-block;
              font-size: 16px;
              color: rgb(187, 185, 184);
              border-radius: 5px;
            }
            span:hover {
              background: #a80909;
              color: white;
              text-decoration: underline;
            }
          }
        }
        .mask:hover {
          opacity: 0.3;
        }
        .al-img:hover .cd {
          animation: roting 2s infinite linear;
        }
        @keyframes roting {
          0% {
            transform: translateX(70px);
            transform: rotate(180deg);
          }
          100% {
            transform: translateX(70px);
            transform: rotate(360deg);
          }
        }
      }
    }
  }
}
</style>
