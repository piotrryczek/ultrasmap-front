const namespace = 'APP';

export const SET_MESSAGE = `${namespace}_SET_MESSAGE`;
export const SET_LANGUAGE = `${namespace}_SET_LANGUAGE`;
export const SET_IS_AUTHENTICATED = `${namespace}_SET_IS_AUTHENTICATED`;
export const SET_IS_LOADING_CLUB = `${namespace}_SET_IS_LOADING_CLUB`;
export const SET_IS_LOADING_CLUBS = `${namespace}_SET_IS_LOADING_CLUBS`;
export const SET_IS_SIDEBAR_OPENED = `${namespace}_SET_IS_SIDEBAR_OPENED`;
export const SET_ZOOM = `${namespace}_SET_ZOOM`;
export const SET_IS_TOO_MUCH_CLUBS = `${namespace}_SET_IS_TOO_MUCH_CLUBS`;
export const SET_HOVERED_CLUB_ID = `${namespace}_SET_HOVERED_CLUB_ID`;
export const SET_IS_LOADING_CLUBS_DISABLED = `${namespace}_SET_IS_LOADING_CLUBS_DISABLED`;

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

export const setLanguage = language => (dispatch) => {
  dispatch({
    type: SET_LANGUAGE,
    payload: language,
  })
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

export const setIsLoadingClubs = isLoadingClubs => (dispatch) => {
  dispatch({
    type: SET_IS_LOADING_CLUBS,
    payload: isLoadingClubs,
  });
};

export const toggleSidebar = () => (dispatch, getState) => {
  const { isSidebarOpened } = getState().app;

  dispatch({
    type: SET_IS_SIDEBAR_OPENED,
    payload: !isSidebarOpened,
  });
}

export const showSidebar = () => (dispatch) => {
  dispatch({
    type: SET_IS_SIDEBAR_OPENED,
    payload: true,
  });
}

export const hideSidebar = () => (dispatch) => {
  dispatch({
    type: SET_IS_SIDEBAR_OPENED,
    payload: false,
  });
}

export const setZoom = zoom => (dispatch) => {
  dispatch({
    type: SET_ZOOM,
    payload: zoom,
  });
};

export const setIsTooMuchClubs = isTooMuchClubs => (dispatch) => {
  dispatch({
    type: SET_IS_TOO_MUCH_CLUBS,
    payload: isTooMuchClubs,
  });
};

export const setHoveredClubId = hoveredClubId => (dispatch) => {
  dispatch({
    type: SET_HOVERED_CLUB_ID,
    payload: hoveredClubId,
  });
};

export const setIsLoadingClubsDisabled = isLoadingClubsDisabled => (dispatch) => {
  dispatch({
    type: SET_IS_LOADING_CLUBS_DISABLED,
    payload: isLoadingClubsDisabled,
  });
};

