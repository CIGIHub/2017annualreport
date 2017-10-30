import {
    createEl
} from 'helpers';

const tocIconOpen = 'fa fa-navicon black';
const tocIcon = createEl('i', tocIconOpen);
const tableOfContentsButton = document.getElementById('table-of-contents-button');
const slideNumberRegex = /slide-(\d)+/;

function toggleTOCMenu(){
    // Show the TOC
    var tocMobileMenu = document.getElementsByClassName('toc-mobile-wrapper');
    tocMobileMenu[0].classList.toggle('hidden');
    
    // Change header colours
    var mobileHeader = document.getElementsByClassName('site-header');
    mobileHeader[0].classList.toggle('header-inverse');
}

function showMobileTOC(){
    toggleTOCMenu();
}

var mobileTOCLinks = function(){
    var slideClass = (this.className).match(slideNumberRegex)[0];
    let navigateTo;

    // Some slides are named differently, doing specific checks for those
    // Influential Research slide
    if (slideClass == "slide-2"){
        navigateTo = document.getElementsByClassName('joint-message cover-slide slide-2')[0];
    }
    // Photo Gallery slide
    else if (slideClass == "slide-18"){
        navigateTo = document.getElementsByClassName('default-background relative')[1];
    }
    // Financials Slide
    else if (slideClass == "slide-17"){
        navigateTo = document.getElementsByClassName('financials')[0];
    }
    else {
        navigateTo = document.getElementsByClassName('standard-slide ' + slideClass)[0];
    }
    navigateTo.scrollIntoView(true);
    toggleTOCMenu();
}

export default function mobileNavMagic(){
    tableOfContentsButton.appendChild(tocIcon);
    tableOfContentsButton.addEventListener('click', showMobileTOC);
    var TOCMobileItems = document.getElementsByClassName('toc-mobile-item');
    Array.from(TOCMobileItems).forEach(function(link) {
        link.addEventListener('click', mobileTOCLinks);
    });
}