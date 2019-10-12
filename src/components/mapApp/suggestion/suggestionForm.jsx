import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncCreatableSelect from 'react-select/async-creatable';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';

import HelpIcon from '@material-ui/icons/Help';

import Api from 'services/api';
import { DEFAULT_COORDINATES } from 'config/config';
import { parseCoordinates } from 'util/helpers';

import { useMobileStyles } from 'theme/useStyles';

import TooltipWrapper from 'common/tooltipWrapper/tooltipWrapper.component';
import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';
import FieldWrapper from 'common/fieldWrapper/fieldWrapper.component';
import ImageUploader from 'common/imageUploader/ImageUploader.component';
import GoogleMapLocation from './googleMapLocation';
import AddressSearch from './addressSearch.component';

import {
  retrieveClubOptionLabel,
  retrieveClubOptionValue, 
  handleFormatCreateLabel,
  selectStyles,
} from './util';


function SuggestionForm({
  handleClose,
  isLoading,
  clubId,
  editType,
  hasChanged,
  values: {
    name,
    logo,
    coordinates,
    friendships,
    agreements,
    positives,
    enemies,
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
}) {
  const { t } = useTranslation();
  const mobileClasses = useMobileStyles({});

  const isError = (field) => errors[field] && touched[field];

  const getCurrentRelations = () => {
    const allRelations = [
      ...friendships,
      ...agreements,
      ...positives,
      ...enemies,
      ...satellites,
    ];

    if (satelliteOf && !Array.isArray(satelliteOf)) allRelations.push(satelliteOf);
    
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

  const handleGetPossibleRelations = value => new Promise(async (resolve, reject) => {
    const excluded = getCurrentRelations();
    if (editType === 'edit') excluded.push(clubId);

    const { data: clubs } = await Api.post('/clubs/possibleRelations', {
      searchName: value,
      excluded: excluded,
    });

    resolve(clubs);
  });

  const handleCoordinatesChange = useCallback((coordinates) => {
    setFieldValue('coordinates', coordinates);
  }, []);

  const handleLogoChange = useCallback((file) => {
    setFieldValue('newLogo', file);
  }, []);

  const finalCoordination= parseCoordinates(coordinates || DEFAULT_COORDINATES);

  return (
    <LoadingWrapper type="big" isLoading={isLoading}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography>{t('suggestion.welcome')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <h5 className={classNames('section-header', { 'error': isError('name') })}>
              {t('suggestion.name.header')}
              <TooltipWrapper placement="right" title={t('suggestion.name.tooltip')}>
                <HelpIcon fontSize="small" color="primary" />
              </TooltipWrapper>
            </h5>
            <FieldWrapper error={isError('name') && t(errors.name)}>
              <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
                placeholder={t('suggestion.name.placeholder')}
                value={name}
                className={classNames('styled-input', {
                  'error': isError('name'),
                })}
              />
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5 className={classNames('section-header', { 'error': errors.newLogo })}>
              {t('suggestion.logo.header')}
              <TooltipWrapper placement="right" title={t('suggestion.logo.tooltip')}>
                <HelpIcon fontSize="small" color="primary" />
              </TooltipWrapper>
            </h5>
            <FieldWrapper error={t(errors.newLogo)}>
              <Paper>
                <Box p={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                  <ImageUploader
                    fieldId="logo"
                    logo={logo}
                    onChange={handleLogoChange}
                  />
                </Box>
              </Paper>
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5
              className={classNames('section-header', { 'error': isError('coordinates') })}
            >
              {t('suggestion.location.header')}
              <TooltipWrapper placement="right" title={t('suggestion.location.tooltip')}>
                <HelpIcon fontSize="small" color="primary" />
              </TooltipWrapper>
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
                {t('suggestion.friendships.header')}
                <TooltipWrapper placement="right" title={t('suggestion.friendships.tooltip')}>
                  <HelpIcon fontSize="small" color="primary" />
                </TooltipWrapper>
              </span>
            </h5>
            <FieldWrapper error={t(errors.relationsNotUnique)}>
              <AsyncCreatableSelect
                isMulti
                name="friendships"
                closeMenuOnSelect={false}
                formatOptionLabel={retrieveClubOptionLabel}
                getOptionValue={retrieveClubOptionValue}
                formatCreateLabel={handleFormatCreateLabel(t('suggestion.createNewClub'))}
                loadOptions={handleGetPossibleRelations}
                value={friendships}
                onChange={handleSelectChange('friendships')}
                onBlur={handleBlur}
                placeholder={t('suggestion.friendships.placeholder')}
                styles={selectStyles(!!errors.relationsNotUnique)}
                noOptionsMessage={() => t('suggestion.noOptions')}
              />
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5
              className={classNames('relations-header agreements-header', { 'error': errors.relationsNotUnique })}
            >
              <span className="text">
                {t('suggestion.agreements.header')}
                <TooltipWrapper placement="right" title={t('suggestion.agreements.tooltip')}>
                  <HelpIcon fontSize="small" color="primary" />
                </TooltipWrapper>
              </span>
            </h5>
            <FieldWrapper error={t(errors.relationsNotUnique)}>
              <AsyncCreatableSelect
                isMulti
                name="agreements"
                closeMenuOnSelect={false}
                formatOptionLabel={retrieveClubOptionLabel}
                getOptionValue={retrieveClubOptionValue}
                formatCreateLabel={handleFormatCreateLabel(t('suggestion.createNewClub'))}
                loadOptions={handleGetPossibleRelations}
                value={agreements}
                onChange={handleSelectChange('agreements')}
                onBlur={handleBlur}
                placeholder={t('suggestion.agreements.placeholder')}
                styles={selectStyles(!!errors.relationsNotUnique)}
                noOptionsMessage={() => t('suggestion.noOptions')}
              />
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5
              className={classNames('relations-header positives-header', { 'error': errors.relationsNotUnique })}
            >
              <span className="text">
                {t('suggestion.positives.header')}
                <TooltipWrapper placement="right" title={t('suggestion.positives.tooltip')}>
                  <HelpIcon fontSize="small" color="primary" />
                </TooltipWrapper>
              </span>
            </h5>
            <FieldWrapper error={t(errors.relationsNotUnique)}>
              <AsyncCreatableSelect
                isMulti
                name="positives"
                closeMenuOnSelect={false}
                formatOptionLabel={retrieveClubOptionLabel}
                getOptionValue={retrieveClubOptionValue}
                formatCreateLabel={handleFormatCreateLabel(t('suggestion.createNewClub'))}
                loadOptions={handleGetPossibleRelations}
                value={positives}
                onChange={handleSelectChange('positives')}
                onBlur={handleBlur}
                placeholder={t('suggestion.friendships.placeholder')}
                styles={selectStyles(!!errors.positives)}
                noOptionsMessage={() => t('suggestion.noOptions')}
              />
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5
              className={classNames('relations-header enemies-header', { 'error': errors.relationsNotUnique })}
            >
              <span className="text">
                {t('suggestion.enemies.header')}
                <TooltipWrapper placement="right" title={t('suggestion.enemies.tooltip')}>
                  <HelpIcon fontSize="small" color="primary" />
                </TooltipWrapper>
              </span>
            </h5>
            <FieldWrapper error={t(errors.relationsNotUnique)}>
              <AsyncCreatableSelect
                isMulti
                name="enemies"
                closeMenuOnSelect={false}
                formatOptionLabel={retrieveClubOptionLabel}
                getOptionValue={retrieveClubOptionValue}
                formatCreateLabel={handleFormatCreateLabel(t('suggestion.createNewClub'))}
                loadOptions={handleGetPossibleRelations}
                value={enemies}
                onChange={handleSelectChange('enemies')}
                onBlur={handleBlur}
                placeholder={t('suggestion.enemies.placeholder')}
                styles={selectStyles(!!errors.enemies)}
                noOptionsMessage={() => t('suggestion.noOptions')}
              />
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5
              className={classNames('relations-header satellites-header', { 'error': errors.relationsNotUnique })}
            >
              <span className="text">
                {t('suggestion.satellites.header')}
                <TooltipWrapper placement="right" title={t('suggestion.satellites.tooltip')}>
                  <HelpIcon fontSize="small" color="primary" />
                </TooltipWrapper>
              </span>
            </h5>
            <FieldWrapper error={t(errors.relationsNotUnique)}>
              <AsyncCreatableSelect
                isMulti
                name="satellites"
                closeMenuOnSelect={false}
                formatOptionLabel={retrieveClubOptionLabel}
                getOptionValue={retrieveClubOptionValue}
                formatCreateLabel={handleFormatCreateLabel(t('suggestion.createNewClub'))}
                loadOptions={handleGetPossibleRelations}
                value={satellites}
                onChange={handleSelectChange('satellites')}
                onBlur={handleBlur}
                placeholder={t('suggestion.satellites.placeholder')}
                styles={selectStyles(!!errors.relationsNotUnique)}
                noOptionsMessage={() => t('suggestion.noOptions')}
              />
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5
              className={classNames('relations-header satelliteof-header', { 'error': errors.relationsNotUnique })}
            >
              <span className="text">
                {t('suggestion.satelliteOf.header')}
                <TooltipWrapper placement="right" title={t('suggestion.satelliteOf.tooltip')}>
                  <HelpIcon fontSize="small" color="primary" />
                </TooltipWrapper>
              </span>
            </h5>
            <FieldWrapper error={t(errors.relationsNotUnique)}>
              <AsyncCreatableSelect
                name="satelliteOf"
                isClearable
                closeMenuOnSelect={false}
                formatOptionLabel={retrieveClubOptionLabel}
                getOptionValue={retrieveClubOptionValue}
                formatCreateLabel={handleFormatCreateLabel(t('suggestion.createNewClub'))}
                loadOptions={handleGetPossibleRelations}
                value={satelliteOf}
                onChange={handleSelectSingleChange('satelliteOf')}
                onBlur={handleBlur}
                placeholder={t('suggestion.satelliteOf.placeholder')}
                styles={selectStyles(!!errors.relationsNotUnique)}
                noOptionsMessage={() => t('suggestion.noOptions')}
              />
            </FieldWrapper>
          </Grid>
          <Grid item xs={12}>
            <h5 className="section-header">
              {t('suggestion.comments.header')}
              <TooltipWrapper placement="right" title={t('suggestion.comments.tooltip')}>
                <HelpIcon fontSize="small" color="primary" />
              </TooltipWrapper>
            </h5>
            <Typography gutterBottom>{t('suggestion.comments.additional')}</Typography>
            <textarea
              className="styled-textarea"
              name="comment"
              onChange={handleChange}
              onBlur={handleBlur}
              value={comment}
            />
          </Grid>
          {!hasChanged && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography>{t('formErrors.suggestionNoChanges')}</Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <ButtonGroup className={mobileClasses.groupButton}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleClose}
                  className={mobileClasses.buttonBase}
                >
                  {t('global.backToMap')}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  type="submit"
                  className={mobileClasses.buttonBase}
                  disabled={!hasChanged}
                >
                  {t('suggestion.addSuggestion')}
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LoadingWrapper>
  )
}

export default SuggestionForm;