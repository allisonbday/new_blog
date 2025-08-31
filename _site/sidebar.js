





  function createSidebarSVG(sidebar, top, height) {
    // Remove existing SVG
    let oldSvg = sidebar.querySelector('svg');
    if (oldSvg) oldSvg.remove();

    let sidebarWidth = sidebar.clientWidth || 120;
    let svgWidth = Math.max(70, Math.min(sidebarWidth * 0.7, Math.round(height * 0.32), 320));
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${height}`);
    svg.style.position = 'absolute';
    svg.style.top = top + 'px';
    svg.style.left = '0';

    // Gradient for line
    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'fade-gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    [
      { offset: '0%', color: 'rgba(191,167,122,0)' },
      { offset: '10%', color: '#bfa77a' },
      { offset: '90%', color: '#bfa77a' },
      { offset: '100%', color: 'rgba(191,167,122,0)' }
    ].forEach(s => {
      let stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    svg.appendChild(defs);

    let loops = Math.max(8, Math.floor(height/120));
    let amplitude = Math.max(40, Math.min(svgWidth * 0.45, height * 0.18));
  let centerOffset = svgWidth / 2 + 20;
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
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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
      '🚗','🧭','⛺','🔥','🍫','☕','🌲','🦉','🌙','⭐', '🚙','🛤️','🌵','🌞','🐍','🐢','🍉','🔥','🌌',
    ];
    let len = path.getTotalLength();
    let emojiCount = Math.max(2, Math.min(8, Math.round(height / 180)));
    let shuffled = emojis.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < emojiCount; i++) {
      let emoji = shuffled[i % shuffled.length];
      let t = (i + 0.5) / emojiCount;
      let variance = (Math.random() - 0.5);
      let pos = path.getPointAtLength(t * len);
      let tWave = t;
  let xWave = centerOffset + Math.sin(Math.PI * freq * tWave) * amplitude;
  let minX = centerOffset - amplitude;
  let maxX = centerOffset + amplitude;
  let xEmojiRaw = xWave + variance * amplitude * 2.4;
  let xEmoji = Math.max(minX, Math.min(maxX, xEmojiRaw));
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
  }



  window.runSidebar = function() {
    function resizeSidebarSVG() {
      let listing = document.querySelector('.quarto-listing-default');
      let sidebar = document.querySelector('.blog-left-sidebar');
      if (!listing || !sidebar) return;
      let posts = listing.querySelectorAll('.quarto-post');
      if (!posts.length) return;
      let firstPost = posts[0];
      let lastPost = posts[posts.length - 1];
      let top = firstPost.offsetTop;
      let bottom = lastPost.offsetTop + lastPost.offsetHeight;
      let height = bottom - top;
      createSidebarSVG(sidebar, top, height);
    }
    resizeSidebarSVG();
    window.addEventListener('resize', resizeSidebarSVG);
    let listing = document.querySelector('.quarto-listing-default');
    if (listing) {
      let observer = new MutationObserver(resizeSidebarSVG);
      observer.observe(listing, { childList: true, subtree: true });
    }
  }
