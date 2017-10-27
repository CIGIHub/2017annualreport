import {
    generateFacebookShareLink,
    generateTwitterShareLink,
    createDiv,
    createEl,
    closeSvg,
} from 'helpers';

const tocIconOpen = 'fa fa-navicon black';
const tocIcon = createEl('i', tocIconOpen);
const tableOfContentsButton = document.getElementById('table-of-contents-button');
let tableOfContents;

function showMobileTOC(){
    // Show the TOC
    var tocMobileMenu = document.getElementsByClassName('mobile-toc');
    tocMobileMenu[0].classList.toggle('hidden');

    // Change header colours
    var tocMobileMenu = document.getElementsByClassName('site-header');

}


export default function mobileNavMagic(){
    tableOfContents = createDiv('mobile-toc pt5 pt6-ns fixed bg-black-90 z-7 left-0 top-0 hidden');
    tableOfContentsButton.appendChild(tocIcon);
    document.body.appendChild(tableOfContents);
    var slideHeadings = document.getElementsByTagName('h1');
    //var headingsDuplicate = slideHeadings;
    Array.from(slideHeadings).forEach(function(heading){
        var tocHeadingElement = document.createElement("h1");
        tocHeadingElement.textContent = heading.textContent
        tableOfContents.appendChild(tocHeadingElement);
    });
    tableOfContentsButton.addEventListener('click', showMobileTOC);
}