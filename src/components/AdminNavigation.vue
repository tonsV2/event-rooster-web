<template>
  <div id="admin-nav">
    <router-link :to="{ path: '/edit-event', query: { token:  $route.query.token }}">Edit</router-link> |
    <router-link :to="{ path: '/show-event', query: { token:  $route.query.token }}">Details</router-link>
  </div>
</template>

<script>
export default {
  name: 'AdminNavigation'
}
</script>

<style scoped>
#admin-nav {
  padding: 10px;
}

#admin-nav a {
  font-weight: bold;
  color: #2c3e50;
}

#admin-nav a.router-link-exact-active {
  color: #42b983;
}
</style>
