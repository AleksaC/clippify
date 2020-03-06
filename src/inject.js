const base64ClippyIcon =
  'PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIGhlaWdodD0iMTAyNCIgd2lkdGg9Ijg5NiIge' +
  'G1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik03MDQgOD' +
  'k2SDY0VjMyMGg2NDB2MTkyaDY0VjE5MmMwLTM1LjMxMi0yOC42MjUtNjQtNjQtNjRINTEyQzU' +
  'xMiA1Ny4zNDQwMDAwMDAwMDAwNSA0NTQuNjU2IDAgMzg0IDBTMjU2IDU3LjM0NDAwMDAwMDAw' +
  'MDA1IDI1NiAxMjhINjRjLTM1LjQwNiAwLTY0IDI4LjY4OC02NCA2NHY3MDRjMCAzNS4zNzUgM' +
  'jguNTk0IDY0IDY0IDY0aDY0MGMzNS4zNzUgMCA2NC0yOC42MjUgNjQtNjRWNzY4aC02NFY4OT' +
  'Z6TTE5MiAxOTJjMCAwIDAgMCA2NCAwczY0LTY0IDY0LTY0YzAtMzUuMzEyIDI4LjU5NC02NCA' +
  '2NC02NHM2NCAyOC42ODggNjQgNjRjMCAwIDAgNjQgNjQgNjRoNjRjNjQgMCA2NCA2NCA2NCA2' +
  'NEgxMjhDMTI4IDI1NiAxMjggMTkyIDE5MiAxOTJ6TTEyOCA3MDRoMTI4di02NEgxMjhWNzA0e' +
  'k01NzYgNTc2VjQ0OEwzMjAgNjQwbDI1NiAxOTJWNzA0aDMyMFY1NzZINTc2ek0xMjggODMyaD' +
  'E5MnYtNjRIMTI4VjgzMnpNNDQ4IDM4NEgxMjh2NjRoMzIwVjM4NHpNMjU2IDUxMkgxMjh2NjR' +
  'oMTI4VjUxMnoiLz4KPC9zdmc+';

const btn = `
  <div class="copy-plugin-button-ref">
    <button class="copy-plugin-button">
      <img src="data:image/svg+xml;base64, ${base64ClippyIcon}" alt="">
    </button>
  </div>
`;

const copiedTooltip = `
  <div class="copy-plugin-tooltip">
    Copied!
  </div>
`;

const copyToClipboard = (c) => {
  const textArea = document.createElement('textarea');
  document.body.appendChild(textArea);

  textArea.value = c.textContent.trim();
  textArea.select();
  document.execCommand('Copy');

  textArea.remove();
};

const computeOffset = (codeBlock) => {
  const style = getComputedStyle(codeBlock);

  const x = parseInt(style.paddingRight);
  const y = parseInt(style.paddingTop);

  return [x, y];
};

const setBtnPosition = (btn, code) => {
  const [offsetRight, offsetTop] = computeOffset(code);

  const top = -offsetTop + 5;
  const right = -offsetRight + 5;

  btn.setAttribute(
    'style',
    `top: ${top}px !important; right: ${right}px !important;`
  );
};

const flashTooltip = (btn) => {
  const tmp = document.createElement('template');
  tmp.innerHTML = copiedTooltip.trim();
  const tooltip = tmp.content.firstChild;

  btn.appendChild(tooltip);

  setTimeout(() => {
    btn.removeChild(tooltip);
  }, 500);
};

const insertButton = (preElement) => {
  const tmp = document.createElement('template');
  tmp.innerHTML = btn.trim();
  const copyBtn = tmp.content.firstChild;

  const cpBtn = copyBtn.querySelector('button');
  setBtnPosition(cpBtn, preElement);

  copyBtn.addEventListener('click', () => {
    copyToClipboard(preElement);
    flashTooltip(cpBtn);
  });

  preElement.insertBefore(copyBtn, preElement.firstChild);

  preElement.addEventListener('scroll', (e) => {
    copyBtn.setAttribute(
      'style',
      `left: ${e.target.scrollLeft}px !important; top: ${e.target.scrollTop}px !important;`
    );
  });
};

const revealAll = () => {
  const btns = document.querySelectorAll('.copy-plugin-button');
  for (const btn of btns) {
    btn.setAttribute(
      'style',
      `${btn.getAttribute('style')} opacity: 1 !important;`
    );
  }
};

const removeAll = () => {
  const btns = document.querySelectorAll('.copy-plugin-button-ref');
  for (const btn of btns) {
    btn.parentNode.removeChild(btn);
  }
};

const isBlacklisted = (onTrue, onFalse) => {
  chrome.storage.local.get('blacklist', (data) => {
    try {
      const blacklist = data.blacklist || {};
      const url = location.href;
      if (blacklist[url] || blacklist[new URL(url).hostname]) {
        onTrue();
        return;
      }
    } catch (e) {
      console.log(e);
    }
    onFalse();
  });
};

const mutationObserver = new MutationObserver((mutationRecords) => {
  for (const mutationRecord of mutationRecords) {
    if (mutationRecord.addedNodes.length > 0) {
      for (const node of mutationRecord.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        if (node.nodeName === 'PRE') {
          insertButton(node);
        } else {
          const preChildren = node.querySelectorAll('pre');
          for (const pre of preChildren) {
            insertButton(pre);
          }
        }
      }
    }
  }
});

isBlacklisted(
  () => {},
  () => {
    const preElements = document.querySelectorAll('pre');

    for (const preElement of preElements) {
      insertButton(preElement);
    }

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }
);

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from === 'popup') {
    if (msg.subject === 'clear') {
      removeAll();
      mutationObserver.disconnect();
    } else if (msg.subject === 'show') {
      revealAll();
    }
  }
});
