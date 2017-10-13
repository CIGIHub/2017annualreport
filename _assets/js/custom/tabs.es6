
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

  console.log(selectedTab);
  console.log(selectedTabId);
  
  //this shouldn't happen, but just in case
  if(currentSlideId === undefined){
    return;
  }
  else{
    const currentSlide = 'slide-' + currentSlideId;
    console.log(currentSlide);
    //var clearSelectedTab = Array.from(document.getElementById(currentSlide).getElementsByClassName('tab'));
    var clearSelectedTabs = document.getElementById(currentSlide).getElementsByClassName('tab');
    for (var item of clearSelectedTabs){

      item.classList.remove('selected');
      // console.log(item);
      // console.log(item.getAttribute('data-id'));
      if (item.getAttribute('data-id') === selectedTab){
        item.classList.add('selected');
      }
    }
  }

}


let tabs = Array.from(document.getElementsByClassName('tab'));
let toggle = Array.from(document.getElementsByClassName('toggle'));

console.log(tabs.length);

window.onload = function(){

  initializeTabs();
  
  toggle.forEach(function(item){
    item.addEventListener("click", toggleTabs);
  });
}

