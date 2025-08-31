
// Scenic looping SVG path from bottom to top of page, dynamic height
window.addEventListener('DOMContentLoaded', function () {
  function scenicLoopingPath(height, loops, amplitude, width) {
    // Make the path more random and wavy, with higher ups/downs and wider as height increases
    let d = `M${width/2} ${height}`;
    let step = height / loops;
    for (let i = 0; i < loops; i++) {
      let direction = i % 2 === 0 ? 1 : -1;
      // Add randomness to amplitude and horizontal position
      let ampRand = amplitude * (1.2 + Math.random() * 1.2); // up to 2.4x amplitude
      let xRand = (width/2) + direction * ampRand * (0.7 + Math.random()*0.6); // more horizontal spread
      let controlX = xRand;
      let controlY = height - (i * step + step/2) + (Math.random()-0.5)*step*0.7; // random vertical
      let endX = width/2 + (Math.random()-0.5)*width*0.18; // end point can wiggle left/right
      let endY = height - ((i+1) * step) + (Math.random()-0.5)*step*0.7;
      d += ` Q${controlX} ${controlY} ${endX} ${endY}`;
    }
    return d;
  }

  function createSidebarSVG(sidebar, top, height) {
    // Remove existing SVG if present
    let oldSvg = sidebar.querySelector('svg');
    if (oldSvg) oldSvg.remove();

  // Make the path width dynamic based on the sidebar's actual width
  let sidebarWidth = sidebar.clientWidth || 120;
  let width = Math.max(70, Math.min(sidebarWidth - 10, Math.round(height * 0.32), 220));
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

    // Add a gradient for fading ends
    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'fade-gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    let stops = [
      { offset: '0%', color: 'rgba(191,167,122,0)' },
      { offset: '10%', color: '#bfa77a' },
      { offset: '90%', color: '#bfa77a' },
      { offset: '100%', color: 'rgba(191,167,122,0)' }
    ];
    stops.forEach(s => {
      let stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    svg.appendChild(defs);

    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let loops = Math.max(8, Math.floor(height/120));
    let amplitude = Math.max(40, Math.min(90, height * 0.18));
    let d = scenicLoopingPath(height, loops, amplitude, width);
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'url(#fade-gradient)');
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
