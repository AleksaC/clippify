const blacklistItem = `
  <li>{url} <a class="remove-btn" href="">remove</a></li>
`;

const removeFromBlacklist = (url) => {
  chrome.storage.local.get('blacklist', (data) => {
    let blacklist = data.blacklist || {};
    delete blacklist[url];
    chrome.storage.local.set({ blacklist: blacklist }, () => {});
  });
};

const addBlacklistItem = (item, root) => {
  const tmp = document.createElement('template');
  tmp.innerHTML = blacklistItem.trim().replace('{url}', item);
  const li = tmp.content.firstChild;

  li.querySelector('.remove-btn').addEventListener('click', (e) => {
    e.preventDefault();
    removeFromBlacklist(item);
    location.reload();
  });

  root.appendChild(li);
};

chrome.storage.local.get('blacklist', (data) => {
  let blacklist = data.blacklist || {};

  const items = document.querySelector('#blacklist-items');

  if (Object.keys(blacklist).length === 0) {
    const noData = document.createElement('div');
    noData.textContent = 'Blacklist is empty.';
    items.appendChild(noData);
  }

  for (const item in blacklist) {
    if (blacklist.hasOwnProperty(item)) {
      addBlacklistItem(item, items);
    }
  }
});

document.querySelector('#clear-blacklist').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.storage.local.clear();
  location.reload();
});
