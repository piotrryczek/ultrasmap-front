/* global google */
import history from 'config/history';
import { IMAGES_URL } from 'config/config';

const getPixelsFromSize = (size) => {
  switch (size) {
    case 'xs': return 44;
    case 's': return 48;
    case 'm': return 52;
    case 'l': return 56;
    case 'xl': return 60;
    default: return 52;
  }
}

ClubOverlay.prototype = new google.maps.OverlayView();

function ClubOverlay({
  club,
  map,
  createCallback = null,
  isCurrent = false,
  size = 'm',
}) {
  const {
    _id: clubId,
    latLng,
    name,
    transliterationName,
    logo,
    relationType = 'no-relation',
    tier,
  } = club;
  this.sizePixels = getPixelsFromSize(size);
  this.createCallback = createCallback;

  this.bounds_ = new google.maps.LatLngBounds(new google.maps.LatLng(latLng), new google.maps.LatLng(latLng));
  this.map_ = map;
  this.clubMarker = null;
  this.clubId = clubId;

  this.setMap(map);

  this.onAdd = () => {
    const clubMarker = document.createElement('button');
    clubMarker.style.position = 'absolute';
    clubMarker.setAttribute('type', 'button');
    clubMarker.classList.add('club-marker', relationType, `size-${size}`);
    if (isCurrent) clubMarker.classList.add('current-club');
    if (tier < 0.2) clubMarker.classList.add('inactive');

    clubMarker.innerHTML = `
      <div class="name">
        <span class="original">${name}</span>
        ${transliterationName ? `<span class="transliteration">${transliterationName}</span>` : ''}
      </div>
      <div class="logo-wrapper">
        <div class="logo">
        </div>
      </div>`;

    const imgLogo = document.createElement('img');
    imgLogo.setAttribute('alt', name);
    imgLogo.setAttribute('src', `${IMAGES_URL}/h90/${logo}`);
    imgLogo.addEventListener('load', () => {
      this.createCallback(clubMarker);
    });
    clubMarker.querySelector('.logo').appendChild(imgLogo);

    clubMarker.addEventListener('click', this.goTo);

    this.clubMarker = clubMarker;
  
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(clubMarker);
    panes.overlayMouseTarget.appendChild(clubMarker);
  }

  this.draw = function() {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    
    this.clubMarker.style.left = `${sw.x}px`; // - (this.sizePixels / 2)
    this.clubMarker.style.top = `${ne.y}px`; // - (this.sizePixels / 2)
  };

  this.onRemove = function() {
    this.clubMarker.removeEventListener('click', this.goTo);
    this.clubMarker.parentNode.removeChild(this.clubMarker);
    this.clubMarker = null;
  };

  this.goTo = (event) => {
    event.stopPropagation();
    history.push(`/club/${this.clubId}`);
  }

  this.updateSize = (size) => {
    if (!size || !this.clubMarker) return false;
    this.sizePixels = getPixelsFromSize(size);
    this.clubMarker.classList.remove('size-xl', 'size-l', 'size-m', 'size-s', 'size-xs');
    this.clubMarker.classList.add(`size-${size}`);
  }

  this.disapear = () => {
    if (!this.clubMarker) return false;
    this.clubMarker.classList.add('disappear');
    setTimeout(() => {
      this.setMap(null);
    }, 1000);
  }
}

export default ClubOverlay;