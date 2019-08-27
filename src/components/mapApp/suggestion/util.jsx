import React from 'react';
import { IMAGES_URL } from 'config/config';

export const parseOptionsToIds = options => options.map(({ value }) => value);

export const retrieveClubOptionLabel = (option) => {
  if (option.__isNew__) {
    const { label } = option;

    return (
      <div className="club-option">
        <span className="name">{label}</span>
      </div>
    );
  }

  const {
    name,
    logo,
  } = option;
  
  return (
    <div className="club-option">
      <span className="logo"><img src={`${IMAGES_URL}/h30/${logo}`} alt="" /></span>
      <span className="name">{name}</span>
    </div>
  );
}

export const retrieveClubOptionValue = (option) => {
  if (option.__isNew__) {
    const { label } = option;
    return label;
  }

  const {_id: clubId } = option;
  return clubId;
};

export const handleFormatCreateLabel = value => `Utwórz nowy klub: ${value}`;

export const prepareSuggestionFormData = ({
  newLogo,
  clubId = null,
  type,
  comment,
  ...rest
}) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(rest));
  formData.append('type', type);

  if (type === 'edit') formData.append('clubId', clubId);
  if (newLogo) formData.append('newLogo', newLogo);
  if (comment) formData.append('initialComment', comment);

  return formData;
};

export const parseRelationsToFormData = clubs => clubs.reduce((acc, club) => {
  if (club.__isNew__) {
    acc.namesToCreate.push(club.label);
  } else {
    acc.existingIds.push(club._id);
  }

  return acc;
}, {
  existingIds: [],
  namesToCreate: [],
});

export const parseClubData = ({
  name,
  logo,
  tier,
  location,
  friendships,
  agreements,
  positives,
  satellites,
  satelliteOf,
}) => ({
  newLogo: null,
  name,
  logo,
  tier,
  coordinates: location.coordinates,
  friendships,
  agreements,
  positives,
  satellites,
  satelliteOf,
  comment: '',
});



export const selectStyles = {
  multiValueLabel: base => ({
    ...base,
    height: '36px',
    lineHeight: '36px',
    padding: '0px',
    margin: '0px',
    backgroundColor: '#FFFCFF',
    fontSize: '100%',
  }),
  multiValueRemove: base => ({
    ...base,
    backgroundColor: '#FFFCFF',
    cursor: 'pointer',
  }),
  option: base => ({
    ...base,
    height: '36px',
    lineHeight: '36px',
    padding: '0px 10px',
    margin: '0px',
    cursor: 'pointer'
  }),
  container: base => ({
    ...base,
    height: '48px',
    lineHeight: '48px',
  }),
  control: base => ({
    ...base,
    height: '48px',
    lineHeight: '48px',
  }),
  input: base => ({
    ...base,
    boxSizing: 'border-box',
    padding: '0px',
    margin: '0px'
  }),
}