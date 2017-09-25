// DOM Helper Functions
function createEl(name, className) {
  const element = document.createElement(name);
  if (className) {
    element.className = className;
  }
  return element;
}

const createSvgEl = type => document.createElementNS('http://www.w3.org/2000/svg', type); // eslint-disable-line

const createDiv = className => createEl('div', className); // eslint-disable-line

function mountElementsInArrayIntoParent(parent, arr) { // eslint-disable-line
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    parent.appendChild(el);
  }
}

function mountElementsInArrayIntoParentInOrder(parent, arr) { // eslint-disable-line
  const length = arr.length;
  let i = 0;
  while (i < length) {
    const el = arr[i++];
    parent.appendChild(el);
  }
}

function addClassToElementsInArray(arr, className) { // eslint-disable-line
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    el.classList.add(className);
  }
}

function removeClassFromElementsInArray(arr, className) { // eslint-disable-line
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    el.classList.remove(className);
  }
}

function unmountElementsInArray(arr) { // eslint-disable-line
  let i = arr.length;
  while (i-- > 0) {
    const el = arr[i];
    el.remove();
  }
}

// Useful for triggering transitions
const nextTick = func => setTimeout(func, 0); // eslint-disable-line

const generateFacebookShareLink = (encodedURL, encodedTitle = '') => `http://www.facebook.com/sharer/sharer.php?u=${encodedURL}&title=${encodedTitle}`; // eslint-disable-line
const generateTwitterShareLink = (encodedURL, encodedTitle = '') => `http://twitter.com/intent/tweet?status=${encodedTitle}+${encodedURL}`; // eslint-disable-line
