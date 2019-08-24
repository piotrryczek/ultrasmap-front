import Api from 'services/api';
import history from 'config/history';

class Auth {

  constructor(store) {
    const { getState, dispatch } = store;

    this.getState = getState;
    this.dispatch = dispatch;
  }

  login = async (email, password) => {
    try {
      const {
        data: jwtToken,
        credentials,
      } = await Api.post('/users/login', {
        email,
        password,
      });
  
      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('credentials', credentials);
  
      this.dispatch(setMessage('success', 'LOGIN_SUCCESS'));
      this.dispatch(setIsAuthenticated(true, credentials));
    } catch (error) {
      const {
        response: {
          data: {
            type,
          },
        },
      } = error;
      
      this.dispatch(setMessage('error', type));
    }
  }

  logout = async () => {
    this.clearAuth({
      type: 'success',
      code: 'LOGOUT_SUCCESS',
    });
  }

  clearAuth = (message = null) => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('credentials');

    history.push('/login');

    this.dispatch(setIsAuthenticated(false));

    if (message) {
      const { type, code } = message;

      this.dispatch(setMessage(type, code));
    }
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