import timelineMagic from './timeline';
import navigationMagic from './navigation';
import galleryMagic from './gallery';
import loadTabs from './tabs';
import photoCaptionMagic from './captions';
import mobileNavMagic from './mobile';
import initializeLightboxMedia from './mediaLightbox';

timelineMagic();
galleryMagic();
loadTabs();
initializeLightboxMedia();

console.log(window.innerWidth);

if (window.innerWidth > 450) {
    navigationMagic();
    photoCaptionMagic();
} else {
    mobileNavMagic();
}