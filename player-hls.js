import './tv-detect.js';

window._currentHls       = null;
window._currentP2pEngine = null;

window.playHLS = (url, wrap, p2pStatusEl) => {
  const video = document.createElement('video');
  video.style.width    = '100%';
  video.style.height   = '100%';
  video.controls       = true;
  video.playsInline    = true;
  // ❌ autoplay шууд тавихгүй — TV browser блоклодог
  // Харин user gesture дараа .play() дуудна

  wrap.appendChild(video);

  const tryPlay = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // Autoplay блоклогдсон → Play товч харуулна
        _showPlayOverlay(wrap, video);
      });
    }
  };

  // ── TV дээр HLS.js ашигладаггүй (MSE дэмжихгүй) ────────────
  if (window.isTV) {
    if (p2pStatusEl) p2pStatusEl.style.display = 'none';

    // Apple TV / Safari нативаар HLS дэмждэг
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', tryPlay, { once: true });
    } else {
      // Android TV / Tizen / WebOS — iframe fallback
      wrap.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src             = url;
      iframe.allowFullscreen = true;
      iframe.style.cssText   = 'width:100%;height:100%;border:none;background:#000;border-radius:8px;';
      iframe.setAttribute('allow', 'autoplay; fullscreen');
      wrap.appendChild(iframe);
    }
    return;
  }

  // ── Desktop / Mobile — P2P + HLS.js ────────────────────────
  if (typeof p2pml !== 'undefined' && p2pml.hlsjs.Engine.isSupported()) {
    if (p2pStatusEl) {
      p2pStatusEl.style.display     = 'flex';
      p2pStatusEl.innerHTML         = '<div class="p2p-dot"></div> P2P Сүлжээ идэвхтэй';
      p2pStatusEl.style.color       = '#0f0';
      p2pStatusEl.style.borderColor = 'rgba(0,255,0,0.3)';
    }
    window._currentP2pEngine = new p2pml.hlsjs.Engine();
    window._currentHls = new Hls({
      liveSyncDurationCount: 7,
      loader: window._currentP2pEngine.createLoaderClass()
    });
    p2pml.hlsjs.initHlsJsPlayer(window._currentHls);
    window._currentHls.loadSource(url);
    window._currentHls.attachMedia(video);
    window._currentHls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', tryPlay, { once: true });
  } else {
    video.src = url;
    tryPlay();
  }
};

// ── Play overlay — TV remote OK товчоор дарна ───────────────
function _showPlayOverlay(wrap, video) {
  const existing = wrap.querySelector('.tv-play-overlay');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.className = 'tv-play-overlay';
  overlay.style.cssText = `
    position:absolute;inset:0;display:flex;align-items:center;
    justify-content:center;background:rgba(0,0,0,0.4);z-index:10;
    border-radius:8px;`;

  const btn = document.createElement('button');
  btn.style.cssText = `
    display:flex;flex-direction:column;align-items:center;gap:10px;
    background:none;border:none;cursor:pointer;color:#fff;font-size:18px;`;
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="72" height="72">
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.7)" stroke="#fff" stroke-width="1.5"/>
      <polygon points="9,7 19,12 9,17" fill="white"/>
    </svg>
    <span>OK дарж тоглуулах</span>`;

  const play = () => { overlay.remove(); video.play(); };
  btn.addEventListener('click', play);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) play();
  });

  overlay.appendChild(btn);
  wrap.style.position = 'relative';
  wrap.appendChild(overlay);
  setTimeout(() => btn.focus(), 100);
}

window.destroyHLS = () => {
  if (window._currentHls)       { window._currentHls.destroy();       window._currentHls = null; }
  if (window._currentP2pEngine) { window._currentP2pEngine.destroy(); window._currentP2pEngine = null; }
};
