const clearSelectedTabs = Array.from(document.getElementById('tab-toggles').getElementsByClassName('tab'));

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

function toggleTabs(e) {
  const selectedTab = e.target.getAttribute('data-id');
  // const selectedTabId = selectedTab.split('tab-')[1];

  for (const item of clearSelectedTabs) {
    item.classList.remove('selected');
    if (item.getAttribute('data-id') === selectedTab) {
      item.classList.add('selected');
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
