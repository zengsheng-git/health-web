<template>
    <router-view />
    <Toast />
     <ConfirmDialog></ConfirmDialog>
</template>
<script setup>
</script>
<style lang="scss">
html,
body,
#app {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-size: 14px;
}

#app {
    // overflow: hidden;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    // color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
