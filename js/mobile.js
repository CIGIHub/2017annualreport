import {
    unmountElementsInArray,
    removeClassFromElementsInArray,
} from 'helpers';

const standardSlides = Array.from(document.getElementsByClassName('standard-slide'));
const removeBgClass = 'remove-bg-image';

export function putBackgroundImageIntoArticle() {
    standardSlides.forEach(slide => {
        const elementComputedStyle = window.getComputedStyle(slide);
        const backgroundImage = elementComputedStyle.getPropertyValue('background-image');
        const pTag = slide.querySelector('p');
        const photoCaption = slide.querySelector('.photo-caption');
        if (backgroundImage != 'none' && pTag) {
            const backgroundImageURL = /url\("(.*)"\)/.exec(backgroundImage)[1];
            const parentElement = pTag.parentElement;
            const articleImage = new Image();
            articleImage.src = backgroundImageURL;
            articleImage.className = 'bg-image';
            parentElement.insertBefore(articleImage, pTag);
            slide.classList.add(removeBgClass);
            if (photoCaption) {
                parentElement.insertBefore(photoCaption, pTag);
            }
        }
    });
}

export function unPutBackgroundImageIntoArticle() {
    const images = Array.from(document.getElementsByClassName('bg-image'));
    unmountElementsInArray(images);
    removeClassFromElementsInArray(Array.from(document.getElementsByClassName(removeBgClass)), removeBgClass);
}
