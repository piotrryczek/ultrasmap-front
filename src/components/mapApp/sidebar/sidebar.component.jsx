import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { IMAGES_URL } from 'config/config';

import ScrollbarsWrapper from 'common/scrollbarsWrapper/scrollbarsWrapper.component';
import RelationClubs from './relationClubs/relationClubs.component';

const renderClubContent = ({ club, retrieveClub }) => {
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
            <img src={`${IMAGES_URL}/h180/${logo}`} alt="" />
            <Rating value={tier} readOnly />
          </div>
        </Paper>
      </Grid>
      {friendships.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header friendships-header"><span className="text">Zgody</span></h5>
          <RelationClubs clubs={friendships} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {agreements.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header agreements-header"><span className="text">Układy</span></h5>
          <RelationClubs clubs={agreements} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {positives.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header positives-header"><span className="text">Pozytywne relacje</span></h5>
          <RelationClubs clubs={positives} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {satellites.length > 0 && (
        <Grid item xs={12}>
          <h5 className="relations-header satellites-header"><span className="text">Satelity / FC</span></h5>
          <RelationClubs clubs={satellites} retrieveClub={retrieveClub} />
        </Grid>
      )}
      
      {satelliteOf && (
        <Grid item xs={12}>
          <h5 className="relations-header satellites-header"><span className="text">Jest satelitą / FC</span></h5>
          <button type="button" onClick={handleChangeClub(satelliteOf._id)} className="club-link">
            <div className="logo">
              <img src={`${IMAGES_URL}/h60/${satelliteOf.logo}`} alt="" />
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
              Suggest change
            </Button>
          </Link>
        </Box>
        
      </Grid>
    </Grid>
  );
}

const renderWelcome = () => {
  return (
    <>
      <Typography variant="h5" gutterBottom>Witaj!</Typography>
      <Typography gutterBottom>
        Celem aplikacji jest zobrazowanie relacji między grupami kibicowskimi rozsianymi na całym świecie. Jetem świadomy różnic w specyfice różnych regionów jak i skomplikowania wewnętrznych powiązań więc niestety nie unikniemy pewnych uproszczeń.
      </Typography>
      <Typography gutterBottom>
        Pamiętajcie, że to Wy tworzycie tę mapę. To dzięki Waszym sugestiom ta cała układanka będzie mogła żyć swoim życiem. Nieważne czy Twój klub występuje w europejskich pucharach czy okręgówcę. Jeśli funkcjonuje w kibicowskich klimatach - dodaj go! Jeśli jego dane są nieaktualne - zasugeruj ich aktualizację!
      </Typography>
      <Typography gutterBottom>
        Aplikacja jest nadal w bardzo wczesnej fazie. W razie uwag bądź dostrzeżenia nieprawidłowości w działaniu będę wdzięczny za informacje zwrotne.
      </Typography>
      <Typography gutterBottom>
        Projekt jest non-profit.
      </Typography>
    </>
  );
}

function Sidebar(props) {
  const {
    club,
  } = props;

  const {
    isLoadingClub,
  } = useSelector(state => ({
    isLoadingClub: state.app.isLoadingClub,
  }), shallowEqual);

  return (
    <div
      id="sidebar"
      className={classNames('has-scrollbar', {
        'loading': isLoadingClub,
      })}
    >
      <ScrollbarsWrapper>
        <div className="inner">
          {club ? renderClubContent(props) : renderWelcome()}
        </div>
      </ScrollbarsWrapper>
      
    </div>
  );
}

export default Sidebar;
