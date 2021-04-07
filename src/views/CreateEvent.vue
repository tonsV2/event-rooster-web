<template>
  <div class="create-event">

    <div class="spinner-border" role="status" v-if="loading.isLoading()">
      <span class="sr-only">Loading...</span>
    </div>

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
import backgroundImage from '@/assets/pexels-karl-solano-2729899.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

import axios from '@/utils/axios-client'

import loading from '@/utils/loading'

export default {
  data() {
    return {
      loading: loading,
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
        const url = '/events'
        try {
          const data = {
            title: this.title,
            datetime: new Date(this.datetime).toISOString(),
            email: this.email
          }

          loading.load()
          axios
              .post(url, data)
              .then(response => {
                loading.unload()
                this.clicked = true
                console.log(response.data)
                this.response = response.data
              })
              .catch(error => {
                loading.unload()
                console.log(error)
                this.errors.push(error.response.data.error)
              })

        } catch (error) {
          console.log(error)
          this.errors.push(error)
        }
      }

    }
  },
  mounted () {
    setBackgroundImage(backgroundImage)
  }
}
</script>

<style scoped>
.form-error {
  color: red
}
</style>
