const namespace = 'APP';

export const SET_MESSAGE = `${namespace}_SET_MESSAGE`;
export const SET_IS_AUTHENTICATED = `${namespace}_SET_IS_AUTHENTICATED`;
export const SET_IS_LOADING_CLUB = `${namespace}_SET_IS_LOADING_CLUB`;
export const SET_IS_SIDEBAR_OPENED = `${namespace}_SET_IS_SIDEBAR_OPENED`;

export const setMessage = messageCode => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: messageCode,
  });
};

export const clearMessage = () => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: '',
  });
}

export const setIsAuthenticated = (isAuthenticated, credentials = [], language = null) => (dispatch, getState) => {
  const finalLanguage = language || getState().app.language;

  dispatch({
    type: SET_IS_AUTHENTICATED,
    payload: {
      isAuthenticated,
      credentials,
      language: finalLanguage,
    },
  });
};

export const setIsLoadingClub = isLoadingClub => (dispatch) => {
  dispatch({
    type: SET_IS_LOADING_CLUB,
    payload: isLoadingClub,
  });
};

export const toggleSidebar = () => (dispatch, getState) => {
  const { isSidebarOpened } = getState().app;

  dispatch({
    type: SET_IS_SIDEBAR_OPENED,
    payload: !isSidebarOpened,
  });
}
