// Store last emoji selection and height
let lastEmojiData = { height: null, emojis: [] };

window.addEventListener('DOMContentLoaded', function () {
  // Generate a smooth sine wave SVG path
  function scenicLoopingPath(height, loops, amplitude, width) {
  let centerOffset = width * 0.25;
  let d = `M${centerOffset} ${height}`;
    let step = height / loops;
    let freq = 5;
    for (let i = 0; i < loops; i++) {
      let t0 = i / loops;
      let t1 = (i+1) / loops;
  let controlX = centerOffset + Math.sin(Math.PI * freq * (t0 + t1)/2) * amplitude;
      let controlY = height - (i * step + step/2);
  let endX = centerOffset + Math.sin(Math.PI * freq * t1) * amplitude;
      let endY = height - ((i+1) * step);
      d += ` Q${controlX} ${controlY} ${endX} ${endY}`;
    }
    return d;
  }

  function createSidebarSVG(sidebar, top, height) {
    // Remove existing SVG
    let oldSvg = sidebar.querySelector('svg');
    if (oldSvg) oldSvg.remove();

    // Dynamic SVG width
    let sidebarWidth = sidebar.clientWidth || 120;
    // Dynamic left padding: 10% of sidebar width, min 12px, max (sidebarWidth - svgWidth - rightMargin)
    const rightMargin = 12;
    let svgWidth = Math.max(70, Math.min(sidebarWidth * 0.7, Math.round(height * 0.32), 320));
    let dynamicLeftPadding = Math.max(12, Math.min(Math.round(sidebarWidth * 0.10), sidebarWidth - svgWidth - rightMargin));
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${height}`);
    svg.style.display = 'block';
    svg.style.margin = '0';
    svg.style.width = svgWidth + 'px';
    svg.style.position = 'absolute';
    svg.style.top = top + 'px';
    svg.style.left = '0';
    svg.style.transform = '';
    svg.style.right = '';
    svg.style.alignSelf = '';

    // Add left padding for the line
    const leftPadding = 100;
    svg.style.left = dynamicLeftPadding + 'px';

    // Gradient for line
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
    let amplitude = Math.max(40, Math.min(svgWidth * 0.45, height * 0.18));
    // Draw the path using the full SVG width
    let d = (function(height, loops, amplitude, width) {
      let centerOffset = width * 0.25;
      let d = `M${centerOffset} ${height}`;
      let step = height / loops;
      let freq = 5;
      for (let i = 0; i < loops; i++) {
        let t0 = i / loops;
        let t1 = (i+1) / loops;
        let controlX = centerOffset + Math.sin(Math.PI * freq * (t0 + t1)/2) * amplitude;
        let controlY = height - (i * step + step/2);
        let endX = centerOffset + Math.sin(Math.PI * freq * t1) * amplitude;
        let endY = height - ((i+1) * step);
        d += ` Q${controlX} ${controlY} ${endX} ${endY}`;
      }
      return d;
    })(height, loops, amplitude, svgWidth);
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'url(#fade-gradient)');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-dasharray', '12 14');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    sidebar.appendChild(svg);

    // Remove old emojis
    Array.from(sidebar.querySelectorAll('.sidebar-emoji')).forEach(e => e.remove());
    // Emoji set
    const emojis = [
      '⛰️','🌋','🍄','🫎','🐖','🦔','🦆','🐧','⛳','🎂','🥕','🌵','🍂','🍀','🚀','✈️','🏁','🌊','🏖️','⛺','🪤','🌝','🌞','☃️','🔥'
    ];
    let len = path.getTotalLength();
    let emojiData;
    // Scale emoji count with line height
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
      // Shuffle for unique emojis
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
  // Offset emoji path by 25% from center
  let centerOffset = svgWidth * 0.25;
  let xWave = centerOffset + Math.sin(Math.PI * freq * tWave) * amplitude;
  let minX = centerOffset - amplitude;
  let maxX = centerOffset + amplitude;
  let xEmojiRaw = xWave + variance * amplitude * 2.4;
  let xEmoji = Math.max(minX, Math.min(maxX, xEmojiRaw));
  let distance = Math.abs(xEmoji - xWave);
  let maxDist = amplitude * 1.2;
  // Vary emoji size randomly between 1.2rem and 2.4rem
  let size = 1.2 + Math.random() * 3;
  let el = document.createElement('span');
  el.textContent = emoji;
  el.className = 'sidebar-emoji';
  el.style.position = 'absolute';
  el.style.fontSize = size + 'rem';
  el.style.pointerEvents = 'none';
  el.style.left = xEmoji + 'px';
  el.style.top = (top + pos.y - 18) + 'px';
  el.style.zIndex = '0';
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
      createSidebarSVG(sidebar, top, height);
    }
  }
  resizeSidebarSVG();
  setTimeout(resizeSidebarSVG, 100);
  window.addEventListener('resize', resizeSidebarSVG);
  var listing = document.querySelector('.quarto-listing-default');
  if (listing) {
    var observer = new MutationObserver(function() {
      resizeSidebarSVG();
    });
    observer.observe(listing, { childList: true, subtree: true });
  }
});
