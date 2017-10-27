import timelineMagic from './timeline';
import navigationMagic from './navigation';
import galleryMagic from './gallery';
import loadTabs from './tabs';
import photoCaptionMagic from './captions';

loadTabs();
timelineMagic();
galleryMagic();

if (window.innerWidth > 450){
navigationMagic();
photoCaptionMagic();
}