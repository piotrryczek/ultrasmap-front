import React, { useCallback, useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import _isEqual from 'lodash/isEqual';

import _get from 'lodash/get';
import _uniq from 'lodash/uniq';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { DEFAULT_COORDINATES } from 'config/config';
import Api from 'services/api';
import Auth from 'services/auth';
import clubSchema from 'schemas/club';
import NeedToBeLoggedIn from 'components/mapApp/needToBeLoggedIn/needToBeLoggedIn.component';
import SuggestionForm from './suggestionForm';

import { prepareSuggestionFormData, parseRelationsToFormData, parseClubData } from './util';

const checkHasChanged = (previousValues, currentValues) => {
  const {
    name: prevName,
    coordinates: prevCoordinates,
    friendships: prevFriendships,
    agreements: prevAgreements,
    positives: prevPositives,
    satellites: prevSatellites,
    satelliteOf: prevSatelliteOf,
  } = previousValues;

  const {
    name,
    coordinates,
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
    newLogo,
  } = currentValues;

  return prevName !== name
    || newLogo
    || !_isEqual(prevCoordinates, coordinates)
    || !_isEqual(prevFriendships.sort(), friendships.sort())
    || !_isEqual(prevAgreements.sort(), agreements.sort())
    || !_isEqual(prevPositives.sort(), positives.sort())
    || !_isEqual(prevSatellites.sort(), satellites.sort())
    || prevSatelliteOf !== satelliteOf;
}

function Suggestion(props) {
  const {
    editType,
  } = props;

  const { t } = useTranslation();
  const isAuthenticated = useSelector(state => state.app.isAuthenticated);

  const club = _get(props, 'location.state.club', null);
  const clubId = _get(props, 'match.params.clubId', null);

  const [hasChanged, setHasChanged] = useState(false);
  const [state, setState] = useState({
    isSend: false,
    isLoading: false,
    fields: {
      newLogo: null,
      name: '',
      transliterationName: '',
      searchName: '',
      logo: '',
      tier: '',
      coordinates: DEFAULT_COORDINATES,
      friendships: [],
      agreements: [],
      positives: [],
      satellites: [],
      satelliteOf: null,
    }
  });

  const {
    isSend,
    isLoading,
    fields,
  } = state;

  const fetchData = async () => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
    }));

    const { data: clubData } = await Api.get(`/clubs/${clubId}`);

    setState(prevState => ({
      ...prevState,
      isLoading: false,
      fields: parseClubData(clubData),
    }));
  }

  useEffect(() => {
    if (clubId) {
      
      if (club) {
        setState(prevState => ({
          ...prevState,
          fields: parseClubData(club),
        }));
      } else {
        fetchData();
      }
    }
  }, [clubId]);

  const handleSubmit = useCallback(async (values) => {
    const {
      newLogo, // file
      name,
      transliterationName,
      searchName,
      logo, // url
      tier,
      coordinates,
      friendships,
      agreements,
      positives,
      satellites,
      satelliteOf,
      comment,
    } = values;

    const {
      existingIds: friendshipsIds,
      namesToCreate: friendshipsToCreate,
    } = parseRelationsToFormData(friendships);

    const {
      existingIds: agreementsIds,
      namesToCreate: agreementsToCreate,
    } = parseRelationsToFormData(agreements);

    const {
      existingIds: positivesIds,
      namesToCreate: positivesToCreate,
    } = parseRelationsToFormData(positives);

    const {
      existingIds: satellitesIds,
      namesToCreate: satellitesToCreate,
    } = parseRelationsToFormData(satellites);

    const data = {
      type: editType,
      newLogo,
      comment,
      // Club data
      name,
      transliterationName,
      searchName,
      logo,
      tier,
      coordinates,
      friendships: friendshipsIds,
      friendshipsToCreate,
      agreements: agreementsIds,
      agreementsToCreate,
      positives: positivesIds,
      positivesToCreate,
      satellites: satellitesIds,
      satellitesToCreate,
      satelliteOf: null,
      satelliteOfToCreate: null,
    };

    if (editType === 'edit') {
      Object.assign(data, {
        clubId,
      });
    }

    if (satelliteOf) {
      if (satelliteOf.__isNew__) {
        Object.assign(data, {
          satelliteOfToCreate: satelliteOf.label,
        });
      } else {
        Object.assign(data, {
          satelliteOf: satelliteOf._id,
        });
      }
    }

    const formData = prepareSuggestionFormData(data);

    setState(prevState => ({
      ...prevState,
      isLoading: true,
    }));

    await Api.post('/suggestions', formData);

    setState(prevState => ({
      ...prevState,
      isSend: true,
      isLoading: false,
    }));
  }, []);

  const handleValidate = useCallback(async (values) => {
    const errors = {};

    if (!checkHasChanged(fields, values)) {
      Object.assign(errors, {
        noChanges: 'formErrors.suggestionNoChanges',
      });

      setHasChanged(false);
    } else {
      setHasChanged(true);
    }

    const {
      friendships,
      agreements,
      positives,
      satellites,
      satelliteOf,
    } = values;

    const allRelations = [...friendships, ...agreements, ...positives, ...satellites];
    if (satelliteOf) allRelations.push(satelliteOf);

    const allRelationsNames = allRelations.map((club) => {
      if (club.__isNew__) return club.label.toLowerCase();

      return club.name.toLowerCase();
    });

    const uniqNames = _uniq(allRelationsNames);
    if (allRelations.length > 0 && allRelationsNames.length !== uniqNames.length) {
      Object.assign(errors, {
        relationsNotUnique: 'formErrors.relationsNotUnique',
      });
    }   

    try {
      await clubSchema.validate(values, {
        abortEarly: false,
      });
    } catch (error) {
      
      
      const { inner: schemaErrors } = error;

      const parsedErrors = schemaErrors.reduce((acc, { path, message }) => {
        Object.assign(acc, {
          [path]: message,
        });

        return acc;
      }, {});

      Object.assign(errors, parsedErrors);

      throw errors;
    }

    throw errors;
  }, [hasChanged, fields]);

  return isAuthenticated ?
    Auth.hasCredentialLocal('addSuggestion') ?
      isSend ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Box mb={2}>
            <Typography>{t('suggestion.success')}</Typography>
          </Box>
          <Link to="/">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              type="submit"
            >
              {t('global.backToMap')}
            </Button>
          </Link>
        </Box>
      ) : (
        <Formik
          initialValues={fields}
          enableReinitialize
          onSubmit={handleSubmit}
          validate={handleValidate}
          render={(props) => (
            <SuggestionForm
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              isLoading={isLoading}
              editType={editType}
              clubId={clubId}
              hasChanged={hasChanged}
            />
          )}
        />
      ) : (<Typography>{t('suggestion.lackOfCredential')}</Typography>) : 
    (
      <NeedToBeLoggedIn header={t('suggestion.needToBeLoggedin')} />
    );
}

export default Suggestion;
