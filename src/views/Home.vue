<template>
  <div>
    <banner></banner>
    <newsong v-bind:state="true"></newsong>
  </div>
</template>

<script>
// @ is an alias to /src
import banner from '../components/Banner'
import newsong from '../components/Newsong'
export default {
  name: 'Home',
  components: {
    banner,
    newsong
  }
}
</script>
