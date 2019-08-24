import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';

import { IMAGES_URL } from 'config/config';

import RelationClubs from './relationClubs/relationClubs.component';

function Sidebar(props) {
  const {
    club,
    retrieveClub,
  } = props;

  if (!club) return (<p>TODO</p>)

  const {
    name,
    logo,
    tier,
    location,
    friendships,
    agreements,
    positives,
    satellites,
    satelliteOf,
  } = club;

  const stars = 5 - (tier - 1) % 5;

  const handleChangeClub = clubId => () => {
    retrieveClub(clubId);
  }

  return (
    <div id="sidebar">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">{name}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <div className="main-logo">
              <img src={`${IMAGES_URL}${logo}`} alt="" />
              <Rating value={stars} readOnly />
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
                <img src={`${IMAGES_URL}${satelliteOf.logo}`} alt="" />
              </div>
              <h5 className="name">{satelliteOf.name}</h5>
            </button>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Sidebar;
