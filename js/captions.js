import { mobile } from 'navigation';

export default function photoCaptionMagic() {
    function findParentElement(element, className) {
        let parentElement = element.parentElement;
        while (parentElement.className.indexOf(className) === -1) {
            parentElement = parentElement.parentElement;
        }
        return parentElement;
    }

    function toggleText(element) {
        //console.log("toggling...");
        //console.log(element);
        const children = element.childNodes;
        Array.from(children).forEach(child => {
            if (child.tagName && child.className.indexOf('photo-caption') === -1
            && child.className.indexOf('img-container') === -1) {
                child.classList.toggle('hide-text');
                if (child.childNodes) toggleText(child);
            }
        });
    }

    function toggleBackground() {
        if (mobile) {
            return;
        }
        var standardSlideElement = findParentElement(this, 'standard-slide');
        var headerElement = document.getElementById('site-header');
        headerElement.classList.toggle('hide-text');
        standardSlideElement.classList.toggle('hide');
        toggleText(this.parentElement);
    }

    const photoCaptionElements = document.getElementsByClassName('photo-caption');

    Array.from(photoCaptionElements).forEach(element => {
        element.addEventListener('mouseover', toggleBackground);
        element.addEventListener('mouseout', toggleBackground);
    });
}