'use strict';

const changeSlideInUrl = id => history.replaceState('', '', '#/?slide=' + id);
const globalShareFacebook = document.getElementById('global-share-facebook');
const globalShareTwitter = document.getElementById('global-share-twitter');
const tableOfContentsButton = document.getElementById('table-of-contents-button');
const cigiLogo = document.getElementById('cigi-logo');

navigationMagic();

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
function navigationMagic() {
  // hacky onscroll to aid with the scroll-jacking
  // scroll back to top when something like Find (Ctrl + F) triggers a scroll when not intended
  window.onscroll = () => window.scrollTo(0, 0);
  const inactivityMilliseconds = 1500;
  let topButton;
  let bottomButton;
  let sidebar;
  let currentSlide;
  updateGlobalShareLinks();
  const expandedViewEnabled = () => document.body.classList.contains('expanded-view-enabled');
  function fadeOutAllNavigationComponents() {
    fadeOutNavigationComponent(sidebar);
    fadeOutNavigationComponent(topButton);
    fadeOutNavigationComponent(bottomButton);
  }
  function handleNavigationButtonsFade() {
    if (currentSlide === 0) {
      fadeOutNavigationComponent(topButton);
    } else {
      fadeInNavigationComponent(topButton);
    }
    if (currentSlide === numberOfSections - 1) {
      fadeOutNavigationComponent(bottomButton);
    } else {
      fadeInNavigationComponent(bottomButton);
    }
  }
  const smoothSlideContainer = document.getElementsByClassName('smooth-slide-container')[0];
  function scrollViewToSlideIndex(slide) {
    if (slide === 0) {
      smoothSlideContainer.style.transform = null;
    } else {
      smoothSlideContainer.style.transform = 'translateY(-' + 100 * slide + 'vh)';
    }
  }
  const sections = document.getElementsByTagName('section');
  const numberOfSections = sections.length;
  const buttons = new Array(numberOfSections);
  const rawInitialSlide = location.hash.split('#/?slide=')[1];
  if (rawInitialSlide === undefined) {
    currentSlide = 0;
  } else {
    const parsedInitialSlide = parseInt(rawInitialSlide, 10);
    if (parsedInitialSlide < 0 || parsedInitialSlide >= buttons.length) {
      currentSlide = 0;
    } else {
      currentSlide = parsedInitialSlide;
      scrollViewToSlideIndex(currentSlide);
    }
  }
  let isScrolling = false;
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
    const slideTransitionHandler = e => {
      if (e.target === smoothSlideContainer) {
        isScrolling = false;
        smoothSlideContainer.removeEventListener('transitionend', slideTransitionHandler, false);
      }
    };
    smoothSlideContainer.addEventListener('transitionend', slideTransitionHandler, false);
    newButton.classList.add('active');
    oldButton.classList.remove('active');
    changeSlideInUrl(newIndex);
    updateGlobalShareLinks();
    scrollViewToSlideIndex(newIndex);
    currentSlide = newIndex;

    handleNavigationButtonsFade();
  }
  let tableOfContents;
  let tocOpen = false;
  function injectLinksAndAddSideBar() {
    sidebar = createDiv('fixed sidebar');
    const subsections = new Map();
    for (let i = 0; i < numberOfSections; i++) {
      // now create a corresponding button on the sidebar
      const button = createDiv('sidebar-button');
      const currentIndex = i;
      button.onclick = () => {
        if (currentSlide !== currentIndex) {
          updateNavigation(currentIndex, currentSlide);
        }
      };
      sidebar.appendChild(button);
      buttons[i] = button;
      // and add entry to table of contents
      const section = sections[i];
      const h3s = section.getElementsByTagName('h3');
      const subsection = h3s.length && h3s[0].innerHTML || 'Explore CIGI';
      const content = subsections.get(subsection);
      if (content === undefined) {
        subsections.set(subsection, [{
          title: section.getElementsByTagName('h1')[0].innerHTML,
          slidenum: i,
        }]);
      } else {
        content.push({
          title: section.getElementsByTagName('h1')[0].innerHTML,
          slidenum: i,
        });
      }
    }
    buttons[currentSlide].classList.add('active');
    tableOfContents = createDiv('pt5 pt6-ns fixed vh-100 w-100 bg-black-90 z-7 left-0 top-0');
    const tocIconOpen = 'fa fa-navicon';
    const tocIcon = createEl('i', tocIconOpen);
    tableOfContentsButton.appendChild(tocIcon);
    const toggleToc = () => {
      tocOpen = !tocOpen;
      if (tocOpen) {
        fadeOutAllNavigationComponents();
        tocIcon.className = '';
        tocIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g stroke-width="12" stroke="white">
<line x1="0" y1="100" x2="100" y2="0">
</line>
<line x1="0" y1="0" x2="100" y2="100">
</line>
</g>
</svg>`;
        document.body.appendChild(tableOfContents);
        cigiLogo.style.filter = 'invert(100%)';
        [globalShareFacebook, globalShareTwitter].forEach(el => { el.style.color = 'white'; });
      } else {
        tocIcon.innerHTML = '';
        tocIcon.className = tocIconOpen;
        tableOfContents.remove();
        cigiLogo.style.filter = null;
        [globalShareFacebook, globalShareTwitter].forEach(el => { el.style.color = null; });
      }
    };
    tableOfContentsButton.onclick = toggleToc;
    document.body.appendChild(sidebar);
    const container = createDiv('tr h-100 overflow-auto wrapper');
    const h1 = createEl('h1', 'ttu accent-color fw5 f4 tracked lh-title mb2 mb4-ns');
    h1.innerText = 'Table of Contents';
    container.appendChild(h1);
    const div = createDiv('');
    for (const [subsection, content] of subsections) {
      const h2 = createEl('h2', 'accent-color partial-underline-right f4 fw3 mt3 smooth');
      h2.innerText = subsection;
      div.appendChild(h2);
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
      div.appendChild(ul);
    }
    container.appendChild(div);
    tableOfContents.appendChild(container);
  }
  injectLinksAndAddSideBar();

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
  injectTopAndBottomButtons();

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
  let fadeTimeoutSet = false;
  let fadeTimeout;

  const navigationInactivityFadeHandler = e => {
    if (tocOpen || expandedViewEnabled()) {
      return;
    }
    clearTimeout(fadeTimeout);
    fadeInNavigationComponent(sidebar);
    handleNavigationButtonsFade();
    setMousemoveFadeTimemout(e);
  };
  const navigationKeydownHandler = e => {
    if (tocOpen || expandedViewEnabled()) {
      return;
    }
    fadeInNavigationComponent(sidebar);
    handleNavigationButtonsFade();
    switch(e.key) {
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
  const navigationWheelHandler = e => {
    if (tocOpen || expandedViewEnabled()) {
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
  document.addEventListener('mousemove', navigationInactivityFadeHandler, false);
  document.addEventListener('keydown', navigationKeydownHandler, false);
  document.addEventListener('wheel', navigationWheelHandler, false);
}
