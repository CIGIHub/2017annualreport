import {
  generateFacebookShareLink,
  generateTwitterShareLink,
  createDiv,
  createEl,
  closeSvg,
} from './helpers';

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
const header = document.getElementById('site-header');
const landingUpArrow = document.getElementsByClassName('explore')[0];
const landingDownArrow = document.getElementsByClassName('view-ar')[0];
const mobileTimelineDownArrow = document.getElementsByClassName('view-ar-mobile')[0];
const presidentsMessageLink = document.querySelector("[data-id='tab-1']");
const chairsMessageLink = document.querySelector("[data-id='tab-2']");
const chairSlide = 2;

const smoothSlideContainer = document.getElementById('smooth-slide-container');
export const sections = Array.from(document.getElementsByTagName('section'));
export const numberOfSections = sections.length;
const slideNumToBackgroundVideo = new Array(numberOfSections);

export let mobile = false;

function updateGlobalShareLinks() {
  const encodedURL = encodeURIComponent(location.href);
  const encodedTitle = 'CIGI+Annual+Report+2017';
  //globalShareFacebook.setAttribute('href', 'https://developers.facebook.com/docs/sharing/reference/share-dialog');
  globalShareTwitter.setAttribute('href', generateTwitterShareLink(encodedURL, encodedTitle));
}

function fadeOutNavigationComponent(component) {
  component.style.opacity = '0';
  component.style.pointerEvents = 'none';
}

function fadeInNavigationComponent(component) {
  component.style.opacity = '';
  component.style.pointerEvents = '';
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

function updateNavigation(newIndex, oldIndex, { slide =  true, transition =  true, e = null } = {}) {
  if (overlayEnabled || isDesktopScrolling) {
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
    const playPromise = newVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }
  if (!mobile) {
    isDesktopScrolling = true;
    setTimeout(() => {
      isDesktopScrolling = false;
    }, slideTransitionMs);
  }
  oldButton.classList.remove('active');
  newButton.classList.add('active');
  changeSlideInUrl(newIndex);
  if (slide) scrollViewToSlideIndex(newIndex, transition);
  currentSlide = newIndex;
  updateGlobalShareLinks();
  handleNavigationFade();
  setNavigationFadeTimemout(e);
}

function setNavigationFadeTimemout(e) {
  if (fadeTimeoutSet) {
    clearTimeout(fadeTimeout);
  }
  fadeTimeout = setTimeout(() => {
    if (e) {
      const cursorOnNavigation = Array.prototype.some.call([sidebar], child => child.contains(e.target));
      if (cursorOnNavigation) {
        return;
      }
    }
    fadeOutNavigationComponent(sidebar);
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

landingUpArrow.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(0, currentSlide);
};

viewARLink.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(2, currentSlide);
};

landingDownArrow.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(2, currentSlide);
};

mobileTimelineDownArrow.onclick = (e) => {
  e.stopPropagation();
  updateNavigation(2, currentSlide);
};

function fadeOutAllNavigationComponents() {
  fadeOutNavigationComponent(sidebar);
  fadeOutNavigationComponent(topButton);
  fadeOutNavigationComponent(bottomButton);
}

function handleNavigationFade() {
  fadeInNavigationComponent(sidebar);
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
    if (!mobile) {
      header.classList.add('white');
      sidebar.classList.add('white');
    }
  }
  else {
    if (!mobile) {
      header.classList.remove('white');
      sidebar.classList.remove('white');
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
    smoothSlideContainer.style.transform = 'translateY(-' + 100 * newIndex + 'vh)';
  });
  setTimeout(() => {
    smoothSlideContainer.style.transition = '';
    if (newIndex === 0) {
      smoothSlideContainer.style.transform = 'none';
    }
  }, slideTransitionMs);
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
    button.onclick = e => {
      if (currentSlide !== currentIndex) {
        updateNavigation(currentIndex, currentSlide, { e });
      }
    };
    const tooltip = createDiv('sidebar-tooltip mr2 ph2 pv1 br2');
    tooltip.innerText = i === chairSlide ? subsection : slideName;
    button.appendChild(tooltip);
    sidebar.appendChild(button);
    buttons[i] = button;
  }

  buttons[currentSlide].classList.add('active');
  const tableOfContentsDesktop = createDiv('pt6 pb4 fixed vh-100 w-100 bg-black-90 left-0 top-0 z-7');
  const tableOfContentsMobile = createDiv('toc-mobile-wrapper z-7');
  const tableOfContentsWrapper = createDiv('z-7');
  tableOfContentsWrapper.appendChild(tableOfContentsDesktop);

  function mobileScroll() {
    window.onscroll = null;
    smoothSlideContainer.style.transform = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }

  function desktopScroll() {
    window.onscroll = () => window.scrollTo(0, 0);
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }
  desktopScroll();

  const handleWidth = () => {
    if (window.innerWidth < 480 || window.innerHeight < 480) {
      if (!mobile) {
        toggleTocEl();
        mobileScroll();
        scrollViewToSlideIndex(currentSlide);
        if (tocOpen) {
          header.style.background = 'black';
        }
        if (currentSlide === 1 && !tocOpen) {
          header.classList.remove('white');
        }
      }
    }
    else {
      if (mobile) {
        toggleTocEl();
        desktopScroll();
        scrollViewToSlideIndex(currentSlide, false);
        if (tocOpen) {
          header.style.background = '';
        }
        if (currentSlide === 1) {
          header.classList.add('white');
        }
      }
    }
  };

  const toggleTocEl = () => {
    mobile = !mobile;
    if (mobile) {
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
      header.classList.add('white');
      if (mobile) {
        header.style.background = 'black';
      }
    } else {
      tocIcon.innerHTML = '';
      tocIcon.className = tocIconOpen;
      tableOfContentsWrapper.remove();
      header.classList.remove('white');
      if (mobile) {
        header.style.background = '';
      }
      disableOverlay();
    }
  };
  tableOfContentsButton.onclick = toggleTocOpen;

  document.body.appendChild(sidebar);

  function tocDesktop() {
    const container = createDiv('tr h-100 overflow-auto wrapper');
    const h1 = createEl('h1', 'ttu accent-color fw5 f4 tracked lh-title mb2 mb3-ns db-ns dn');
    let tocItemCounter = 0;
    h1.innerText = 'Table of Contents';
    container.appendChild(h1);
    const div = createDiv('flex flex-row justify-end flex-wrap');
    for (const [subsection, content] of subsections) {
      const wrapper = createEl('li', 'list ph3 toc-flex-item order-' + tocItemCounter);
      tocItemCounter++;
      const h2 = createEl('h2', 'accent-color partial-underline-right f4 fw3 mt3 smooth');
      h2.innerText = subsection;
      wrapper.appendChild(h2);
      const ul = content.reduce((acc, slide) => {
        const liClassName = 'dib pointer white f6 fw3 mt2 underline-hover list smooth';
        if (slide.slideNum === chairSlide) {
          const presidentLi = createEl('li', liClassName);
          presidentLi.innerText = "Chair's Message";
          presidentLi.onclick = () => {
            toggleTocOpen();
            if (slide.slideNum !== currentSlide) {
              updateNavigation(slide.slideNum, currentSlide);
            }
            presidentsMessageLink.click();
          };
          acc.appendChild(presidentLi);
          acc.appendChild(createEl('br'));

          const chairLi = createEl('li', liClassName);
          chairLi.innerText = "President's Message";
          chairLi.onclick = () => {
            toggleTocOpen();
              if (slide.slideNum !== currentSlide) {
                updateNavigation(slide.slideNum, currentSlide);
              }
            chairsMessageLink.click();
          };
          acc.appendChild(chairLi);
          acc.appendChild(createEl('br'));
        } else {
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
      if (i === chairSlide) {
        const presidentLi = createEl('li', 'pointer');
        presidentLi.innerText = "Chair's Message";
        presidentLi.onclick = () => {
          toggleTocOpen();
          updateNavigation(i, currentSlide);
          window.scrollBy(0,-40); // clear the top nav
          presidentsMessageLink.click();
        };
        ul.appendChild(presidentLi);

        const chairLi = createEl('li', 'pointer');
        chairLi.innerText = "President's Message";
        chairLi.onclick = () => {
          toggleTocOpen();
          updateNavigation(i, currentSlide);
          document.getElementById("presidents-message").scrollIntoView();
          window.scrollBy(0,-40); // clear the top nav
          chairsMessageLink.click();
        };
        ul.appendChild(chairLi);
      } else {
        const li = createEl('li', 'pointer');
        li.innerText = slideName;
        li.onclick = () => {
          toggleTocOpen();
          updateNavigation(i, currentSlide);
          window.scrollBy(0,-40); // clear the top nav
        };
        ul.appendChild(li);
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
  topButton.onclick = e => {
    updateNavigation(currentSlide - 1, currentSlide, { e });
  };
  bottomButton.onclick = e => {
    updateNavigation(currentSlide + 1, currentSlide, { e });
  };
}

const navigationInactivityFadeHandler = e => {
  if (overlayEnabled || mobile) {
    return;
  }
  clearTimeout(fadeTimeout);
  fadeInNavigationComponent(sidebar);
  handleNavigationFade();
  setNavigationFadeTimemout(e);
};

const navigationKeydownHandler = e => {
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
};

const mobileScrollHandler = () => {
  if (!mobile) {
    return;
  }
  const rect = sections[currentSlide].getBoundingClientRect();
  const { top, bottom } = rect;
  const windowHeight = window.innerHeight;
  if (bottom < windowHeight / 3) {
    updateNavigation(currentSlide + 1, currentSlide, { slide: false });
  } else if (top > windowHeight / 3) {
    updateNavigation(currentSlide - 1, currentSlide, { slide: false });
  }
};

const navigationWheelHandler = e => {
  if (mobile) {
    return;
  }
  const currentTime = e.timeStamp;
  const diff = currentTime - lastWheel;
  lastWheel = currentTime;
  if (diff < 55) {
    return;
  }
  if (e.deltaY > 0) {
    updateNavigation(currentSlide + 1, currentSlide);
  } else {
    updateNavigation(currentSlide - 1, currentSlide);
  }
};

export function loadInitialSlide(initialSlide) {
  updateNavigation(initialSlide, currentSlide, { transition: false });
}

let touchXStart;
let touchOffset = 0;
let touchCancel = false;
const touchThreshold = 75;
const navigationTouchStart = e => {
  if (mobile) return;
  navigationInactivityFadeHandler(e);
  if (e.touches.length > 1) {
    touchCancel = true;
    return;
  }
  touchCancel = false;
  touchXStart = e.touches[0].clientY;
};

const navigationTouchMove = e => {
  if (mobile || touchCancel) return;
  touchOffset = e.touches[0].clientY - touchXStart;
  if (touchOffset > touchThreshold) {
    touchOffset = 0;
    touchCancel = true;
    updateNavigation(currentSlide - 1, currentSlide);
  } else if (touchOffset < -touchThreshold) {
    touchOffset = 0;
    touchCancel = true;
    updateNavigation(currentSlide + 1, currentSlide);
  }
};

const navigationTouchEnd = () => {
  if (mobile || touchCancel) return;
  if (touchCancel) {
    touchCancel = false;
    return;
  }
  if (touchOffset > touchThreshold) {
    touchOffset = 0;
    updateNavigation(currentSlide - 1, currentSlide);
  } else if (touchOffset < -touchThreshold) {
    touchOffset = 0;
    updateNavigation(currentSlide + 1, currentSlide);
  }
};

export default function navigationMagic() {
  updateGlobalShareLinks();
  injectLinksAndAddSideBar();
  injectTopAndBottomButtons();
  parseAndLoadSlide();
  setNavigationFadeTimemout();
  document.addEventListener('mousemove', navigationInactivityFadeHandler, false);
  document.addEventListener('keydown', navigationKeydownHandler, false);
  document.addEventListener('wheel', navigationWheelHandler, false);
  document.addEventListener('touchstart', navigationTouchStart, false);
  document.addEventListener('touchmove', navigationTouchMove, false);
  document.addEventListener('touchend', navigationTouchEnd, false);
  window.addEventListener('scroll', mobileScrollHandler, false);
}
