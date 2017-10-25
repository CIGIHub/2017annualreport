function findStandardSlide (element) {
    while ((element = element.parentElement) && !element.className.contains("standard-slide"));
    return element;
}

document.addEventListener("mouseover", function (eventArgs) {
    var target = eventArgs.target;
    while (target !== null) {
        if (target.className.includes("photo-caption")) {
            var standardSlide = findStandardSlide(target);
            standardSlide.removeAttribute('background');
            console.log(target);
        }
    }
});