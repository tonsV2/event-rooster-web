<template>
  <div class="create-event">
    <h1>This is a "create event" page</h1>

    <div v-if="errors.length">
      <b>The following error(s) occurred:</b>
      <ul>
        <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
      </ul>
    </div>

    <form id="create-event" @submit="submit">

      <p>
        <label>
          <input id="title" v-model="title" type="text" name="title" placeholder="Title">
        </label>
      </p>

      <p>
        <label>
          <input id="datetime" v-model="datetime" type="datetime-local" name="datetime">
        </label>
      </p>

      <p>
        <label>
          <input id="email" v-model="email" type="email" name="email" placeholder="some@mail.com">
        </label>
      </p>

      <p>
        <input type="submit" value="Submit" :disabled="clicked">
      </p>

      <pre v-if="response">
        {{ response }}
      </pre>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import apiBaseUrl from '@/utils/api-base-url'

export default {
  data() {
    return {
      clicked: false,
      errors: [],
      title: null,
      datetime: null,
      email: null,
      response: null
    }
  },
  methods: {
    submit(e) {
      e.preventDefault()

      this.errors = []

      if (!this.title) {
        this.errors.push('Title required')
      }

      if (!this.datetime || new Date(this.datetime) < new Date()) {
        this.errors.push('A valid future date is equired')
      }

      if (!this.email) {
        this.errors.push('Email required')
      }

      if (this.errors.length < 1) {
        const url = apiBaseUrl('/events')
        try {
          const data = {
            title: this.title,
            datetime: new Date(this.datetime).toISOString(),
            email: this.email
          }

          axios
              .post(url, data)
              .then(response => {
                this.clicked = true
                console.log(response.data)
                this.response = response.data
              })
              .catch(error => {
                console.log(error)
                this.errors.push(error.response.data.error)
              })

        } catch (error) {
          console.log(error)
          this.errors.push(error)
        }
      }

    }
  }
}
</script>

<style scoped>
.form-error {
  color: red
}
</style>
