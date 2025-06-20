document.addEventListener('DOMContentLoaded', function() {
  // Image gallery switching
  const thumbs = document.querySelectorAll('.ph3d-thumb img');
  const mainImg = document.getElementById('ph3d-main-img');
  thumbs.forEach(function(thumb, i) {
    thumb.addEventListener('click', function() {
      mainImg.src = thumb.src.replace('100x100', '800x800');
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Variant button selection (optional: update Shopify variant id etc)
  const variantBtns = document.querySelectorAll('.ph3d-variant-btn');
  variantBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const group = btn.dataset.option;
      // Remove active from all in this group
      variantBtns.forEach(b => {
        if (b.dataset.option === group) b.classList.remove('active');
      });
      btn.classList.add('active');
      // TODO: Update price, variant id etc if needed
    });
  });

  // Frame selection (visual only, can integrate with metafields/line item properties)
  const frameBtns = document.querySelectorAll('.ph3d-frame-btn');
  frameBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      frameBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // TODO: Set hidden input value for frame, etc.
    });
  });
});
