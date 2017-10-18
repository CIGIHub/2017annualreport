
function initializeTabs() {
  const tab1 = document.querySelectorAll('[data-id="tab-1"]');
  const tab2 = document.querySelectorAll('[data-id="tab-2"]');
  let parameter = window.location.href.split('&');

  console.log('here');
  let tabId = 'tab-1';
  let setTab = tab1;
  let unsetTab = tab2;

  if(parameter.length > 1){
    tabId = parameter[1];
    if(tabId === 'tab-1' ){
      setTab = tab1;
      unsetTab = tab2;
    }
    else{
      setTab = tab2;
      unsetTab = tab1;
    }
  }
  
  const setSelected = Array.from(setTab);
  for (const item of setSelected) {
    item.classList.add('selected');
  }

  const unsetSelected = Array.from(unsetTab);
  for (const item of unsetSelected) {
    item.classList.remove('selected');
  }
}

function toggleTabs(e) {
  const selectedTab = e.target.getAttribute('data-id');
  const selectedSlide = e.target.parentElement.getAttribute('data-slide');
  const clearSelectedTabs = document.getElementById(selectedSlide).getElementsByClassName('tab');
  let parameter = window.location.href.split('&');

  for (const item of clearSelectedTabs) {
    
    item.classList.remove('selected');
    if (item.getAttribute('data-id') === selectedTab) {
      item.classList.add('selected');
      window.location.href = parameter[0] + '&' + selectedTab;
    }
  }
}


const toggle = Array.from(document.getElementsByClassName('toggle'));
let section = Array.from(document.getElementsByTagName("section"));

export default function load() {
  initializeTabs();

  toggle.forEach(item => {
    item.addEventListener('click', toggleTabs);
  });
}
