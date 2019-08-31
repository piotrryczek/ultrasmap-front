import Api from 'services/api';
import history from 'config/history';
import store from 'config/store';
import i18n from 'config/i18n';

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
      language,
    } = await Api.post('/users/login', {
      email,
      password,
    }, false);

    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('credentials', credentials);
    localStorage.setItem('language', language);

    i18n.changeLanguage(language);

    this.dispatch(setIsAuthenticated(true, credentials, language));
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