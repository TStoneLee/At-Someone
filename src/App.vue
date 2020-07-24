<template>
  <div id="app">
    <!-- <editor></editor> -->
    <Chat></Chat>
  </div>
</template>

<script>
// import Editor from './components/Editor'
import Chat from './components/Chat'

export default {
  name: 'app',
  components: {
    // Editor
    Chat
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
