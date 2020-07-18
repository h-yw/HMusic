<template>
  <div>
    <div id="newsong" v-show="isPlaylistShow">
      <!--  -->
      <div class="contitle">
        <h3>
          <span>{{this.cat===''?'全部':this.cat}}</span>
          <a v-on:click="handleCat($event)">
            <i>
              选择分类
              <em>↓</em>
            </i>
          </a>
        </h3>
        <div class="order" v-on:click="handleHot" ref="order">
          <a v-if="isOrderShow" order="hot">热门</a>
          <a v-if="!isOrderShow" order="new">最新</a>
        </div>
      </div>
      <div
        id="type"
        @mouseout="isShow=false"
        @mouseover="isShow=true"
        :style="'display:'+(isShow ?'block':'none')"
      >
        <div class="tri">
          <i></i>
        </div>
        <h3>
          <a
            @click.prevent="handleSetCat($event)"
            :resourceCount="all.resourceCount"
            cat
          >{{all.name}}</a>
        </h3>
        <dl>
          <dt>
            <i class="icg"></i>
            {{categories[0]}}
          </dt>
          <dd>
            <a
              @click.prevent="handleSetCat($event)"
              v-for="(item, index) in classlg"
              :key="index"
              :resourceCount="item.resourceCount"
              :cat="item.name"
            >{{item.name}}</a>
          </dd>
        </dl>
        <dl>
          <dt>
            <i class="ist"></i>
            {{categories[1]}}
          </dt>
          <dd>
            <a
              @click.prevent="handleSetCat($event)"
              v-for="(item, index) in style"
              :key="index"
              :resourceCount="item.resourceCount"
              :cat="item.name"
            >{{item.name}}</a>
          </dd>
        </dl>
        <dl>
          <dt>
            <i class="isc"></i>
            {{categories[2]}}
          </dt>
          <dd>
            <a
              @click.prevent="handleSetCat($event)"
              v-for="(item, index) in scene"
              :key="index"
              :resourceCount="item.resourceCount"
              :cat="item.name"
            >{{item.name}}</a>
          </dd>
        </dl>
        <dl>
          <dt>
            <i class="ife"></i>
            {{categories[3]}}
          </dt>
          <dd>
            <a
              @click.prevent="handleSetCat($event)"
              v-for="(item, index) in feel"
              :key="index"
              :resourceCount="item.resourceCount"
              :cat="item.name"
            >{{item.name}}</a>
          </dd>
        </dl>
        <dl>
          <dt>
            <i class="isu"></i>
            {{categories[4]}}
          </dt>
          <dd>
            <a
              @click.prevent="handleSetCat($event)"
              v-for="(item, index) in subject"
              :key="index"
              :resourceCount="item.resourceCount"
              :cat="item.name"
            >{{item.name}}</a>
          </dd>
        </dl>
      </div>
      <div id="s">
        <ul ref="songul">
          <li
            v-for="(playlist, index) in playlists.playlists"
            :key="index"
            @click="toDetail(id=playlist.id)"
          >
            <!-- <li v-for="(playlist, index) in playlists.playlists" :key="index"> -->
            <div id="song">
              <div id="dimg">
                <img :src="playlist.coverImgUrl" />
              </div>
              <div id="dname">
                <span :title="playlist.name">{{playlist.name}}</span>
                <span :title="playlist.creator.nickname">
                  <i>by</i>
                  {{playlist.creator.nickname}}
                </span>
              </div>
            </div>
            <!-- </li> -->
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
              v-model="inputPage"
              defaultValue="1"
              :max="Math.ceil(this.playlists.total /15)"
              min="1"
              @blur="getInpPage()"
            />
            <span>{{Math.ceil(this.playlists.total /15)}}</span>
          </label>
        </div>
        <button class="btn-up" v-on:click="slideDown()">👇</button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {

  data () {
    return {
      all: {},
      categories: {},
      sub: [],
      classlg: [],
      style: [],
      scene: [],
      feel: [],
      subject: [],
      isShow: false,
      isOrderShow: true,
      cat: '',
      order: '',
      playlists: {},
      offset: 0,
      pageNum: 1,
      inputPage: 1
    }
  },
  methods: {
    toDetail (id) {
      // this.$router.push(`/playlist/playlistdeatil/${i}`)
      this.$router.push({ name: '', params: { id: '' } })
      this.$router.push({ name: 'detail', params: { id: id } })
      this.$store.commit('hidePlaylist', false)
    },
    getPlayList (cat, order, offset) {
      axios.get('/top/playlist?limit=15&cat=' + cat + '&order=' + order + '&offset=' + offset).then(res => {
        this.playlists = res.data
      })
    },
    handleCat () {
      event.stopPropagation()
      this.isShow = !this.isShow
    },

    handleHot (event) {
      this.order = this.$refs.order.children[0].attributes.order.nodeValue === 'new' ? 'hot' : 'new'
      this.isOrderShow = !this.isOrderShow
      this.offset = 0
      this.pageNum = 1
      this.getPlayList(this.cat, this.order, this.offset)
    },
    handleSetCat (event) {
      this.cat = event.target.attributes.cat.nodeValue
      this.offset = 0
      this.pageNum = 1
      this.getPlayList(this.cat, this.order, this.offset)
      this.isShow = false
    },
    slideDown () {
      if (this.pageNum <= Math.ceil(this.playlists.total / 15)) {
        this.pageNum += 1
        this.offset = (this.pageNum - 1) * 15
        this.getPlayList(this.cat, this.order, this.offset)
        this.inputPage = this.pageNum
      }
    },
    slideUp () {
      if (this.pageNum > 1) {
        this.pageNum -= 1
        this.offset = (this.pageNum - 1) * 15
        this.getPlayList(this.cat, this.order, this.offset)
        this.inputPage = this.pageNum
      }
      // this.pageNum += 1
    },
    getInpPage () {
      console.log(this.inputPage)
      if (parseInt(this.inputPage) <= Math.ceil(this.playlists.total / 15) && this.inputPage !== '') {
        this.offset = (this.inputPage - 1) * 15
        this.getPlayList(this.cat, this.order, this.offset)
      }
    }
  },
  beforeMount () {
    axios.get('/playlist/catlist').then(res => {
      this.all = res.data.all
      this.categories = res.data.categories
      this.sub = res.data.sub
    }).then(() => {
      for (var i = 0; i < this.sub.length; i++) {
        if (this.sub[i].category === 0) {
          this.classlg.push(this.sub[i])
        } else if (this.sub[i].category === 1) {
          this.style.push(this.sub[i])
        } else if (this.sub[i].category === 2) {
          this.scene.push(this.sub[i])
        } else if (this.sub[i].category === 3) {
          this.feel.push(this.sub[i])
        } else {
          this.subject.push(this.sub[i])
        }
      }
    })
  },
  created () {
    // (function () {
    this.offset = 0
    this.pageNum = 1
    this.inputPage = 1
    // })()
    this.getPlayList(this.cat, this.order, this.offset)
  },
  computed: {
    ...mapState(['isPlaylistShow'])
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
#type {
  position: absolute;
  width: 700px;
  height: 426px;
  border: 1px solid blanchedalmond;
  background: #ffffff;
  border-radius: 10px;
  top: 61px;
  z-index: 10;
  h3 {
    display: block;
    // margin-top: 20px;
    // margin-left: 18px;
    height: 57px;
    width: 100%;
    border-bottom: 0.5px solid #f5f5f5;
    a {
      margin-top: 20px;
      margin-left: 18px;
      display: inline-block;
      font-size: inherit;
      font-weight: normal;
      height: 30px;
      width: 90px;
      border: 1px #e7e7e7 solid;
      line-height: 30px;
      text-align: center;
      background: #f6f6f6;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  dl {
    width: 100%;
    padding-top: 20px;
    // border-bottom: 1px solid black;
    dt {
      float: left;
      margin-left: 18px;
      i {
        display: inline-block;
        width: 23px;
        height: 23px;
        background: url(../assets/img/icon.png);
        vertical-align: middle;
        margin-right: 8px;
        margin-bottom: 4px;
      }
      .icg {
        background-position: -20px -735px;
      }
      .ist {
        background-position: 0 -60px;
      }
      .isc {
        background-position: 0 -88px;
      }
      .ife {
        background-position: 0 -117px;
      }
      .isu {
        background-position: 0 -141px;
      }
    }
    dd {
      // margin-top: 20px;
      // border-left: 1px solid black;
      margin-left: 90px;
      text-align: left;
      a {
        text-align: left;
        margin-left: 25px;
        white-space: nowrap;
        line-height: 25px;
        cursor: pointer;
        font-size: 12px;
      }
      a:hover {
        text-decoration: underline;
        text-decoration-color: rgb(130, 123, 123);
        text-decoration-thickness: 2px;
      }
    }
  }
  .tri {
    position: absolute;
    width: 24px;
    height: 11px;
    background: url("../assets/img/iconall.png");
    background-position: -48px 0;
    top: -11px;
    left: 90px;
  }
}
</style>
