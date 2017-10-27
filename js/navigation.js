import {
  generateFacebookShareLink,
  generateTwitterShareLink,
  createDiv,
  createEl,
  closeSvg,
} from 'helpers';

import {
  changeSlideInUrl,
  parseAndLoadSlide,
} from './permalink';

const globalShareFacebook = document.getElementById('global-share-facebook');
const globalShareTwitter = document.getElementById('global-share-twitter');
const tableOfContentsButton = document.getElementById('table-of-contents-button');
const exploreCIGILink = document.getElementById('explore-cigi-link');
const viewARLink = document.getElementById('view-ar-link');
const cigiLogo = document.getElementById('cigi-logo');
const mainTabs = document.getElementById('main-tabs');
const header = document.getElementById('site-header');
const upArrow = document.getElementsByClassName('explore')[0];
const downArrow = document.getElementsByClassName('view-ar')[0];

const smoothSlideContainer = document.getElementById('smooth-slide-container');
const sections = document.getElementsByTagName('section');
export const numberOfSections = sections.length;

function updateGlobalShareLinks() {
  const encodedURL = encodeURIComponent(location.href);
  globalShareFacebook.setAttribute('href', generateFacebookShareLink(encodedURL));
  globalShareTwitter.setAttribute('href', generateTwitterShareLink(encodedURL));
}

function fadeOutNavigationComponent(component) {
  component.style.opacity = '0';
  component.style.pointerEvents = 'none';
}

function fadeInNavigationComponent(component) {
  component.style.opacity = null;
  component.style.pointerEvents = null;
}
const inactivityMilliseconds = 1500;

let sidebar;
let topButton;
let bottomButton;
let currentSlide = 1;
let isScrolling = false;
let tableOfContents;
let tocOpen = false;
const buttons = new Array(numberOfSections);
let fadeTimeoutSet = false;
let fadeTimeout;
let overlayEnabled = false;
const slideTransitionMs = 1000;

export function disableOverlay() {
  overlayEnabled = false;
}

export function enableOverlay() {
  overlayEnabled = true;
}

function updateNavigation(newIndex, oldIndex) {
  if (isScrolling) {
    return;
  }
  const newButton = buttons[newIndex];
  const oldButton = buttons[oldIndex];
  if (newButton === undefined || oldButton === undefined) {
    return;
  }
  isScrolling = true;
  setTimeout(() => {
    isScrolling = false;
  }, slideTransitionMs);
  oldButton.classList.remove('active');
  newButton.classList.add('active');
  updateGlobalShareLinks();
  changeSlideInUrl(newIndex);
  scrollViewToSlideIndex(newIndex);
  currentSlide = newIndex;
  handleNavigationButtonsFade();
}

function setMousemoveFadeTimemout(e) {
  if (fadeTimeoutSet) {
    clearTimeout(fadeTimeout);
  }
  fadeTimeout = setTimeout(() => {
    const cursorOnNavigation = Array.prototype.some.call([topButton, bottomButton, sidebar], child => child.contains(e.target));
    if (cursorOnNavigation) {
      return;
    }
    fadeOutAllNavigationComponents();
    fadeTimeoutSet = false;
  }, inactivityMilliseconds);
  fadeTimeoutSet = true;
}

exploreCIGILink.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(0, currentSlide);
};

upArrow.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(0, currentSlide);
}

viewARLink.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(2, currentSlide);
};

downArrow.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(2, currentSlide);
}

function setKeydownAndWheelFadeTimeout() {
  if (fadeTimeoutSet) {
    clearTimeout(fadeTimeout);
  }
  fadeTimeout = setTimeout(() => {
    fadeOutAllNavigationComponents();
    fadeTimeoutSet = false;
  }, inactivityMilliseconds);
  fadeTimeoutSet = true;
}

function fadeOutAllNavigationComponents() {
  fadeOutNavigationComponent(sidebar);
  fadeOutNavigationComponent(topButton);
  fadeOutNavigationComponent(bottomButton);
}

function handleNavigationButtonsFade() {
  if (currentSlide === 0) {
    fadeOutNavigationComponent(topButton);
    exploreCIGILink.classList.add('selected');
    viewARLink.classList.remove('selected');
    
  } else {
    fadeInNavigationComponent(topButton)
    ;exploreCIGILink.classList.remove('selected');
    viewARLink.classList.add('selected');
  }
  
  if (currentSlide === 1){
    fadeOutAllNavigationComponents();
    fadeOutNavigationComponent(mainTabs);
    header.classList.add('white');
  }
  else{
    fadeInNavigationComponent(mainTabs);
    header.classList.remove('white');
  }
  
  if (currentSlide === numberOfSections - 1) {
    fadeOutNavigationComponent(bottomButton);
  } else {
    fadeInNavigationComponent(bottomButton);
  }
}

function scrollViewToSlideIndex(newIndex) {
  smoothSlideContainer.style.transition = `all ${slideTransitionMs}ms ease`;
  requestAnimationFrame(() => {
    if (newIndex === 0) {
      smoothSlideContainer.style.transform = null;
    } else {
      smoothSlideContainer.style.transform = 'translateY(-' + 100 * newIndex + 'vh)';
      if(newIndex === 1){
        fadeOutAllNavigationComponents(sidebar);
      }
    }
    setTimeout(() => {
      smoothSlideContainer.style.transition = null;
    }, slideTransitionMs);
  });
}

function injectLinksAndAddSideBar() {
  sidebar = createDiv('fixed sidebar');
  const subsections = new Map();
  for (let i = 0; i < numberOfSections; i++) {
    // and add entry to table of contents
    const section = sections[i];
    const h3s = section.getElementsByTagName('h3');
    const subsection = h3s.length && h3s[0].innerHTML || 'Explore CIGI';
    const slideName = section.getElementsByTagName('h1')[0].innerText;
    const content = subsections.get(subsection);
    if (content === undefined) {
      subsections.set(subsection, [{
        title: slideName,
        slidenum: i,
      }]);
    } else {
      content.push({
        title: slideName,
        slidenum: i,
      });
    }
    // now create a corresponding button on the sidebar
    const button = createDiv('sidebar-button');
    const currentIndex = i;
    button.onclick = () => {
      if (currentSlide !== currentIndex) {
        updateNavigation(currentIndex, currentSlide);
      }
    };
    const tooltip = createDiv('sidebar-tooltip mr2 ph2 pv1 br2');
    tooltip.innerText = slideName;
    button.appendChild(tooltip);
    sidebar.appendChild(button);
    buttons[i] = button;
  }
  buttons[currentSlide].classList.add('active');
  tableOfContents = createDiv('pt5 pt6-ns fixed vh-100 w-100 bg-black-90 z-7 left-0 top-0');
  const tocIconOpen = 'fa fa-navicon black';
  const tocIcon = createEl('i', tocIconOpen);
  tableOfContentsButton.appendChild(tocIcon);
  const toggleToc = () => {
    tocOpen = !tocOpen;
    if (tocOpen) {
      enableOverlay();
      fadeOutAllNavigationComponents();
      tocIcon.className = '';
      tocIcon.innerHTML = closeSvg;
      document.body.appendChild(tableOfContents);
      cigiLogo.style.filter = 'invert(100%)';
      [globalShareFacebook, globalShareTwitter].forEach(el => { el.style.color = 'white'; });
    } else {
      tocIcon.innerHTML = '';
      tocIcon.className = tocIconOpen;
      tableOfContents.remove();
      cigiLogo.style.filter = null;
      [globalShareFacebook, globalShareTwitter].forEach(el => { el.style.color = null; });
      disableOverlay();
    }
  };
  
  tableOfContentsButton.onclick = toggleToc;
  document.body.appendChild(sidebar);
  const container = createDiv('tr h-100 overflow-auto wrapper');
  const h1 = createEl('h1', 'ttu accent-color fw5 f4 tracked lh-title mb2 mb4-ns');
  h1.innerText = 'Table of Contents';
  container.appendChild(h1);
  const div = createDiv('col');
  for (const [subsection, content] of subsections) {
    const wrapper = createEl('li', 'column-no-wrap list');
    const h2 = createEl('h2', 'accent-color partial-underline-right f4 fw3 mt3 smooth');
    h2.innerText = subsection;
    wrapper.appendChild(h2);
    const ul = content.reduce((acc, item) => {
      const li = createEl('li', 'dib pointer white f6 fw3 mt2 underline-hover list smooth');
      li.innerHTML = item.title;
      li.onclick = () => {
        toggleToc();
        if (item.slidenum !== currentSlide) {
          updateNavigation(item.slidenum, currentSlide);
        }
      };
      acc.appendChild(li);
      acc.appendChild(createEl('br'));
      return acc;
    }, createEl('ul'));
    wrapper.appendChild(ul);
    div.appendChild(wrapper);
  }
  container.appendChild(div);
  tableOfContents.appendChild(container);
}

function injectTopAndBottomButtons() {
  topButton = createDiv('navigation-top-button');
  topButton.innerHTML = '<div style="margin:auto;"><i class="fa fa-angle-up"></i></div>';
  bottomButton = createDiv('navigation-bottom-button');
  bottomButton.innerHTML = '<div style="margin:auto;"><i class="fa fa-angle-down"></i></div>';
  document.body.appendChild(topButton);
  document.body.appendChild(bottomButton);
  if (currentSlide === 0) {
    fadeOutNavigationComponent(topButton);
  }
  if (currentSlide === numberOfSections - 1) {
    fadeOutNavigationComponent(bottomButton);
  }
  topButton.onclick = () => {
    updateNavigation(currentSlide - 1, currentSlide);
  };
  bottomButton.onclick = () => {
    updateNavigation(currentSlide + 1, currentSlide);
  };
}

const navigationInactivityFadeHandler = e => {
  if (overlayEnabled) {
    return;
  }
  clearTimeout(fadeTimeout);
  fadeInNavigationComponent(sidebar);
  handleNavigationButtonsFade();
  setMousemoveFadeTimemout(e);
};

const navigationKeydownHandler = e => {
  if (overlayEnabled) {
    return;
  }
  fadeInNavigationComponent(sidebar);
  handleNavigationButtonsFade();
  switch (e.key) {
    case 'ArrowUp':
    case 'PageUp': {
      e.preventDefault();
      updateNavigation(currentSlide - 1, currentSlide);
      break;
    }
    case 'ArrowDown':
    case ' ':
    case 'PageDown': {
      e.preventDefault();
      updateNavigation(currentSlide + 1, currentSlide);
      break;
    }
  }
  setKeydownAndWheelFadeTimeout();
};

let lastWheel = performance.now();
const navigationWheelHandler = e => {
  if (overlayEnabled) {
    return;
  }
  const currentTime = performance.now();
  if (currentTime - lastWheel < 1000) {
    // lastWheel = currentTime;
    return;
  }
  lastWheel = currentTime;
  fadeInNavigationComponent(sidebar);
  handleNavigationButtonsFade();
  if (e.deltaY > 0) {
    updateNavigation(currentSlide + 1, currentSlide);
  } else {
    updateNavigation(currentSlide - 1, currentSlide);
  }
  setKeydownAndWheelFadeTimeout();
};

export function loadInitialSlide(initialSlide) {
  updateNavigation(initialSlide, currentSlide);
}

export default function navigationMagic() {
  // hacky onscroll to aid with the scroll-jacking
  // scroll back to top when something like Find (Ctrl + F) triggers a scroll when not intended
  window.onscroll = () => window.scrollTo(0, 0);
  // hide the rest of the slides with overflow: hidden
  document.body.style.overflow = 'hidden';
  
  updateGlobalShareLinks();
  injectLinksAndAddSideBar();
  injectTopAndBottomButtons();
  parseAndLoadSlide();
  document.addEventListener('mousemove', navigationInactivityFadeHandler, false);
  document.addEventListener('keydown', navigationKeydownHandler, false);
  document.addEventListener('wheel', navigationWheelHandler, false);
}
