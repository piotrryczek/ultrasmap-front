/* global google */
import _intersection from 'lodash/intersection';
import _get from 'lodash/get';
import getDistance from 'geolib/es/getDistance';
import _shuffle from 'lodash/shuffle';

// import { APPEAR_DELAY } from 'config/config';

import {
  getMaximumDistance,
  getRelationColor,
  getAllClubs,
} from './util';

import ClubOverlay from './clubOverlay';

const mapToId = club => club._id;

class GoogleMapDrawer {
  clubs = [];
  clubsOverlays = [];
  relationsLines = [];
  currentClub = {};
  tooMuchClubs = false;
  firstTime = true;

  constructor(params, callbacks) {
    this.callbacks = callbacks;

    const {
      initialCenter,
      initialZoom,
    } = params;

    this.map = new google.maps.Map(document.getElementById('google-map-clubs'), {
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        mapTypeIds: []
      },
      gestureHandling: 'greedy',
      center: initialCenter,
      zoom: initialZoom,
    });

    google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => { const { mapLoadedCallback } = this.callbacks; mapLoadedCallback(); });
    google.maps.event.addListener(this.map, 'bounds_changed', this.handleBoundsChanged);
    google.maps.event.addListener(this.map, 'zoom_changed', this.handleZoomChanged);
    google.maps.event.addListener(this.map, 'drag', this.handleClearSearchInputFocus);

    google.maps.event.clearListeners(this.map, 'idle');
  }

  handleZoomChanged = () => {
    const { zoomChangedCallback } = this.callbacks;

    zoomChangedCallback(this.map.getZoom());
  }

  handleBoundsChanged = () => {
    const { boundsChangedCallback } = this.callbacks;

    boundsChangedCallback();
  }

  handleClearSearchInputFocus = () => {
    const { clearSearchInputFocusCallback } = this.callbacks;

    clearSearchInputFocusCallback();
  }

  setCallback = (callbackName, callback) => {
    this.callbacks[callbackName] = callback;
  }

  setTooMuchClubs = (tooMuchClubs) => {
    if (tooMuchClubs) this.updateClubs([]);

    this.tooMuchClubs = tooMuchClubs;
  }

  updateClubs = (clubs) => {
    if (this.currentClub) {
      this.currentClub = null;
      this.clearClubsOverlays();
      this.clearCurrentClass();
    }

    const sameClubsIds = _intersection(
      this.clubs.map(mapToId), 
      clubs.map(mapToId)
    );

    const clubsToAdd = clubs.filter(club => !sameClubsIds.includes(club._id));
    const clubsToRemove = this.clubs.filter(club => !sameClubsIds.includes(club._id));

    this.clubs = clubs;

    const appearDelay = (20 / clubsToAdd.length) * clubsToAdd.length;

    _shuffle(clubsToAdd).forEach((club, index) => {
      const overlay = new ClubOverlay({
        club,
        map: this.map,
        createCallback: (clubMarker) => {
          setTimeout(() => {
            clubMarker.classList.add('show');
          }, appearDelay * index);
        },
      });
    
      this.clubsOverlays.push({
        clubId: club._id,
        overlay,
      });
    });

    clubsToRemove.forEach((club) => {
      const clubOverlay = this.clubsOverlays.find(clubOverlay => clubOverlay.clubId === club._id);

      if (clubOverlay) clubOverlay.overlay.setMap(null);
    });

    const clubsToRemoveIds = clubsToRemove.map(mapToId);
    this.clubsOverlays = this.clubsOverlays.filter(clubOverlay => !clubsToRemoveIds.includes(clubOverlay.clubId));

    this.clearRelationsLines();
  }

  updateCurrentClub = (currentClub) => {
    this.currentClub = currentClub;

    const allClubs = currentClub ? getAllClubs(currentClub) : [];

    const [enhancedCurrentClub, ...relations] = allClubs;

    // Clear previous clubs overlays and relation lines
    this.clearClubsOverlays();
    this.clearRelationsLines();

    // Draw Clubs and Relations
    if (allClubs.length) {
      const maximumDistance = getMaximumDistance(currentClub, allClubs);

      let boundsCounter = 0;
      const bounds = new google.maps.LatLngBounds();

      for (const club of allClubs) {
        if (getDistance({ latitude: currentClub.latLng.lat, longitude: currentClub.latLng.lng}, { latitude: club.latLng.lat, longitude: club.latLng.lng }) < maximumDistance) {
          bounds.extend(new google.maps.LatLng(club.latLng));
          boundsCounter += 1;
        }
      }

      if (boundsCounter > 1) {
        this.map.fitBounds(bounds, {
          top: 90,
          bottom: 35,
          left: 35,
          right: 35,
        });
      } else {
        this.map.setCenter(new google.maps.LatLng(allClubs[0].latLng)); 
      }

      allClubs.forEach((club) => {
        const overlay = new ClubOverlay({
          club,
          map: this.map,
          isCurrent: club._id === currentClub._id,
          createCallback: (clubMarker) => {
            clubMarker.classList.add('immediate-show');
          },
        });

        this.clubsOverlays.push({
          clubId: club._id,
          overlay,
        });
      });

      relations.forEach((club) => {
        const {
          latLng,
          relationType,
        } = club;

        const relationLine = new google.maps.Polyline({
          path: [enhancedCurrentClub.latLng, latLng],
          strokeColor: getRelationColor(relationType),
          strokeOpacity: 0.5,
          strokeWeight: 6
        });
  
        relationLine.setMap(this.map);
        this.relationsLines.push(relationLine);
      });
    }
  }

  setHovered = (clubId) => {
    const clubOverlay = this.clubsOverlays.find(clubOverlay => clubOverlay.clubId === clubId);

    const clubMarker = _get(clubOverlay, 'overlay.clubMarker', null);
    if (clubMarker) clubMarker.classList.add('hovered');

    this.clubsOverlays.filter(clubOverlay => clubOverlay.clubId !== clubId).forEach(clubOverlay => {
      if (clubOverlay.overlay.clubMarker) clubOverlay.overlay.clubMarker.classList.remove('hovered');
    });
  }

  clearClubsOverlays = () => {
    if (!this.clubsOverlays.length) return false;

    this.clubsOverlays.forEach(clubOverlay => {
      clubOverlay.overlay.setMap(null);
    });
    this.clubsOverlays = [];
  }

  clearRelationsLines = () => {
    if (!this.relationsLines.length) return false;

    this.relationsLines.forEach(relationLine => {
      relationLine.setMap(null);
    });
    this.relationsLines = [];
  }

  clearCurrentClass = () => {
    this.clubsOverlays.forEach(clubOverlay => {
      clubOverlay.overlay.clubMarker.classList.remove('current-club');
    });
  }
}

export default GoogleMapDrawer;