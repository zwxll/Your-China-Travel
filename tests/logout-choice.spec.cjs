const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const start = source.indexOf("  signOutBtn.addEventListener('click'");
const end = source.indexOf('  async function initCloudAuth()', start);
if (start < 0 || end < 0) throw new Error('找不到退出账号处理逻辑');
const signOutScript = source.slice(start, end);

async function runSignOut(clearLocalData) {
  let clickHandler;
  const state = { travelRecords: ['孝感市'], toast: '', refreshed: 0 };
  const storage = new Map([
    ['travelCloudOwner', 'user-1'],
    ['travelCloudDirty', '1'],
    ['travelCloudUpdatedAt', '2026-09-30'],
  ]);
  const context = {
    signOutBtn: {
      disabled: false,
      addEventListener(type, handler) { if (type === 'click') clickHandler = handler; },
    },
    cloudSigningOut: false,
    cloudSyncEpoch: 0,
    cloudSyncTimer: null,
    cloudSuppressDirty: false,
    cloudUser: { id: 'user-1' },
    cloudConfig: { url: 'https://example.supabase.co' },
    cloudClient: { auth: { async signOut() { return { error: null }; } } },
    CLOUD_OWNER_KEY: 'travelCloudOwner',
    CLOUD_DIRTY_KEY: 'travelCloudDirty',
    CLOUD_UPDATED_KEY: 'travelCloudUpdatedAt',
    localStorage: {
      removeItem(key) { storage.delete(key); },
      setItem(key, value) { storage.set(key, value); },
      getItem(key) { return storage.get(key) ?? null; },
    },
    confirm() { return clearLocalData; },
    clearTimeout() {},
    async withTimeout(promise) { return promise; },
    async clearCloudDataPreservingLocalVideos() { state.travelRecords.length = 0; },
    setStorageMode() {},
    async refreshState() { state.refreshed += 1; },
    updateAccountUI() {},
    closeAuth() {},
    toast(message) { state.toast = message; },
    friendlyAuthError(error) { return String(error); },
    URL,
  };
  vm.runInNewContext(signOutScript, context);
  await clickHandler();
  return { state, context, storage };
}

test('选择清除时，退出账号并删除当前浏览器旅行资料', async () => {
  const result = await runSignOut(true);
  assert.deepEqual(result.state.travelRecords, []);
  assert.equal(result.context.cloudUser, null);
  assert.equal(result.state.refreshed, 1);
});

test('选择保留时，退出账号但保留当前浏览器旅行资料', async () => {
  const result = await runSignOut(false);
  assert.deepEqual(result.state.travelRecords, ['孝感市']);
  assert.equal(result.context.cloudUser, null);
  assert.equal(result.state.refreshed, 1);
});
