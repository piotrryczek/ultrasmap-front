import update from 'immutability-helper';

import {
  SET_MESSAGE,
  SET_LANGUAGE,
  SET_IS_AUTHENTICATED,
  SET_IS_LOADING_CLUB,
  SET_IS_LOADING_CLUBS,
  SET_IS_SIDEBAR_OPENED,
  SET_ZOOM,
  SET_IS_TOO_MUCH_CLUBS,
  SET_HOVERED_CLUB_ID,
  SET_IS_LOADING_CLUBS_DISABLED,
} from 'components/app/app.actions';
import { DEFAULT_LANGUAGE, DEFAULT_ZOOM } from 'config/config';

const getCredentialsFromLocalStorage = () => {
  const credentials = localStorage.getItem('credentials');

  if (!credentials) return [];

  return credentials.split(',');
}

const initialState = {
  isLoadingClubsDisabled: false,
  isAuthenticated: localStorage.getItem('jwtToken') || false,
  credentials: getCredentialsFromLocalStorage(),
  messageCode: '',
  isLoadingClub: false,
  isLoadingClubs: false,
  language: localStorage.getItem('language') || DEFAULT_LANGUAGE,
  isSidebarOpened: window.innerWidth > 800,
  zoom: DEFAULT_ZOOM,
  isTooMuchClubs: false,
  hoveredClubId: null,
};

const app = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MESSAGE: {
      return update(state, {
        messageCode: { $set: payload },
      });
    }

    case SET_LANGUAGE: {
      return update(state, {
        language: { $set: payload },
      });
    }

    case SET_IS_AUTHENTICATED: {
      const {
        isAuthenticated,
        credentials = [],
        language,
      } = payload;

      return update(state, {
        isAuthenticated: { $set: isAuthenticated },
        credentials: { $set: credentials },
        language: { $set: language },
      });
    }

    case SET_IS_LOADING_CLUB: {
      return update(state, {
        isLoadingClub: { $set: payload },
      });
    }

    case SET_IS_LOADING_CLUBS: {
      return update(state, {
        isLoadingClubs: { $set: payload },
      });
    }

    case SET_IS_SIDEBAR_OPENED: {
      return update(state, {
        isSidebarOpened: { $set: payload },
      });
    }

    case SET_ZOOM: {
      return update(state, {
        zoom: { $set: payload },
      });
    }

    case SET_IS_TOO_MUCH_CLUBS: {
      return update(state, {
        isTooMuchClubs: { $set: payload },
      });
    }

    case SET_HOVERED_CLUB_ID: {
      return update(state, {
        hoveredClubId: { $set: payload },
      });
    }

    case SET_IS_LOADING_CLUBS_DISABLED: {
      return update(state, {
        isLoadingClubsDisabled: { $set: payload },
      });
    }

    default: {
      return state;
    }
  }
}

export default app;
