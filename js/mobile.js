import {
    createEl
} from 'helpers';

const tocIconOpen = 'fa fa-navicon black';
const tocIcon = createEl('i', tocIconOpen);
tocIcon.classList.add('toc-open-mobile');
const tocIconClose = 'fa fa-times black';
const tocIcon2 = createEl('i', tocIconClose);
tocIcon2.classList.add('toc-close-mobile', 'hidden');
const tableOfContentsButton = document.getElementById('table-of-contents-button');
const slideNumberRegex = /slide-(\d)+/;
const imageRegex = /\/assets(.)*/;

function toggleTOCMenu(){
    // Show/hide the TOC
    var tocMobileMenu = document.getElementsByClassName('toc-mobile-wrapper');
    tocMobileMenu[0].classList.toggle('hidden');
    
    // switch icons
    var tocOpenMobile = document.getElementsByClassName('toc-open-mobile')[0];
    tocOpenMobile.classList.toggle('hidden');
    var tocCloseMobile = document.getElementsByClassName('toc-close-mobile')[0];
    tocCloseMobile.classList.toggle('hidden');
    
    // Change header colours
    var mobileHeader = document.getElementsByClassName('site-header');
    mobileHeader[0].classList.toggle('header-inverse');
    var mobileLogo = document.getElementsByClassName('cigi-logo-mobile');
    mobileLogo[0].classList.toggle('hidden');
    var mobileLogoInverse = document.getElementsByClassName('cigi-logo-mobile inverse');
    mobileLogoInverse[0].classList.toggle('hidden');   
}

function toggleAllSlides(){
    // hiding all slides so there isn't a scroll bar when mobile TOC is open
    var allSlides = document.getElementsByTagName('section');
    Array.from(allSlides).forEach(function(slide) {
        slide.classList.toggle('visibility-hidden');
    });
}

function showMobileTOC(){
    toggleTOCMenu();
    toggleAllSlides();
}

function scrollToHome() {
    document.getElementsByClassName('slide-1')[0].scrollIntoView(true);
    location.href= location.pathname + "#/?slide=1";
}

var mobileTOCLinks = function(){
    var slideClass = (this.className).match(slideNumberRegex)[0];
    this.className.match('president') ? slideClass = "president" : "";
    this.className.match('chair') ? slideClass = "chair" : "";
    let navigateTo;
    toggleAllSlides();
    
    // Some slides are named differently, doing specific checks for those
    // Influential Research slide
    if (slideClass == "slide-2"){
        navigateTo = document.getElementsByClassName('joint-message cover-slide slide-2')[0];
    }
    // Joint message slide - president's message
    else if (slideClass == "president"){
        navigateTo = document.getElementsByClassName('default-background joint-message')[0];
        var presidentTab = document.querySelectorAll("[data-id='tab-1']")[0];
        presidentTab.click();
    }
    // Joint message slide - chair's message
    else if (slideClass == "chair"){
        navigateTo = document.getElementsByClassName('default-background joint-message')[0];
        var chairTab = document.querySelectorAll("[data-id='tab-2']")[0];
        chairTab.click();
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

function scrollToTop(){
    window.scroll(0,0);
}

function scrollToSlide2(){
    document.getElementsByClassName('joint-message cover-slide slide-2')[0].scrollIntoView(true);
}

function putBackgroundImageIntoArticle(element){

    var elementComputedStyle = window.getComputedStyle(element);
    var backgroundImage = elementComputedStyle.getPropertyValue('background-image');
    let backgroundImageURL;

    if (backgroundImage != "none"){
        backgroundImageURL = backgroundImage.match(imageRegex)[0];
        var elementText = element.querySelector("p");
        var parentElement = element.querySelector(".absolute");
        var articleImage = new Image();
        articleImage.src = backgroundImageURL.slice(0, -2);
        parentElement.insertBefore(articleImage, elementText);
        element.classList.add("remove-bg-image");
    }
}

export default function mobileNavMagic(){
    
    // Adding TOC icons
    tableOfContentsButton.appendChild(tocIcon);
    tableOfContentsButton.appendChild(tocIcon2);
    tableOfContentsButton.addEventListener('click', showMobileTOC);
    
    // Revealing mobile logo
    document.getElementsByClassName('mobile-header-logo')[0].classList.toggle('hidden');
    
    // adding event listeners to mobile TOC items
    var TOCMobileItems = document.getElementsByClassName('toc-mobile-item');
    Array.from(TOCMobileItems).forEach(function(link) {
        link.addEventListener('click', mobileTOCLinks);
    });
    
    // Adding message to replace timeline
    document.getElementsByClassName("mobile-timeline-message")[0].classList.toggle("hidden");
    
    // Moving background images into article
    var allSections = document.getElementsByClassName('standard-slide');
    Array.from(allSections).forEach(function(section) {
        putBackgroundImageIntoArticle(section);
    });

    // revealing mobile button and adding event listener
    var mobilebutton =  document.getElementsByClassName("mobile-button")[0];
    mobilebutton.classList.toggle("hidden");
    mobilebutton.addEventListener('click', scrollToHome);

    // start on slide 2
    scrollToHome();

    // add working links for slide 2
    document.getElementsByClassName("explore")[0].addEventListener('click', scrollToTop);
    document.getElementsByClassName("view-ar")[0].addEventListener('click', scrollToSlide2);
}