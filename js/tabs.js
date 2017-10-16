
// tabs

function initializeTabs(){
   
  var tab1 = document.querySelectorAll("[data-id='tab-1']");
  var tab2 = document.querySelectorAll("[data-id='tab-2']");

  let setSelected1 = Array.from(tab1);
  for (var item of setSelected1) {
      item.classList.add('selected');
  }

  let unsetSelected1 = Array.from(tab2);
  for (var item of unsetSelected1) {
      item.classList.remove('selected');
  }
 
}

function toggleTabs(e){
  
  const selectedTab = e.target.getAttribute('data-id');
  const selectedTabId = selectedTab.split('tab-')[1];
  const currentSlideId = window.location.hash.split('#/?slide=')[1];
  
  //this shouldn't happen, but just in case
  if(currentSlideId === undefined){
    return;
  }
  else{
    //get the current slide and assign the clicked tab.
    const currentSlide = 'slide-' + currentSlideId;
  
    var clearSelectedTabs = document.getElementById(currentSlide).getElementsByClassName('tab');
    for (var item of clearSelectedTabs){
      item.classList.remove('selected');
      if (item.getAttribute('data-id') === selectedTab){
        item.classList.add('selected');
      }
    }
  }

}

let tabs = Array.from(document.getElementsByClassName('tab'));
let toggle = Array.from(document.getElementsByClassName('toggle'));

window.onload = function(){
  initializeTabs();
  
  toggle.forEach(function(item){
    item.addEventListener("click", toggleTabs);
  });
}

