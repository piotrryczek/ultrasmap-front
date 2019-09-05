import axios from 'axios';
import ApiError from 'util/apiError';
import qs from 'qs';

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
          paramsSerializer: params => qs.stringify(params),
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

  post = (url, body, defaultErrorHandling = true) => this.doQuery(async () => await axios.post(`${this.apiUrl}${url}`, body, this.getConfig()), defaultErrorHandling);

  put = (url, body, defaultErrorHandling = true) => this.doQuery(async () => await axios.put(`${this.apiUrl}${url}`, body, this.getConfig()), defaultErrorHandling);

  patch = (url, body, defaultErrorHandling = true) => this.doQuery(async () => await axios.patch(`${this.apiUrl}${url}`, body, this.getConfig()), defaultErrorHandling);

  delete = (url, body, defaultErrorHandling = true) =>  this.doQuery(async () => await axios.delete(`${this.apiUrl}${url}`, this.getConfig(body, 'body')), defaultErrorHandling);

  get = (url, query = {}, defaultErrorHandling = true) => this.doQuery(async () => await axios.get(`${this.apiUrl}${url}`, this.getConfig(query, 'query')), defaultErrorHandling);

  doQuery = async (queryFunc, defaultErrorHandling) => {
    if (defaultErrorHandling) {
      return new Promise(async (resolve) => {
        try {
          const { data } = await queryFunc();
  
          resolve(data);
        } catch (error) {
          new ApiError(error);
        }
      });
    } else {
      const { data } = await queryFunc();
  
      return data;
    }
  }
}

export default new Api();
