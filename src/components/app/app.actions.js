const namespace = 'APP';

export const SET_MESSAGE = `${namespace}_SET_MESSAGE`;
export const SET_IS_AUTHENTICATED = `${namespace}_SET_IS_AUTHENTICATED`;
export const SET_IS_LOADING_CLUB = `${namespace}_SET_IS_LOADING_CLUB`;

export const setMessage = (messageType, messageCode) => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: {
      messageCode,
      messageType,
    },
  });
};

export const clearMessage = () => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: {
      messageCode: '',
      messageType: '',
    },
  });
}

export const setIsAuthenticated = (isAuthenticated, credentials = []) => (dispatch) => {
  dispatch({
    type: SET_IS_AUTHENTICATED,
    payload: {
      isAuthenticated,
      credentials,
    },
  });
};

export const setIsLoadingClub = isLoadingClub => (dispatch) => {
  dispatch({
    type: SET_IS_LOADING_CLUB,
    payload: isLoadingClub,
  });
};
