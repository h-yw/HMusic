<template>
  <div id="artist">
    <div class="select">
      <!-- <div :class="'hot-singer '+selectHot?'active':''">
        <span @click="getAlphabetId($event)" data-alph="-1">热门歌手</span>
      </div>-->
      <div class="type">
        <span>TYPE</span>
        <ul @click="getTypeId($event)">
          <li data-type="-1">全部</li>
          <li data-type="1">男歌手</li>
          <li data-type="2">女歌手</li>
          <li data-type="3">乐队</li>
        </ul>
      </div>
      <div class="area">
        <span>AREA</span>
        <ul @click="getAreaId($event)">
          <li data-area="-1">全部</li>
          <li data-area="7">华语</li>
          <li data-area="96">欧美</li>
          <li data-area="8">日本</li>
          <li data-area="16">韩国</li>
          <li data-area="0">其他</li>
        </ul>
      </div>
      <div class="alplist">
        <span>字母顺序</span>
        <ul @click="getAlphabetId($event)">
          <li data-alph="-1">热门</li>
          <li data-alph="a">A</li>
          <li data-alph="b">B</li>
          <li data-alph="c">C</li>
          <li data-alph="d">D</li>
          <li data-alph="e">E</li>
          <li data-alph="f">F</li>
          <li data-alph="g">G</li>
          <li data-alph="h">H</li>
          <li data-alph="i">I</li>
          <li data-alph="j">J</li>
          <li data-alph="k">K</li>
          <li data-alph="l">L</li>
          <li data-alph="m">M</li>
          <li data-alph="n">N</li>
          <li data-alph="o">O</li>
          <li data-alph="p">P</li>
          <li data-alph="q">Q</li>
          <li data-alph="r">R</li>
          <li data-alph="s">S</li>
          <li data-alph="t">T</li>
          <li data-alph="u">U</li>
          <li data-alph="v">V</li>
          <li data-alph="w">W</li>
          <li data-alph="x">X</li>
          <li data-alph="y">Y</li>
          <li data-alph="z">Z</li>
          <li data-alph="0">其他</li>
        </ul>
      </div>
    </div>
    <div id="artlist">
      <ul>
        <router-link
          :to="{name:'singer',query:{id:artist.id}}"
          v-for=" artist in artists"
          :key="artist.id"
          tag="li"
        >
          <div class="art-img">
            <span>
              <img :src="artist.picUrl+'?param=120y120'" :title="artist.name" :alt="artist.name" />
            </span>
          </div>
          <div class="art-name">
            <span :title="artist.trans?artist.trans:artist.name">{{artist.name}}</span>
          </div>
        </router-link>
      </ul>
      <div id="page">
        <span class="pagedown">
          <svg
            t="1594969258056"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="15245"
            width="32"
            height="32"
          >
            <path
              d="M759.808 959.658667a51.541333 51.541333 0 0 1-32-11.178667L233.386667 550.741333a51.029333 51.029333 0 0 1 0-79.445333L725.76 75.690667a50.944 50.944 0 0 1 63.829333 79.36l-442.88 355.84 445.098667 358.144a50.944 50.944 0 0 1-32 90.624z"
              fill="#000000"
              p-id="15246"
            />
          </svg>
        </span>
        <span class="pageup">
          <svg
            t="1594969229926"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="15107"
            width="32"
            height="32"
          >
            <path
              d="M264.192 959.658667a51.541333 51.541333 0 0 0 32-11.178667l494.421333-397.738667a51.029333 51.029333 0 0 0 0-79.445333L298.24 75.690667a50.944 50.944 0 0 0-63.829333 79.36l442.88 355.84-445.098667 358.144a50.944 50.944 0 0 0 32 90.624z"
              fill="#000000"
              p-id="15108"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      artists: [],
      params: {
        type: '',
        area: '',
        initial: '',
        limit: '',
        offset: ''
      },
      selectHot: true
    }
  },
  methods: {
    /*
      limit : 返回数量 , 默认为 30
      offset :
            偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
      initial:
          按首字母索引查找参数,如 /artist/list?type=1&area=96&initial=b 返回内容将以 name 字段开头为 b 或者拼音开头为 b 为顺序排列, 热门传-1,#传0
      type 取值:
          -1:全部
          1:男歌手
          2:女歌手
          3:乐队
      area 取值:
          -1:全部
          7华语
          96欧美
          8:日本
          16韩国
          0:其他
    */
    getAxiosObj ({ type, area, initial, limit, offset }) {
      type = arguments[0] || '-1'
      area = arguments[1] || '-1'
      initial = arguments[2] || '0'
      var params = ''
      if (!arguments[0]) {
        params = 'type=' + type + '&area=' + area + '$initial=' + initial
      } else {
        var keys = Object.getOwnPropertyNames(arguments[0])
        // console.log('arguments', arguments[0])
        keys.forEach(el => {
          if (el !== '__ob__') {
            // console.log('el', el)
            params += el + '=' + arguments[0][el] + '&'
          }
        })
      }
      // console.log(params.replace(/&{0,2}}$/g, ''))
      return axios.get('/artist/list?' + params.replace(/&$/, ''))
    },
    getTypeId (event) {
      if (event.target.dataset.type !== undefined) {
        this.doActive(event.target)
        this.$set(this.params, 'type', event.target.dataset.type)
      }
    },
    getAreaId (event) {
      if (event.target.dataset.area) {
        this.doActive(event.target)
        this.$set(this.params, 'area', event.target.dataset.area)
      }
    },
    getAlphabetId (event) {
      console.log(event.target)
      if (event.target.dataset.alph === '-1') {
        this.selectHot = !this.selectHot
      }
      if (event.target.dataset.alph) {
        this.doActive(event.target)
        this.$set(this.params, 'initial', event.target.dataset.alph)
      }
    },
    doActive (target) {
      for (let index = 0; index < target.parentNode.children.length; index++) {
        if (target.parentNode.children[index] !== target) {
          target.parentNode.children[index].removeAttribute('class')
        } else {
          target.setAttribute('class', 'active')
        }
      }
    }
  },
  watch: {
    params: {
      handler () {
        // console.log(this.params)
        this.getAxiosObj(this.params).then(res => {
          this.$set(this.$data, 'artists', res.data.artists)
          // console.log(this.artists)
        })
      },
      deep: true,
      immediate: true
    }
    // params: [
    //   function type (val, oldVal) { console.log('watch', val, oldVal) }
    // ]
  },
  mounted () {
    this.getAxiosObj({
      type: '-1',
      area: '-1',
      initila: '0'
    }).then(res => {
      this.$set(this.$data, 'artists', res.data.artists)
    })
    // console.log(this.$data)
  }
}
</script>

<style lang="scss" scoped>
.active {
  background: #c20c0c;
  color: whitesmoke;
  border-top-right-radius: 5px;
}
#artist {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 100px;
  background: rgba(166, 166, 168, 0.418);
  display: flex;
  li:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  .select {
    float: left;
    width: 200px;
    margin-left: 30px;
    span {
      width: 100px;
      padding-left: 15px;
      margin-top: 15px;
      font-size: 20px;
      display: inline-block;
      border-bottom: 5px solid red;
      max-width: 200px;
      transition: 1s ease-out;
    }
    .hot-singer {
      // background: white;
      margin-bottom: 10px;
      line-height: 47px;
      span {
        // width: 200px;
        width: 178px;
        height: 47px;
        margin-top: 0px;
        border: 2px solid bla;
        border-bottom: 5px solid red;
        border-left: 1px solid gray;
        border-top: 1px solid gray;
        border-right: 1px solid gray;
        border-style: inset;
        // background: blanchedalmond;
        text-align: center;
      }
    }
    .hot-singer:hover {
      span {
        width: 178px;
        cursor: pointer;
        // transform: scale(1.1, 1.1);
      }
    }
    .type {
      max-width: 200px;

      text-align: left;
      line-height: 30px;
      border-top-right-radius: 10px;
      background: #dadada;
      ul {
        list-style: disc;
        padding-left: 50px;
        margin-bottom: 10px;
        background: rgb(243, 243, 243);
        padding-top: 10px;
        padding-bottom: 10px;
        li {
          margin-right: 10px;
        }
      }
    }
    .type:hover span {
      width: 180px;
    }
    .area {
      max-width: 200px;
      background: #dadada;

      text-align: left;
      line-height: 30px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      ul {
        list-style: disc;
        padding-left: 50px;
        background: rgb(243, 243, 243);
        padding-top: 10px;
        padding-bottom: 10px;
        li {
          margin-right: 10px;
        }
      }
    }
    .area:hover span {
      width: 180px;
    }
    .alplist {
      margin-top: 10px;
      max-width: 200px;
      background: rgb(218, 218, 218);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      ul {
        min-width: 180px;
        // margin-left: -15px;
        padding-left: 15px;
        background: rgb(243, 243, 243);
        padding-top: 20px;
        padding-bottom: 20px;
        overflow: hidden;
        clear: both;
        li {
          text-align: center;
          line-height: 25px;
          float: left;
          width: 40px;
          height: 25px;
          border: 1px solid black;
          border-radius: 5px;
          margin: 5px;
        }
      }
    }
    .alplist:hover span {
      width: 180px;
    }
    li:hover {
      background: #c20c0c;
      color: whitesmoke;
      border-top-right-radius: 5px;
    }
  }
  #artlist {
    flex: 1;
    float: right;
    max-width: 700px;
    background: rgb(226, 225, 225);
    margin-left: 50px;
    // margin: 0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-start-start-radius: 10px;
    ul {
      min-width: 500px;
      padding-top: 20px;
      overflow: hidden;
      clear: both;
      padding-left: 30px;
      li {
        float: left;
        width: 150px;
        height: 150px;
        border: 1px solid black;
        text-align: center;
        // line-height: 200px;
        margin-bottom: 20px;
        margin-right: 10px;
        border-radius: 5px;
        background: rgb(226, 225, 225);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transform: perspective(500px);
        .art-img {
          padding-top: 5px;
          span {
            display: inline-block;
            //  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
              0 0 6px rgba(0, 0, 0, 0.04);
            img {
              border-radius: 5px;
            }
          }
        }
        .art-name {
          span {
          }
        }
      }
      li:hover {
        z-index: 9999;
        transition: 1.5s;

        transform-style: preserve-3d;
        transform: translateZ(300px);
        transform: scale(1.2, 1.2);
      }
    }
  }
  #page {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    span {
      display: inline-block;
      width: 50%;
    }
    .pagedown {
      text-align: left;
      // padding-left: 10%;
      svg {
        margin-left: 50%;
      }
    }
    .pageup {
      text-align: right;
      // padding-right: 10%;
      svg {
        margin-right: 50%;
      }
    }
  }
}
</style>
