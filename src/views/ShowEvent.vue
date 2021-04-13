<template>
  <div class="edit-event">
    <h1 v-if="event">{{ event.title }}</h1>

    <div v-if="event">
      <div v-bind:key="index" v-for="(group, index) in event.groups">
        <span>Group {{ group.gid }}: {{ group.datetime }} - {{ getParticipantsLength(group) }} / {{ group.maxParticipants }}</span>
        <ParticipantsList :event="event" :participants="group.participants"/>
      </div>
    </div>

    <div v-if="hasUngroupedParticipants()" id="ungrouped-participants" class="row">
      <h2>Ungrouped participants</h2>
      <ParticipantsList :event="event" :participants="ungroupedParticipants"/>
    </div>

  </div>
</template>

<script>
import backgroundImage from '@/assets/shutterstock_582394888_resize.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

import axios from '@/utils/axios-client'

import ParticipantsList from "@/components/ParticipantsList"

import loading from '@/utils/loading'

export default {
  components: {
    ParticipantsList
  },
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
