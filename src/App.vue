<template>
  <div id="app">
    <FirstRun />
  </div>
</template>

<script>
import FirstRun from './components/FirstRun.vue'

export default {
  name: 'app',
  components: {
    FirstRun
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
