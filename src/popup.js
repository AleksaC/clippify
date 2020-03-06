const revealOnPage = () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: 'popup', subject: 'show' },
        () => console.log('All buttons revealed.')
      );
    }
  );
};

const removeFromPage = () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: 'popup', subject: 'clear' },
        () => console.log('Page cleared.')
      );
    }
  );
};

const disableOnPage = () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      addToBlacklist(tabs[0].url);
    }
  );
  removeFromPage();
};

const disableOnDomain = () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      addToBlacklist(new URL(tabs[0].url).hostname);
    }
  );
  removeFromPage();
};

const addToBlacklist = (url) => {
  chrome.storage.local.get('blacklist', (data) => {
    let blacklist = data.blacklist || {};
    blacklist[url] = true;
    chrome.storage.local.set({ blacklist: blacklist }, () => {});
  });
};

const $ = (selector) => document.querySelector(selector);

$('#show-all').addEventListener('click', revealOnPage);
$('#clear').addEventListener('click', removeFromPage);
$('#disable').addEventListener('click', disableOnPage);
$('#disable-domain').addEventListener('click', disableOnDomain);
$('#edit-blacklist').addEventListener('click', () =>
  window.open(chrome.runtime.getURL('src/options.html'))
);
