import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import classNames from 'classnames';

import AddCommentIcon from '@material-ui/icons/AddCommentOutlined';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import history from 'config/history';
import { IMAGES_URL } from 'config/config';

import ApiError from 'util/apiError';
import Api from 'services/api';
import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';

function Search(props) {
  const { retrieveClub, setSearchInputRef } = props;

  const { t } = useTranslation(); 
  const inputRef = useRef(null);

  const [state, setState] = useState({
    search: '',
    clubs: [],
    hoveredClubIndex: null,
    isLoading: false,
  });

  const {
    search,
    clubs,
    hoveredClubIndex,
    isLoading,
  } = state;

  useEffect(() => {
    inputRef.current.focus();
    setSearchInputRef(inputRef);
  }, []);

  const handleSearchChange = useCallback((event) => {
    const { target: { value } } = event;

    setState(prevState => ({
      ...prevState,
      search: value,
    }));
    handleSearchClubs(value);
  }, []);

  const [handleSearchClubs] = useDebouncedCallback(async (searchValue) => {
    if (searchValue) {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      try {
        const { data: clubs } = await Api.get('/clubs', { search: { name: { value: searchValue, type: 'text' } } }, false);

        setState(prevState => ({
          ...prevState,
          clubs,
          isLoading: false,
        }));
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));

        new ApiError(error);
      }
      
    } else {
      setState(prevState => ({
        ...prevState,
        clubs: [],
        isLoading: false,
      }));
    }
  }, 300);

  const setNewClub = (clubId) => {
    retrieveClub(clubId);

    setState(prevState => ({
      ...prevState,
      clubs: [],
      search: '',
      hoveredClubIndex: null,
    }));
  }

  const handleChooseClub = clubId => () => {
    setNewClub(clubId);
  }

  const handleChangeHovered = clubIndex => () => {
    setState(prevState => ({
      ...prevState,
      hoveredClubIndex: clubIndex,
    }));
  }
  
  const handleClearFocus = useCallback(() => {
    inputRef.current.blur();
  }, []);
  
  const handleKeyDown = useCallback((event) => {
    const { keyCode } = event;

    const newState = {};

    if (!clubs.length) return false;
    
    switch (keyCode) {
      case 38: // up
        Object.assign(newState, {
          hoveredClubIndex: (!hoveredClubIndex) ? clubs.length - 1 : hoveredClubIndex - 1,
        });
        break;

      case 40: // down
        Object.assign(newState, {
          hoveredClubIndex: ((!hoveredClubIndex && hoveredClubIndex !== 0) || hoveredClubIndex === clubs.length - 1) ? 0 : hoveredClubIndex + 1,
        });
        break;

      case 13: // enter
        setNewClub(clubs[hoveredClubIndex]._id);

        return;

      case 27: // esc
        Object.assign(newState, {
          hoveredClubIndex: null,
          clubs: [],
          search: '',
        });
        break;
    }

    setState(prevState => ({
      ...prevState,
      ...newState,
    }));

  }, [clubs, hoveredClubIndex]);

  const handleOpenSuggestionWindow = () => {
    setState(prevState => ({
      ...prevState,
      hoveredClubIndex: null,
      clubs: [],
      search: '',
    }));

    history.push('/suggestion');
  }

  const handleClose = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      hoveredClubIndex: null,
      clubs: [],
      search: '',
    }));
  }, []);

  const handleGetRandom = useCallback(() => {
    retrieveClub();

    setState(prevState => ({
      ...prevState,
      clubs: [],
      search: '',
      hoveredClubIndex: null,
    }));
  }, []);

  return (
    <div id="search-wrapper">
      <ClickAwayListener onClickAway={handleClose}>
        <div 
          id="search" 
          className={classNames({
            'found-clubs': clubs.length > 0,
          })}
          onKeyDown={handleKeyDown}
          role="presentation"
        >
          <LoadingWrapper isLoading={isLoading} type="small">
            <div className="search-input-wrapper">
              <ClickAwayListener onClickAway={handleClearFocus}>
                <input
                  ref={inputRef}
                  className="search-input"
                  type="text"
                  placeholder={t('search.searchPlaceholder')}
                  value={search}
                  onChange={handleSearchChange}
                />
              </ClickAwayListener>
              <div id="search-secondary-buttons">
                <button
                  type="button"
                  id="button-get-random"
                  className="standard-button button-blue small-button"
                  onClick={handleGetRandom}
                >
                  {t('global.getRandom')}
                </button>
                <Link to="/suggestion">
                  <button
                    type="button"
                    id="button-add-suggestion"
                    className="standard-button button-green small-button"
                  >
                    {t('global.suggestNewClub')}
                  </button>
                </Link>
              </div>
            </div>

            {(clubs.length > 0 || search) && (
              <ul
                className="search-clubs"
              >
                {clubs.map(({
                  _id: clubId,
                  name,
                  logo,
                }, index) => (
                  <li
                    key={clubId}
                    onMouseMove={handleChangeHovered(index)}
                    onMouseLeave={handleChangeHovered(null)}
                  >
                    <button
                      type="button"
                      className={classNames('search-club', {
                        'hovered': hoveredClubIndex === index,
                      })}
                      onClick={handleChooseClub(clubId)}
                    >
                      {logo && (
                        <div className="logo">
                          <img src={`${IMAGES_URL}/h180/${logo}`} alt="" />
                        </div>
                      )}
                      <p className="name">{name}</p>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="search-club suggest-new"
                    onClick={handleOpenSuggestionWindow}
                  >
                    <div className="logo icon">
                      <AddCommentIcon fontSize="large" />
                    </div>
                    <p className="name">{t('search.lackOfClub')}</p>
                  </button>
                </li>
              </ul>
            )}
          </LoadingWrapper>
        </div>
      </ClickAwayListener>
    </div>
  );
}

export default memo(Search);
