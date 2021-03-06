import { setHash } from './permalink';
import { addClassToElementsInArray } from './helpers';
import { sections, currentSlide } from './navigation';

function initializeTabs() {
  let tabId = /&tab-(\d+)/.exec(location.hash);
  const slideId = /slide=(\d+)/.exec(location.hash);
  if (tabId !== null) {
    tabId = tabId[1];
  } else {
    tabId = '1';
  }

  for (const section of sections) {
    let setTab = section.querySelectorAll(`[data-id="tab-${tabId}"]`);
    if (setTab.length === 0) {
      setTab = section.querySelectorAll('[data-id="tab-1"]');
    }
    addClassToElementsInArray(setTab, 'selected');
  }

  if (slideId !== null && slideId[1] == '2') {
    setMessagesBackground('tab-' + tabId);
  }
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

  if (e.target.textContent.includes('Message')) {
    setMessagesBackground(selectedTab);
  }
}

 // Setting background for messages slides
function setMessagesBackground(tab) {
  const slide2 = document.getElementsByClassName('slide-2')[0];
  const slide2BG = slide2.getElementsByClassName('background-img')[0];
  if (tab == 'tab-1') {
    slide2BG.style.backgroundImage = "url('assets/slides/JB-headshot-smaller.jpg')";
  }
  else if (tab == 'tab-2') {
    slide2BG.style.backgroundImage = "url('assets/slides/RM-headshot-smaller.jpg')";
  }
}

const toggle = Array.from(document.getElementsByClassName('toggle'));

export default function load() {
  initializeTabs();

  toggle.forEach(item => {
    item.addEventListener('click', toggleTabs);
  });
}
