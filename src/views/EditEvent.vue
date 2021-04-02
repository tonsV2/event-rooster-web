<template>
  <div class="edit-event">
    <h1>{{ title }}</h1>
    <ul>
      <li v-bind:key="index" v-for="(group, index) in groups">
        {{ group.maxParticipants }} - {{ group.datetime }}
      </li>
    </ul>

    <button class="btn btn-primary" @click="showAddGroupForm">Add group</button>

    <form v-if="showForm" id="add-group" @submit="submit" action="https://vuejs.org/" method="post">

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
        <input type="submit" value="Submit" @click="postGroup">
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
      showForm: false,
      title: null,
      groups: [],
      maxParticipants: null,
      datetime: null,
      response: null
    }
  },
  methods: {
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
                this.showForm = false
                this.groups.push(response.data)
              }
            })
            .catch(error => console.log(error.response.data.error))
      }

    },
    showAddGroupForm() {
      this.showForm = true
    }
  },
  mounted() {
    this.token = this.$route.query.token
    console.log(this.token)
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
