<template>
  <div>
    <h1>Please select the group you wish to join</h1>

    <div v-if="errors.length">
      <b>The following error(s) occurred:</b>
      <ul>
        <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
      </ul>
    </div>

    <form id="join-group" @submit="submit">
      <div v-if="groups">
        <div v-bind:key="index" v-for="(group, index) in groups">
          <label>
            <input type="radio" name="groupId" :value="group.id" :disabled="isGroupFull(group)" v-model="selectedGroup">
            <span>Group {{ index + 1 }}: {{ group.datetime }} - {{ group.actualParticipants }} / {{ group.maxParticipants }}</span>
          </label>
          <br>
        </div>
      </div>
      <input type="submit" value="Submit" :disabled="!selectedGroup">
    </form>

    <div v-if="response">
      <span>Good choice! You should receive a mail with the event details soon</span>
      <pre>{{ response }}</pre>
    </div>

  </div>
</template>

<script>
import backgroundImage from '@/assets/shutterstock_1774837916_resize.png'
import setBackgroundImage from '@/utils/setBackgroundImage'

import axios from "axios";
import apiBaseUrl from '@/utils/api-base-url'

export default {
  data() {
    return {
      errors: [],
      token: null,
      eventId: null,
      groups: null,
      selectedGroup: null,
      response: null
    }
  },
  methods: {
    isGroupFull(group) {
      return !(group.actualParticipants < group.maxParticipants)
    },
    submit(e) {
      e.preventDefault()
      this.errors = []
      const url = apiBaseUrl('/participants/groups')
      const config = {params: {token: this.token, groupId: this.selectedGroup}}
      axios
          .post(url, {}, config)
          .then(response => {
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
    setBackgroundImage(backgroundImage)

    this.token = this.$route.query.token
    this.eventId = this.$route.query.eventId

    if (this.eventId == null || this.eventId === '') {
      this.errors.push('Missing id!')
    }

    if (this.token != null && this.token !== '' && this.eventId !== '') {
      const url = apiBaseUrl('/events/groups-count')
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
