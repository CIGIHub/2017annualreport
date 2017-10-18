// DOM Helper Functions
export function createEl(name, className) {
  const element = document.createElement(name);
  if (className) {
    element.className = className;
  }
  return element;
}

export const createSvgEl = type => document.createElementNS('http://www.w3.org/2000/svg', type);

export const createDiv = className => createEl('div', className);

export function mountElementsInArrayIntoParent(parent, arr) {
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    parent.appendChild(el);
  }
}

export function mountElementsInArrayIntoParentInOrder(parent, arr) {
  const length = arr.length;
  let i = 0;
  while (i < length) {
    const el = arr[i++];
    parent.appendChild(el);
  }
}

export function addClassToElementsInArray(arr, className) {
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    el.classList.add(className);
  }
}

export function removeClassFromElementsInArray(arr, className) {
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    el.classList.remove(className);
  }
}

export function unmountElementsInArray(arr) {
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    el.remove();
  }
}

// Useful for triggering transitions
export const nextTick = func => setTimeout(func, 0);

export const generateFacebookShareLink = (encodedURL, encodedTitle = '') => `http://www.facebook.com/sharer/sharer.php?u=${encodedURL}&title=${encodedTitle}`;
export const generateTwitterShareLink = (encodedURL, encodedTitle = '') => `http://twitter.com/intent/tweet?status=${encodedTitle}+${encodedURL}`;

// svg elements

export const closeSvg = `<svg width="12" height="12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<g stroke-width="12" stroke="currentColor">
<line x1="0" y1="100" x2="100" y2="0">
</line>
<line x1="0" y1="0" x2="100" y2="100">
</line>
</g>
</svg>`;
