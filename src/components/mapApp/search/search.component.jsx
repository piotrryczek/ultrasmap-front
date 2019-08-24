import React, { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import classNames from 'classnames';

import AddCommentIcon from '@material-ui/icons/AddCommentOutlined';

import { IMAGES_URL } from 'config/config';

import Api from 'services/api';

function Search(props) {
  const { retrieveClub } = props;

  const [search, setSearch] = useState('');
  const [clubs, setClubs] = useState([]);

  const handleSearchChange = useCallback((event) => {
    const { target: { value } } = event;
    setSearch(value);
    handleSearchClubs(value);
  }, []);

  const [handleSearchClubs] = useDebouncedCallback(async (searchValue) => {
    if (searchValue) {
      const { data: clubs } = await Api.get('/clubs', { search: { name: searchValue } });

      setClubs(clubs);
    } else {
      setClubs([]);
    }
  }, 500);

  const handleChooseClub = clubId => async () => {
    retrieveClub(clubId);
    setClubs([]);
    setSearch('');
  }

  return (
    <div 
      id="search" 
      className={classNames({
        'found-clubs': clubs.length > 0,
      })}
    >
      <div className="search-input-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Search club..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {(clubs.length > 0 || search) && (
        <ul className="search-clubs">
          {clubs.map(({
            _id: clubId,
            name,
            logo,
          }) => (
            <li key={clubId}>
              <button
                type="button"
                className="search-club"
                onClick={handleChooseClub(clubId)}
              >
                {logo && (
                  <div className="logo">
                    <img src={`${IMAGES_URL}${logo}`} alt="" />
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
              // onClick={}
            >
              <div className="logo icon">
                <AddCommentIcon fontSize="large" />
              </div>
              <p className="name">Brakuje klubu? Zasugeruj dodanie go...</p>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Search;
