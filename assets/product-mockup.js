document.addEventListener("DOMContentLoaded", function() {
  var productData = window.ccmSettings.collection.productData;
  var animationInterval = window.ccmSettings.animationInterval;
  if (!productData.length) {
    console.error("No product data available.");
    return;
  }
  var poster = document.querySelector('.ccm-poster');
  if (!poster) {
    console.error("Poster element .ccm-poster not found.");
    return;
  }
  var currentIndex = 0;
  
  function updatePoster() {
    var product = productData[currentIndex];
    // Create clickable image.
    var anchor = document.createElement('a');
    anchor.href = product.url;
    var newImg = document.createElement('img');
    newImg.src = product.image;
    anchor.appendChild(newImg);
    poster.appendChild(anchor);
    
    // Trigger CSS transition.
    requestAnimationFrame(function() {
      newImg.classList.add('active');
    });
    
    // Remove previous image after the transition.
    if (poster.children.length > 1) {
      setTimeout(function() {
        while (poster.children.length > 1) {
          poster.removeChild(poster.firstElementChild);
        }
      }, 1000);
    }
    // Cycle to the next product.
    currentIndex = (currentIndex + 1) % productData.length;
  }
  
  // Initial display.
  updatePoster();
  
  // Set the interval for updating the poster.
  setInterval(updatePoster, animationInterval);
});
