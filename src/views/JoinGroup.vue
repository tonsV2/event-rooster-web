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

    <form id="join-group" @submit="submit" class="form-group">
      <div v-if="groups">
        <div v-bind:key="index" v-for="(group, index) in groups" class="form-check">
          <label>
            <input type="radio" name="groupId" :value="group.id" :disabled="isGroupFull(group)" v-model="selectedGroup" class="form-check-input">
            <span>Group {{ index + 1 }}: {{ group.datetime }} - {{ group.actualParticipants }} / {{ group.maxParticipants }}</span>
          </label>
          <br>
        </div>
      </div>
      <input type="submit" value="Submit" :disabled="!selectedGroup" class="btn btn-primary">
    </form>

    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Good choice!</h5>
          </div>
          <div class="modal-body">We've sent an email with event details to {{email}}</div>
        </div>
      </div>
    </div>

    <button style="visibility: hidden" id="show-modal" data-toggle="modal" data-target="#exampleModal"></button>

  </div>
</template>

<script>
import backgroundImage from '@/assets/shutterstock_1774837916_resize.png'
import setBackgroundImage from '@/utils/setBackgroundImage'

import axios from '@/utils/axios-client'

import loading from '@/utils/loading'

import $ from 'jquery'

export default {
  data() {
    return {
      loading: loading,
      errors: [],
      token: null,
      eventId: null,
      groups: null,
      selectedGroup: null,
      email: null
    }
  },
  methods: {
    showModal() {
      $('#show-modal').click()
    },
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
            this.email = response.data.email
            this.showModal()
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
