import axios from 'axios';
import { useRequestSuccess } from './success';
import { useRequestError } from './error';
import { requestBaseURL } from './configs';

export const request = axios.create({
  baseURL: requestBaseURL,
  withCredentials: true,
})

request.interceptors.response.use(useRequestSuccess, useRequestError);