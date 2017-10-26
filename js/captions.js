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
            if ((child.className && child.className.indexOf("photo-caption") == -1 && child.className.indexOf("bottom-0") == -1) || (!child.className)){
                child.hidden == true ? child.hidden = false : child.hidden = true;
                if (child.childNodes) toggleText(child);
            }
        });
    }
    
    var toggleBackground = function() {
        var parentElement = findParentElement(this, "bottom-0");
        toggleText(parentElement);
    }

    var photoCaptionElements = document.getElementsByClassName("photo-caption");
    
    Array.from(photoCaptionElements).forEach(function(element) {
        element.addEventListener('mouseover', toggleBackground);
        element.addEventListener('mouseout', toggleBackground);
    });
}