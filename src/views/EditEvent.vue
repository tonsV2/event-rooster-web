<template>
  <div class="edit-event">

    <div class="spinner-border" role="status" v-if="loading.isLoading()">
      <span class="sr-only">Loading...</span>
    </div>

    <div v-if="errors.length">
      <b>The following error(s) occurred:</b>
      <ul>
        <li class="form-error" v-bind:key="index" v-for="(error, index) in errors">{{ error }}</li>
      </ul>
    </div>

    <div class="row">
      <div class="col-lg-4">
        <h1>{{ title }}</h1>
        <form id="add-group" @submit="postGroup" class="form-group form-box">
          <fieldset>
            <legend>Add Group</legend>
            <p>
              <label>
                <input type="number" v-model="maxParticipants" placeholder="Max Participants" class="form-control">
              </label>
            </p>
            <p>
              <label>
                <input type="datetime-local" v-model="datetime" class="form-control">
              </label>
            </p>
            <p>
              <input type="submit" value="Submit" class="form-control">
            </p>
          </fieldset>
        </form>

        <form id="add-participants" @submit="postParticipants" class="form-group form-box">
          <fieldset>
            <legend>Add Participants</legend>
            <p>
              <label>
                <input type="file" id="file" class="form-control">
              </label>
            </p>
            <p>
              <input type="submit" value="Submit" class="form-control">
            </p>
          </fieldset>
          <div v-if="csvResponse">{{csvResponse.parsed}} participants parsed, found {{csvResponse.new}} new</div>
        </form>

      </div>
      <div class="col-lg-4">
        <ol class="list-group" v-if="groups">
          <li v-bind:key="index" v-for="(group, index) in groups" class="list-group-item">
            {{group.gid}}. Group - <span>{{ group.maxParticipants }} - {{ toLocaleDatetimeString(group.datetime) }}</span>
          </li>
        </ol>
      </div>
      <div class="col-lg-4">
      </div>
    </div>

  </div>
</template>

<script>
import axios from '@/utils/axios-client'

import backgroundImage from '@/assets/pexels-artūras-kokorevas-2968388_resize.jpg'
import setBackgroundImage from '@/utils/setBackgroundImage'

import loading from '@/utils/loading'

import {toLocaleDatetimeString, toISOWithOffsetString} from '@/utils/datetime'

export default {
  data() {
    return {
      loading: loading,
      toLocaleDatetimeString: toLocaleDatetimeString,
      errors: [],
      title: null,
      groups: [],
      maxParticipants: null,
      datetime: null,
      csvResponse: null
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
        const url = '/events/groups'
        const config = {params: {token: this.token}}
        try {
          const data = {
            gid: (this.groups.length + 1).toString(),
            maxParticipants: parseInt(this.maxParticipants),
            datetime: toISOWithOffsetString(this.datetime)
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
                loading.unload()
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
            this.csvResponse = response.data
            this.errors = []
          })
          .catch(error => {
            loading.unload()
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
            loading.unload()
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

.form-box {
  border-radius: 25px;
  background: white;
  width: 60%;
  margin-left: 5%;
  padding: 2% 2% 1%;
}

.list-group {
  width: 80%;
}

h1 {
  text-align: left;
  margin-left: 10%;
  font-weight: bold;
}
</style>
