<template>
  <div id="app">
    <div id="nav">
      <ul>
        <router-link to="/" tag="li">推荐</router-link>
        <router-link to="/toplists" tag="li">排行榜</router-link>
        <router-link to="/playlist" tag="li">歌单</router-link>
        <router-link to="/artist" tag="li">歌手</router-link>
        <router-link to="/newalbum" tag="li">新碟上架</router-link>
        <!-- <router-link to="/my" tag="li">我的音乐</router-link> -->
      </ul>
    </div>
    <!--  style="bottom: 80px;position: relative;"
     style="top:60px;bottom: 70px;position: absolute;"
    -->
    <router-view />
    <audiocontrol></audiocontrol>
  </div>
</template>

<script>
import audiocontrol from './components/audiocontrol'
export default {
  components: {
    audiocontrol
  }
}
</script>

<style lang="scss">
#app {
  min-width: 982px;
  height: 100%;
  // min-height: 1250px;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  font-size: 16px;
  background: #dae1e7;
  // bottom: 80px;
}
#nav {
  // position: absolute;
  width: 100%;
  height: 60px;
  top: 0;
  background: #333;
  text-align: center;
  color: #fff;
  line-height: 50px;
  ul {
    // background: red;
    list-style: none;
    white-space: nowrap;
    overflow: hidden;
    li {
      display: inline-block;
      margin-left: 5%;
      cursor: pointer;
    }
  }
}
</style>
