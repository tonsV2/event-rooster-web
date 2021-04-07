<template>
  <div class="edit-event">
    <h1>{{ title }}</h1>

    <div class="spinner-border" role="status" v-if="loading.isLoading()">
      <span class="sr-only">Loading...</span>
    </div>

    <div v-if="errors.length">
      <b>The following error(s) occurred:</b>
      <ul>
        <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
      </ul>
    </div>

    <ul>
      <li v-bind:key="index" v-for="(group, index) in groups">
        {{ group.maxParticipants }} - {{ group.datetime }}
      </li>
    </ul>

    <button class="btn btn-primary" @click="toggleShowAddGroupForm">Add group</button>
    <br>
    <button class="btn btn-primary" @click="toggleShowAddParticipantsForm">Add participants</button>

    <form v-if="showAddGroupForm" id="add-group" @submit="postGroup">

      <p>
        <label>
          <input type="number" v-model="maxParticipants" placeholder="Max Participants">
        </label>
      </p>

      <p>
        <label>
          <input type="datetime-local" v-model="datetime">
        </label>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>

    <form v-if="showAddParticipantsForm" id="add-participants" @submit="postParticipants">

      <p>
        <label>
          <input type="file" id="file">
        </label>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>

    <pre v-if="response">{{ response }}</pre>

  </div>
</template>

<script>
import axios from '@/utils/axios-client'

import backgroundImage from '@/assets/pexels-artūras-kokorevas-2968388_resize.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

import loading from '@/utils/loading'

export default {
  data() {
    return {
      loading: loading,
      errors: [],
      showAddGroupForm: false,
      showAddParticipantsForm: false,
      title: null,
      groups: [],
      maxParticipants: null,
      datetime: null,
      response: null
    }
  },
  methods: {
    toggleShowAddGroupForm() {
      this.showAddGroupForm = !this.showAddGroupForm
    },
    toggleShowAddParticipantsForm() {
      this.showAddParticipantsForm = !this.showAddParticipantsForm
    },
    postGroup(e) {
      e.preventDefault()

      this.errors = []

      if (!this.maxParticipants || this.maxParticipants < 1) {
        this.errors.push('MaxParticipants required')
      }

      if (!this.datetime || new Date(this.datetime) < new Date()) {
        this.errors.push('A valid future date is equired')
      }

      if (this.errors.length < 1) {
        const url = '/events/groups'
        const config = {params: {token: this.token}}
        try {
          const data = {
            maxParticipants: parseInt(this.maxParticipants),
            datetime: new Date(this.datetime).toISOString()
          }

          loading.load()
          axios
              .post(url, data, config)
              .then(response => {
                loading.unload()
                if (response.status === 201) {
                  this.showAddGroupForm = false
                  this.groups.push(response.data)
                }
              })
              .catch(error => {
                const e = error.response.data.error;
                console.log(e)
                this.errors.push(e)
              })
        } catch (error) {
          console.log(error)
          this.errors.push(error)
        }

      }

    },
    postParticipants(e) {
      e.preventDefault()

      const fileElement = document.getElementById('file')
      const file = fileElement.files[0]
      if (file == null) {
        this.errors.push("No input file!")
        return
      }
      const data = new FormData()
      data.append('file', file)
      const url = '/participants/csv'
      const config = {
        params: {token: this.token}
      }

      loading.load()
      axios
          .post(url, data, config)
          .then(response => {
            loading.unload()
            this.response = response.data
            this.showAddParticipantsForm = false
            this.errors = []
          })
          .catch(error => {
            console.log(error)
            this.errors.push(error)
          })
    }
  },
  mounted() {
    setBackgroundImage(backgroundImage)

    this.token = this.$route.query.token
    if (this.token != null && this.token !== '') {
      const url = '/events/groups'
      const config = {params: {token: this.token}}

      loading.load()
      axios.get(url, config)
          .then(response => {
            loading.unload()
            const data = response.data
            this.title = data.title
            this.groups = data.groups
          })
          .catch(error => {
            console.log(error)
            this.errors.push(error.response.data.error)
          })
    } else {
      console.log('Missing token!')
      this.errors.push('A valid future date is required')
    }
  }
}
</script>

<style scoped>
.form-error {
  color: red
}
</style>
