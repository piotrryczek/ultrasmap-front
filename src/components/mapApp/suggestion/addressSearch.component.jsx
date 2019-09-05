/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import classNames from 'classnames';

function AddressSearch(props) {
  const { onChange } = props;
  const { t } = useTranslation();

  const [address, setAddress] = useState('');

  const handleChange = useCallback((newAddress) => {
    setAddress(newAddress);
  }, []);

  const handleSelect = useCallback(async (newAddress) => {
    const [result] = await geocodeByAddress(newAddress);
    const { lat, lng } = await getLatLng(result);

    onChange([lng, lat]);
  }, []);

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: t('suggestion.searchPlaces'),
              className: classNames('location-search-input', {
                'opened': loading || suggestions.length > 0,
              }),
            })}
          />
          {(loading || suggestions.length > 0) && (
            <ul 
              className={classNames('autocomplete-dropdown-container', {
                'loading': loading,
              })}
            >
              {loading && <li>Loading...</li>}
              {suggestions.map(suggestion => {
                const { id, description, active } = suggestion;

                return (
                  <li
                    key={id}
                    {...getSuggestionItemProps(suggestion, {
                      className: classNames('suggestion-item', {
                        'active': active
                      }),
                    })}
                  >
                    {description}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </PlacesAutocomplete>
  );
}

export default AddressSearch;
