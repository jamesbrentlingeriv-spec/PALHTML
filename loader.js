(() => {
    const overlay = document.getElementById('page-loader-overlay');
    const image = document.getElementById('page-loader-image');
    if (!overlay || !image) return;

    const minLoaderMs = Number(overlay.dataset.minMs || 3000);
    const maxImageWaitMs = Number(overlay.dataset.maxWait || 7000);
    const isMobileDevice =
        window.matchMedia('(max-width: 900px) and (pointer: coarse)').matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobileDevice) {
        overlay.style.setProperty('--loader-scale', '0.8');
    }

    const sources = (overlay.dataset.loaderSources || image.getAttribute('src') || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);

    const shownAt = Date.now();
    let pageLoaded = document.readyState === 'complete';
    let imageResolved = false;

    const hideWhenReady = () => {
        if (!pageLoaded || !imageResolved) return;
        const elapsed = Date.now() - shownAt;
        const delay = Math.max(0, minLoaderMs - elapsed);
        setTimeout(() => {
            overlay.classList.add('is-hidden');
            setTimeout(() => overlay.remove(), 400);
        }, delay);
    };

    let idx = 0;
    const tryNextSource = () => {
        if (idx >= sources.length) {
            imageResolved = true;
            hideWhenReady();
            return;
        }
        image.src = sources[idx++];
    };

    image.addEventListener('load', () => {
        imageResolved = true;
        hideWhenReady();
    }, { once: true });

    image.addEventListener('error', () => {
        if (imageResolved) return;
        tryNextSource();
    });

    setTimeout(() => {
        if (!imageResolved) {
            imageResolved = true;
            hideWhenReady();
        }
    }, maxImageWaitMs);

    if (pageLoaded) {
        hideWhenReady();
    } else {
        window.addEventListener('load', () => {
            pageLoaded = true;
            hideWhenReady();
        }, { once: true });
    }

    if (sources.length === 0) {
        imageResolved = true;
        hideWhenReady();
        return;
    }

    tryNextSource();
})();
