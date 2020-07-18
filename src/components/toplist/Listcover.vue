<template>
  <div id="box">
    <div id="listcover">
      <div>
        <span class="title">排行榜</span>
      </div>
      <div id="ulist">
        <ul>
          <li v-for="(toplist) in toplistarr" :key="toplist.id">
            <div id="cover">
              <div id="coverimg">
                <a @click.prevent="setListId(id=toplist.id)">
                  <img :src="toplist.coverImgUrl+'?param=50y50'" />
                </a>
              </div>
              <div id="covertitle">
                <p>
                  <a @click.prevent>{{toplist.name}}</a>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div id="content">
      <list></list>
    </div>-->
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      toplistarr: [],
      artistToplist: []
    }
  },
  methods: {
    setListId (id) {
      this.$bus.emit('getList', id)
    }
  },
  beforeCreate () {
    axios.get('/toplist').then(res => {
      this.toplistarr = res.data.list
      this.artistToplist = res.data.artistToplist
      console.log('toplist: ', res.data)
      // console.log()
    }).catch(err => {
      console.log('榜单列表获取错误：', err)
    })
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
#box {
  #listcover {
    width: 240px;
    border: 2px solid rgb(180, 172, 172);
    background: #eeeded;
    .title {
      display: inline-block;
      margin-left: 20px;
      margin-top: 30px;
      font-size: 25px;
      font-weight: bold;
    }
    #ulist {
      width: 240px;
      margin: 0 auto;
      ul {
        margin-top: 50px;
        margin-left: 10px;
        display: block;
        list-style: none;
        // width: 100%;
        // height: 100%;
        li {
          display: block;
          margin-top: 50px;
          // border: 1px solid black;
          #cover {
            height: 50px;
            #coverimg {
              a {
                display: inline-block;
                width: 40px;
                height: 40px;
                img {
                  display: inline-block;
                }
              }
            }
            #covertitle {
              margin-left: 60px;
              margin-top: -55px;
              font-size: 15px;
              p {
                display: inline-block;
                a {
                  display: inline-block;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
