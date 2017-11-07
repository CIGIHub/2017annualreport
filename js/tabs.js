import { setHash } from './permalink';
import { addClassToElementsInArray } from './helpers';
import { sections, currentSlide } from './navigation';

function initializeTabs() {
  let tabId = /&tab-(\d+)/.exec(location.hash);
  if (tabId !== null) {
    tabId = tabId[1];
  } else {
    tabId = '1';
  }
  const setTab = document.querySelectorAll(`[data-id="tab-${tabId}"]`);
  addClassToElementsInArray(setTab, 'selected');
}

function toggleTabs(e) {
  e.stopPropagation();
  const selectedTab = e.target.dataset.id;
  const clearSelectedTabs = Array.from(sections[currentSlide].getElementsByClassName('tab'));
  const parameter = location.hash.split('&');
  setHash(parameter[0] + '&' + selectedTab);

  for (const item of clearSelectedTabs) {
    if (item.dataset.id === selectedTab) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
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
