/* ================================================================
   works.js — 作品集页交互
   包含：筛选过滤 / 灯箱图片 / 灯箱视频播放
================================================================ */

/* ── 分类筛选 ──────────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 更新按钮状态
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // 过滤卡片
      workCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          // 重新触发 reveal 动画
          card.classList.remove('revealed');
          requestAnimationFrame(() => card.classList.add('revealed'));
        } else {
          card.style.display = 'none';
        }
      });

      // 筛选对应分类区块
      document.querySelectorAll('.work-category').forEach(section => {
        if (filter === 'all') {
          section.style.display = '';
        } else {
          section.style.display = section.id === filter ? '' : 'none';
        }
      });
    });
  });

  // URL Hash 触发筛选
  const hash = window.location.hash.slice(1);
  if (hash) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
    if (targetBtn) targetBtn.click();
  }
}

/* ── 灯箱（图片 & 视频） ──────────────────────────────────────── */
function openLightbox(src, title, isVideo) {
  let lightbox = document.getElementById('lightbox');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);
  }

  // 注入内容
  if (isVideo) {
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content lightbox-video-content">
        <button class="lightbox-close" aria-label="关闭">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <video class="lightbox-video" src="${src}" controls autoplay playsinline></video>
        <p class="lightbox-title">${title}</p>
      </div>
    `;
  } else {
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="关闭">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <img class="lightbox-image" src="${src}" alt="${title}">
        <p class="lightbox-title">${title}</p>
      </div>
    `;
  }

  // 关闭
  const close = () => {
    const v = lightbox.querySelector('video');
    if (v) v.pause();
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightbox.querySelector('.lightbox-backdrop').addEventListener('click', close);
  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });

  // 打开
  requestAnimationFrame(() => {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const v = lightbox.querySelector('video');
    if (v) v.pause();
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── 绑定卡片点击 ──────────────────────────────────────────────── */
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const videoSrc = card.dataset.video;
    const title = card.querySelector('.work-card-title')?.textContent || '';

    if (videoSrc) {
      openLightbox(videoSrc, title, true);
    } else if (img) {
      openLightbox(img.src, title, false);
    }
  });

  // 键盘可访问
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

/* ── 灯箱样式（内联） ─────────────────────────────────────────── */
(function() {
  const s = document.createElement('style');
  s.textContent = `
    #lightbox {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    #lightbox.open { opacity: 1; pointer-events: all; }
    .lightbox-backdrop {
      position: absolute; inset: 0;
      background: rgba(2,0,8,0.96);
    }
    .lightbox-content {
      position: relative; max-width: 90vw; max-height: 90vh;
    }
    .lightbox-video-content {
      max-width: 960px;
    }
    .lightbox-video {
      display: block; max-width: 100%; max-height: 80vh;
      border-radius: 4px;
    }
    .lightbox-image {
      display: block; max-width: 100%; max-height: 85vh;
      object-fit: contain; border-radius: 4px;
    }
    .lightbox-close {
      position: absolute; top: -48px; right: 0;
      background: none; border: none;
      color: var(--text-primary); cursor: pointer;
      padding: 8px; opacity: 0.7;
      transition: opacity 0.3s;
    }
    .lightbox-close:hover { opacity: 1; }
    .lightbox-title {
      text-align: center; margin-top: 16px;
      font-family: var(--font-serif); font-size: var(--text-lg);
      color: var(--text-secondary);
    }
  `;
  document.head.appendChild(s);
})();
