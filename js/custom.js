/*
-------------------------------------
/// nav scroll
-------------------------------------
*/
window.addEventListener("scroll", function(){
  let nav = document.querySelector(".navbar");
  nav.classList.toggle("nav-fixed", window.scrollY > 64);
});

/*
-------------------------------------
/// tooltip
-------------------------------------
*/
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

/*
-------------------------------------
/// togglers
-------------------------------------
*/
let toggler = document.querySelectorAll('.toggler');

toggler.forEach(btn => {
  btn.addEventListener('click', ()=>{
    btn.lastElementChild.classList.toggle('tests-nav--active');
  })
});

/*
-------------------------------------
/// category-multilevel
-------------------------------------
*/
const ctgTargets = document.querySelectorAll(".category-link");
const ctgLabels = document.querySelectorAll(".subcategory");
const backBtns = document.querySelectorAll(".btn-back");

ctgTargets.forEach(element => {
  element.addEventListener("click", hideSubCat);
});

backBtns.forEach(bkbtns => {
  bkbtns.addEventListener("click", backCategory);
});

function backCategory(e){
  let bkTaeget  = e.target.getAttribute("parent-target");
  document.querySelector("#"+bkTaeget).classList.remove("d-none");

  ctgLabels.forEach(label => {
    if(label.getAttribute("ctg-label") === bkTaeget){
      label.classList.add("d-none");
    }
  });
}

function hideSubCat(e){
  let target  = e.target.getAttribute("ctg-target");
  document.querySelector("#"+target).classList.add("d-none");

  ctgLabels.forEach(label => {
    if(label.getAttribute("ctg-label") === target){
      label.classList.remove("d-none");
    }
  });
}

/*
-------------------------------------
/// scrolling by touch
-------------------------------------
*/
const dragScroll = document.querySelectorAll('.drag-scroll');

let isDown = 0;
let startX;
let scrollLeft;

dragScroll.forEach( dragItem => {

  dragItem.addEventListener('mousedown', (e) => {
    isDown = 1;
    startX = e.pageX - dragItem.offsetLeft;
    scrollLeft = dragItem.scrollLeft;
  });

  dragItem.addEventListener('mouseleave', () => {
    isDown = 0;

  });

  dragItem.addEventListener('mouseup', () => {
    isDown = 0;

  });

  dragItem.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - dragItem.offsetLeft; 
    const walk = (x - startX) * 1.4; 
    dragItem.scrollLeft = scrollLeft - walk;
  });

});


/*
-------------------------------------
/// photo gallery
-------------------------------------
*/


/*
-------------------------------------
/// photo gallery
-------------------------------------
*/


var initPhotoSwipeFromDOM = function(gallerySelector) {

  // parse slide data (url, title, size ...) from DOM elements 
  // (children of gallerySelector)
  var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes,
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;

      for(var i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i]; // <figure> element

          // include only element nodes 
          if(figureEl.nodeType !== 1) {
              continue;
          }

          linkEl = figureEl.children[0]; // <a> element

          size = linkEl.getAttribute('data-size').split('x');

          // create slide object
          item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
          };



          if(figureEl.children.length > 1) {
              // <figcaption> content
              item.title = figureEl.children[1].innerHTML; 
          }

          if(linkEl.children.length > 0) {
              // <img> thumbnail element, retrieving thumbnail url
              item.msrc = linkEl.children[0].getAttribute('src');
          } 

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
      }

      return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
      return el && ( fn(el) ? el : closest(el.parentNode, fn) );
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;

      var eTarget = e.target || e.srcElement;

      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });

      if(!clickedListItem) {
          return;
      }

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      var clickedGallery = clickedListItem.parentNode,
          childNodes = clickedListItem.parentNode.childNodes,
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

      for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) { 
              continue; 
          }

          if(childNodes[i] === clickedListItem) {
              index = nodeIndex;
              break;
          }
          nodeIndex++;
      }



      if(index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe( index, clickedGallery );
      }
      return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
      params = {};

      if(hash.length < 5) {
          return params;
      }

      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
          if(!vars[i]) {
              continue;
          }
          var pair = vars[i].split('=');  
          if(pair.length < 2) {
              continue;
          }           
          params[pair[0]] = pair[1];
      }

      if(params.gid) {
          params.gid = parseInt(params.gid, 10);
      }

      return params;
  };

  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
      var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;

      items = parseThumbnailElements(galleryElement);

      // define options (if needed)
      options = {

          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),

          getThumbBoundsFn: function(index) {
              // See Options -> getThumbBoundsFn section of documentation for more info
              var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                  pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                  rect = thumbnail.getBoundingClientRect(); 

              return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          }

      };

      // PhotoSwipe opened from URL
      if(fromURL) {
          if(options.galleryPIDs) {
              // parse real index when custom PIDs are used 
              // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
              for(var j = 0; j < items.length; j++) {
                  if(items[j].pid == index) {
                      options.index = j;
                      break;
                  }
              }
          } else {
              // in URL indexes start from 1
              options.index = parseInt(index, 10) - 1;
          }
      } else {
          options.index = parseInt(index, 10);
      }

      // exit if index not found
      if( isNaN(options.index) ) {
          return;
      }

      if(disableAnimation) {
          options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it
      gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll( gallerySelector );

  for(var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i+1);
      galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
  }
};

// execute above function
initPhotoSwipeFromDOM('.univer-gallery');
var openPhotoSwipe = function() {
  var pswpElement = document.querySelectorAll('.pswp')[0];

  // build items array
  var items = [
      {
          src: '../images/background/universities/tuit/tuit-1.jpg',
          w: 964,
          h: 1024
      },
      {
          src: '../images/background/universities/tuit/tuit-2.jpg',
          w: 1024,
          h: 683
      },
      {
          src: '../images/background/universities/tuit/tuit-3.jpg',
          w: 1024,
          h: 683
      },
      {
          src: '../images/background/universities/tuit/tuit-4.jpg',
          w: 1024,
          h: 683
      },
      {
          src: '../images/background/universities/tuit/tuit-5.jpg',
          w: 1024,
          h: 683
      }
  ];
  
  // define options (if needed)
  var options = {
     // history & focus options are disabled on CodePen        
      history: false,
      focus: false,

      showAnimationDuration: 0,
      hideAnimationDuration: 0
      
  };
  
  var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
};

document.getElementById('ei-galley').addEventListener("click", openPhotoSwipe);


/*
-------------------------------------
/// charts and graphs
-------------------------------------
*/
var ctx = document.getElementById('myChart').getContext('2d');
var ctx2 = document.getElementById('myChart-dnt').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1 May', '2 May', '3 May', '4 May', '5 May', '6 May', '7 May'],
        datasets: [{
            label: 'Ballar',
            data: [87, 128, 93, 165, 172, 153, 192],
            fill: false,
            borderColor: 'rgb(161, 142, 229)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 40
                }
            }
        }
    }
});
var myChartDnt = new Chart(ctx2,{
  type: 'doughnut',
  data:{
    labels: ['To’g’ri', 'Xato'],
    datasets: [{
      label: 'My First Dataset',
      data: [253,47],
      backgroundColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)'
      ],
      hoverOffset: 4
    }]
  },
  options:{
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 32
        },
        position: 'bottom'
      }
    }
  }
});


/*

some code about password
*/