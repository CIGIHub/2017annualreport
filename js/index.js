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


function loadJavascriptFiles(){
    console.log(window.innerWidth);
    if (window.innerWidth > 450) {
        console.log("in desktop version");
        navigationMagic();
        photoCaptionMagic();
    } else {
        console.log("in mobile version");
        mobileNavMagic();
    }
}

initializeLightboxMedia();
loadJavascriptFiles();

window.onresize = loadJavascriptFiles;
