import React, { useCallback } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Rating from '@material-ui/lab/Rating';

import HelpIcon from '@material-ui/icons/Help';

import Api from 'services/api';
import { DEFAULT_COORDINATES } from 'config/config';
import { parseCoordinates } from 'util/helpers';

import ImageUploader from 'common/imageUploader/ImageUploader.component';
import ButtonLink from 'common/buttonLink/buttonLink.component';
import GoogleMapLocation from './googleMapLocation';
import AddressSearch from './addressSearch.component';

import {
  retrieveClubOptionLabel,
  retrieveClubOptionValue, 
  handleFormatCreateLabel,
  selectStyles,
} from './util';

function SuggestionForm({
  clubId,
  editType,
  // initiallyLoaded,
  values: {
    name,
    logo,
    tier,
    coordinates,
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
    comment = '',
  },
  errors,
  touched,
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  // isSubmitting,
  // isValid,
}) {
  const isError = (field) => errors[field] && touched[field];

  const getCurrentRelations = () => {
    const allRelations = [
      ...friendships,
      ...agreements,
      ...positives,
      ...satellites,
    ];

    if (satelliteOf) allRelations.push(satelliteOf);
    
    return allRelations.reduce((acc, { __isNew__: isNew, _id: clubId }) => {
      if (!isNew) {
        acc.push(clubId);
      }

      return acc;
    }, []);
  }

  const handleSelectChange = (type) => (value) => {
    const newValue = value || [];

    setFieldValue(type, newValue);

    return newValue;
  }

  const handleSelectSingleChange = (type) => (value) => {
    setFieldValue(type, value);

    return value;
  }

  // TODO: Reject
  const handleGetPossibleRelations = value => new Promise(async (resolve, reject) => {
    const excluded = getCurrentRelations();
    if (editType === 'edit') excluded.push(clubId);

    const { data: clubs } = await Api.get('/clubs/possibleRelations', {
      searchName: value,
      excluded: excluded,
    });

    resolve(clubs);
  });

  const handleCoordinatesChange = useCallback((coordinates) => {
    setFieldValue('coordinates', coordinates);
  }, []);

  const handleTierChange = useCallback((event, newValue) => {
    setFieldValue('tier', newValue);
  }, []);

  const handleLogoChange = useCallback((file) => {
    setFieldValue('newLogo', file);
  }, []);

  const finalCoordination= parseCoordinates(coordinates || DEFAULT_COORDINATES);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h5 className={classNames('section-header', { 'error': isError('name') })}>
            Nazwa klubu
            <Tooltip placement="right" title="Wpisz pełną nazwę klubu z nazwą miejscowości.">
              <HelpIcon fontSize="small" color="primary" />
            </Tooltip>
          </h5>
          <input
            type="text"
            onChange={handleChange} 
            name="name"
            placeholder="Name..."
            value={name}
            className={classNames('styled-input', {
              'error': isError('name'),
            })}
          />
          {isError('name') && (
            <p className="error">{errors.name}</p>
          )}
        </Grid>
        <Grid item xs={12}>
          <h5 className={classNames('section-header', { 'error': errors.newLogo })}>
            Logo / Herb
            <Tooltip placement="right" title="Postaraj się wgrać logo dobrej jakości, bez uciętych krawędzi z przezroczystym tłem.">
              <HelpIcon fontSize="small" color="primary" />
            </Tooltip>
          </h5>
          <Paper>
            <Box p={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
              <ImageUploader
                fieldId="logo"
                logo={logo}
                onChange={handleLogoChange}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <h5 className={classNames('section-header', { 'error': isError('tier') })}>
            Znaczenie kibicowskie
            <Tooltip placement="right" title="Uwzględnij liczebność i siłę ekipy, wielkość młyna, liczby wyjazdowe i ogólny stopień aktywności, przyjmij, że 5 to marka rozpoznawalna na arenie międzynarodowej, a 1 to ekipa działająca sporadycznie lokalnie.">
              <HelpIcon fontSize="small" color="primary" />
            </Tooltip>
          </h5>
          <Paper>
            <Box p={2} display="block">
              <Rating
                name="simple-controlled"
                value={tier}
                onChange={handleTierChange}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <h5
            className={classNames('section-header', { 'error': isError('coordinates') })}
          >
            Lokalizacja
            <Tooltip placement="right" title="Zaznacz lokalizację stadionu.">
              <HelpIcon fontSize="small" color="primary" />
            </Tooltip>
          </h5>
          <Box mb={2}>
            <AddressSearch
              onChange={handleCoordinatesChange}
            />
          </Box>
          <Paper>
            <GoogleMapLocation
              markerCoordination={finalCoordination}
              setFieldValue={setFieldValue}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `300px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <h5
            className={classNames('relations-header friendships-header', { 'error': errors.relationsNotUnique })}
          >
            <span className="text">
              Zgody
              <Tooltip placement="right" title="Wybierz oficjalne i aktualnie istniejące zgody, jeśli klub nie istnieje możesz zasugerować dodanie go.">
                <HelpIcon fontSize="small" color="primary" />
              </Tooltip>
            </span>
          </h5>
          <AsyncCreatableSelect
            isMulti
            name="friendships"
            closeMenuOnSelect={false}
            formatOptionLabel={retrieveClubOptionLabel}
            getOptionValue={retrieveClubOptionValue}
            formatCreateLabel={handleFormatCreateLabel}
            loadOptions={handleGetPossibleRelations}
            value={friendships}
            onChange={handleSelectChange('friendships')}
            onBlur={handleBlur}
            placeholder="Start typing and choose clubs with which has friendships..."
            styles={selectStyles}
          />
          {/* {errors.relationsNotUnique && (
            <p>Relacje musza byc unikalne</p>
          )} */}
        </Grid>
        <Grid item xs={12}>
          <h5
            className={classNames('relations-header agreements-header', { 'error': errors.relationsNotUnique })}
          >
            <span className="text">
              Układy
              <Tooltip placement="right" title="Wybierz oficjalne i aktualnie istniejące układy, jeśli klub nie istnieje możesz zasugerować dodanie go.">
                <HelpIcon fontSize="small" color="primary" />
              </Tooltip>
            </span>
          </h5>
          <AsyncCreatableSelect
            isMulti
            name="agreements"
            closeMenuOnSelect={false}
            formatOptionLabel={retrieveClubOptionLabel}
            getOptionValue={retrieveClubOptionValue}
            formatCreateLabel={handleFormatCreateLabel}
            loadOptions={handleGetPossibleRelations}
            value={agreements}
            onChange={handleSelectChange('agreements')}
            onBlur={handleBlur}
            placeholder="Start typing and choose clubs with which has friendships..."
            styles={selectStyles}
          />
        </Grid>
        <Grid item xs={12}>
          <h5
            className={classNames('relations-header positives-header', { 'error': errors.relationsNotUnique })}
          >
            <span className="text">
              Pozytywne relacje
              <Tooltip placement="right" title="Wybierz z jakimi innymi klubami klub posiada nieoficjalne pozytywne relacje bądź prywatne kontakty nie będące oficjalnymi zgodami lub układami. Jeśli klubnie istnieje możesz zasugerować dodanie go.">
                <HelpIcon fontSize="small" color="primary" />
              </Tooltip>
            </span>
          </h5>
          <AsyncCreatableSelect
            isMulti
            name="positives"
            closeMenuOnSelect={false}
            formatOptionLabel={retrieveClubOptionLabel}
            getOptionValue={retrieveClubOptionValue}
            formatCreateLabel={handleFormatCreateLabel}
            loadOptions={handleGetPossibleRelations}
            value={positives}
            onChange={handleSelectChange('positives')}
            onBlur={handleBlur}
            placeholder="Start typing and choose clubs with which has friendships..."
            styles={selectStyles}
          />
        </Grid>
        <Grid item xs={12}>
          <h5
            className={classNames('relations-header satellites-header', { 'error': errors.relationsNotUnique })}
          >
            <span className="text">
              Satelity / FanCluby
              <Tooltip placement="right" title="Wybierz jakie kluby można uznać za Fan Cluby bądź satelity. Są to przypadki, w których praktycznie cała ekipa danego klubu jest także zaangażowana w kibicowanie innemu klubowi i jednocześnie nie podlega dyskusji jej podrzędność w hierarchi. Zanim dodasz przejrzyj już istniejące przypadki.">
                <HelpIcon fontSize="small" color="primary" />
              </Tooltip>
            </span>
          </h5>
          <AsyncCreatableSelect
            isMulti
            name="satellites"
            closeMenuOnSelect={false}
            formatOptionLabel={retrieveClubOptionLabel}
            getOptionValue={retrieveClubOptionValue}
            formatCreateLabel={handleFormatCreateLabel}
            loadOptions={handleGetPossibleRelations}
            value={satellites}
            onChange={handleSelectChange('satellites')}
            onBlur={handleBlur}
            placeholder="Start typing and choose clubs with which has friendships..."
            styles={selectStyles}
          />
        </Grid>
        <Grid item xs={12}>
          <h5
            className={classNames('relations-header satelliteof-header', { 'error': errors.relationsNotUnique })}
          >
            <span className="text">
              Jest satelitą / FanClubem
              <Tooltip placement="right" title="Wybierz klub nadrzędny, któremu oddana jest praktycznie cała ekipa danego klubu.">
                <HelpIcon fontSize="small" color="primary" />
              </Tooltip>
            </span>
          </h5>
          <AsyncCreatableSelect
            name="satelliteOf"
            isClearable
            closeMenuOnSelect={false}
            formatOptionLabel={retrieveClubOptionLabel}
            getOptionValue={retrieveClubOptionValue}
            formatCreateLabel={handleFormatCreateLabel}
            loadOptions={handleGetPossibleRelations}
            value={satelliteOf}
            onChange={handleSelectSingleChange('satelliteOf')}
            onBlur={handleBlur}
            placeholder="Start typing and choose clubs with which has friendships..."
            styles={selectStyles}
          />
        </Grid>
        <Grid item xs={12}>
          <h5 className="section-header">
            Uwagi
            <Tooltip placement="right" title="Dopisz wszelkie uwagi, sugestie, którę mogą nam pomóc precyzyjnie uwzględnić Twoją sugestię.">
              <HelpIcon fontSize="small" color="primary" />
            </Tooltip>
          </h5>
          <textarea
            className="styled-textarea"
            name="comment"
            onChange={handleChange}
            onBlur={handleBlur}
            value={comment}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <ButtonGroup>
              <ButtonLink
                variant="contained"
                color="primary"
                size="large"
                to="/"
              >
                Back to map
              </ButtonLink>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                type="submit"
              >
                Add suggestion
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default SuggestionForm;