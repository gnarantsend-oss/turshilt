import './player-hls.js';

window.openPlayer = (m) => {
  _playMovie(m);
};

function _playMovie(m) {
  const wrap = document.getElementById('playerWrap');
  const p2p  = document.getElementById('p2pStatus');
  if (!wrap) return;

  wrap.innerHTML = '';
  if (window.destroyHLS) window.destroyHLS();

  const videoUrl = m.embed || '';

  if (videoUrl.includes('.m3u8')) {
    if (window.playHLS) window.playHLS(videoUrl, wrap, p2p);

  } else if (videoUrl.toLowerCase().endsWith('.mp4') || videoUrl.includes('.mp4?')) {
    if (p2p) p2p.style.display = 'none';

    const video = document.createElement('video');
    video.src        = videoUrl;
    video.controls   = true;
    video.playsInline = true;
    // autoplay attribute оронд .play() дуудна — TV блоклохгүй
    video.crossOrigin = 'anonymous';
    video.style.cssText = 'width:100%;height:100%;background:#000;outline:none;border-radius:8px;';
    video.innerHTML = 'Таны хөтөч видео тоглуулах боломжгүй байна.';
    wrap.appendChild(video);

    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // TV autoplay блоклогдвол overlay харуул
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);border-radius:8px;';
        const btn = document.createElement('button');
        btn.textContent = '▶ Тоглуулах';
        btn.style.cssText = 'font-size:22px;padding:14px 32px;border-radius:8px;border:2px solid #fff;background:rgba(0,0,0,0.6);color:#fff;cursor:pointer;';
        btn.onclick = () => { overlay.remove(); video.play(); };
        overlay.appendChild(btn);
        wrap.style.position = 'relative';
        wrap.appendChild(overlay);
        setTimeout(() => btn.focus(), 100);
      });
    }

  } else if (videoUrl) {
    if (p2p) p2p.style.display = 'none';
    const iframe = document.createElement('iframe');
    iframe.src             = videoUrl;
    iframe.allowFullscreen = true;
    iframe.style.cssText   = 'width:100%;height:100%;border:none;background:#000;border-radius:8px;';
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    wrap.appendChild(iframe);
  }

  if (document.getElementById('pTitle')) document.getElementById('pTitle').textContent = m.title;
  document.getElementById('movieModal')?.classList.remove('open');
  document.getElementById('playerModal')?.classList.add('open');
}

window.closeM = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
  if (id === 'playerModal') {
    const w = document.getElementById('playerWrap');
    if (w) w.innerHTML = '';
    if (window.destroyHLS) window.destroyHLS();
  }
};

window.closeMb = (e, id) => { if (e.target.id === id) window.closeM(id); };
