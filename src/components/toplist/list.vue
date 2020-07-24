<template>
  <div id="listbox">
    <div id="list">
      <div id="head">
        <div class="playleft">
          <img :src="playlist.coverImgUrl+'?param=140y140'" alt />
        </div>
        <div class="playright">
          <span class="title">{{playlist.name}}</span>
          <span class="date">最近更新：{{date}}</span>
          <div class="data">
            <span class="data-d">{{playlist.subscribedCount}}</span>
            <span class="data-d">{{playlist.shareCount}}</span>
            <span class="data-d">{{playlist.commentCount}}</span>
          </div>
        </div>
      </div>
      <div id="content">
        <div class="cs">
          <span class="cst">歌曲列表</span>
          <!-- <audio :src="this.songUrl" autoplay controls></audio> -->
        </div>
        <ul>
          <li v-for="(songDetail, index) in songsDetail" :key="index">
            <div id="lin-box">
              <span class="s-img">
                <a @click.prevent>
                  <img :src="songDetail.al.picUrl+'?param=70y70'" alt />
                </a>
              </span>
              <span
                class="s-p-svg"
                v-on:click="play(songDetail,$event)"
                :flagId="'play_'+songDetail.id"
              ></span>
              <div class="d-name-a">
                <span class="s-name">
                  <a @click.prevent>{{songDetail.name}}</a>
                </span>
                <span class="s-alia" v-if="songDetail.alia!=''">
                  <a class="a-alia" @click.prevent>{{songDetail.alia[0]}}</a>
                </span>
              </div>
              <span class="s-acname">
                <router-link
                  :to="{name:'singer',query:{id:songDetail.ar[0].id}}"
                  tag="a"
                >{{songDetail.ar[0].name}}</router-link>
                <!-- <a @click.prevent>{{songDetail.ar[0].name}}</a> -->
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      privileges: [],
      playlist: [],
      date: '',
      songIds: [],
      songsDetail: [],
      songUrl: '',
      isShow: true,
      lastplay: ''
    }
  },
  methods: {
    getDate (timestmp) {
      var d = new Date(timestmp)
      return (d.getMonth() + 1) + '月' + d.getDate() + '日'
    },
    getSongIds (data) {
      for (var i = 0; i < data.length; i++) {
        this.songIds[i] = data[i].id
      }
    },
    play (datas, event) {
      this.isShow = !this.isShow
      if (this.lastplay) {
        this.lastplay.classList.remove('active')
        if (this.lastplay.attributes[1].nodeValue !== event.target.attributes[1].nodeValue) {
          this.isShow = false
        }
      }
      this.lastplay = event.target
      if (this.isShow) {
        event.target.classList.remove('active')
      } else {
        event.target.classList.add('active')
        this.$bus.emit('message', datas)
      }
    }
  },
  created () {
    this.privileges.length = 0
    this.playlist.length = 0
    this.songIds.length = 0
    this.songsDetail.length = 0
    axios.get('/playlist/detail?id=19723756').then(res => {
      this.playlist = res.data.playlist
      this.getSongIds(res.data.privileges)
      this.date = this.getDate(res.data.playlist.updateTime)
    }).then(() => {
      axios.get('/song/detail?ids=' + this.songIds.join(',')).then(res => {
        this.songsDetail = res.data.songs
      }).catch(err => {
        console.log('err: ', err)
      })
    })
  },
  mounted () {
    this.$bus.off('getList')
    this.$bus.on('getList', res => {
      this.privileges.length = 0
      this.playlist.length = 0
      this.songIds.length = 0
      this.songsDetail.length = 0
      axios.get('/playlist/detail?id=' + res).then(res => {
        this.playlist = res.data.playlist
        this.getSongIds(res.data.privileges)
        this.date = this.getDate(res.data.playlist.updateTime)
      }).then(() => {
        axios.get('/song/detail?ids=' + this.songIds.join(',')).then(res => {
          this.songsDetail = res.data.songs
        }).catch(err => {
          console.log('err: ', err)
        })
      })
    })
  }
}
</script>
<style lang="scss" scoped>
#listbox {
  border: 2px solid rgb(185, 182, 182);
  #head {
    width: 660xp;
    .playleft {
      width: 150px;
      height: 150px;
      border: 1px black solid;
      margin-top: 30px;
      margin-left: 30px;
      background: #eeeded;
      img {
        display: inline-block;
        margin: 0 auto;
        margin-top: 5px;
        margin-left: 5px;
      }
    }
    .playright {
      margin-left: 210px;
      margin-top: -150px;
      .title {
        font-size: 20px;
        font-weight: bold;
        display: inline-block;
      }
      .date {
        display: block;
        color: #a6aaaa;
        margin-top: 20px;
      }
      .data {
        margin-top: 35px;
        // margin-left: 10px;
        .data-d {
          line-height: 35px;
          display: inline-block;
          height: 40px;
          width: auto;
          border: 5px solid rgb(224, 218, 218);
          background: #ddd8d8;
          box-sizing: border-box;
          margin-right: 10px;
          border-radius: 5px;
        }
      }
    }
  }
  #content {
    width: 655px;
    margin-top: 60px;
    background: #eeeded;
    border: 2px solid rgb(185, 182, 182);
    border-left: 0;
    border-right: 0;
    box-sizing: border-box;
    // background: pink;
    .cs {
      font-size: 20px;
      font-weight: bold;
      margin: 30px 0 0 30px;
      .cst {
        display: inline-block;
      }
    }
    ul {
      list-style: none;
      margin-top: 50px;
      li {
        display: block;
        height: 80px;
        width: 657px;
        border: 2px solid rgb(161, 161, 161);
        box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        margin-top: 10px;
        box-sizing: border-box;
        #lin-box {
          position: relative;
          color: black;
          font-size: 17px;
          .s-img {
            display: inline-block;
            margin-left: 50px;
            text-align: center;
            img {
              display: inline-block;
              vertical-align: middle;
              border-radius: 5px;
              margin-top: -26px;
              // margin-top: 3px;
            }
          }
          .s-acname {
            display: inline-block;
            position: absolute;
            right: 10px;
            top: 30px;
          }
          .d-name-a {
            position: absolute;
            top: 50%;
            margin-top: -35px;
            display: inline-block;
            white-space: nowrap;
            margin-left: 10px;
            .s-name {
              display: block;
              position: relative;
              white-space: nowrap;
              margin: 0px 10px 0 10px;
              a {
                display: inline-block;
                margin-top: 22px;
              }
            }
            .s-alia {
              display: block;
              color: #a6aaaa;
              .a-alia {
                display: block;
                width: 150px;
                overflow: hidden;
                text-overflow: "...";
                white-space: nowrap;
              }
            }
            a:hover {
              cursor: pointer;
              overflow: visible;
              text-decoration: underline;
            }
          }
          .s-p-svg {
            display: inline-block;
            background-image: url("../../assets/img/play.png");
            text-align: center;
            margin: 24px 0px 0 50px;
            // line-height: 80px;
            height: 32px;
            width: 32px;
            border-radius: 50%;
            cursor: pointer;
          }
          .active {
            background-image: url("../../assets/img/stop.png");
            // color: #c20c0c;
          }
          .s-p-svg:hover {
            // transition: 1s;
            animation: cha 0.5s;
            // transform: scale(1.5, 1.5);
          }
          @keyframes cha {
            0% {
              transform: scale(1.2, 1.2);
            }
            50% {
              transform: scale(1.5, 1.5);
            }
            75% {
              transform: scale(1.2, 1.2);
            }
            100% {
              transform: scale(1, 1);
            }
          }
        }
      }
    }
  }
}
</style>
