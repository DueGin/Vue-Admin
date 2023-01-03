<template>
    <router-view/>
</template>

<script>
export default {
    name: 'App',
    watch: {
        // $route(to, from) {
        //     console.log(to, from)
        //     if (to.path !== '/login' && to.path !== '/sys/index' && to.path !== '/') {
        //         let obj = {
        //             name: to.name,
        //             title: to.meta.title
        //         }
        //         this.$store.commit('addTabs', obj)
        //     }
        // }
    }
}
</script>

<style>

html, body, #app {
    height: 100%;
}

.app-container {
    padding: 20px
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

nav {
    padding: 30px;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
}

nav a.router-link-exact-active {
    color: #42b983;
}
</style>
