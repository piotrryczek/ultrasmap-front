import Api from 'services/api';
import history from 'config/history';
import store from 'config/store';

import { setIsAuthenticated, setMessage } from 'components/app/app.actions';

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

    this.dispatch(setIsAuthenticated(true, credentials));
  }

  logout = async () => {
    this.clearAuth();
  }

  clearAuth = (messageCode= '') => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('credentials');

    history.push('/');

    this.dispatch(setIsAuthenticated(false));

    if (messageCode) this.dispatch(setMessage(messageCode));
  }

  hasCredentialLocal = (credential) => {
    const { credentials } = this.getState().app;

    return credentials.includes(credential);
  }

  isCredentialError = (error) => {
    const {
      response: {
        data: {
          type,
        }
      },
    } = error;

    if (type !== 'NOT_AUTHORIZED') return false;
    
    this.clearAuth('NOT_AUTHORIZED');
    return true;
  }
}

export default new Auth(store);