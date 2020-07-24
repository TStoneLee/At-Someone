<template>
  <div id="app">
    <Chat></Chat>
  </div>
</template>

<script>
import Chat from './components/Chat'

export default {
  name: 'app',
  components: {
    Chat
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
