<template>
  <div v-if="errors.length">
    <b>The following error(s) occurred:</b>
    <ul>
      <li class="error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
    </ul>
  </div>

  <div id="show-event" class="row mx-auto">
    <h1 v-if="event">{{ event.title }}</h1>

    <div v-if="event">
      <div v-bind:key="index" v-for="(group, index) in event.groups">
        <span>Group {{ group.gid }}: {{ group.datetime }} - {{ getParticipantsLength(group) }} / {{ group.maxParticipants }}</span>
        <ParticipantsList id="grouped-participants" :event="event" :participants="group.participants"/>
      </div>
    </div>

    <div v-if="hasUngroupedParticipants()" class="row">
      <h2>Ungrouped participants</h2>
      <ParticipantsList id="ungrouped-participants" :event="event" :participants="ungroupedParticipants"/>
    </div>

  </div>
</template>

<script>
import backgroundImage from '@/assets/pexels-andrea-piacquadio-3764538.jpg'
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

#show-event {
  width: 80%;
}

#ungrouped-participants {
  margin-top: 3%;
}

h1, h2 {
  font-weight: bold;
  color: black;
}

</style>
