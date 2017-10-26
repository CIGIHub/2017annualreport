export default function photoCaptionMagic() {
    
    function findParentElement (element, className) {
        while (element.className.indexOf(className) == -1){
            element = element.parentElement;
        }
        return element;  
    } 
    
    function toggleText(element) {
        var children = element.childNodes;
        Array.from(children).forEach(function(child){
            if (child.tagName && child.className.indexOf("photo-caption") == -1) {
                child.classList.toggle('hide-text');
                if (child.childNodes) toggleText(child);
            }
        });
    }
    
    var toggleBackground = function() {
        var wrapperElement = findParentElement(this, "bottom-0");
        var standardSlideElement = findParentElement(this, "standard-slide");
        var headerElement = document.getElementById('site-header');
        headerElement.classList.toggle('hide-text');
        standardSlideElement.classList.toggle('hide');
        toggleText(wrapperElement);
    }

    var photoCaptionElements = document.getElementsByClassName("photo-caption");
    
    Array.from(photoCaptionElements).forEach(function(element) {
        element.addEventListener('mouseover', toggleBackground);
        element.addEventListener('mouseout', toggleBackground);
    });
}