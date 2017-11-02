import {
  setReseachAreaFilters,
  changeExpandedViewArticle,
  showProgramView,
  toggleSelectOptions,
  contentTypeToRadioBox,
  filterByContentType,
  selectedContentType,
  searchBox,
  searchTimeline,
} from './timeline';

import {
  loadInitialSlide,
} from './navigation';

// History helper function
export const setHash = value => history.replaceState('', '', value);

export const setProgramViewInUrl = () => {
  if (location.hash.indexOf('?program_view=true') === -1) {
    setHash(location.hash + '?program_view=true');
  }
};

export const resetProgramViewInUrl = () => {
  setHash(location.hash.replace('?program_view=true', ''));
};

const articleRegex = /\?article_id=(\d+)/;
export const resetArticleIdInUrl = () => {
  setHash(location.hash.replace(articleRegex, ''));
};

export const changeArticleIdInUrl = id => {
  if (location.hash.indexOf('?article_id=') !== -1) {
    setHash(location.hash.replace(articleRegex, '?article_id=' + id));
  } else {
    setHash(location.hash + '?article_id=' + id);
  }
};

const researchAreaRegex = /\?research_areas=((.+,)?\d+)/;
export const setResearchFiltersInUrl = () => {
  const token = '?research_areas=' + setReseachAreaFilters.join(',');
  if (location.hash.match(researchAreaRegex)) {
    setHash(location.hash.replace(researchAreaRegex, token));
  } else {
    setHash(location.hash + token);
  }
};

export const resetResearchFiltersInUrl = () => {
  setHash(location.hash.replace(researchAreaRegex, ''));
};

const searchRegex = /\?search='(.+)'/;
export const setSearchInUrl = () => {
  const token = `?search='${searchBox.value}'`;
  if (location.hash.match(searchRegex)) {
    setHash(location.hash.replace(searchRegex, token));
  } else {
    setHash(location.hash + token);
  }
};

export const resetSearchInUrl = () => {
  setHash(location.hash.replace(searchRegex, ''));
};

const contentTypeRegex = /\?content_type='(.+)'/;
export const setContentTypeInUrl = () => {
  const token = `?content_type='${selectedContentType}'`;
  if (location.hash.match(contentTypeRegex)) {
    setHash(location.hash.replace(contentTypeRegex, token));
  } else {
    setHash(location.hash + token);
  }
};

export const resetContentTypeInUrl = () => {
  setHash(location.hash.replace(contentTypeRegex, ''));
};

export const clearUrlHash = () => {
  setHash('#');
};

export function handlePermalink(dataByTimeAll, delay) {
  const hash = location.hash;
  let articleId = articleRegex.exec(hash);
  articleId = articleId && articleId[1];
  if (articleId) {
    let i = dataByTimeAll.length - 1;
    for (; i >= 0 && dataByTimeAll[i].id !== articleId; i--);
    if (i !== -1) {
      setTimeout(() => changeExpandedViewArticle(dataByTimeAll[i]), delay);
    }
  }
  const programView = hash.indexOf('?program_view=true') !== -1;
  if (programView) {
    setTimeout(showProgramView, delay);
  }
  let researchAreas = researchAreaRegex.exec(hash);
  if (researchAreas !== null) {
    researchAreas = researchAreas[1].split(',').map(Number);
    researchAreas.forEach((id) => { toggleSelectOptions(id)(); });
  }
  let contentType = contentTypeRegex.exec(hash);
  if (contentType !== null) {
    contentType = contentType[1];
    const radioBox = contentTypeToRadioBox[contentType];
    filterByContentType(radioBox, contentType);
  }

  let search = searchRegex.exec(hash);
  if (search !== null) {
    search = search[1];
    searchBox.value = search;
    searchTimeline(search);
  }
}

const slideRegex = /\?slide=(\d+)/;
export function parseAndLoadSlide() {
  const hash = location.hash;
  let slideNumber = slideRegex.exec(hash);
  slideNumber = slideNumber ? parseInt(slideNumber[1], 10) : 1;
  loadInitialSlide(slideNumber);
}

export const changeSlideInUrl = id => {
  if (id === 0) {
    if (location.hash.indexOf('?slide=') === -1) {
      setHash(location.hash || '#/' + '?slide=' + id);
    } else {
      setHash(location.hash.replace(slideRegex, '?slide=' + id));
    }
  }
  else {
    setHash('#/?slide=' + id);
  }
};
