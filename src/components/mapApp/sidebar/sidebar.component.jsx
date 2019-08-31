import React, { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { IMAGES_URL } from 'config/config';
import useWindowHeight from 'hooks/useWindowHeight';

import ScrollbarsWrapper from 'common/scrollbarsWrapper/scrollbarsWrapper.component';
import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';
import RelationClubs from 'components/mapApp/sidebar/relationClubs/relationClubs.component';

import { toggleSidebar } from 'components/app/app.actions';

const ClubContent = ({ club, retrieveClub }) => {
  const { t } = useTranslation();

  const {
    name,
    logo,
    tier,
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
  } = club;

  const handleChangeClub = clubId => () => {
    retrieveClub(clubId);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">{name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <div className="main-logo">
            <img src={`${IMAGES_URL}/h360/${logo}`} alt="" />
            <Rating value={tier} readOnly />
          </div>
        </Paper>
      </Grid>
      {friendships.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header friendships-header"><span className="text">{t('global.friendships')}</span></h5>
          <RelationClubs clubs={friendships} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {agreements.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header agreements-header"><span className="text">{t('global.agreements')}</span></h5>
          <RelationClubs clubs={agreements} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {positives.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header positives-header"><span className="text">{t('global.positives')}</span></h5>
          <RelationClubs clubs={positives} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {satellites.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header satellites-header"><span className="text">{t('global.satellites')}</span></h5>
          <RelationClubs clubs={satellites} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {satelliteOf && (
        <Grid item xs={12}>
          <h5 className="relations-header satellites-header"><span className="text">{t('global.satelliteOf')}</span></h5>
          <button type="button" onClick={handleChangeClub(satelliteOf._id)} className="club-link">
            <div className="logo">
              <img src={`${IMAGES_URL}/h90/${satelliteOf.logo}`} alt="" />
            </div>
            <h5 className="name">{satelliteOf.name}</h5>
          </button>
        </Grid>
      )}

      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <Link 
            to={{
              pathname: `/suggestion/${club._id}`,
              state: {
                club,
              }}}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              {t('global.suggestChange')}
            </Button>
          </Link>
        </Box>
        
      </Grid>
    </Grid>
  );
}

const Welcome = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h5" gutterBottom>{t('welcome.header')}</Typography>
      <Typography gutterBottom>{t('welcome.paragraph1')}</Typography>
      <Typography gutterBottom>{t('welcome.paragraph2')}</Typography>
      <Typography gutterBottom>{t('welcome.paragraph3')}</Typography>
      <Typography gutterBottom>{t('welcome.paragraph4')}</Typography>
      <Typography variant="caption">
        {t('welcome.copyrights')}
        <span className="copyright-email"><a href="mailto:fanaticsmap@gmail.com">fanaticsmap@gmail.com</a></span>
      </Typography>
    </>
  );
}

function Sidebar(props) {
  const dispatch = useDispatch();
  const windowHeight = useWindowHeight();

  const {
    club,
  } = props;

  const { isSidebarOpened, isLoadingClub } = useSelector(state => ({
    isSidebarOpened: state.app.isSidebarOpened,
    isLoadingClub: state.app.isLoadingClub,
  }));

  const handleToggleOpened = useCallback(() => {
    dispatch(toggleSidebar())
  }, []);

  return (
    <div id="sidebar" className={classNames('has-scrollbar', { 'opened': isSidebarOpened })} style={{ height: `${windowHeight}px` }}>
      <button
        type="button"
        onClick={handleToggleOpened}
        id="scrollbar-toggle"
      >
        {isSidebarOpened ? <ChevronRightIcon fontSize="large" htmlColor="#191923" /> : <ChevronLeftIcon fontSize="large" htmlColor="#191923" />}
      </button>
      <ScrollbarsWrapper>
        <LoadingWrapper type="big" isLoading={isLoadingClub}>
          <div className="inner">
            {club ? <ClubContent {...props} /> : <Welcome />}
          </div>
        </LoadingWrapper>
      </ScrollbarsWrapper>
    </div>
  );
}

export default memo(Sidebar);
