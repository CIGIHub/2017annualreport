
// tabs

function initializeTabs() {

  const tab1 = document.querySelectorAll('[data-id="tab-1"]');
  const tab2 = document.querySelectorAll('[data-id="tab-2"]');

  const setSelected1 = Array.from(tab1);
  for (const item of setSelected1) {
    item.classList.add('selected');
  }

  const unsetSelected1 = Array.from(tab2);
  for (const item of unsetSelected1) {
    item.classList.remove('selected');
  }

}

function toggleTabs(e){

  const selectedTab = e.target.getAttribute('data-id');
  // const selectedTabId = selectedTab.split('tab-')[1];
  const currentSlideId = window.location.hash.split('#/?slide=')[1];

  // this shouldn't happen, but just in case
  if(currentSlideId === undefined){
    return;
  }
  else{
    // get the current slide and assign the clicked tab.
    const currentSlide = 'slide-' + currentSlideId;

    var clearSelectedTabs = document.getElementById(currentSlide).getElementsByClassName('tab');
    for (var item of clearSelectedTabs){
      item.classList.remove('selected');
      if (item.getAttribute('data-id') === selectedTab){
        item.classList.add('selected');
      }
    }
  }

}

// const tabs = Array.from(document.getElementsByClassName('tab'));
const toggle = Array.from(document.getElementsByClassName('toggle'));

export default function load() {
  initializeTabs();

  toggle.forEach(item => {
    item.addEventListener('click', toggleTabs);
  });
}

