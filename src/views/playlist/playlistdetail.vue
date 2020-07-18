<template>
  <div id="box" v-if="privileges.length!==0">
    <div id="listhead">
      <div class="ld-img">
        <img :src="playlist.coverImgUrl+'?param=200y200'" alt />
      </div>
      <div class="ld-info">
        <h2 class="ls-title">{{playlist.name}}</h2>
        <span class="ls-cretor">
          <img :src="playlist.creator.avatarUrl+'?param=50y50'" alt />
          <div>
            <span class="ls-i-cretor">{{playlist.creator.nickname}}</span>
            <span class="ls-i-date">{{formatDate(playlist.createTime)}} 创建</span>
          </div>
        </span>
      </div>
      <div class="ls-data">
        <span>
          <a class="ls-i-coll">
            <span>{{playlist.subscribedCount}}</span>
          </a>
          <a class="ls-i-share">
            <span>{{playlist.shareCount}}</span>
          </a>
          <!-- <i class="ls-d-comm"></i> -->
        </span>
      </div>
      <div class="intr">
        <div class="intr-tag">
          <span class="tag-head">tags</span>
          <span v-for="(tag, index) in playlist.tags" :key="index">{{tag}}</span>
        </div>
        <div class="intr-p">
          <i>Description:</i>
          <p v-if="playlist.description==null">无</p>
          <p v-else v-for="(item, index) in playlist.description.split('\n')" :key="index">{{item}}</p>
        </div>
      </div>
    </div>
    <div id="listcontent">
      <div class="playc">
        <span>{{playlist.playCount}}</span>
      </div>
      <!-- frame="border"   cellpadding="2"border="5"  cellpadding="0"-->
      <audio v-if="songurl!==''" :src="songurl" autoplay controls></audio>
      <table cellspacing="0">
        <thead>
          <tr height="30px">
            <th></th>
            <th>歌曲</th>
            <th>时长</th>
            <th>歌手</th>
            <th colspan="2">专辑</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in  songsdetail" :key="index">
            <td>
              <div>
                <span>{{index+1}}</span>
                <!-- @click.prevent="getMusicUrl(id=item.id)" -->
                <span></span>
              </div>
            </td>
            <td>
              <span
                :soid="item.id"
                :title="item.name"
                @click.prevent="getMusicUrl(id=item.id)"
              >{{item.name}}</span>
            </td>
            <td>
              <span>{{item.l!==null?getPlaytime ('128000', item.l.size):'00:00'}}</span>
            </td>
            <td>
              <!-- <router-link to="/singer"></router-link> -->
              <router-link
                :to="{name:'singer',query:{id:ar.id}}"
                tag="span"
                :title="ar.name"
                :arid="ar.id"
                v-for="(ar, index) in item.ar"
                :key="index"
              >{{ar.name}}</router-link>
            </td>
            <td colspan="2">
              <span
                :title="item.al.name"
                :alid="item.al.id"
                :alurl="item.al.picUrl"
              >{{item.al.name}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      playlist: {}, // this.$store.state.detaillist.playlist,
      privileges: [], // this.$store.state.detaillist.privileges
      songIds: [],
      songsdetail: [],
      songurl: ''
    }
  },
  methods: {
    getMusicUrl (id) {
      console.log(id)
      axios.get('/song/url?id=' + id).then(res => {
        console.log(res.data)
        this.songurl = res.data.data[0].url
      })
    },
    formatDate (timestmp) {
      var t = new Date(timestmp)
      return [t.getFullYear(), ('0' + (t.getMonth() + 1)).substr(-2), ('0' + t.getDate()).substr(-2)].join('-')
    },
    getPlaytime (bps, size) {
      var t = parseInt(size) / 1024 * 8 / parseInt(bps.substr(0, 3)) / 60
      var m = 0
      var s = 0
      if (parseInt(t) > 10) {
        m = parseInt(t).toString()
      } else {
        m = parseInt(t).toString().replace('', 0).substr(-2)
      }
      // console.log(m)
      if ((t % 1 * 60) >= 10.0) {
        s = (t % 1 * 60).toFixed()
      } else {
        s = parseInt(t % 1 * 60).toString().replace('', 0).substr(-2)
      }
      return m + ':' + s
    }
    // filterName(arry){
    //   var data =
    // }
  },
  mounted () {
    this.$store.commit('hidePlaylist', false)
  },
  beforeCreate () {
    console.log(this.$route.params.id)
    const pro = new Promise((resolve, reject) => {
      axios.get('/playlist/detail?id=' + this.$route.params.id).then(res => {
        this.playlist = res.data.playlist
        this.privileges = res.data.privileges
        for (var i = 0; i < this.privileges.length; i++) {
          this.songIds[i] = this.privileges[i].id
        }
        resolve(this.songIds)
      })
    })
    pro.then(res => {
      axios.get('song/detail?ids=' + res).then(res => {
        this.songsdetail = res.data.songs
        console.log(this.songsdetail)
      })
    })
  },

  beforeDestroy () {
    this.$store.commit('hidePlaylist', true)
  }

}
</script>
<style lang="scss" scoped>
#box {
  width: 640px;
  margin: 30px;
  margin: 0 auto;
  #listhead {
    width: 100%;
    // height: 300px;
    border-radius: 10px;
    background: #e9e9e9;
    display: inline-block;
    position: relative;
    // margin-top: 50px;
    .ld-img {
      display: inline-block;
      width: 200px;
      height: 200px;
      margin: 20px;
      margin-left: 10px;
      padding-top: 20px;
      // background: yellow;
      img {
        display: inline-block;
        border: 1px solid #d21a1a;
        border-radius: 5px;
        padding: 5px;
        background: #d21a1a;
        box-sizing: border-box;
      }
    }
    .ld-info {
      position: absolute;
      top: 40px;
      left: 240px;
      .ls-title {
        display: inline-block;
      }
      .ls-cretor {
        display: inline-block;
        height: 50px;
        width: 350px;
        margin-top: 20px;
        line-height: 50px;
        img {
          float: left;
          display: block;
          border-radius: 5px;
          border: 1px solid #8e8888;
        }
        div {
          float: left;
          margin-left: 15px;
          font-size: 12px;
          .ls-i-cretor {
            color: rgb(162, 162, 238);
            cursor: pointer;
          }
          .ls-i-cretor:hover {
            text-decoration: underline;
          }
          .ls-i-date {
            margin-left: 15px;
            color: #999;
          }
        }
      }
    }
    .ls-data {
      position: absolute;
      left: 240px;
      top: 160px;
      span {
        display: block;
        margin: 0 auto;
        line-height: 32px;
        .ls-i-coll {
          float: left;
          display: block;
          background: url(../../assets/img/colle.png) no-repeat;
          span {
            display: block;
            margin-left: 40px;
          }
        }
        .ls-i-share {
          float: left;
          display: block;
          height: 32px;
          margin-left: 30px;
          background: url(../../assets/img/share.png) no-repeat;
          span {
            display: block;
            margin-left: 40px;
            // line-height: 32px;
          }
        }
        a {
          background: #b5b5b5;
          cursor: pointer;
          border: 1px solid rgb(162, 161, 161);
          padding: 0 5px 0 5px;
          border-radius: 5px;
          box-sizing: content-box;
          -moz-box-shadow: 1px 1px 4px #d21a1a;
          -webkit-box-shadow: 1px 1px 4px #d21a1a;
          box-shadow: 1px 1px 4px #d21a1a;
        }
      }
    }
    .intr {
      float: right;
      // margin-left: 240px;
      margin-top: -50px;
      .intr-tag {
        height: 28px;
        line-height: 28px;
        margin-left: 10px;
        .tag-head {
          width: 40px;
          display: inline-block;
          background: #999;
          border-radius: 5px;
          text-align: center;
          background: #aeadad; //#d21a1a;
          // color:;
        }
        .tag-head ~ span {
          display: inline-block;
          // width: 50px;
          padding: 0 0.5em 0 0.5em;
          border: 1px solid gray;
          border-radius: 10px;
          text-align: center;
          margin-left: 15px;
          color: white;
          background: #d21a1a;
        }
      }
      .intr-p {
        padding: 0 5px 0 5px;
        margin-top: 10px;
        border: 1px solid black;
        display: block;
        max-width: 400px;
        i {
          font-weight: bold;
        }
        p:first-of-type {
          margin-top: 10px;
          text-indent: 32px;
        }
        p {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          min-width: 400px;
        }
      }
      .intr-p:hover {
        overflow: visible;
        height: auto;
      }
    }
  }
  #listcontent {
    border-radius: 10px;
    .playc {
      width: 100%;
      height: 30px;
      span {
        float: right;
        margin-right: 20px;
      }
    }
    table {
      // border: 1px solid black;
      width: 100%;
      margin-bottom: 20px;
      table-layout: fixed;
      thead {
        background: #ccc9c9;
        border: 2px inset rgba(174, 173, 173, 0.421);
        tr {
          th {
            border-right: 2px solid rgba(174, 173, 173, 0.421);
          }
          th:last-of-type {
            border-right: 0;
          }
        }
      }
      tbody {
        tr {
          height: 30px;
          width: 100%;
          text-align: center;
          td {
            height: 30px;
            width: 50px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            border-left: 3px solid #e0e0e0;
            border-top: 2px solid #f3f2f2;
            cursor: pointer;
          }
          td:nth-of-type(4):hover {
            text-decoration: underline;
          }
          td:first-of-type {
            text-align: center;
            line-height: 20px;

            div {
              display: inline-block;
              text-align: center;

              span {
                display: inline-block;
                line-height: 30px;
              }
              span:nth-of-type(2) {
                width: 20px;
                height: 20px;
                // display: block;
                background: url(../../assets/img/icon.png);
                background-position: 40px -632px;
                margin-top: 5px;
                text-align: right;
                margin-left: 10px;
              }
              span:nth-of-type(2):hover {
                // background: #77767652;
                // box-shadow: 1px 1px 1px 1px inset rgba(0, 0, 0, 0.2);
                border-radius: 50%;
              }
              span:nth-of-type(1) {
                text-align: left;
                float: left;
                line-height: 32px;
                // margin-left: 10px;
                margin-right: 10px;
              }
            }
          }
          table tr:hover {
            background: #d21a1a;
            color: #fff;
            &:hover td {
              background: none;
            }
          }
        }
      }
      tr:nth-child(even) {
        background: #e9e9e9;
      }
    }
  }
}
</style>
