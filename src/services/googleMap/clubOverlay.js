/* global google */
import history from 'config/history';
import { IMAGES_URL } from 'config/config';

ClubOverlay.prototype = new google.maps.OverlayView();

function ClubOverlay({
  club,
  map,
  createCallback = null,
  isCurrent = false,
}) {
  const {
    _id: clubId,
    latLng,
    name,
    transliterationName,
    logo,
    relationType = 'no-relation',
  } = club;

  this.createCallback = createCallback;

  this.bounds_ = new google.maps.LatLngBounds(new google.maps.LatLng(latLng), new google.maps.LatLng(latLng));
  this.map_ = map;
  this.clubMarker = null;

  this.setMap(map);

  this.onAdd = () => {
    const clubMarker = document.createElement('button');
    clubMarker.style.position = 'absolute';
    clubMarker.setAttribute('type', 'button');
    clubMarker.classList.add('club-marker', relationType);
    if (isCurrent) clubMarker.classList.add('current-club');

    clubMarker.innerHTML = `
      <div class="name">
        <span class="original">${name}</span>
        ${transliterationName ? `<span class="transliteration">${transliterationName}</span>` : ''}
      </div>
      <div class="logo-wrapper">
        <div class="logo">
          <img src="" alt="" />
        </div>
      </div>`;

    const imgLogo = document.createElement('img');
    imgLogo.setAttribute('alt', name);
    imgLogo.setAttribute('src', `${IMAGES_URL}/h90/${logo}`);
    imgLogo.addEventListener('load', () => {
      this.createCallback(clubMarker);
    });
    clubMarker.querySelector('.logo').appendChild(imgLogo);

    clubMarker.addEventListener('click', () => history.push(`/club/${clubId}`));

    this.clubMarker = clubMarker;
  
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(clubMarker);
    panes.overlayMouseTarget.appendChild(clubMarker);
  }

  this.draw = function() {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    
    this.clubMarker.style.left = `${sw.x - 24}px`;
    this.clubMarker.style.top = `${ne.y - 24}px`;
    this.clubMarker.style.width = '48px';
    this.clubMarker.style.height = '48px';
  };

  this.onRemove = function() {
    this.clubMarker.parentNode.removeChild(this.clubMarker);
    this.clubMarker = null;
  };
}

export default ClubOverlay;