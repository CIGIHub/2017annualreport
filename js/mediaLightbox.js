import {
  enableOverlay,
  disableOverlay,
} from './navigation';

import {
  createDiv,
  createLoadOverlay,
  closeSvg,
} from './helpers';

const tweets = document.getElementsByClassName('twitter-lightbox');
const youtubes = document.getElementsByClassName('youtube-lightbox');
const soundclouds = document.getElementsByClassName('soundcloud-lightbox');

const youtubeWidth = 640;
const soundCloudWidth = 600;

const tweetIdToTweetContainer = {};
const youtubeIdToYoutubeContainer = {};
const soundcloudUrlToSoundcloudContainer = {};
let closing = false;

const lightbox = createDiv('lightbox');
const loadOverlay = createLoadOverlay();
let currentContainer = null;

function closeLightbox() {
  lightbox.classList.remove('enabled');
  closing = true;
  setTimeout(() => {
    closing = false;
    disableOverlay();
    currentContainer.remove();
    lightbox.remove();
  }, 1000);
}

lightbox.onclick = e => {
  if (e.target === lightbox) {
    closeLightbox();
  }
};

function createTweetContainer(tweetId) {
  const tweetContainer = createDiv('media-container');
  lightbox.appendChild(loadOverlay);

  const closeButton = createDiv('close-button pointer dim');
  closeButton.innerHTML = closeSvg;
  closeButton.onclick = closeLightbox;

  window.twttr.widgets.createTweet(
    tweetId,
    tweetContainer,
    {
      align: 'left',
    }
  ).then(() => {
    tweetContainer.firstChild.style.margin = '0';
    tweetContainer.appendChild(closeButton);
    loadOverlay.remove();
  });

  tweetIdToTweetContainer[tweetId] = tweetContainer;
  return tweetContainer;
}
function createYoutubeContainer(youtubeId) {
  const youtubeContainer = createDiv('media-container');
  lightbox.appendChild(loadOverlay);

  const closeButton = createDiv('close-button pointer dim');
  closeButton.innerHTML = closeSvg;
  closeButton.onclick = closeLightbox;

  youtubeContainer.innerHTML = `<iframe type="text/html" width="100%" height="360" src="https://www.youtube.com/embed/${youtubeId}?fs=0&modestbranding=1&autoplay=1" frameborder="0"></iframe>`;
  youtubeContainer.style.width = `${youtubeWidth}px`;
  youtubeContainer.appendChild(closeButton);
  loadOverlay.remove();

  youtubeIdToYoutubeContainer[youtubeId] = youtubeContainer;
  return youtubeContainer;
}

function createSoundcloudContainer(soundcloudId, soundcloudUrl) {
  const soundcloudContainer = createDiv('media-container');
  lightbox.appendChild(loadOverlay);

  const closeButton = createDiv('close-button pointer dim');
  closeButton.innerHTML = closeSvg;
  closeButton.onclick = closeLightbox;

  soundcloudContainer.innerHTML = `<iframe width="100%" height="160" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F${soundcloudId}&amp;auto_play=true&amp;show_artwork=true&amp;color=e6023b"></iframe>`;
  soundcloudContainer.style.width = soundCloudWidth;
  soundcloudContainer.appendChild(closeButton);
  loadOverlay.remove();

  soundcloudUrlToSoundcloudContainer[soundcloudUrl] = soundcloudContainer;
  return soundcloudContainer;
}

function openLightbox() {
  enableOverlay();
  lightbox.appendChild(currentContainer);
  document.body.appendChild(lightbox);
  lightbox.clientHeight;
  lightbox.classList.add('enabled');
}

export default function initializeLightboxMedia() {
  Array.prototype.forEach.call(tweets, tweet => {
    tweet.onclick = () => {
      if (closing) return;
      const tweetId = tweet.dataset.tweetid;
      currentContainer = tweetIdToTweetContainer[tweetId] || createTweetContainer(tweetId);
      openLightbox();
    };
  });
  Array.prototype.forEach.call(youtubes, youtube => {
    youtube.onclick = () => {
      if (closing) return;
      const youtubeId = youtube.dataset.videoid;
      currentContainer = youtubeIdToYoutubeContainer[youtubeId] || createYoutubeContainer(youtubeId);
      openLightbox();
    };
  });
  Array.prototype.forEach.call(soundclouds, soundcloud => {
    soundcloud.onclick = () => {
      if (closing) return;
      const soundcloudUrl = soundcloud.dataset.url;
      currentContainer = soundcloudUrlToSoundcloudContainer[soundcloudUrl];
      if (currentContainer) {
        openLightbox();
        return;
      }
      fetch('https://soundcloud.com/oembed', {
        method: 'post',
        body: `format=json&url=${soundcloudUrl}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(res => res.json()).then(res => {
        currentContainer = createSoundcloudContainer(/.*tracks%2F(\d+).*/.exec(res.html)[1], soundcloudUrl);
        openLightbox();
      });
    };
  });
}
