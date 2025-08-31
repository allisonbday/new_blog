
// Scenic looping SVG path from bottom to top of page, dynamic height
window.addEventListener('DOMContentLoaded', function () {
  function scenicLoopingPath(height, loops, amplitude, width) {
    let d = `M${width/2} ${height}`;
    let step = height / loops;
    for (let i = 0; i < loops; i++) {
      let direction = i % 2 === 0 ? 1 : -1;
      let controlX = width/2 + direction * amplitude;
      let controlY = height - (i * step + step/2);
      let endX = width/2;
      let endY = height - ((i+1) * step);
      d += ` Q${controlX} ${controlY} ${endX} ${endY}`;
    }
    return d;
  }

  function createSidebarSVG(sidebar, top, height) {
    // Remove existing SVG if present
    let oldSvg = sidebar.querySelector('svg');
    if (oldSvg) oldSvg.remove();

    let width = 100;
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.style.display = 'block';
  svg.style.margin = '0';
  svg.style.width = width + 'px';
  svg.style.position = 'absolute';
  svg.style.top = top + 'px';
  svg.style.transform = 'translateX(-5%)';
  svg.style.right = '';
  svg.style.alignSelf = '';

    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let loops = Math.max(8, Math.floor(height/120));
    let amplitude = 40;
    let d = scenicLoopingPath(height, loops, amplitude, width);
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#bfa77a');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-dasharray', '12 14');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    sidebar.appendChild(svg);
    return {svg, path};
  }

  function resizeSidebarSVG() {
    var listing = document.querySelector('.quarto-listing-default');
    var sidebar = document.querySelector('.blog-left-sidebar');
    if (listing && sidebar) {
      var posts = listing.querySelectorAll('.quarto-post');
      if (posts.length === 0) return;
      var firstPost = posts[0];
      var lastPost = posts[posts.length - 1];
      var top = firstPost.offsetTop;
      var bottom = lastPost.offsetTop + lastPost.offsetHeight;
      var height = bottom - top;

      // Create SVG and path dynamically
      var {svg, path} = createSidebarSVG(sidebar, top, height);


    }
  }
  resizeSidebarSVG();
  setTimeout(resizeSidebarSVG, 100);
  window.addEventListener('resize', resizeSidebarSVG);
  var listing = document.querySelector('.quarto-listing-default');
  if (listing) {
    var observer = new MutationObserver(function(mutationsList, observer) {
      resizeSidebarSVG();
    });
    observer.observe(listing, { childList: true, subtree: true });
  }
});
