<template>
  <div id="app">
    <editor></editor>
  </div>
</template>

<script>
import Editor from './components/Editor'

export default {
  name: 'app',
  components: {
    Editor
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
