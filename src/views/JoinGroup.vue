<template>
  <div class="join-group">
    <h1>This is a "join group" page</h1>

    <div v-if="errors.length">
      <b>The following error(s) occurred:</b>
      <ul>
        <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
      </ul>
    </div>

    <ul v-if="groups">
      <li v-bind:key="index" v-for="(group, index) in groups">
        <div>Group {{ index + 1 }}: {{ group.datetime }} - {{ group.actualParticipants }} / {{ group.maxParticipants }}<button :disabled="isGroupFull(group)" @click="selectGroup(group, index)">Select</button></div>
      </li>
    </ul>

    <div v-if="selectedGroup">
      <span>You selected group number: {{selectedGroupIndex + 1}}</span>
      <br>
      <button @click="submit()" :disabled="clicked">Submit selection</button>
    </div>

    <div v-if="response">
      <span>Good choice! You should receive a mail with the event details soon</span>
      <pre>{{ response }}</pre>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      errors: [],
      token: null,
      eventId: null,
      groups: null,
      clicked: false,
      selectedGroup: null,
      selectedGroupIndex: null,
      response: null
    }
  },
  methods: {
    isGroupFull(group) {
      return !(group.actualParticipants < group.maxParticipants)
    },
    selectGroup(group, selectedGroupIndex) {
      this.selectedGroupIndex = selectedGroupIndex
      this.selectedGroup = group
      this.clicked = false
    },
    submit() {
      this.errors = []
      const url = 'http://localhost:8080/participants/groups'
      const config = {params: {token: this.token, groupId: this.selectedGroup.id}}

      axios
          .post(url, {}, config)
          .then(response => {
            this.clicked = true
            console.log(response.data)
            this.response = response.data
          })
          .catch(error => {
            console.log(error)
            this.errors.push(error.response.data.error)
          })

    }
  },
  mounted() {
    this.token = this.$route.query.token
    this.eventId = this.$route.query.eventId

    if (this.eventId == null || this.eventId === '') {
      this.errors.push('Missing id!')
    }

    if (this.token != null && this.token !== '' && this.eventId !== '') {
      const url = 'http://localhost:8080/events/groups-count'
      const config = {params: {eventId: this.eventId, token: this.token}}

      axios
          .get(url, config)
          .then(response => {
            this.groups = response.data
          })
          .catch(error => {
            console.log(error)
            this.errors.push(error)
          })

    } else {
      this.errors.push('Missing token!')
    }
  }
}
</script>

<style scoped>
.form-error {
  color: red
}
</style>
