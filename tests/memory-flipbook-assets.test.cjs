const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'assets', 'memory-flipbook');
const requiredAssets = [
  'vendor/page-flip.browser.js',
  'vendor/PAGE-FLIP-LICENSE',
  'paper-grain.svg',
  'cloth-weave.svg',
  'fonts/SourceSerif4-Regular.otf.woff2',
  'fonts/SourceSerif4-It.otf.woff2',
  'fonts/LICENSE.md',
  'fonts/SOURCE.txt',
  'memory-flipbook.js',
];

test('all flipbook runtime assets are local and licensed', () => {
  for (const file of requiredAssets) {
    assert.ok(fs.existsSync(path.join(assetRoot, file)), `missing ${file}`);
  }
  assert.ok(fs.statSync(path.join(assetRoot, 'vendor', 'PAGE-FLIP-LICENSE')).size > 0);
  const adapter = fs.readFileSync(path.join(assetRoot, 'memory-flipbook.js'), 'utf8');
  assert.doesNotMatch(adapter, /https?:\/\//i);
});

test('adapter exposes the navigation controller contract', () => {
  const source = fs.readFileSync(path.join(assetRoot, 'memory-flipbook.js'), 'utf8');
  const pages = [{}, {}, {}];
  const flips = [];

  class FakePageFlip {
    constructor(element, options) {
      this.element = element;
      this.options = options;
      this.index = 0;
      this.listeners = {};
      this.destroyCount = 0;
      FakePageFlip.instance = this;
    }
    on(name, handler) { this.listeners[name] = handler; }
    loadFromHTML(input) { this.pages = Array.from(input); }
    getPageCount() { return this.pages.length; }
    getCurrentPageIndex() { return this.index; }
    flipNext() { if (this.index < this.pages.length - 1) this.turnToPage(this.index + 1); }
    flipPrev() { if (this.index > 0) this.turnToPage(this.index - 1); }
    turnToPage(index) {
      this.index = index;
      if (this.listeners.flip) this.listeners.flip({ data: index });
    }
    destroy() { this.destroyCount += 1; }
  }

  const window = { innerWidth: 1200, St: { PageFlip: FakePageFlip } };
  vm.runInNewContext(source, { window });
  assert.equal(typeof window.MemoryFlipbook.create, 'function');

  const controller = window.MemoryFlipbook.create({
    root: { querySelectorAll: () => pages },
    initialPage: 1,
    mobileBreakpoint: 760,
    reduceMotion: true,
    onFlip: index => flips.push(index),
  });

  assert.deepEqual(
    ['next', 'prev', 'turnTo', 'getPageIndex', 'destroy'].map(name => typeof controller[name]),
    ['function', 'function', 'function', 'function', 'function']
  );
  assert.equal(controller.getPageIndex(), 1);
  controller.next();
  controller.next();
  assert.equal(controller.getPageIndex(), 2, 'next stops at the last page');
  controller.prev();
  controller.turnTo(-1);
  assert.equal(controller.getPageIndex(), 1, 'invalid pages are ignored');
  assert.deepEqual(flips, [1, 2, 1]);
  controller.destroy();
  controller.destroy();
  assert.equal(FakePageFlip.instance.destroyCount, 1, 'destroy is idempotent');
});
