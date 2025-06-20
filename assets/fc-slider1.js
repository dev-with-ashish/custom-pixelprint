document.addEventListener("DOMContentLoaded", function() {
  // Helper function to determine the number of slides to move based on viewport width
  function getVisibleCount() {
    return window.innerWidth <= 768 ? 2 : 4;
  }
  
  // Select all slider containers
  const sliders = document.querySelectorAll('.fc-slider1');

  sliders.forEach(function(slider) {
    const track = slider.querySelector(".fc-track1");
    const slides = Array.from(track.children);
    const prevBtn = slider.querySelector(".fc-prev1");
    const nextBtn = slider.querySelector(".fc-next1");

    // Calculate the width of a slide (including right margin)
    let slideWidth = slides[0].getBoundingClientRect().width +
                     parseInt(getComputedStyle(slides[0]).marginRight);
    let currentIndex = 0;

    function updateSlider() {
      track.style.transform = "translateX(" + (-currentIndex * slideWidth) + "px)";
    }

    nextBtn.addEventListener("click", function() {
      const visibleCount = getVisibleCount();
      // Calculate maximum starting index so that a full group of visible slides is shown
      const maxIndex = Math.max(0, slides.length - visibleCount);
      if (currentIndex < maxIndex) {
        currentIndex = Math.min(currentIndex + visibleCount, maxIndex);
        updateSlider();
      }
    });

    prevBtn.addEventListener("click", function() {
      const visibleCount = getVisibleCount();
      if (currentIndex > 0) {
        currentIndex = Math.max(currentIndex - visibleCount, 0);
        updateSlider();
      }
    });

    // Update slide width and adjust current index on window resize for each slider instance
    window.addEventListener("resize", function() {
      slideWidth = slides[0].getBoundingClientRect().width +
                   parseInt(getComputedStyle(slides[0]).marginRight);
      // Optional: reset currentIndex if it exceeds the new maximum index
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, slides.length - visibleCount);
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      updateSlider();
    });
  });
});
