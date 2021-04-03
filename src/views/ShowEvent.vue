<template>
  <div class="edit-event">
    <h1 v-if="event">{{ event.title }}</h1>

    <div v-if="errors.length">
      <b>The following error(s) occurred:</b>
      <ul>
        <li class="error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
      </ul>
    </div>

    <ul v-if="event">
      <li v-bind:key="index" v-for="(group, index) in event.groups">
        <div>
          <span>Group {{ index + 1 }}: {{ group.datetime }} - {{ getParticipantsLength(group) }} / {{ group.maxParticipants }}</span>
          <ul>
            <li v-bind:key="index" v-for="(participant, index) in group.participants">
              <span>{{ participant }}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>

    <hr>
    <div v-if="hasUngroupedParticipants()">
      <h2>Ungrouped participants</h2>
      <ul>
        <li v-bind:key="index" v-for="(participant, index) in ungroupedParticipants">
          <span>{{ participant }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      errors: [],
      event: null,
      ungroupedParticipants: null
    }
  },
  methods: {
    getEvent() {
      const url = 'http://localhost:8080/events'
      const config = {params: {token: this.token}}

      axios
          .get(url, config)
          .then(response => {
            this.event = response.data
          })
          .catch(error => {
            console.log(error)
            this.errors.push(error.response.data.error)
          })
    },
    getUngroupedParticipants() {
      const url = 'http://localhost:8080/participants/not-in-groups'
      const config = {params: {token: this.token}}

      axios
          .get(url, config)
          .then(response => {
            this.ungroupedParticipants = response.data
          })
          .catch(error => {
            console.log(error)
            this.errors.push(error)
          })
    },
    getParticipantsLength(group) {
      return group.participants ? group.participants.length : 0
    },
    hasUngroupedParticipants() {
      return this.ungroupedParticipants && this.ungroupedParticipants.length
    }
  },
  mounted() {
    this.token = this.$route.query.token
    if (this.token != null && this.token !== '') {
      this.getEvent()
      this.getUngroupedParticipants()
    } else {
      this.errors.push('Missing token!')
    }
  }
}
</script>

<style scoped>
.error {
  color: red
}
</style>
