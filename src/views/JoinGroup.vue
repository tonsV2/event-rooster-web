<template>
  <div>
    <h1>Please select the group you wish to join</h1>

    <div class="spinner-border" role="status" v-if="loading.isLoading()">
      <span class="sr-only">Loading...</span>
    </div>

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

import axios from '@/utils/axios-client'

import loading from '@/utils/loading'

export default {
  data() {
    return {
      loading: loading,
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
      const url = '/participants/groups'
      const config = {params: {token: this.token, groupId: this.selectedGroup}}

      loading.load()
      axios
          .post(url, {}, config)
          .then(response => {
            loading.unload()
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
      const url = '/events/groups-count'
      const config = {params: {eventId: this.eventId, token: this.token}}

      loading.load()
      axios
          .get(url, config)
          .then(response => {
            loading.unload()
            this.groups = response.data
          })
          .catch(error => {
            loading.unload()
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
