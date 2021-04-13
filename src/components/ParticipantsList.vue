<template>
  <ul class="list-group">
    <li v-bind:key="index" v-for="(participant, index) in participants" class="list-group-item">
      <span>{{ participant.name }} - {{ participant.email }}</span> - <router-link :to="{name: 'join-group', query: {eventId: event.id, token: participant.token}}">Select group</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ParticipantsList',
  props: {
    event: Object,
    participants: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.list-group {
  width: 80%;
}
</style>
