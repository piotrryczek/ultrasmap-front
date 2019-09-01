import store from 'config/store';
import Auth from 'services/auth';
import { setMessage, setIsLoadingClub } from 'components/app/app.actions';

class ApiError {
  constructor(error) {
    if (!error.response) {
      store.dispatch(setMessage('NETWORK_ERROR'));
    } else if (!error.response.data) {
      store.dispatch(setMessage('UNKNOWN_ERROR'));
    } else {
      if (!Auth.isCredentialError(error)) {
        const { response: { data: { type } } } = error;

        store.dispatch(setMessage(type));
      }
    }

    store.dispatch(setIsLoadingClub(false));
  }
}

export default ApiError;
