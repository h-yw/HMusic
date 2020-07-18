<template>
  <div v-if="datas.length!==0" :key="(new Date()).getTime()">
    <div id="newsong">
      <div id="s">
        <ul ref="songul">
          <!-- @click="toDetail(id=playlist.id)" -->
          <li :alid="data.id" v-for="data in  datas.hotAlbums" :key="data.id">
            <div id="song">
              <div id="dimg" @click="sendIdformalbum(id=data.id)">
                <img :src="data.picUrl" />
              </div>
              <div id="dname" :data-id="data.id">
                <span
                  :title="data.name"
                  :data-id="data.id"
                  @click="sendIdformalbum(id=data.id)"
                >{{data.name}}</span>
                <span>
                  <i>{{formatDate(data.publishTime)}}</i>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div id="slide">
        <button class="btn-down" v-on:click="slideUp()">👆</button>
        <div class="page">
          <label for="inputnum">
            <input
              id="inputnum"
              type="number"
              defaultValue="1"
              v-model="inputPage"
              :max="Math.ceil(this.datas.hotAlbums.length /12)"
              min="1"
              @blur="getInpPage()"
            />
            <span>{{Math.ceil(this.datas.hotAlbums.length /12)}}</span>
          </label>
        </div>
        <button class="btn-up" v-on:click="slideDown()">👇</button>
      </div>
    </div>
    <floatscreen :idformalbum="idformalbum"></floatscreen>
  </div>
</template>
<script>
import floatscreen from '../floatscreen'
export default {
  data () {
    return {
      datas: [],
      dataclass: '',
      slidedown: 0,
      slidetime: 0,
      slidetimetmp: 0,
      offset: 0,
      pageNum: 1,
      inputPage: 1,
      idformalbum: ''
    }
  },
  components: {
    floatscreen
  },
  methods: {
    sendIdformalbum (id) {
      this.idformalbum = id
    },
    formatDate (timestmp) {
      var t = new Date(timestmp)
      return [t.getFullYear(), ('0' + (t.getMonth() + 1)).substr(-2), ('0' + t.getDate()).substr(-2)].join('-')
    },
    slideDown () {
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
    getInpPage () {
      console.log(this.inputPage)
      if (parseInt(this.inputPage) <= Math.ceil(this.playlists.total / 15) && this.inputPage !== '') {
        this.offset = (this.inputPage - 1) * 15
        this.getPlayList(this.cat, this.order, this.offset)
      }
    }

  },
  props: ['propdatas'],
  mounted () {
    this.$set(this.$data, 'datas', this.propdatas)
    console.log(this.datas.mvs)
    if ('mvs' in this.datas) {
      console.log('true')
      this.datas = this.datas.mvs.map(el => {
        return {
          id: el.id,
          name: el.name,
          picUrl: el.imgurl,
          publishTime: el.publishTime
        }
      })
      this.datas = {
        hotAlbums: this.datas
      }
      console.log(this.datas)
    }
    if (this.propdatas.hotAlbums !== undefined) {
      this.slidetime = parseInt(this.propdatas.hotAlbums.length / 12)
      this.slidetimetmp = parseInt(this.propdatas.hotAlbums.length / 12)
    }
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
    // overflow: hidden;
    z-index: 1;
  }
  .contitle {
    width: 100%;
    height: 30px;
    // white-space: nowrap;
    line-height: 30px;
    padding-top: 15px;
    margin-left: 15px;
    .order {
      float: right;
      margin-right: 30px;
      width: 46px;
      height: 29px;
      border: 1px black solid;
      text-align: center;
      line-height: 29px;
      border-radius: 5px;
      background: #a80909;
      a {
        text-align: center;
        color: white;
      }
      a:hover {
        text-decoration: underline;
        text-decoration-color: black;
        cursor: pointer;
      }
    }
    h3 {
      display: inline-block;
      text-align: center;
      a {
        height: 30px;
        width: 70px;
        display: inline-block;
        margin-left: 15px;
        border: 1px solid black;
        border-radius: 5px;
        cursor: pointer;
        i {
          font-style: normal;
          font-size: 12px;
          font-weight: normal;
        }
      }
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
        margin-top: 5px;
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
          width: 115px;
          height: 40px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin: 0 2px;
        }
        span:nth-of-type(2) {
          margin: 0 5px;
          font-size: 12px;
          i {
            color: #aeacac;
          }
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
    .page {
      position: relative;
      width: 50px;
      // position: absolute;
      top: 100px;
      span {
        display: inline-block;
        position: absolute;
        width: 25px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        border-radius: 5px;
        border: 2px solid black;
        background: #7d7b7b;
      }
      label {
        width: 25px;
        height: 50px;
        #inputnum {
          text-align: center;
          line-height: 48px;
          width: 24px;
          height: 48px;
          // background: url(../assets/img/input.png);
          border-radius: 5px;
          border: 2px solid black;
          -webkit-appearance: none;
          -moz-appearance: textfield;
        }
        #inputnum:focus {
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(102, 175, 233, 0.6);
        }
      }
    }
  }
}
</style>
