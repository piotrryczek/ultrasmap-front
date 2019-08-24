import axios from 'axios';
import ApiError from 'util/apiError';

class Api {

  apiUrl = process.env.REACT_APP_API_URL;

  getConfig = (data = null, dataType = 'query') => {
    const jwtToken = localStorage.getItem('jwtToken');

    const config = {};

    if (jwtToken) {
      Object.assign(config, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    }

    if (data) {
      if (dataType === 'query') {
        Object.assign(config, {
          params: data,
        });
      } else {
        Object.assign(config, {
          data,
        });
      }
    }

    return config;
  }

  post = (url, body) => this.doQuery(async () => await axios.post(`${this.apiUrl}${url}`, body, this.getConfig()));

  put = (url, body) => this.doQuery(async () => await axios.put(`${this.apiUrl}${url}`, body, this.getConfig()));

  patch = (url, body) => this.doQuery(async () => await axios.patch(`${this.apiUrl}${url}`, body, this.getConfig()));

  delete = (url, body) =>  this.doQuery(async () => await axios.delete(`${this.apiUrl}${url}`, this.getConfig(body, 'body')));

  get = (url, query = {}) => this.doQuery(async () => await axios.get(`${this.apiUrl}${url}`, this.getConfig(query, 'query')));

  doQuery = (queryFunc) => {
    return new Promise(async (resolve) => {
      try {
        const { data } = await queryFunc();

        resolve(data);
      } catch (error) {
        new ApiError(error);
      }
    });
  }
}

export default new Api();
