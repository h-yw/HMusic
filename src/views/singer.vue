<template>
  <div>
    <div id="head">
      <div class="h-bg">
        <h1 v-if="singerhot.artist===undefined"></h1>
        <h1 v-else>{{singerhot.artist.name}}</h1>
        <h3
          v-if="singerhot.artist!==undefined&& singerhot.artist.trans!=''"
        >{{singerhot.artist.trans}}</h3>
        <img :src="singerhot.artist!==undefined&& singerhot.artist.picUrl+'?param=640y300'" alt />
      </div>
      <div class="h-tab">
        <ul @click="handleliClick($event)">
          <li class="active" value>热门作品</li>
          <li value="album">所有专辑</li>
          <li value="mv">相关mv</li>
          <li value="desc">艺人介绍</li>
        </ul>
      </div>
    </div>
    <div id="content">
      <div class="con-data" v-if="selectTab[0]">
        <button>播放</button>
        <button>收藏</button>
        <div class="select" @click.prevent>
          <select name="selectlist" autocomplete="off">
            <option value="热门作品">热门作品</option>
            <option value="作词作品">作词作品</option>
            <option value="作曲作品">作曲作品</option>
          </select>
        </div>
      </div>
      <div class="con-lis">
        <listoftable
          v-if="selectTab[0] &&singerhot.length!=0 "
          class="table"
          :singerhot="singerhot"
        ></listoftable>
        <listofimg
          class="listimg"
          v-if="selectTab[1] &&propdatas.hotAlbums !==undefined&& propdatas.hotAlbums.length!==0"
          :propdatas="propdatas"
        ></listofimg>
        <listofimg
          class="listimg"
          key="singer-mvs"
          v-if="selectTab[2]&&propdatas.mvs!==undefined&&this.propdatas.mvs.length!==0"
          :propdatas="propdatas"
        ></listofimg>
        <div v-if="selectTab[3]">
          <div class="intr">
            <div class="intr-pe">{{propdatas.briefDesc!=''?propdatas.briefDesc:''}}</div>
            <div
              class="intr-suc"
              v-if="propdatas.introduction===undefined||propdatas.introduction.length===0 "
            ></div>
            <div
              class="intr-suc"
              v-else
              v-for="(intr,index) in propdatas.introduction"
              :key="index"
            >
              <h3 v-if="intr.ti==''"></h3>
              <h3 v-else>{{intr.ti}}</h3>

              <p v-if="intr.txt==null"></p>
              <p
                v-else
                v-for="(item, index) in intr.txt.replace('/\s/ig',' ').split('\n')"
                :key="index"
              >{{item}}</p>
              <!-- {{intr.txt!=null?intr.txt.replace('\n','<br>'):''}} -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import listoftable from '../components/utils/listoftable'
import listofimg from '../components/utils/listofimg'
export default {
  data () {
    return {
      singIngo: [],
      arid: this.$route.query.id,
      singerhot: [],
      // singeralbums: [],
      propdatas: [],
      desc: [],
      isActive: true,
      selectTab: {
        0: true,
        1: false,
        2: false,
        3: false
      }
    }
  },
  methods: {
    handleliClick (event) {
      console.log(event.target)
      if (event.target.getAttribute('value') !== '') {
        var value = event.target.getAttribute('value')
        this.getAboutSinger({ api: value, id: this.arid }).then(res => {
          this.$set(this.$data, 'propdatas', res.data)
        })
      }
      for (var i = 0; i < event.target.parentNode.childNodes.length; i++) {
        if (event.target === event.target.parentNode.childNodes[i]) {
          event.target.className = 'active'
          this.$set(this.selectTab, i, true)
          // eslint-disable-next-line no-undef
        } else {
          event.target.parentNode.childNodes[i].removeAttribute('class')
          this.$set(this.selectTab, i, false)
        }
      }
    },
    getAboutSinger ({ api = '', id, limit = '' }) {
      var str = ''
      if (api !== '') {
        str = (limit === '') ? '/artist/' + api + '?id=' + id : '/artist/' + api + '?id=' + id + '&limit=' + limit
      } else {
        str = '/artists?id=' + id
      }
      return axios.get(str)
    }
  },
  mounted () {
    if (this.arid !== '') {
      this.getAboutSinger({ id: this.arid }).then(res => {
        // this.singerhot = res.data
        this.$set(this.$data, 'singerhot', res.data)
      })
    }
  },
  // beforeUpdate () {
  //   this.selectTab = { 0: true, 1: false, 2: false, 3: false }
  //   // this.selectTab(0) = true
  // },
  components: {
    listoftable,
    listofimg
  }
}
</script>

<style lang="scss" scoped>
#head {
  width: 700px;
  margin: 0 auto;
  margin-top: 20px;
  .h-bg {
    margin: 0 auto;
    width: 640px;
    height: 400px;
    background: #333333;
    color: #c4c2c2;
    // text-align: center;
    // line-height: 145px;
    border-radius: 5px;
    border: 1px black solid;
    h1 {
      text-indent: 1em;
      padding-top: 10px;
    }
    h3 {
      text-indent: 2em;
      color: rgb(197, 197, 197);
    }
    img {
      display: inline-block;
      margin-top: 30px;
      // border-radius: 5px;
    }
  }
  .h-tab {
    width: 640px;
    height: 45px;
    // table-layout: fixed;
    margin: 0 auto;
    border-top: 5px solid #333333;
    ul {
      width: 100%;
      // height: 40px;
      white-space: nowrap;
      margin-top: -5px;
      height: 45px;
      li {
        display: inline-block;
        width: 160px;

        line-height: 45px;
        text-align: center;
        box-sizing: inherit;
        background: #3333337a;
        a {
        }
      }
      .active {
        width: 158px;
        border-top: 5px solid #d21a1a;
        border-left: 1px solid white;
        border-right: 1px solid white;
        background: #333333;
        color: #fff;
      }
      li:hover {
        width: 158.2px;
        border-top: 5px solid #d21a1a;
        border-left: 1px solid white;
        border-right: 1px solid white;
        cursor: pointer;
      }
    }
  }
}
#content {
  clear: both;
  width: 700px;
  margin: 0 auto;
  margin-bottom: 20px;
  .con-data {
    width: 640px;
    margin: 0 auto;
    height: 72px;
    // text-align: center;
    line-height: 72px;
    button {
      display: inline-block;
      width: 80px;
      height: 38px;
      border-radius: 5px;
    }
    button:first-of-type {
      background: url(../assets/img/play.png) no-repeat;
      background-position: 5px 1.5px;
      text-align: right;
      margin-right: 50px;
    }
    button:nth-of-type(2) {
      background: url(../assets/img/colle.png) no-repeat;
      background-position: 5px 1.5px;
      text-align: right;
    }
    .select {
      float: right;
      margin-top: 17px;
      width: 80px;
      height: 38px;
      vertical-align: middle;
      background-color: #fff;
      color: #555;
      // border: 1px solid #aaa;
      text-shadow: none;
      border-radius: 5px;
      // transition: box-shadow 0.25s ease;
      text-align: center;
      line-height: 38px;
      select {
        width: 100%;
        height: 38px;
        border-radius: 5px;
        option {
          background: rgb(233, 232, 232);
        }
      }
    }
  }
  .con-lis {
    .listimg {
      width: 700px;
      overflow: hidden;
      margin-top: 70px;
    }
    /deep/ #newsong {
      margin-top: 0;
      width: 700px;
      /deep/ s {
        overflow: hidden;
      }
      ul {
        width: 700px;
      }
    }
    .intr {
      margin: 0 auto;
      width: 590px;
      text-align: justify;
      text-indent: 2em;
      margin-top: 40px;
      line-height: 25px;
      background: #c9c6c6ce;
      border: 5px solid rgba(146, 145, 145, 0.438);
      border-radius: 10px;
      padding: 20px;
      .intr-pe {
      }
      .intr-suc {
      }
    }
  }
}
html {
  background: #d21a1a70;
}
</style>
