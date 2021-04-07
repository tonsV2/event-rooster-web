<template>
  <div class="edit-event">
    <h1 v-if="event">{{ event.title }}</h1>

    <div class="spinner-border" role="status" v-if="loading.isLoading()">
      <span class="sr-only">Loading...</span>
    </div>

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
import backgroundImage from '@/assets/shutterstock_582394888_resize.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

import axios from '@/utils/axios-client'

import loading from '@/utils/loading'

export default {
  data() {
    return {
      loading: loading,
      errors: [],
      event: null,
      ungroupedParticipants: null
    }
  },
  methods: {
    getEvent() {
      const url = '/events'
      const config = {params: {token: this.token}}

      loading.load()
      axios
          .get(url, config)
          .then(response => {
            loading.unload()
            this.event = response.data
          })
          .catch(error => {
            loading.unload()
            console.log(error)
            this.errors.push(error.response.data.error)
          })
    },
    getUngroupedParticipants() {
      const url = '/participants/not-in-groups'
      const config = {params: {token: this.token}}

      loading.load()
      axios
          .get(url, config)
          .then(response => {
            loading.unload()
            this.ungroupedParticipants = response.data
          })
          .catch(error => {
            loading.unload()
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
    setBackgroundImage(backgroundImage)

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
