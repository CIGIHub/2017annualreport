import timelineMagic from './timeline';
import navigationMagic from './navigation';
import galleryMagic from './gallery';
import loadTabs from './tabs';
import photoCaptionMagic from './captions';
import initializeLightboxMedia from './mediaLightbox';
import progressiveBlur from './progressive';

import objectFitImages from './polyfills/object-fit';
objectFitImages();

progressiveBlur();
timelineMagic();
galleryMagic();
loadTabs();
initializeLightboxMedia();

navigationMagic();
photoCaptionMagic();