<template>
  <div id="create-event">

    <div class="spinner-border" role="status" v-if="loading.isLoading()">
      <span class="sr-only">Loading...</span>
    </div>

    <div v-if="errors.length">
      <b>The following error(s) occurred:</b>
      <ul>
        <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
      </ul>
    </div>

    <form id="create-event-form" @submit="submit" class="form-group">

      <p>
        <label>
          <input id="title" v-model="title" type="text" name="title" placeholder="Event name" class="form-control">
        </label>
      </p>

      <p>
        <label>
          <input id="datetime" v-model="datetime" type="datetime-local" name="datetime" class="form-control">
        </label>
      </p>

      <p>
        <label>
          <input id="email" v-model="email" type="email" name="email" placeholder="some@mail.com" class="form-control">
        </label>
      </p>

      <p>
        <input type="submit" value="Submit" :disabled="clicked" class="btn btn-primary">
      </p>
    </form>

    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Event created</h5>
          </div>
          <div class="modal-body">A mail with instructions on how to proceed has been sent to {{email}}</div>
        </div>
      </div>
    </div>

    <button style="visibility: hidden" id="show-modal" data-toggle="modal" data-target="#exampleModal"></button>

  </div>
</template>

<script>
import backgroundImage from '@/assets/pexels-karl-solano-2729899.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

import axios from '@/utils/axios-client'

import loading from '@/utils/loading'

import $ from 'jquery'
import {toISOWithOffsetString} from '@/utils/datetime'

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
    showModal() {
      $('#show-modal').click()
    },
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

        this.clicked = true

        const url = '/events'
        try {
          const data = {
            title: this.title,
            datetime: toISOWithOffsetString(this.datetime),
            email: this.email
          }

          loading.load()
          axios
              .post(url, data)
              .then(response => {
                loading.unload()
                this.showModal()
                console.log(response.data)
                this.response = response.data
              })
              .catch(error => {
                loading.unload()
                console.log(error)
                this.errors.push(error.response.data.error)
              })

        } catch (error) {
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

#create-event-form {
  border-radius: 25px;
  background: white;
  width: 20%;
  margin-left: 5%;
  padding: 2% 2% 1%;
}
</style>
