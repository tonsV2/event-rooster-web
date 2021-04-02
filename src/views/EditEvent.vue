<template>
  <div class="edit-event">
    <h1>{{ title }}</h1>
    <ul>
      <li v-bind:key="index" v-for="(group, index) in groups">
        {{ group.maxParticipants }} - {{ group.datetime }}
      </li>
    </ul>

    <button class="btn btn-primary" @click="toggleShowAddGroupForm">Add group</button>
    <br>
    <button class="btn btn-primary" @click="toggleShowAddParticipantsForm">Add participants</button>

    <form v-if="showAddGroupForm" id="add-group" @submit="postGroup">

      <div v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">* {{ error }}</li>
        </ul>
      </div>

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

      <div v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">* {{ error }}</li>
        </ul>
      </div>

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
import axios from "axios";

export default {
  data() {
    return {
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
        const url = 'http://localhost:8080/events/groups'
        const config = {params: {token: this.token}}
        const data = {
          maxParticipants: parseInt(this.maxParticipants),
          datetime: this.datetime
        }

        axios
            .post(url, data, config)
            .then(response => {
              if (response.status === 201) {
                this.showAddGroupForm = false
                this.groups.push(response.data)
              }
            })
            .catch(error => console.log(error.response.data.error))
      }

    },
    postParticipants(e) {
      e.preventDefault()

      const file = document.getElementById('file')
      const data = new FormData()
      data.append('file', file.files[0])
      const url = 'http://localhost:8080/participants/csv'
      const config = {
        params: {token: this.token}
      }

      axios
          .post(url, data, config)
          .then(response => {
            this.response = response.data
          })
          .catch(error => console.log(error))
    }
  },
  mounted() {
    this.token = this.$route.query.token
    if (this.token != null) {
      const url = 'http://localhost:8080/events/groups'
      const config = {params: {token: this.token}}

      axios.get(url, config)
          .then(response => {
            const data = response.data
            this.title = data.title
            this.groups = data.groups
          })
          .catch(error => console.log(error))
    } else {
      // TODO: Show error message on page
      console.log('Missing token!')
    }
  }
}
</script>

<style scoped>
.form-error {
  color: red
}
</style>
