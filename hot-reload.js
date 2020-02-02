// Modified version of https://github.com/xpl/crx-hotreload

const filesInDirectory = (entry) =>
  new Promise((resolve) => {
    if (entry.isDirectory) {
      entry.createReader().readEntries((entries) => {
        return Promise.all(
          entries.map((e) =>
            e.isDirectory
              ? filesInDirectory(e)
              : new Promise((resolve) => e.file(resolve))
          )
        )
          .then((files) => [].concat(...files))
          .then(resolve);
      });
    } else {
      entry.file((file) => resolve([file]));
    }
  });

const timestampForFilesInDirectory = (dir) =>
  filesInDirectory(dir).then((files) =>
    files.map((f) => f.name + f.lastModifiedDate).join()
  );

const reload = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
    }
    chrome.runtime.reload();
  });
};

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then((timestamp) => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000);
    } else {
      reload();
    }
  });
};

chrome.management.getSelf((self) => {
  if (self.installType === 'development') {
    chrome.runtime.getPackageDirectoryEntry((dir) => {
      dir.createReader().readEntries((entries) => {
        for (const entry of entries) {
          if (entry.name === 'src' || entry.name === 'manifest.json') {
            watchChanges(entry);
          }
        }
      });
    });
  }
});
