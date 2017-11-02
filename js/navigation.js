import {
  generateFacebookShareLink,
  generateTwitterShareLink,
  createDiv,
  createEl,
  closeSvg,
} from './helpers';

import  {
  putBackgroundImageIntoArticle,
  unPutBackgroundImageIntoArticle,
} from './mobile';

import {
  changeSlideInUrl,
  parseAndLoadSlide,
} from './permalink';

const globalShareFacebook = document.getElementById('global-share-facebook');
const globalShareTwitter = document.getElementById('global-share-twitter');
const tableOfContentsButton = document.getElementById('table-of-contents-button');
const exploreCIGILink = document.getElementById('explore-cigi-link');
const mobileHomeButton = document.getElementsByClassName('mobile-button')[0];
const viewARLink = document.getElementById('view-ar-link');
const cigiLogo = document.getElementById('cigi-logo');
const mainTabs = document.getElementById('main-tabs');
const header = document.getElementById('site-header');
const upArrow = document.getElementsByClassName('explore')[0];
const downArrow = document.getElementsByClassName('view-ar')[0];
const chairsMessageLink = document.querySelector("[data-id='tab-2']");
const chairSlide = 2;

const smoothSlideContainer = document.getElementById('smooth-slide-container');
const sections = document.getElementsByTagName('section');
export const numberOfSections = sections.length;
const slideNumToBackgroundVideo = new Array(numberOfSections);

export let mobile = false;

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
export let currentSlide = 1;
let isDesktopScrolling = false;
let tocOpen = false;
const buttons = new Array(numberOfSections);
let fadeTimeoutSet = false;
let fadeTimeout;
let overlayEnabled = false;
const slideTransitionMs = 1000;

export function disableOverlay() {
  overlayEnabled = false;
  document.body.classList.remove('overflow-hidden');
}

export function enableOverlay() {
  overlayEnabled = true;
  document.body.classList.add('overflow-hidden');
}

let lastWheel = 0;

function updateNavigation(newIndex, oldIndex, slide = true, transition = true) {
  if (isDesktopScrolling) {
    return;
  }
  const newButton = buttons[newIndex];
  const oldButton = buttons[oldIndex];
  if (newButton === undefined || oldButton === undefined) {
    return;
  }
  const newVideo = slideNumToBackgroundVideo[newIndex];
  const oldVideo = slideNumToBackgroundVideo[oldIndex];
  if (oldVideo) {
    oldVideo.pause();
  }
  if (newVideo) {
    newVideo.play();
  }
  if (!mobile) {
    isDesktopScrolling = true;
    setTimeout(() => {
      isDesktopScrolling = false;
      // lastWheel = 0;
    }, slideTransitionMs);
  }
  oldButton.classList.remove('active');
  newButton.classList.add('active');
  updateGlobalShareLinks();
  changeSlideInUrl(newIndex);
  if (slide) scrollViewToSlideIndex(newIndex, transition);
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

mobileHomeButton.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(1, currentSlide);
};

upArrow.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(0, currentSlide);
};

viewARLink.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(2, currentSlide);
};

downArrow.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(2, currentSlide);
};

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
    fadeInNavigationComponent(topButton);
    exploreCIGILink.classList.remove('selected');
    viewARLink.classList.add('selected');
  }

  if (currentSlide === numberOfSections - 1) {
    fadeOutNavigationComponent(bottomButton);
  } else {
    fadeInNavigationComponent(bottomButton);
  }

  if (currentSlide === 1) {
    fadeOutAllNavigationComponents();
    fadeOutNavigationComponent(mainTabs);
    if (!mobile) {
      header.classList.add('white');
    }
  }
  else {
    fadeInNavigationComponent(mainTabs);
    if (!mobile) {
      header.classList.remove('white');
    }
  }
}

function scrollViewToSlideIndex(newIndex, transition = true) {
  if (mobile) {
    sections[newIndex].scrollIntoView();
    return;
  }
  if (transition) smoothSlideContainer.style.transition = `all ${slideTransitionMs}ms ease`;
  requestAnimationFrame(() => {
    if (newIndex === 0) {
      smoothSlideContainer.style.transform = null;
    } else {
      smoothSlideContainer.style.transform = 'translateY(-' + 100 * newIndex + 'vh)';
    }
    setTimeout(() => {
      smoothSlideContainer.style.transition = null;
    }, slideTransitionMs);
  });
}

function injectLinksAndAddSideBar() {
  sidebar = createDiv('fixed sidebar');
  const slides = new Array(numberOfSections);
  const subsections = new Map();
  for (let i = 0; i < numberOfSections; i++) {
    // and add entry to table of contents
    const section = sections[i];
    const h3s = section.getElementsByTagName('h3');
    const subsection = h3s.length && h3s[0].innerHTML || 'Explore CIGI';
    const slideName = section.getElementsByTagName('h1')[0].innerText;
    slides[i] = slideName;
    slideNumToBackgroundVideo[i] = section.getElementsByClassName('fullscreen-bg-video')[0];
    const item = {
      slideName,
      slideNum: i,
    };
    const content = subsections.get(subsection);
    if (content === undefined) {
      subsections.set(subsection, [item]);
    } else {
      content.push(item);
    }
    // now create a corresponding button on the sidebar
    const button = createDiv(i === 1 ? 'sidebar-home fa-home' : 'sidebar-button');
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
  const tableOfContentsDesktop = createDiv('pt5 pt6-ns pl3 pl0-ns pr3 pr0-ns fixed vh-100 w-100 bg-black-90 left-0 top-0');
  const tableOfContentsMobile = createDiv('toc-mobile-wrapper');
  const tableOfContentsWrapper = createDiv('z-7');
  tableOfContentsWrapper.appendChild(tableOfContentsDesktop);

  function mobileScroll() {
    window.onscroll = null;
    smoothSlideContainer.style.transform = null;
    document.body.style.overflow = null;
  }

  function desktopScroll() {
    window.onscroll = () => window.scrollTo(0, 0);
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
  }
  desktopScroll();

  const handleWidth = () => {
    if (window.innerWidth <= 450) {
      if (!mobile) {
        toggleTocEl();
        mobileScroll();
        scrollViewToSlideIndex(currentSlide);
        if (tocOpen) {
          header.style.background = 'black';
        }
        if (currentSlide === 1) {
          header.classList.remove('white');
        }
        Array.from(sections).forEach(section => putBackgroundImageIntoArticle(section));
      }
    }
    else {
      if (mobile) {
        toggleTocEl();
        desktopScroll();
        scrollViewToSlideIndex(currentSlide, false);
        if (currentSlide === 1) {
          header.classList.add('white');
        }
        unPutBackgroundImageIntoArticle();
      }
    }
  };

  const toggleTocEl = () => {
    mobile = !mobile;
    if (mobile) {
      document.body.classList.add('mobile');
      tableOfContentsDesktop.remove();
      tableOfContentsWrapper.appendChild(tableOfContentsMobile);
    } else {
      document.body.classList.remove('mobile');
      tableOfContentsMobile.remove();
      tableOfContentsWrapper.appendChild(tableOfContentsDesktop);
    }
  };
  window.onresize = handleWidth;
  handleWidth();
  const tocIconOpen = 'fa fa-navicon black';
  const tocIcon = createEl('i', tocIconOpen);
  tableOfContentsButton.appendChild(tocIcon);
  const toggleTocOpen = () => {
    tocOpen = !tocOpen;
    if (mobile) {
      document.body.classList.add('overflow-hidden');
    }
    if (tocOpen) {
      enableOverlay();
      fadeOutAllNavigationComponents();
      tocIcon.className = '';
      tocIcon.innerHTML = closeSvg;
      document.body.appendChild(tableOfContentsWrapper);
      cigiLogo.style.filter = 'invert(100%)';
      header.classList.add('white');
      if (mobile) {
        header.style.background = 'black';
      }
    } else {
      tocIcon.innerHTML = '';
      tocIcon.className = tocIconOpen;
      tableOfContentsWrapper.remove();
      cigiLogo.style.filter = null;
      header.classList.remove('white');
      if (mobile) {
        header.style.background = null;
      }
      disableOverlay();
    }
  };
  tableOfContentsButton.onclick = toggleTocOpen;

  document.body.appendChild(sidebar);

  function tocDesktop() {
    const container = createDiv('tr h-100 overflow-auto wrapper');
    const h1 = createEl('h1', 'ttu accent-color fw5 f4 tracked lh-title mb2 mb4-ns db-ns dn');
    h1.innerText = 'Table of Contents';
    container.appendChild(h1);
    const div = createDiv('col');
    for (const [subsection, content] of subsections) {
      const wrapper = createEl('li', 'column-no-wrap list');
      const h2 = createEl('h2', 'accent-color partial-underline-right f4 fw3 mt3 smooth');
      h2.innerText = subsection;
      wrapper.appendChild(h2);
      const ul = content.reduce((acc, slide) => {
        const liClassName = 'dib pointer white f6 fw3 mt2 underline-hover list smooth';
        const li = createEl('li', liClassName);
        li.innerText = slide.slideName;
        li.onclick = () => {
          toggleTocOpen();
          if (slide.slideNum !== currentSlide) {
            updateNavigation(slide.slideNum, currentSlide);
          }
        };
        acc.appendChild(li);
        acc.appendChild(createEl('br'));
        if (slide.slideNum === chairSlide) {
          const chairLi = createEl('li', liClassName);
          chairLi.innerText = "Chair's Message";
          chairLi.onclick = () => {
            toggleTocOpen();
            if (slide.slideNum !== currentSlide) {
              updateNavigation(slide.slideNum, currentSlide);
            }
            chairsMessageLink.click();
          };
          acc.appendChild(chairLi);
          acc.appendChild(createEl('br'));
        }
        return acc;
      }, createEl('ul'));
      wrapper.appendChild(ul);
      div.appendChild(wrapper);
    }
    container.appendChild(div);
    tableOfContentsDesktop.appendChild(container);
  }
  tocDesktop();

  function tocMobile() {
    const ul = createEl('ul');
    slides.forEach((slideName, i) => {
      const li = createEl('li', 'pointer');
      li.innerText = slideName;
      li.onclick = () => {
        toggleTocOpen();
        if (i !== currentSlide) {
          updateNavigation(i, currentSlide);
        }
      };
      ul.appendChild(li);
      if (i === chairSlide) {
        const chairLi = createEl('li', 'pointer');
        chairLi.innerText = "Chair's Message";
        chairLi.onclick = () => {
          toggleTocOpen();
          if (i !== currentSlide) {
            updateNavigation(i, currentSlide);
            chairsMessageLink.click();
          }
        };
        ul.appendChild(chairLi);
      }
    });
    tableOfContentsMobile.appendChild(ul);
  }
  tocMobile();
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
  if (overlayEnabled || mobile) {
    return;
  }
  clearTimeout(fadeTimeout);
  fadeInNavigationComponent(sidebar);
  handleNavigationButtonsFade();
  setMousemoveFadeTimemout(e);
};

const navigationKeydownHandler = e => {
  if (overlayEnabled || mobile) {
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

const mobileScrollHandler = () => {
  if (!mobile) {
    return;
  }
  const rect = sections[currentSlide].getBoundingClientRect();
  const { top, bottom } = rect;
  const windowHeight = window.innerHeight;
  if (bottom < windowHeight / 3) {
    updateNavigation(currentSlide + 1, currentSlide, false);
  } else if (top > windowHeight / 3) {
    updateNavigation(currentSlide - 1, currentSlide, false);
  }
};

const navigationWheelHandler = e => {
  if (overlayEnabled || mobile) {
    return;
  }
  const currentTime = performance.now();
  const diff = currentTime - lastWheel;
  lastWheel = currentTime;
  if (diff < 40) {
    return;
  }
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
  updateNavigation(initialSlide, currentSlide, true, false);
}

export default function navigationMagic() {
  updateGlobalShareLinks();
  injectLinksAndAddSideBar();
  injectTopAndBottomButtons();
  parseAndLoadSlide();
  document.addEventListener('mousemove', navigationInactivityFadeHandler, false);
  document.addEventListener('keydown', navigationKeydownHandler, false);
  document.addEventListener('wheel', navigationWheelHandler, false);
  window.addEventListener('scroll', mobileScrollHandler, false);
}
