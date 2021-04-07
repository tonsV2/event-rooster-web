import axios from "axios"

export default axios.create({
    rejectUnauthorized: process.NODE_ENV === 'prod',
    baseURL: process.env.VUE_APP_API_BASE_URL
})
