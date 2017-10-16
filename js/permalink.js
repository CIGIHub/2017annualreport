import {
  setReseachAreaFilters,
  changeExpandedViewArticle,
  showProgramView,
  toggleSelectOptions,
} from './timeline';

import {
  loadInitialSlide,
} from './navigation';

// History helper functions

const setHash = value => history.replaceState('', '', value);

export const setProgramViewInUrl = () => {
  if (location.hash.indexOf('?program_view=true') === -1) {
    setHash(location.hash + '?program_view=true');
  }
};

export const resetProgramViewInUrl = () => {
  setHash(location.hash.replace('?program_view=true', ''));
};

export const resetArticleIdInUrl = () => {
  setHash(location.hash.replace(/\?article_id=\d+/, ''));
};

export const changeArticleIdInUrl = id => {
  if (location.hash.indexOf('?article_id=') !== -1) {
    setHash(location.hash.replace(/\?article_id=\d+/), '?article_id=' + id);
  } else {
    setHash(location.hash + '?article_id=' + id);
  }
};

export const setResearchFiltersInUrl = () => {
  const filterString = setReseachAreaFilters.join(',') + ',';
  if (location.hash.match(/\?research_areas=.+,/)) {
    setHash(location.hash.replace(/\?research_areas=.+,/, '?research_areas=' + filterString));
  } else {
    setHash(location.hash + '?research_areas=' + filterString);
  }
};

export const resetResearchFiltersInUrl = () => {
  setHash(location.hash.replace(/\?research_areas=.+,/, ''));
};

export const clearUrlHash = () => {
  setHash('#');
};

export function handlePermalink(dataByTimeAll, delay) {
  const hash = location.hash;
  let articleId = /\?article_id=(\d+)/.exec(hash);
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
  let researchAreas = /\?research_areas=(.+),/.exec(hash);
  if (researchAreas !== null) {
    researchAreas = researchAreas[1].split(',');
    researchAreas.forEach((id) => { toggleSelectOptions(id)(); });
  }
}

function parseAndLoadSlide() {
  const hash = location.hash;
  let slideNumber = /\?slide=(\d+)/.exec(hash);
  slideNumber = slideNumber ? parseInt(slideNumber[1], 10) : 1;
  loadInitialSlide(slideNumber);
}
parseAndLoadSlide();

export const changeSlideInUrl = id => {
  if (id === 0) {
    if (location.hash.indexOf('?slide=') === -1) {
      setHash(location.hash || '#/' + '?slide=' + id);
    } else {
      setHash(location.hash.replace(/\?slide=\d+/, '?slide=' + id));
    }
  }
  else {
    setHash('#/?slide=' + id);
  }
};
