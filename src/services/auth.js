import Api from 'services/api';
import history from 'config/history';
import store from 'config/store';

import { setIsAuthenticated } from 'components/app/app.actions';

class Auth {

  constructor(store) {
    const { getState, dispatch } = store;

    this.getState = getState;
    this.dispatch = dispatch;
  }

  login = async (email, password) => {
    const {
      data: jwtToken,
      credentials,
    } = await Api.post('/users/login', {
      email,
      password,
    }, false);

    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('credentials', credentials);

    this.dispatch(setIsAuthenticated(true));
  }

  logout = async () => {
    this.clearAuth();
  }

  clearAuth = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('credentials');

    history.push('/');

    this.dispatch(setIsAuthenticated(false));
  }

  hasCredentialLocal = (credential) => {
    const { credentials } = this.getState().app;

    return credentials.includes(credential);
  }

  hasCredentialApi = (credential) => {

  }

  verifyApiError = (error) => {
    const {
      response: {
        data: {
          type,
        }
      },
    } = error;

    if (type !== 'NOT_AUTHORIZED') return false;
    
    this.clearAuth({ type: 'error', code: 'NOT_AUTHORIZED' });
    return true;
  }
}

export default new Auth(store);