import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import _uniq from 'lodash/uniq';
import _get from 'lodash/get';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

import { DEFAULT_COORDINATES } from 'config/config';
import Api from 'services/api';
import clubSchema from 'schemas/club';
import PageOverlay from 'common/pageOverlay/pageOverlay.component';
import ButtonLink from 'common/buttonLink/buttonLink.component';
import SuggestionForm from './suggestionForm';

import { prepareSuggestionFormData, parseRelationsToFormData, parseClubData } from './util';

function Suggestion(props) {
  const {
    editType,
  } = props;

  const { isAuthenticated } = useSelector(state => ({ isAuthenticated: _get(state, 'app.isAuthenticated', false) }));

  const club = _get(props, 'location.state.club', null);
  const clubId = _get(props, 'match.params.clubId', null);

  const [isSend, setIsSend] = useState(false);
  const [fields, setFields] = useState({
    newLogo: null,
    name: '',
    logo: '',
    tier: 1,
    coordinates: DEFAULT_COORDINATES,
    friendships: [],
    agreements: [],
    positives: [],
    satellites: [],
    satelliteOf: null,
  });

  const fetchData = async () => {
    const { data: clubData } = await Api.get(`/clubs/${clubId}`);

    setFields(parseClubData(clubData));
  }

  useEffect(() => {
    if (clubId) {
      
      if (club) {
        setFields(parseClubData(club));
      } else {
        fetchData();
      }
    }
  }, [clubId]);

  const handleSubmit = useCallback(async (values) => {
    const {
      newLogo, // file
      name,
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

    await Api.post('/suggestions', formData);

    setIsSend(true);
  }, []);

  const handleValidate = useCallback(async (values) => {
    const errors = {};

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
        relationsNotUnique: 'Relations have to be unique', // TODO: Translatiom
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
  }, []);

  return (
    <PageOverlay>
      {isAuthenticated ?
        isSend ? (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box mb={2}>
              <Typography>Dziękujemy za dodane sugestii. Postaramy się ją przejrzeć jak najszybciej!</Typography>
            </Box>
            <Link to="/">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                type="submit"
              >
                Wróc do mapy
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
                editType={editType}
                clubId={clubId}
              />
            )}
          />  
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography>Aby proponować zmiany musisz być zalogowany. Ten proces zajmie Ci dosłownie moment.</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <ButtonGroup>
                  <ButtonLink
                    variant="contained"
                    color="primary"
                    size="large"
                    to="/login"
                  >
                    Login
                  </ButtonLink>
                  <ButtonLink
                    variant="contained"
                    color="secondary"
                    size="large"
                    to="/register"
                  >
                    Register
                  </ButtonLink>
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        )}
    </PageOverlay>
  );
}

export default Suggestion;
