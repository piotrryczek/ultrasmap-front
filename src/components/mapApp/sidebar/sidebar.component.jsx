import React, { useCallback, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { useSwipeable } from 'react-swipeable';
import { isMobile, isTablet } from 'react-device-detect';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
// import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Api from 'services/api';
import history from 'config/history';
import { IMAGES_URL, ABSOLUTE_MAX_ZOOM } from 'config/config';
// import { getRoundedTierForLabel } from 'util/helpers';
import useWindowHeight from 'hooks/useWindowHeight';

import ScrollbarsWrapper from 'common/scrollbarsWrapper/scrollbarsWrapper.component';
import LoadingWrapper from 'common/loadingWrapper/loadingWrapper.component';
import RelationClubs from 'components/mapApp/sidebar/relationClubs/relationClubs.component';
import RelationClub from 'components/mapApp/sidebar/relationClubs/relationClub.component';
import UpcomingMatch from 'components/mapApp/sidebar/upcomingMatch/upcomingMatch.component';
import ButtonLink from 'common/buttonLink/buttonLink.component';



import { toggleSidebar, showSidebar, hideSidebar } from 'components/app/app.actions';
import { useButtonIconStyles, useMobileStyles } from 'theme/useStyles';

const ClubContent = ({ club, handleGoTo }) => {
  const { t } = useTranslation();
  const iconClasses = useButtonIconStyles({});
  const mobileClasses = useMobileStyles({});

  const [state, setState] = useState({
    isLoadingMatches: true,
    upcomingMatch: null,
  });

  const {
    isLoadingMatches,
    upcomingMatch,
  } = state;

  const retrieveMatches = useCallback(async () => {
    const { data: matches } = await Api.get('/matches', {
      filters: {
        clubs: [club._id],
        dateFrom: Date.now(),
      },
      sort: {
        date: 'ascending'
      }
    });

    const upcomingMatch = matches.find((match) => {
      const {
        homeClub,
        isHomeClubReserve,
        isAwayClubReserve,
      } = match;

      const isHome = homeClub && homeClub._id === club._id;
      return isHome ? !isHomeClubReserve : !isAwayClubReserve;
    });

    setState({
      isLoadingMatches: false,
      upcomingMatch,
    });
  }, [club]);

  useEffect(() => {
    setState({
      upcomingMatch: null,
      isLoadingMatches: true,
    });

    retrieveMatches();
  }, [club]);

  const {
    name,
    transliterationName,
    country,
    logo,
    // tier,
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
  } = club;

  const handleBackToViewingClubs = useCallback(() => {
    history.push({
      pathname: '/',
      state: { hideSidebar: isMobile || isTablet || window.innerWidth < 800 },
    });
  }, []);

  // const roundedTierForLabel = getRoundedTierForLabel(tier);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display="flex" justifyItems="center" justifyContent="center">
          <Button
            className={mobileClasses.buttonBase}
            variant="contained"
            color="primary"
            size="large"
            type="button"
            onClick={handleBackToViewingClubs}
          >
            <LocationSearchingIcon fontSize="small" className={iconClasses.leftIcon} />
            {t('global.backToViewingClubs')}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">{name}</Typography>
        {transliterationName && (<Typography variant="subtitle2" align="center">{transliterationName}</Typography>)}
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <div className="main-logo">
            <img src={`${IMAGES_URL}/h360/${logo}`} alt="" />
            {/* <Rating value={roundedTierForLabel} readOnly /> */}
            {/* <Typography variant="caption" display="block">{`(${t(`ratings.stars${roundedTierForLabel}`)})`}</Typography> */}
          </div>

          <Box display="flex" justifyItems="center" justifyContent="center" pb={2}>
            <Link 
              to={{
                pathname: `/suggestion/${club._id}`,
                state: {
                  club,
                  hideSidebar: true,
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
        </Paper>
      </Grid>
      {friendships.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header friendships-header"><span className="text">{t('global.friendships')}</span></h5>
          <RelationClubs clubs={friendships} goTo={handleGoTo} />
        </Grid>
      )}
      
      {agreements.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header agreements-header"><span className="text">{t('global.agreements')}</span></h5>
          <RelationClubs clubs={agreements} goTo={handleGoTo} />
        </Grid>
      )}
      
      {positives.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header positives-header"><span className="text">{t('global.positives')}</span></h5>
          <RelationClubs clubs={positives} goTo={handleGoTo} />
        </Grid>
      )}
      
      {satellites.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header satellites-header"><span className="text">{t('global.satellites')}</span></h5>
          <RelationClubs clubs={satellites} goTo={handleGoTo} />
        </Grid>
      )}
      
      {satelliteOf && (
        <Grid item xs={12}>
          <h5 className="relations-header satellites-header"><span className="text">{t('global.satelliteOf')}</span></h5>
          <RelationClub
            goTo={handleGoTo}
            club={satelliteOf}
          />
        </Grid>
      )}
      
      {country && country.name === 'Polska' && (
        <Grid item xs={12}>
          <h5 className="relations-header upcoming-match-header"><span className="text">{t('global.upcomingMatch')}</span></h5>

          {isLoadingMatches && (
            <div id="loading-matches" />
          )}

          {upcomingMatch && <UpcomingMatch currentClub={club} match={upcomingMatch} goTo={handleGoTo} />}

          {!isLoadingMatches && !upcomingMatch && (
            <Typography gutterBottom>{t('global.noUpcomingMatch')}</Typography>
          )}

          <Typography align="center" gutterBottom>{t('global.checkFanaticsCalendar')}</Typography>
          <Typography align="center" variant="h5">{t('global.fanaticsCalendar')}</Typography>

          <a href="https://play.google.com/store/apps/details?id=com.piotrryczek.fanaticscalendar" target="_blank" rel="noopener noreferrer" id="fanatics-calendar-link">
            <img src="/assets/fanatics_calendar.png" alt="" />
          </a>
        </Grid>
      )}

      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <ButtonLink
            variant="contained"
            color="secondary"
            size="large"
            type="button"
            to="/about"
          >
            {t('global.aboutProject')}
          </ButtonLink>
        </Box>
      </Grid>
    </Grid>
  );
}

const ClubsContent = ({ clubs, handleGoTo, zoom, isTooMuchClubs }) => {
  const { t } = useTranslation();

  if (zoom < ABSOLUTE_MAX_ZOOM || isTooMuchClubs) {
    if (zoom < ABSOLUTE_MAX_ZOOM) {
      return(<Typography>{t('global.zoomMaxMore')}</Typography>);
    } else {
      return(<Typography>{t('global.zoomIn')}</Typography>);
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h5 className="relations-header no-relation-header">
          <span className="text">
            {t('global.clubsOnMap')}
            <span className="clubs-number">
              (
              {clubs.length}
              )
            </span>
          </span>
        </h5>
        <RelationClubs clubs={clubs} goTo={handleGoTo} />
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <ButtonLink
            variant="contained"
            color="secondary"
            size="large"
            type="button"
            to="/about"
          >
            {t('global.aboutProject')}
          </ButtonLink>
        </Box>
      </Grid>
    </Grid>
  );
}

function Sidebar(props) {
  const dispatch = useDispatch();
  const windowHeight = useWindowHeight();

  const {
    club,
    clubs,
  } = props;

  const {
    isSidebarOpened,
    isLoadingClub,
    isLoadingClubs,
    zoom,
    isTooMuchClubs,
  } = useSelector(state => ({
    isSidebarOpened: state.app.isSidebarOpened,
    isLoadingClub: state.app.isLoadingClub,
    isLoadingClubs: state.app.isLoadingClubs,
    zoom: state.app.zoom,
    isTooMuchClubs: state.app.isTooMuchClubs,
  }));

  const handleToggleOpened = useCallback(() => {
    dispatch(toggleSidebar());
  }, []);

  const handleSwipeLeft = useCallback(() => {
    dispatch(showSidebar());
  }, []);

  const handleSwipeRight = useCallback(() => {
    dispatch(hideSidebar());
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
  });

  const handleGoTo = useCallback((clubId) => {
    history.push(`/club/${clubId}`)
  }, []);

  return (
    <div
      id="sidebar"
      className={classNames('has-scrollbar', { 'opened': isSidebarOpened })}
      style={{ height: `${windowHeight}px` }}
      {...swipeHandlers}
    >
      <div id="sidebar-toggle-overlay">
        <button
          type="button"
          onClick={handleToggleOpened}
          id="scrollbar-toggle"
        >
          {isSidebarOpened ? <ChevronRightIcon fontSize="large" htmlColor="#191923" /> : <ChevronLeftIcon fontSize="large" htmlColor="#191923" />}
        </button>
      </div>
      
      <ScrollbarsWrapper>
        <LoadingWrapper type="big" isLoading={isLoadingClub || isLoadingClubs}>
          <div className="inner">
            {club
              ? <ClubContent club={club} handleGoTo={handleGoTo} />
              : <ClubsContent clubs={clubs} handleGoTo={handleGoTo} zoom={zoom} isTooMuchClubs={isTooMuchClubs} />}
          </div>
        </LoadingWrapper>
      </ScrollbarsWrapper>
    </div>
  );
}

export default memo(Sidebar);
