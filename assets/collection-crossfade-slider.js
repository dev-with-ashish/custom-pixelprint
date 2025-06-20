document.addEventListener("DOMContentLoaded", function() {
  var collections = window.ccmSettings.collections;
  var animationInterval = window.ccmSettings.animationInterval;
  if (!collections.length) {
    console.error("No collections data available.");
    return;
  }
  // Set initial collection index to cycle through the selected collections.
  var currentCollectionIndex = 0;
  var currentCollection = collections[currentCollectionIndex];
  var productData = currentCollection.productData;
  var totalProducts = productData.length;
  
  // Setup three poster elements.
  var posters = [];
  for (var i = 0; i < 3; i++) {
    var posterElement = document.querySelector('.ccm-poster' + (i + 1));
    if (!posterElement) {
      console.error("Poster element .ccm-poster" + (i + 1) + " not found.");
    }
    posters.push({
      element: posterElement,
      currentIndex: i % totalProducts
    });
  }
  
  // Function to update a poster with a clickable image.
  function updatePoster(poster, productIndex) {
    var anchor = document.createElement('a');
    anchor.href = productData[productIndex].url;
    var newImg = document.createElement('img');
    newImg.src = productData[productIndex].image;
    anchor.appendChild(newImg);
    poster.element.appendChild(anchor);
    requestAnimationFrame(function() {
      newImg.classList.add('active');
    });
    if (poster.element.children.length > 1) {
      setTimeout(function() {
        while (poster.element.children.length > 1) {
          poster.element.removeChild(poster.element.firstElementChild);
        }
      }, 1000);
    }
    console.log("Updated poster with product index:", productIndex);
  }
  
  // Function to display the current collection's three products.
  function displayCurrentCollection() {
    // Update productData and totalProducts for the current collection.
    productData = collections[currentCollectionIndex].productData;
    totalProducts = productData.length;
    posters.forEach(function(poster, index) {
      // Reset the poster's index relative to the current collection.
      poster.currentIndex = index % totalProducts;
      updatePoster(poster, poster.currentIndex);
    });
  }
  
  // Initial display.
  displayCurrentCollection();
  
  // Function to cycle to the next collection.
  function updateToNextCollection() {
    currentCollectionIndex = (currentCollectionIndex + 1) % collections.length;
    displayCurrentCollection();
  }
  
  // Set the interval for switching collections.
  setInterval(updateToNextCollection, animationInterval);
});
