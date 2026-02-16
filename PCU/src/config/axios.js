import axios from 'axios'
import { API_BASE_URL } from './api'

export const api = axios.create({
	baseURL: API_BASE_URL,
})
