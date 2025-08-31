// Store last emoji selection and height
let lastEmojiData = { height: null, emojis: [] };

// Scenic looping SVG path from bottom to top of page, dynamic height
window.addEventListener('DOMContentLoaded', function () {
  function scenicLoopingPath(height, loops, amplitude, width) {
    // Make the path a consistent, smooth sine wave
    let d = `M${width/2} ${height}`;
    let step = height / loops;
    let freq = 5; // number of full sine waves in the column (more crests)
    for (let i = 0; i < loops; i++) {
      let t0 = i / loops;
      let t1 = (i+1) / loops;
      let controlX = width/2 + Math.sin(Math.PI * freq * (t0 + t1)/2) * amplitude;
      let controlY = height - (i * step + step/2);
      let endX = width/2 + Math.sin(Math.PI * freq * t1) * amplitude;
      let endY = height - ((i+1) * step);
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
  svg.style.left = '0';
  svg.style.transform = '';
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

  // Remove old emojis before adding new ones
  Array.from(sidebar.querySelectorAll('.sidebar-emoji')).forEach(e => e.remove());
  // Only pick new emojis if the height changes
  const emojis = [
    '⛰️','🌋','🍄','🫎','🐖','🦔','🦆','🐧','⛳','🎂','🐉', '🥕','🌵','🍂','🍀','🚀','✈️','🏁','🌊🏖️','⛺','🪤','🌝','🌞','☃️','🔥'
  ];
  let len = path.getTotalLength();
  let emojiData;
  // Scale emoji count with line height: 2 for short, up to 8 for very tall
  let minEmojis = 2;
  let maxEmojis = 8;
  let minHeight = 200;
  let maxHeight = 1200;
  let scaledCount = Math.round(
    minEmojis + (Math.min(height, maxHeight) - minHeight) / (maxHeight - minHeight) * (maxEmojis - minEmojis)
  );
  let emojiCount = Math.max(minEmojis, Math.min(maxEmojis, scaledCount));
  if (lastEmojiData.height === height) {
    emojiData = lastEmojiData.emojis;
  } else {
    emojiData = [];
    // Shuffle a copy of the emojis array for unique selection
    let shuffled = emojis.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < emojiCount; i++) {
      let emoji = shuffled[i % shuffled.length];
      // Evenly distribute t from 0 to 1
      let t = (i + 0.5) / emojiCount;
      let variance = (Math.random() - 0.5);
      emojiData.push({emoji, t, variance});
    }
    lastEmojiData.height = height;
    lastEmojiData.emojis = emojiData;
  }
  for (let i = 0; i < emojiData.length; i++) {
    let {emoji, t, variance} = emojiData[i];
    let pos = path.getPointAtLength(t * len);
    let loops = Math.max(8, Math.floor(height/120));
    let amplitude = Math.max(40, Math.min(90, height * 0.18));
    let freq = 5;
    let tWave = t;
    let xWave = width/2 + Math.sin(Math.PI * freq * tWave) * amplitude;
    // Clamp emoji x position to never go further than the max crest of the line
    let minX = width/2 - amplitude;
    let maxX = width/2 + amplitude;
    let xEmojiRaw = xWave + variance * amplitude * 2.4;
    let xEmoji = Math.max(minX, Math.min(maxX, xEmojiRaw));
    let distance = Math.abs(xEmoji - xWave);
    let maxDist = amplitude * 1.2;
    let size = 1.2 + 1.2 * (distance / maxDist); // 1.2rem to 2.4rem
    let el = document.createElement('span');
    el.textContent = emoji;
    el.className = 'sidebar-emoji';
    el.style.position = 'absolute';
    el.style.fontSize = size + 'rem';
    el.style.pointerEvents = 'none';
    el.style.left = xEmoji + 'px';
    el.style.top = (top + pos.y - 18) + 'px';
    el.style.zIndex = '4';
    el.animate([
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-8px)' },
      { transform: 'translateY(0px)' }
    ], {
      duration: 1800 + Math.random()*1200,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out',
      delay: Math.random()*2000
    });
    sidebar.appendChild(el);
  }
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
