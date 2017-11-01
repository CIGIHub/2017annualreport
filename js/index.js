import timelineMagic from './timeline';
import navigationMagic from './navigation';
import galleryMagic from './gallery';
import loadTabs from './tabs';
import photoCaptionMagic from './captions';
import mobileNavMagic from './mobile';
import initializeLightboxMedia from './mediaLightbox';

const windowSize = window.innerWidth;

timelineMagic();
galleryMagic();
loadTabs();
initializeLightboxMedia();

if (window.innerWidth > 450) {
    navigationMagic();
    photoCaptionMagic();
} else {
    mobileNavMagic();
}

function reloadWindow(){
    if ((windowSize <= 450 && window.innerWidth > 450 )||( windowSize > 450 && window.innerWidth <= 450)){
        console.log("reload");
        window.location.reload();       
    } 
}

window.onresize = reloadWindow;