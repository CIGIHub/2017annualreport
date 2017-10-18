import {
  createDiv,
  closeSvg,
  nextTick,
  mountElementsInArrayIntoParent,
  mountElementsInArrayIntoParentInOrder,
  createSvgEl,
  addClassToElementsInArray,
  removeClassFromElementsInArray,
  unmountElementsInArray,
  createEl,
  generateFacebookShareLink,
  generateTwitterShareLink,
} from './helpers';

import {
  resetProgramViewInUrl,
  changeArticleIdInUrl,
  setResearchFiltersInUrl,
  resetResearchFiltersInUrl,
  resetArticleIdInUrl,
  handlePermalink,
  setProgramViewInUrl,
  setContentTypeInUrl,
  resetContentTypeInUrl,
} from './permalink';

import {
  icons,
  monthNames,
} from './constants';


// DOM elements
const timelineRoot = document.getElementById('timeline-root');
const timelineFlexWrapper = timelineRoot.parentElement;
const timelineSection = document.getElementsByTagName('section')[0];


const baseUrl = location.pathname;
export let setReseachAreaFilters = [];
// Timeline Helper Functions
import {
  sinFuncWithAmplitudeWaveNumberAndYOffset,
  mapTimestampToZeroToOne,
  calculateLinePositions,
} from './helpers/timeline';

// Timeline constants

import {
  defautlLineTemplates,
  monthlyViewLineTemplates,
  researchTypeFilters,
  programViews,
  programTypes,
} from './constants/timeline';

const programTypesLength = programTypes.length;

const dataPointDiameter = 6;
const timelineMaskMilliseconds = 2000;
const amplitude = 90;
const delay = 500;
const spacingFactor = 1.2;
let mainTimeline;

export function changeExpandedViewArticle(newItem, direction) {
  if (inTransition) {
    return;
  }
  inTransition = true;
  if (!mountedExpandedViewContainer) {
    mountedExpandedViewContainer = generateExpandedViewContainer();
  }
  if (mountedExpandedViewContainer.parentElement === null) {
    mountExpandedViewContainer(mountedExpandedViewContainer);
  }
  clearMountedPoint();
  itemIdToDataPointCircles[newItem.id][0].parentElement.parentElement.classList.add('data-point-enabled');
  changeArticleIdInUrl(newItem.id);
  const articleGroup = cachedArticleGroupByArticleI[newItem.i] || createArticleGroup(newItem);
  toggleFadeToWhiteLayer(newItem);
  mountElementsInArrayIntoParent(mountedExpandedViewContainer, articleGroup);

  if (!direction) {
    mountedArticleGroup = articleGroup;
    inTransition = false;
  } else if (direction === 'left') {
    addClassToElementsInArray(articleGroup, 'slide-in-from-left');
    addClassToElementsInArray(mountedArticleGroup, 'slide-out-to-right');
    const animationEndHandler = () => {
      toggleFadeToWhiteLayer(newItem);
      removeClassFromElementsInArray(articleGroup, 'slide-in-from-left');
      removeClassFromElementsInArray(mountedArticleGroup, 'slide-out-to-right');
      unmountElementsInArray(mountedArticleGroup);
      mountedArticleGroup = articleGroup;
      inTransition = false;
      articleGroup[0].removeEventListener('animationend', animationEndHandler, false);
    };
    articleGroup[0].addEventListener('animationend', animationEndHandler, false);
  } else if (direction === 'right') {
    addClassToElementsInArray(articleGroup, 'slide-in-from-right');
    addClassToElementsInArray(mountedArticleGroup, 'slide-out-to-left');
    const animationEndHandler = () => {
      toggleFadeToWhiteLayer(newItem);
      removeClassFromElementsInArray(articleGroup, 'slide-in-from-right');
      removeClassFromElementsInArray(mountedArticleGroup, 'slide-out-to-left');
      unmountElementsInArray(mountedArticleGroup);
      mountedArticleGroup = articleGroup;
      inTransition = false;
      articleGroup[0].removeEventListener('animationend', animationEndHandler, false);
    };
    articleGroup[0].addEventListener('animationend', animationEndHandler, false);
  }
  mountedItem = newItem;
}

const width = timelineRoot.clientWidth;
const waveNumber = 2 * Math.PI / width;
let height = 2 * amplitude;
const sinFunc = sinFuncWithAmplitudeWaveNumberAndYOffset(amplitude, waveNumber, amplitude);

const selectOptionToCheckboxAndX = new Map();
export const contentTypeToRadioBox = {};
const isSelectOptionSelected = new Set();
let clearButton;

function resetDataPoints() {
  let i = dataByTimeAll.length;
  while (i-- > 0) {
    const item = dataByTimeAll[i];
    item.researchAreaDeselected = false;
    const dataPointCircles = itemIdToDataPointCircles[item.id];
    let _i = dataPointCircles.length;
    while (_i-- > 0) {
      const dataPointCircle = dataPointCircles[_i];
      dataPointCircle.parentElement.style.display = null;
      dataPointCircle.style.fill = null;
      dataPointCircle.style.pointerEvents = null;
    }
  }
}

function clearFilters() {
  clearButton.style.display = 'none';
  clearContentTypeFilter();
  resetResearchFiltersInUrl();
  resetDataPoints();
  for (const [selectOption, [checkbox, x]] of selectOptionToCheckboxAndX) {
    if (selectOption.style.color) {
      clearSelectOption(selectOption, checkbox, x);
    }
  }
  setReseachAreaFilters = [];
}

function clearSelectOption(selectOption, checkbox, x) {
  isSelectOptionSelected.delete(selectOption);
  checkbox.style.border = null;
  checkbox.style.background = null;
  checkbox.removeChild(x);
  selectOption.style.color = null;
}

function setSelectOptionColor(selectOption, checkbox, x, color) {
  isSelectOptionSelected.add(selectOption);
  checkbox.style.border = '1px solid ' + color;
  checkbox.style.background = color;
  checkbox.appendChild(x);
  selectOption.style.color = color;
}

const programSelectContainer = createDiv('select-container w4 ma1 pv1 ph1 fw5 f6 grey relative ttu');
const contentSelectContainer = createDiv('select-container w12rem ma1 pv1 ph1 fw5 f6 grey relative ttu');

function disableProgramSelectContainer() {
  programSelectContainer.style.visibility = 'hidden';
}

function reenableProgramSelectContainer() {
  programSelectContainer.style.visibility = null;
}

let programViewCombined = true;
let programViewIdle = true;
const programViewRadioBoxes = new Array(2);
export let selectedContentType = null;
let selectedContentTypeRadioBox = null;
const programViewTransitionMs = 1000;
const programViewTransition = `all ${programViewTransitionMs}ms ease`;
function clearContentTypeFilter() {
  resetContentTypeInUrl();
  if (selectedContentType !== null) {
    selectedContentTypeRadioBox.classList.remove('active');
    selectedContentType = null;
    selectedContentTypeRadioBox = null;
  }

  let i = dataByTimeAll.length;
  while (i-- > 0) {
    const item = dataByTimeAll[i];
    if (item.contentTypeDeselected) {
      item.contentTypeDeselected = false;
      const dataPointCircles = itemIdToDataPointCircles[item.id];
      let j = dataPointCircles.length;
      while (j-- > 0) {
        const dataPointCircle = dataPointCircles[j];
        dataPointCircle.parentElement.style.visibility = null;
      }
    }
  }
}

export function filterByContentType(radioBox, type) {
  if (selectedContentType === type) {
    clearContentTypeFilter();
    if (setReseachAreaFilters.length === 0) {
      clearButton.style.display = 'none';
    }
  } else {
    clearButton.style.display = null;
    radioBox.classList.add('active');
    if (selectedContentTypeRadioBox) selectedContentTypeRadioBox.classList.remove('active');
    selectedContentType = type;
    setContentTypeInUrl();
    selectedContentTypeRadioBox = radioBox;

    let i = dataByTimeAll.length;
    while (i-- > 0) {
      const item = dataByTimeAll[i];
      if (item.contentTypeDeselected && item.subtype[0] === type) {
        item.contentTypeDeselected = false;

        const dataPointCircles = itemIdToDataPointCircles[item.id];
        let j = dataPointCircles.length;
        while (j-- > 0) {
          const dataPointCircle = dataPointCircles[j];
          dataPointCircle.parentElement.style.visibility = null;
        }
      } else if (!item.contentTypeDeselected && item.subtype[0] !== type) {
        item.contentTypeDeselected = true;

        const dataPointCircles = itemIdToDataPointCircles[item.id];
        let j = dataPointCircles.length;
        while (j-- > 0) {
          const dataPointCircle = dataPointCircles[j];
          dataPointCircle.parentElement.style.visibility = 'hidden';
        }
      }
    }
  }
}

export function showProgramView(callback) {
  if (programViewCombined && programViewIdle) {
    setProgramViewInUrl();
    programViewIdle = false;
    programViewCombined = false;
    timelineSqueezeStop();

    programViewRadioBoxes[0].classList.remove('active');
    programViewRadioBoxes[1].classList.add('active');

    userHint1.style.display = null;
    userHint2.style.display = 'none';
    userHintHover.classList.add('fade-in-1');
    userHintClick.style.display = 'block';
    userHintClick.classList.add('fade-in-1');
    userHintZoomIn.classList.remove('fade-in-1');
    userHintZoomIn.classList.remove('fade-in-2');
    userHintZoomIn.style.display = 'none';
    userHintZoomOut.classList.remove('fade-in-1');
    userHintGrab.classList.remove('fade-in-2');

    mainTimeline.style.transition = programViewTransition;
    mainTimeline.style.zIndex = null;
    let i = programTypesLength;
    while (i-- > 0) {
      const timeline = programViewTimelines[i];
      timeline.style.display = 'block';
      timeline.style.transition = programViewTransition;
      timeline.style.zIndex = '1';
    }
    requestAnimationFrame(() => {
      mainTimeline.style.opacity = '0';
      mainTimeline.style.height = '70px';
      i = programTypesLength;
      const containerHeight = timelineFlexWrapper.clientHeight;
      while (i-- > 0) {
        const timeline = programViewTimelines[i];
        timeline.style.opacity = null;
        timeline.style.transform = `translateY(${containerHeight / (programTypesLength + 1.25) * (i + 1) - containerHeight / 2}px)`;
        timeline.style.height = '70px';
      }
    });

    setTimeout(() => {
      mainTimeline.style.display = 'none';
      programViewIdle = true;
      if (typeof (callback) === 'function') {
        callback();
      }
    }, programViewTransitionMs);

    timelineFlexWrapper.removeEventListener('dblclick', timelineDoubleClickEventHandler, false);
  }
}

function combineProgramView(callback) {
  if (!programViewCombined && programViewIdle) {
    resetProgramViewInUrl();
    programViewIdle = false;
    programViewCombined = true;

    programViewRadioBoxes[0].classList.add('active');
    programViewRadioBoxes[1].classList.remove('active');

    userHint1.style.display = null;
    userHint2.style.display = 'none';
    userHintClick.style.display = null;
    userHintClick.classList.remove('fade-in-1');
    userHintHover.classList.add('fade-in-1');
    userHintZoomIn.style.display = null;
    userHintZoomIn.classList.add('fade-in-1');
    userHintZoomOut.classList.remove('fade-in-1');
    userHintGrab.classList.remove('fade-in-2');

    mainTimeline.style.zIndex = '2';
    mainTimeline.style.transition = programViewTransition;
    mainTimeline.style.display = null;
    let i = programTypesLength;
    while (i-- > 0) {
      const timeline = programViewTimelines[i];
      timeline.style.transition = programViewTransition;
      timeline.style.opacity = '0';
      timeline.style.transform = null;
    }
    requestAnimationFrame(() => {
      mainTimeline.style.opacity = null;
      mainTimeline.style.height = 2 * amplitude + 'px';
      i = programTypesLength;
      while (i-- > 0) {
        const timeline = programViewTimelines[i];
        timeline.style.height = 2 * amplitude + 'px';
      }
    });

    setTimeout(() => {
      timelineSqueezeStart();
      i = programTypesLength;
      while (i-- > 0) {
        const timeline = programViewTimelines[i];
        timeline.style.pointerEvents = null;
      }
      programViewIdle = true;
      if (typeof (callback) === 'function') {
        callback();
      }
    }, programViewTransitionMs);
    timelineFlexWrapper.addEventListener('dblclick', timelineDoubleClickEventHandler, false);
  }
}

export const toggleSelectOptions = (filterId) => () => {
  const filter = researchTypeFilters.types[filterId];
  const { selectOption } = filter;
  const [ checkbox, x ] = selectOptionToCheckboxAndX.get(selectOption);
  if (isSelectOptionSelected.has(selectOption)) {
    // if the option is selected then we need to unselect it
    clearSelectOption(selectOption, checkbox, x);
    if (setReseachAreaFilters.length === 1) {
      // if it's the last filter left then reset everything back to normal
      resetDataPoints();
      resetResearchFiltersInUrl();
      if (selectedContentType === null) {
        clearButton.style.display = 'none';
      }
      setReseachAreaFilters.pop();
    } else {
      let j = dataByTimeAll.length;
      while (j-- > 0) {
        const item = dataByTimeAll[j];
        if (!item.researchAreaDeselected && item.research_areas.includes(filter.name)) {
          // if the dataPoint is not grayed out and it falls under the filter
          // then remove the filter and set it to the most recently checked matching filter's color
          let _i = setReseachAreaFilters.length;
          while (_i-- > 0) {
            if (setReseachAreaFilters[_i] === filterId) {
              setReseachAreaFilters.splice(_i, 1);
              setResearchFiltersInUrl();
              break;
            }
          }
          const dataPointCircles = itemIdToDataPointCircles[item.id];
          const dataPointCirclesLength = dataPointCircles.length;
          let fail = true;
          _i = setReseachAreaFilters.length;
          let _j;
          while (_i-- > 0) {
            const mostRecentFilter = researchTypeFilters.types[setReseachAreaFilters[_i]];

            if (item.research_areas.includes(mostRecentFilter.name)) {
              _j = dataPointCirclesLength;
              while (_j-- > 0) {
                const dataPointCircle = dataPointCircles[_j];
                dataPointCircle.parentElement.style.display = null;
                dataPointCircle.style.fill = mostRecentFilter.color;
              }
              fail = false;
              break;
            }
          }
          if (fail) {
            // none of the current filters match
            item.researchAreaDeselected = true;
            _j = dataPointCirclesLength;
            while (_j-- > 0) {
              const dataPointCircle = dataPointCircles[_j];
              dataPointCircle.parentElement.style.display = 'none';
              dataPointCircle.style.fill = null;
            }
          }
        }
      }
    }
  } else {
    // else we select it
    setSelectOptionColor(selectOption, checkbox, x, filter.color);
    let _i = dataByTimeAll.length;
    if (setReseachAreaFilters.length === 0) {
      clearButton.style.display = null;
      while (_i-- > 0) {
        const item = dataByTimeAll[_i];
        const dataPointCircles = itemIdToDataPointCircles[item.id];
        let _j = dataPointCircles.length;
        if (item.research_areas.includes(filter.name)) {
          while (_j-- > 0) {
            const dataPointCircle = dataPointCircles[_j];
            dataPointCircle.style.fill = filter.color;
            dataPointCircle.parentElement.style.display = null;
          }
        } else {
          item.researchAreaDeselected = true;
          while (_j-- > 0) {
            const dataPointCircle = dataPointCircles[_j];
            dataPointCircle.parentElement.style.display = 'none';
            dataPointCircle.style.fill = null;
          }
        }
      }
    } else {
      while (_i-- > 0) {
        const item = dataByTimeAll[_i];
        const dataPointCircles = itemIdToDataPointCircles[item.id];
        if (item.researchAreaDeselected && item.research_areas.includes(filter.name)) {
          item.researchAreaDeselected = false;
          let _j = dataPointCircles.length;
          while (_j-- > 0) {
            const dataPointCircle = dataPointCircles[_j];
            dataPointCircle.parentElement.style.display = null;
            dataPointCircle.style.fill = filter.color;
          }
        }
      }
    }
    setReseachAreaFilters.push(filterId);
    setResearchFiltersInUrl();
  }
};

function generateFilters() {
  const generatedfilters = new Array(4);
  // research types
  const researchSelectContent = createDiv('select-content w-100');
  const researchTypes = researchTypeFilters.types;
  const researchTypesLength = researchTypes.length;
  for (let i = 0; i < researchTypesLength; i++) {
    const filter = researchTypes[i];
    const selectOption = createDiv('select-option flex items-center pv125 hover-bg-black-10');
    filter.selectOption = selectOption;
    const checkbox = createDiv('select-checkbox ml1 mr2 relative');
    const x = createDiv('absolute');
    x.style.fontSize = '1rem';
    x.innerText = '×';
    x.style.top = '50%';
    x.style.left = '50%';
    x.style.transform = 'translate(-50%, -50%)';
    selectOptionToCheckboxAndX.set(selectOption, [checkbox, x]);

    selectOption.onclick = toggleSelectOptions(i);
    selectOption.appendChild(checkbox);
    selectOption.appendChild(document.createTextNode(filter.name));
    researchSelectContent.appendChild(selectOption);
  }
  const researchSelectContainer = createDiv('select-container w6 ma1 pv1 ph1 fw5 f6 grey relative ttu');
  const researchSelectToggler = createDiv('select-toggler');
  researchSelectToggler.innerText = researchTypeFilters.label;
  const chevronDown = '<span class="f5 pl1 pr2"><i class="fa fa-angle-down"></i></span>';
  const chevronUp = '<span class="f5 pl1 pr2"><i class="fa fa-angle-up"></i></span>';
  researchSelectToggler.innerHTML = chevronUp + researchTypeFilters.label;
  researchSelectContainer.onmouseenter = () => {
    researchSelectToggler.innerHTML = chevronDown + researchTypeFilters.label;
  };
  researchSelectContainer.onmouseleave = () => {
    researchSelectToggler.innerHTML = chevronUp + researchTypeFilters.label;
  };
  researchSelectContainer.appendChild(researchSelectContent);
  researchSelectContainer.appendChild(researchSelectToggler);
  generatedfilters[0] = researchSelectContainer;
  // content types
  const contentTypeSelectContent = createDiv('select-content w-100');

  const contentTypeFilters = dataByTimeAll.reduce((set, item) => {
    set.add(item.subtype[0]);
    return set;
  }, new Set());

  for (const contentType of contentTypeFilters) {
    const selectOption = createDiv('select-option flex items-center pv125 hover-bg-black-10');
    const radioBox = createDiv('select-radio ml1 mr2 relative');
    contentTypeToRadioBox[contentType] = radioBox;
    selectOption.onclick = () => { filterByContentType(radioBox, contentType); };
    selectOption.appendChild(radioBox);
    selectOption.appendChild(document.createTextNode(contentType));
    contentTypeSelectContent.appendChild(selectOption);
  }
  const label = 'Content Type';
  const contentSelectToggler = createDiv('select-toggler');
  contentSelectToggler.innerHTML = chevronUp + label;
  contentSelectContainer.onmouseenter = () => {
    contentSelectToggler.innerHTML = chevronDown + label;
  };
  contentSelectContainer.onmouseleave = () => {
    contentSelectToggler.innerHTML = chevronUp + label;
  };
  contentSelectContainer.appendChild(contentTypeSelectContent);
  contentSelectContainer.appendChild(contentSelectToggler);
  generatedfilters[1] = contentSelectContainer;

  // program views
  const programSelectContent = createDiv('select-content w-100');

  const programViewFilters = programViews.filters;
  const programViewFiltersLength = programViewFilters.length;
  for (let j = 0; j < programViewFiltersLength; j++) {
    const filter = programViewFilters[j];
    const selectOption = createDiv('select-option flex items-center pv125 hover-bg-black-10');
    const radioBox = createDiv('select-radio ml1 mr2 relative');
    if (filter.selected) {
      radioBox.classList.add('active');
    }
    programViewRadioBoxes[j] = radioBox;
    if (j === 0) {
      // combined
      selectOption.onclick = combineProgramView;
    } else {
      selectOption.onclick = showProgramView;
    }
    selectOption.appendChild(radioBox);
    selectOption.appendChild(document.createTextNode(filter.name));
    programSelectContent.appendChild(selectOption);
  }
  const programSelectToggler = createDiv('select-toggler');
  programSelectToggler.innerHTML = chevronUp + programViews.label;
  programSelectContainer.onmouseenter = () => {
    programSelectToggler.innerHTML = chevronDown + programViews.label;
  };
  programSelectContainer.onmouseleave = () => {
    programSelectToggler.innerHTML = chevronUp + programViews.label;
  };
  programSelectContainer.appendChild(programSelectContent);
  programSelectContainer.appendChild(programSelectToggler);
  generatedfilters[3] = programSelectContainer;

  clearButton = createDiv('select-clear w4 ma1 pv1 ph1 fw5 f6 grey ttu hover-bg-black-10');
  clearButton.style.display = 'none';
  clearButton.innerHTML = `<div class="ml1 mr2">${closeSvg}</div>Clear All`;
  clearButton.onclick = clearFilters;
  generatedfilters[2] = clearButton;
  return generatedfilters;
}

let mountedFilterContainer;
function mountFilters() {
  if (!mountedFilterContainer) {
    const filters = generateFilters();
    mountedFilterContainer = createDiv('flex-ns absolute items-end bottom-0 left-0 right-0 wrapper w-100 pb4-l z-8');
    mountElementsInArrayIntoParentInOrder(mountedFilterContainer, filters);
  }
  timelineSection.appendChild(mountedFilterContainer);
}

const generateTimelineVerticalLines = (lineTemplates, program = false, label = '') => {
  const lineTemplatesLength = lineTemplates.length;
  const generatedLineContainers = new Array(lineTemplatesLength);
  let i = lineTemplatesLength;
  while (i-- > 0) {
    const lineTemplate = lineTemplates[i];
    const lineContainer = createDiv('timeline-vertical-line-container');
    const verticalLine = createDiv('timeline-vertical-line');
    if (lineTemplate.label && !program) {
      const date = createDiv('timeline-date');
      date.innerText = lineTemplate.label;
      lineContainer.appendChild(date);
    } else if (program && i === 0) {
      const title = createDiv('ttu fw6 f6 grey-color user-select-none');
      title.style.transform = 'translateX(50%)';
      title.innerText = label;
      lineContainer.appendChild(title);
    }
    lineContainer.style.left = lineTemplate.position * 100 + '%';
    lineContainer.style.bottom = (1 - sinFunc(lineTemplate.position * width) / amplitude / 2) * 100 + '%';

    lineContainer.appendChild(verticalLine);
    generatedLineContainers[i] = lineContainer;
  }
  return generatedLineContainers;
};

let defaultTimelineVerticalLines;

let lastPointContainer = null;
function clearLastPreview() {
  if (lastPointContainer !== null) {
    lastPointContainer.classList.remove('preview-enabled');
    lastPointContainer = null;
  }
}

let nextSqueeze;
const timelineSqueezeHalfTimePeriodMs = 5000;

let lastBreatheIn = true;
function timelineSqueeze() {
  lastBreatheIn = !lastBreatheIn;
  const hasFocus = document.hasFocus();
  const boundingRect = mainTimeline.getBoundingClientRect();
  if (!hasFocus || boundingRect.top < 0 || boundingRect.bottom > window.innerHeight) return;
  if (lastBreatheIn) {
    mainTimeline.style.height = height + 'px';
  } else {
    mainTimeline.style.height = height * 0.75 + 'px';
  }
}

function timelineSqueezeInit() {
  mainTimeline.style.transition = `height ${timelineSqueezeHalfTimePeriodMs}ms ease-in-out`;
}

function timelineSqueezeStart() {
  timelineSqueezeInit();
  nextTick(timelineSqueeze);
  nextSqueeze = setInterval(timelineSqueeze, timelineSqueezeHalfTimePeriodMs);
}
function timelineSqueezeStop() {
  lastBreatheIn = true;
  clearInterval(nextSqueeze);
}

function generateAndMountTimeline(dataByTime, program = false, label = '') {
  const timeline = createDiv('timeline absolute w-100');
  if (program) {
    timeline.classList.add('program');
  }
  const svg = createSvgEl('svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('class', 'timeline-svg');
  timeline.appendChild(svg);
  const numClusters = 365;
  const clusters = new Array(numClusters);
  let i_ = numClusters;
  while (i_-- > 0) {
    clusters[i_] = [];
  }
  i_ = dataByTime.length;
  while (i_-- > 0) {
    const item = dataByTime[i_];
    if (!program) {
      item.i = i_;
    }
    clusters[~~(mapTimestampToZeroToOne(new Date(item.published_date).valueOf()) * numClusters)].push(item);
  }
  const yPadding = 1;
  setTimeout(() => {
    let previous = amplitude;
    for (let i = 1; i < width; i++) {
      const line = createSvgEl('line');

      line.setAttribute('x1', (i - 1));
      line.setAttribute('y1', previous);

      line.setAttribute('x2', i);
      const current = sinFunc(i);

      line.setAttribute('y2', current);
      previous = current;
      svg.appendChild(line);
    }
    svg.style.transition = 'all ' + timelineMaskMilliseconds + 'ms ' + 'linear';
    setTimeout(() => { svg.parentNode.classList.add('timeline-svg-active'); }, 250);
    const timelineVerticalLines = generateTimelineVerticalLines(defautlLineTemplates, program, label);
    if (!program) {
      defaultTimelineVerticalLines = timelineVerticalLines;
    }
    let i = timelineVerticalLines.length;
    while (i-- > 0) {
      const lineContainer = timelineVerticalLines[i];
      setTimeout(() => {
        if (!timelineZoomed) {
          timeline.appendChild(lineContainer);
        }
      }, i * timelineMaskMilliseconds / (timelineVerticalLines.length - 1));
    }
  }, delay);
  const paddedHeight = height + 2 * yPadding;
  svg.setAttribute('viewBox', '0 ' + -yPadding + ' ' + width + ' ' + paddedHeight);
  svg.setAttribute('height', paddedHeight);
  timeline.style.height = height + 'px';

  document.addEventListener('click', () => {
    clearLastPreview();
  });
  function plotTimelinePoints() {
    const clustersLength = clusters.length;
    const eightyPercentLength = ~~(0.8 * clustersLength);
    let j = clustersLength;
    while (j-- > 0) {
      const cluster = clusters[j];
      const clusterLength = cluster.length;
      const diameters = new Array(clusterLength);
      let rmsDiameter = 0;
      let i = clusterLength;
      while (i-- > 0) {
        const diameter = dataPointDiameter * Math.log(cluster[i].word_count) * 0.3;
        diameters[i] = diameter;
        rmsDiameter += diameter * diameter;
      }
      rmsDiameter = Math.sqrt(rmsDiameter / diameters.length);
      i = clusterLength;
      while (i-- > 0) {
        const item = cluster[i];
        const diameter = diameters[i];
        const yOffset = rmsDiameter * (i - (clusterLength - 1) / 2) * spacingFactor;
        const pointX = mapTimestampToZeroToOne(new Date(item.published_date).valueOf()) * width;

        const y = sinFunc(pointX) + yOffset;
        const pointContainer = createDiv('point-container');
        const previewLine = createDiv('preview-line');
        const previewContainer = createDiv('preview-container');
        const preview = createDiv('preview ' + (j < eightyPercentLength ? 'preview-right' : 'preview-left'));

        const iconClass = icons[item.type];
        preview.innerHTML = (item.subtype[0] ? '<h4 class="ttu accent-color f7 pb1">' + item.subtype[0] + '</h4>' : '') +
          '<p class="black letter-spacing-half-pixel f5">' + item.title + '</p>' +
          '<i class="fa ' + iconClass + ' accent-color"></i>';
        if (item.image) {
          const previewPicture = createDiv('preview-picture br-100 pa2');
          const previewPictureInner = createDiv('preview-picture-inner br-100');
          previewPictureInner.style.backgroundImage = 'url(' + baseUrl + 'data/prev/' + item.id + '.jpg)';
          previewPicture.appendChild(previewPictureInner);
          previewContainer.appendChild(previewPicture);
        } else {
          previewContainer.classList.add('preview-noimage');
        }

        const dataPoint = createSvgEl('svg');
        dataPoint.setAttribute('class', 'data-point absolute');
        dataPoint.style.marginLeft = dataPoint.style.marginTop = `-${diameter / 2}px`;
        dataPoint.setAttribute('width', diameter);
        dataPoint.setAttribute('height', diameter);
        const dataPointCircle = createSvgEl('circle');
        dataPointCircle.setAttribute('cx', diameter / 2);
        dataPointCircle.setAttribute('cy', diameter / 2);
        dataPointCircle.setAttribute('r', diameter / 2 - 1);
        dataPointCircle.setAttribute('class', 'data-point-circle');
        dataPoint.appendChild(dataPointCircle);

        if (!itemIdToDataPointCircles[item.id]) {
          itemIdToDataPointCircles[item.id] = [];
        }
        itemIdToDataPointCircles[item.id].push(dataPointCircle);
        dataPointCircle.onmouseenter = () => {
          clearLastPreview();
          pointContainer.classList.add('preview-enabled');
          lastPointContainer = pointContainer;
        };

        if (!program) {
          const openExpandedView = () => {
            if (mountedItem && item.i === mountedItem.i) {
              return;
            }
            const direction = mountedItem && (item.i < mountedItem.i ? 'left' : 'right');
            changeExpandedViewArticle(item, direction);
          };
          dataPointCircle.addEventListener('click', openExpandedView, false);
          previewContainer.addEventListener('click', openExpandedView, false);
        } else {
          const openExpandedView = () => {
            combineProgramView(() => changeExpandedViewArticle(item, null));
            // changeExpandedViewArticle(item, null);
          };
          dataPointCircle.addEventListener('click', openExpandedView, false);
          previewContainer.addEventListener('click', openExpandedView, false);
        }

        previewContainer.appendChild(preview);
        pointContainer.appendChild(dataPoint);
        pointContainer.appendChild(previewContainer);
        pointContainer.appendChild(previewLine);
        timeline.appendChild(pointContainer);

        pointContainer.style.top = '50%';
        pointContainer.style.left = pointX / width * 100 + '%';
        nextTick(() => { pointContainer.style.top = y / height * 100 + '%'; });
      }
    }
  }
  plotTimelinePoints();
  timelineRoot.appendChild(timeline);
  return timeline;
}

let dataByTimeAll;
let programViewTimelines;
const itemIdToDataPointCircles = {};

export default function timelineMagic() {
  fetch(baseUrl + 'data/newer.json').then(response => response.json()).then(data => {
    dataByTimeAll = data.posts;
    mainTimeline = generateAndMountTimeline(dataByTimeAll);

    timelineSqueezeStart();

    programViewTimelines = programTypes.map(programType => generateAndMountTimeline(dataByTimeAll.filter(p => p.program.includes(programType)), true, programType));

    // stuff to be done "after" generating the main timeline
    mountFilters();
    timelineFlexWrapper.addEventListener('dblclick', timelineDoubleClickEventHandler, false);
    mainTimeline.addEventListener('dblclick', timelineDoubleClickEventHandler, false);

    handlePermalink(dataByTimeAll, delay + 1);
  });
}

let mountedItem;
let mountedArticleGroup;
const expandedRoot = document.getElementById('timeline-slide-content');
const siteHeader = document.getElementById('site-header');
function mountExpandedViewContainer(expandedViewContainer) {
  // Mount the timeline into the expanded view
  document.body.classList.add('expanded-view-enabled');
  timelineRoot.style.zIndex = 10;

  const transition = 'all 1s ease-in-out';
  timelineRoot.style.transition = transition;
  timelineSqueezeStop();
  disableProgramSelectContainer();
  mainTimeline.style.transition = transition;
  mainTimeline.style.pointerEvents = 'none';
  const timelineBoundingClientRect = mainTimeline.getBoundingClientRect();
  const translateY = 'translateY(' + -1 * ((timelineBoundingClientRect.top + timelineBoundingClientRect.bottom) / 2 - amplitude) + 'px)';
  siteHeader.classList.add('top');
  nextTick(() => {
    height /= 2;
    mainTimeline.style.height = height + 'px';
    timelineRoot.style.transform = translateY;
    if (timelineZoomed) {
      readjustTimeline(initialPositionX);
    }
  });

  const wrapper = createDiv('absolute w-80');
  wrapper.style.left = '50%';
  wrapper.style.transform = 'translateX(-50%)';
  wrapper.style.top = amplitude + 'px';
  // when the timeline has translated to the top
  setTimeout(() => {
    mainTimeline.style.pointerEvents = null;
    if (timelineZoomed) {
      mainTimeline.style.transition = null;
    } else {
      timelineSqueezeStart();
    }
    timelineRoot.classList.add('timeline-top');
    timelineRoot.style.transform = null;
    mountedTimeoutFadeLayer.appendChild(backToTimeline);
    timelineRoot.remove();
    // add the timeline container to the wrapper
    wrapper.appendChild(timelineRoot);
  }, 1000);

  // Set fade on inactivity timeout
  let fadeTimeout;
  const timeoutFadeLayerMousemoveEventHandler = e => {
    clearTimeout(fadeTimeout);
    mountedTimeoutFadeLayer.style.opacity = '1';

    fadeTimeout = setTimeout(() => {
      const cursorOnFadeLayer = Array.prototype.some.call(mountedTimeoutFadeLayer.childNodes, child => child.contains(e.target));
      if (cursorOnFadeLayer) {
        return;
      }
      mountedTimeoutFadeLayer.style.opacity = '0';
    }, 1500);
  };
  // left and right navigation
  const leftAndRightNavigation = e => {
    switch (e.key) {
      case 'ArrowRight': goRight(e); break;
      case 'ArrowLeft': goLeft(e);
    }
  };
  document.addEventListener('keydown', leftAndRightNavigation);
  document.addEventListener('mousemove', timeoutFadeLayerMousemoveEventHandler, false);
  // Hook up "Back to Timeline" button
  const backToTimeline = createDiv('right-2 top-2 fade-in-500ms-linear absolute white pointer inline-flex items-center reverse-dim no-underline br-pill bg-black-50 pv2 ph3');
  backToTimeline.innerHTML = '<i class="fa fa-calendar-check-o"></i><span class="pl2">Back to Timeline</span>';
  backToTimeline.onclick = e => {
    e.stopPropagation();
    if (inTransition) {
      return;
    }
    document.removeEventListener('keydown', leftAndRightNavigation);
    document.removeEventListener('mousemove', timeoutFadeLayerMousemoveEventHandler, false);
    clearTimeout(fadeTimeout);
    resetArticleIdInUrl();
    timelineSqueezeStop();
    backToTimeline.remove();
    timelineRoot.remove();
    wrapper.remove();
    siteHeader.classList.remove('top');
    timelineRoot.classList.remove('timeline-top');
    height *= 2;
    mainTimeline.style.transition = transition;
    timelineFlexWrapper.appendChild(timelineRoot);
    timelineRoot.style.transform = translateY;

    nextTick(() => {
      clearMountedPoint();
      mainTimeline.style.height = height + 'px';
      if (timelineZoomed) {
        readjustTimeline(initialPositionX);
      }
      timelineRoot.style.transform = null;
      unmountExpandedViewContainer(expandedViewContainer);
    });

    setTimeout(() => {
      if (timelineZoomed) {
        mainTimeline.style.transition = null;
      } else {
        timelineSqueezeStart();
      }
      reenableProgramSelectContainer();
      timelineRoot.style.transition = null;
      timelineRoot.style.zIndex = null;
    }, 1000);
  };
  // add the timeline wrapper to the timeout fade layer
  mountedTimeoutFadeLayer.appendChild(wrapper);

  // Finally mount the expanded view container
  expandedRoot.appendChild(expandedViewContainer);
  nextTick(() => expandedViewContainer.style.opacity = '1');
}

let inTransition = false;

function clearMountedPoint() {
  mountedItem && itemIdToDataPointCircles[mountedItem.id][0].parentElement.parentElement.classList.remove('data-point-enabled');
  mountedItem = null;
}
function toggleFadeToWhiteLayer(newItem) {
  if (newItem.image) {
    mountedFadeToWhite.style.display = null;
  } else {
    mountedFadeToWhite.style.display = 'none';
  }
}
let mountedExpandedViewContainer;
let mountedTimeoutFadeLayer;
let mountedFadeToWhite;

const goLeft = e => {
  e.stopPropagation();
  clearLastPreview();
  if (mountedItem.i > 0) {
    let i = mountedItem.i;
    while (i-- > 0) {
      const item = dataByTimeAll[i];
      if (!item.researchAreaDeselected && !item.contentTypeDeselected) {
        changeExpandedViewArticle(item, 'left');
        break;
      }
    }
  }
};
const goRight = e => {
  clearLastPreview();
  e.stopPropagation();
  if (mountedItem.i < dataByTimeAll.length - 1) {
    let i = mountedItem.i;
    const dataByTimeLength = dataByTimeAll.length;
    while (++i < dataByTimeLength) {
      const item = dataByTimeAll[i];
      if (!item.researchAreaDeselected && !item.contentTypeDeselected) {
        changeExpandedViewArticle(item, 'right');
        break;
      }
    }
  }
};
function generateExpandedViewContainer() {
  const expandedViewContainer = createDiv('expanded-view-container');

  mountedTimeoutFadeLayer = createDiv('timeout-fade-layer relative h-100');
  expandedViewContainer.appendChild(mountedTimeoutFadeLayer);
  mountedFadeToWhite = createDiv('fade-to-white w-100 h-100 fixed');

  expandedViewContainer.appendChild(mountedFadeToWhite);

  const leftButton = createDiv('left-button f3 flex pointer reverse-dim');
  leftButton.appendChild(createEl('i', 'fa fa-angle-left fa-fw self-center'));
  leftButton.onclick = goLeft;
  mountedTimeoutFadeLayer.appendChild(leftButton);

  const rightButton = createDiv('right-button f3 flex pointer reverse-dim');
  rightButton.appendChild(createEl('i', 'fa fa-angle-right fa-fw self-center'));
  rightButton.onclick = goRight;
  mountedTimeoutFadeLayer.appendChild(rightButton);
  return expandedViewContainer;
}

function unmountExpandedViewContainer(expandedViewContainer) {
  expandedViewContainer.style.opacity = null;
  const transitionEndHandler = e => {
    if (e.target === expandedViewContainer) {
      document.body.classList.remove('expanded-view-enabled');
      unmountElementsInArray(mountedArticleGroup);
      expandedViewContainer.remove();
      expandedViewContainer.removeEventListener('transitionend', transitionEndHandler, false);
    }
  };
  expandedViewContainer.addEventListener('transitionend', transitionEndHandler, false);
}

const cachedArticleGroupByArticleI = {};

function createArticleGroup(item) {
  const articlePicture = createDiv('article-picture');
  const articlePictureBlurred = createDiv('article-picture blurred');
  if (item.image) {
    const extension = 'jpg';
    const smallImageUrl = 'url(' + baseUrl + 'data/prev/' + item.id + '.' + extension + ')';
    const largeImageUrl = baseUrl + 'data/min/' + item.id + '.' + extension;
    articlePictureBlurred.style.backgroundImage = smallImageUrl;

    fetch(largeImageUrl).then(r => r.blob()).then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener('load', () => {
        articlePicture.style.backgroundImage = `url('${reader.result}')`;
        // wait for two frames to circumvent firefox bug
        articlePicture.onload = requestAnimationFrame(() => {
          requestAnimationFrame(() => {

            requestAnimationFrame(() => {
              articlePictureBlurred.style.opacity = '0';
            });
          });
        });
      }, false);
    });
  }

  const article = createDiv('article absolute black pa4 pl5-m pl6-l pb6-ns w-70-l');

  const splitDate = item.published_date.split('-');
  const year = splitDate[0];
  const month = splitDate[1];
  const date = splitDate[2].split('T')[0];
  const monthName = monthNames[parseInt(month, 10) - 1];

  article.innerHTML = '<div class="ttu f6 fw5 pb1">' +
    monthName + ' ' + date + ', ' + year +
    '</div>' +
    '<h1 class="fw5 f2 lh-title pb2">' +
    item.title +
    '</h1>' +
    '<hr>' +
    '<p class="lh-copy pt3">' +
    item.summary +
    '</p>' +
    '<div class="ttu f7 fw5 pt3">' +
    'Author: ' +
    item.authors.join(', ') +
    '</div>'
    ;

  const share = createDiv('f3 pt4');
  const encodedURL = encodeURIComponent(location.href);
  const encodedTitle = encodeURIComponent(item.title);
  share.innerHTML = `
<a class="no-underline black" href="${generateFacebookShareLink(encodedURL, encodedTitle)}" target="_blank">
  <i class='fa fa-fw fa-facebook pr2 dim'></i>
</a>
<a class="no-underline black" href="${generateTwitterShareLink(encodedURL, encodedTitle)}" target="_blank">
  <i class='fa fa-fw fa-twitter pr2 dim'></i>
</a>
<a class="no-underline black" href="mailto:?subject=${item.title}&amp;body=${location.href}">
  <i class='fa fa-fw fa-envelope dim'></i>
</a>
`;
  const viewFullArticle = createEl('a', 'no-underline inline-flex items-center br-pill bg-accent-color pv2 ph3 mt4 white dib pointer underline-hover');
  viewFullArticle.setAttribute('target', '_blank');
  viewFullArticle.setAttribute('href', item.url_landing_page + '?source=ar');
  viewFullArticle.innerHTML = '<i class="fa fa-film"></i><span class="pl2">View Full Article</span></div>';
  article.appendChild(viewFullArticle);
  article.appendChild(share);
  const articleGroup = [article, articlePicture];
  cachedArticleGroupByArticleI[item.i] = articleGroup;
  return articleGroup;
}

let initialPositionX = 0;
let clickXAtGrabStart = 0;
let offsetX = 0;
let lastAnimationFrame = 0;

const timelineMouseDownEventHandler = e => {
  e.preventDefault();
  e.stopPropagation();
  clickXAtGrabStart = e.clientX;
  timelineFlexWrapper.classList.remove('cursor-grab');
  mainTimeline.classList.remove('cursor-grab');
  timelineSection.classList.add('cursor-grabbing');

  document.addEventListener('mousemove', timelineMousemoveEventHandler, false);
};

const readjustTimeline = x => {
  mainTimeline.style.transform = `translate(${x}px, ${(-height / 2) * (Math.sin(x * waveNumber / 12) + 1)}px)`;
};
const timelineMousemoveEventHandler = e => {
  e.stopPropagation();
  lastAnimationFrame = requestAnimationFrame(() => {
    const newOffsetX = e.clientX - clickXAtGrabStart;
    if (offsetX === newOffsetX) {
      return;
    } else {
      offsetX = newOffsetX;
    }
    readjustTimeline(initialPositionX + offsetX);
  });
};

const timelineMouseUpEventHandler = e => {
  e.stopPropagation();
  // cancel last animation frame to prevent the callback from overriding offsetX after this function is called
  cancelAnimationFrame(lastAnimationFrame);
  initialPositionX += offsetX;
  offsetX = 0;
  timelineSection.classList.remove('cursor-grabbing');
  timelineFlexWrapper.classList.add('cursor-grab');
  mainTimeline.classList.add('cursor-grab');
  document.removeEventListener('mousemove', timelineMousemoveEventHandler, false);
};

let timelineZoomed = false;
const userHint1 = document.getElementById('user-hint-1');
const userHint2 = document.getElementById('user-hint-2');
const userHintHover = document.getElementById('user-hint-hover');
const userHintClick = document.getElementById('user-hint-click');
const userHintGrab = document.getElementById('user-hint-grab');
const userHintZoomIn = document.getElementById('user-hint-zoom-in');
const userHintZoomOut = document.getElementById('user-hint-zoom-out');

userHintZoomIn.style.transition = 'all 1s ease';

const timelineZoomMs = 1000;
let zooming = false;
const monthlyViewTimelineVerticalLines = generateTimelineVerticalLines(calculateLinePositions(monthlyViewLineTemplates));
const timelineDoubleClickEventHandler = e => {
  e.stopPropagation();
  if (zooming) {
    return;
  }
  zooming = true;
  mainTimeline.style.transition = `all ${timelineZoomMs}ms ease`;
  if (timelineZoomed) {
    userHint1.style.display = null;
    userHint2.style.display = 'none';
    userHintHover.classList.add('fade-in-1');
    userHintZoomIn.classList.add('fade-in-2');
    userHintGrab.classList.remove('fade-in-1');
    userHintZoomOut.classList.remove('fade-in-2');

    mainTimeline.classList.remove('timeline-zoomed-in');
    height /= 1.8;
    initialPositionX = 0;
    timelineFlexWrapper.classList.remove('cursor-grab');
    mainTimeline.classList.remove('cursor-grab');
    unmountElementsInArray(monthlyViewTimelineVerticalLines);
    requestAnimationFrame(() => {
      mainTimeline.style.width = null;
      mainTimeline.style.transform = null;
    });
    const whenTimelineHasZoomedOut = () => {
      timelineZoomed = false;
      zooming = false;
      reenableProgramSelectContainer();
      timelineSqueezeStart();
      mountElementsInArrayIntoParent(mainTimeline, defaultTimelineVerticalLines);
    };
    setTimeout(whenTimelineHasZoomedOut, timelineZoomMs);
    timelineFlexWrapper.removeEventListener('mousedown', timelineMouseDownEventHandler, false);
    mainTimeline.removeEventListener('mousedown', timelineMouseDownEventHandler, false);
    document.removeEventListener('mouseup', timelineMouseUpEventHandler, false);
  } else {
    userHint1.style.display = 'none';
    userHint2.style.display = null;
    userHintHover.classList.remove('fade-in-1');
    userHintZoomIn.classList.remove('fade-in-2');
    userHintGrab.classList.add('fade-in-1');
    userHintZoomOut.classList.add('fade-in-2');

    timelineZoomed = true;
    timelineSqueezeStop();
    disableProgramSelectContainer();
    mainTimeline.classList.add('timeline-zoomed-in');
    height *= 1.8;
    const timelineBoundingClientRect = mainTimeline.getBoundingClientRect();
    initialPositionX = (~~(timelineBoundingClientRect.left) - e.clientX) * 11;

    defaultTimelineVerticalLines && unmountElementsInArray(defaultTimelineVerticalLines);
    requestAnimationFrame(() => {
      mainTimeline.style.width = '1200%';
      readjustTimeline(initialPositionX);
    });
    const whenTimelineHasZoomedIn = () => {
      timelineZoomed = true;
      zooming = false;
      mountElementsInArrayIntoParent(mainTimeline, monthlyViewTimelineVerticalLines);
      timelineFlexWrapper.classList.add('cursor-grab');
      mainTimeline.classList.add('cursor-grab');
      mainTimeline.style.transition = null;
      timelineFlexWrapper.addEventListener('mousedown', timelineMouseDownEventHandler, false);
      mainTimeline.addEventListener('mousedown', timelineMouseDownEventHandler, false);
      document.addEventListener('mouseup', timelineMouseUpEventHandler, false);
    };
    setTimeout(whenTimelineHasZoomedIn, timelineZoomMs);
  }
  requestAnimationFrame(() => { mainTimeline.style.height = height + 'px'; });
};
