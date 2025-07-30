import axios from 'axios';

const api = axios.create({
  baseURL: 'https://3.141.14.26.sslip.io',
  withCredentials: true,
});


export default api;
