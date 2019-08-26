import store from 'config/store';
import Auth from 'services/auth';
import { setMessage } from 'components/app/app.actions';

class ApiError {
  constructor(error) {
    if (!error.response) {
      store.dispatch(setMessage('error', 'NETWORK_ERROR'));
    } else if (!error.response.data) {
      store.dispatch(setMessage('error', 'UNKNOWN_ERROR'));
    } else {
      if (!Auth.verifyApiError(error)) {
        const { response: { data: { type } } } = error;

        store.dispatch(setMessage('error', type));
      }
    }
  }
}

export default ApiError;
