<template>
  <div v-if="datas.length!==0">
    <div id="listcontent">
      <!-- <div class="playc">
        <span></span>
      </div>-->
      <!-- frame="border"   cellpadding="2"border="5"  cellpadding="0"-->
      <audio v-if="playurl!==''" :src="playurl" autoplay controls></audio>
      <table cellspacing="0">
        <thead>
          <tr height="30px">
            <th></th>
            <th>歌曲</th>
            <th>时长</th>
            <th v-if="isShowName">歌手</th>
            <th colspan="2">专辑</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in datas.hotSongs" :key="index">
            <td>
              <div>
                <span>{{index+1}}</span>
                <span @click.prevent="getMusicUrl(id=data.id)"></span>
              </div>
            </td>
            <td>
              <span :sid="data.id">{{data.name}}</span>
            </td>
            <td>
              <span>{{data.l!==null?getPlaytime('128000',data.l.size):'00:00'}}</span>
            </td>
            <td v-if="isShowName">
              <span
                v-if="datas.artist"
                :title="(datas.artist!==undefined && datas.artist.trans.length!==0)?'':datas.artist.trans"
              >{{datas.artist.name}}</span>
            </td>
            <td colspan="2">
              <span :alid="data.al.id">{{data.al.name}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      datas: this.$props.singerhot,
      isShowName: false,
      playurl: ''
    }
  },
  props: ['singerhot'],
  methods: {
    getMusicUrl (id) {
      console.log(id)
      axios.get('/song/url?id=' + id).then(res => {
        console.log(res.data)
        if (res.data.data[0].url !== null) {
          this.playurl = res.data.data[0].url
        } else {
          alert('无版权')
        }
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
  },
  mounted () {
    // 歌手页,热门作品 singer
    if (this.$route.name === 'singer') {
      this.$set(this.$data, 'datas', this.singerhot)
    }
    if (this.$route.name === 'Newalbum') {
      console.log('l', this.singerhot)
      console.log('l-d', this.datas.length)
    }
    console.log('l', this.singerhot)
    console.log('l-d', this.datas.length)
    // this.$set(this.$data, 'isShowName', this.singerhot.hotSongs[0].isShowName)
  }
}
</script>
<style lang="scss" scoped>
#listcontent {
  // z-index: 99999;
  width: 640px;
  margin: 0 auto;
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
    width: 640px;
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
        tr:hover {
          background: #d21a1a;
          color: #fff;
        }
        // td:nth-of-type(4) {
        //   row-gap: 2;
        // }
      }
    }
    tr:nth-child(even) {
      background: #e9e9e9;
    }
  }
}
#listcontent > table:nth-child(1) > tbody > tr > td:nth-child(1) {
  border-left: 0;
}
</style>
