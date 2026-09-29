(function (global) {
  'use strict';

  function create(options) {
    const root = options && options.root;
    const PageFlip = global.St && global.St.PageFlip;
    if (!root || !PageFlip) throw new Error('MemoryFlipbook requires a root and PageFlip runtime');

    const pages = root.querySelectorAll('.book-page');
    const pageCount = pages.length;
    const breakpoint = Number(options.mobileBreakpoint) || 760;
    const width = Number(root.dataset && root.dataset.pageWidth) || 510;
    const height = Number(root.dataset && root.dataset.pageHeight) || 680;
    const onFlip = typeof options.onFlip === 'function' ? options.onFlip : function () {};
    let currentPage = 0;
    let destroyed = false;

    function updatePageFocus(index) {
      const landscape = global.innerWidth > breakpoint;
      Array.prototype.forEach.call(pages, function (page, pageIndex) {
        if (!page || typeof page.querySelectorAll !== 'function') return;
        const visible = pageIndex === index || (landscape && index > 0 && pageIndex === index + 1);
        if (typeof page.setAttribute === 'function') page.setAttribute('aria-hidden', visible ? 'false' : 'true');
        page.querySelectorAll('button, a, input, select, textarea, [tabindex]').forEach(function (item) {
          if (!visible) {
            if (!item.hasAttribute('data-memory-flipbook-tabindex')) {
              item.setAttribute('data-memory-flipbook-tabindex', item.getAttribute('tabindex') || '');
            }
            item.tabIndex = -1;
          } else if (item.hasAttribute('data-memory-flipbook-tabindex')) {
            const original = item.getAttribute('data-memory-flipbook-tabindex');
            if (original) item.setAttribute('tabindex', original);
            else item.removeAttribute('tabindex');
            item.removeAttribute('data-memory-flipbook-tabindex');
          }
        });
      });
    }

    const pageFlip = new PageFlip(root, {
      width,
      height,
      size: 'stretch',
      minWidth: Math.round(width * 0.55),
      maxWidth: width,
      minHeight: Math.round(height * 0.55),
      maxHeight: height,
      drawShadow: !options.reduceMotion,
      flippingTime: options.reduceMotion ? 1 : 720,
      usePortrait: true,
      autoSize: true,
      showCover: true,
      mobileScrollSupport: false,
      clickEventForward: true,
      useMouseEvents: true,
      swipeDistance: 24,
      showPageCorners: !options.reduceMotion,
    });

    pageFlip.on('flip', function (event) {
      currentPage = Number(event.data) || 0;
      updatePageFocus(currentPage);
      onFlip(currentPage);
    });
    pageFlip.loadFromHTML(pages);

    function turnTo(index) {
      const target = Number(index);
      if (destroyed || !Number.isInteger(target) || target < 0 || target >= pageCount) return;
      pageFlip.turnToPage(target);
      currentPage = target;
      updatePageFocus(currentPage);
    }

    turnTo(Number.isInteger(options.initialPage) ? options.initialPage : 0);

    function refreshLayout() {
      if (destroyed) return;
      if (root.dataset) root.dataset.layout = global.innerWidth <= breakpoint ? 'portrait' : 'landscape';
      pageFlip.update();
      updatePageFocus(currentPage);
    }

    function handleResize() { refreshLayout(); }
    if (typeof global.addEventListener === 'function') global.addEventListener('resize', handleResize);
    if (root.dataset) root.dataset.layout = global.innerWidth <= breakpoint ? 'portrait' : 'landscape';

    return {
      next: function () {
        if (!destroyed && currentPage < pageCount - 1) pageFlip.flipNext('bottom');
      },
      prev: function () {
        if (!destroyed && currentPage > 0) pageFlip.flipPrev('bottom');
      },
      turnTo,
      getPageIndex: function () { return currentPage; },
      refreshLayout,
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        if (typeof global.removeEventListener === 'function') global.removeEventListener('resize', handleResize);
        pageFlip.destroy();
      },
    };
  }

  global.MemoryFlipbook = { create };
})(window);
