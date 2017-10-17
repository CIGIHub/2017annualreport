
function initializeTabs() {
  const tab1 = document.querySelectorAll('[data-id="tab-1"]');
  const tab2 = document.querySelectorAll('[data-id="tab-2"]');
 
  const setSelected = Array.from(tab1);
  for (const item of setSelected) {
    item.classList.add('selected');
  }

  const unsetSelected = Array.from(tab2);
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

export default function load() {
  initializeTabs();

  toggle.forEach(item => {
    item.addEventListener('click', toggleTabs);
  });
}
