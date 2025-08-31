
// Scenic looping SVG path from bottom to top of page, dynamic height
window.addEventListener('DOMContentLoaded', function () {
  function scenicLoopingPath(height, loops, amplitude, width) {
    // Start at bottom center
    let d = `M${width/2} ${height}`;
    let step = height / loops;
    for (let i = 0; i < loops; i++) {
      // Alternate left/right for scenic effect
      let direction = i % 2 === 0 ? 1 : -1;
      let controlX = width/2 + direction * amplitude;
      let controlY = height - (i * step + step/2);
      let endX = width/2;
      let endY = height - ((i+1) * step);
      d += ` Q${controlX} ${controlY} ${endX} ${endY}`;
    }
    return d;
  }

  function resizeSidebarSVG() {
    var listing = document.querySelector('.quarto-listing-default');
    var sidebar = document.querySelector('.blog-left-sidebar');
    var svg = sidebar ? sidebar.querySelector('svg') : null;
    if (listing && svg) {
      var posts = listing.querySelectorAll('.quarto-post');
      if (posts.length === 0) return;
      var firstPost = posts[0];
      var lastPost = posts[posts.length - 1];
      var top = firstPost.offsetTop;
      var bottom = lastPost.offsetTop + lastPost.offsetHeight;
      var height = bottom - top;
      var width = 100;
      var loops = Math.max(8, Math.floor(height/120)); // more loops for shorter height
      var amplitude = 40;
      svg.setAttribute('height', height);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.style.position = 'absolute';
      svg.style.top = top + 'px';
      svg.style.alignSelf = '';
      var path = svg.querySelector('path');
      if (path) {
        var d = scenicLoopingPath(height, loops, amplitude, width);
        path.setAttribute('d', d);
      }
    }
  }
  resizeSidebarSVG();
    // Fix initial alignment by recalculating after posts render
    setTimeout(resizeSidebarSVG, 100);
    window.addEventListener('resize', resizeSidebarSVG);

    // Dynamically update SVG when posts are added/removed/filtered
    var listing = document.querySelector('.quarto-listing-default');
    if (listing) {
      var observer = new MutationObserver(function(mutationsList, observer) {
        resizeSidebarSVG();
      });
      observer.observe(listing, { childList: true, subtree: true });
    }
});
