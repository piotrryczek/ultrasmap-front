import update from 'immutability-helper';

import {
  SET_MESSAGE,
  SET_IS_AUTHENTICATED,
} from 'components/app/app.actions';

const getCredentialsFromLocalStorage = () => {
  const credentials = localStorage.getItem('credentials');

  if (!credentials) return [];

  return credentials.split(',');
}

const initialState = {
  isAuthenticated: localStorage.getItem('jwtToken') || false,
  credentials: getCredentialsFromLocalStorage(),
  messageType: '', // error, success
  messageCode: '',
};

const app = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MESSAGE: {
      const { messageCode, messageType } = payload;

      return update(state, {
        messageCode: { $set: messageCode },
        messageType: { $set: messageType },
      });
    }

    case SET_IS_AUTHENTICATED: {
      const {
        isAuthenticated,
        credentials = [],
      } = payload;

      return update(state, {
        isAuthenticated: { $set: isAuthenticated },
        credentials: { $set: credentials },
      });
    }

    default: {
      return state;
    }
  }
}

export default app;
