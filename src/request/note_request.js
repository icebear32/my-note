import axios from "axios"
import qs from 'qs'

export const noteBaseRequest = axios.create({
    baseURL: '/note-serve',
    transformRequest: [
        (data, Headers) => {
            return qs.stringify(data)
        }
    ]
})