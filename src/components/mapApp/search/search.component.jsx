import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';
import classNames from 'classnames';

import AddCommentIcon from '@material-ui/icons/AddCommentOutlined';

import history from 'config/history';
import { IMAGES_URL } from 'config/config';

import Api from 'services/api';
import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';

function Search(props) {
  const { t } = useTranslation();
  const { retrieveClub } = props;
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

      const { data: clubs } = await Api.get('/clubs', { search: { name: searchValue } });

      setState(prevState => ({
        ...prevState,
        clubs,
        isLoading: false,
      }));
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

  return (
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
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder={t('search.searchPlaceholder')}
            value={search}
            onChange={handleSearchChange}
          />
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
                      <img src={`${IMAGES_URL}/h60/${logo}`} alt="" />
                    </div>
                  )}
                  <p className="name">{name}</p>
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="search-club"
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
  );
}

export default Search;
