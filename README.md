# Clippify

Copying code made easy.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ojdofoikeplghgcomajojeinnjniecld)](https://chromewebstore.google.com/detail/clippify/ojdofoikeplghgcomajojeinnjniecld)
[![Firefox](https://img.shields.io/amo/v/clippify)](https://addons.mozilla.org/en-US/firefox/addon/clippify/)

## About

A large portion of our work as developers consists of copying code from various
websites. Some websites provide you with the convenience of copying the entire
snippet usually by clicking on a button in top right corner. I thought that it
would be nice if all (or at least most) websites did that. Seeing that a lot
of websites display their code in a similar way (a `pre` element usually
containing a `code` element) I realized that this could be achieved relatively
easily through a browser extension.

### Screenshots

To get a glimpse of the extension used in the wild take a look at the following
screenshots:

Quickly copy those README instructions. It works on Gitlab and BitBucket as
well (screenshots not included).
![GitHub Readme](screenshots/github.png)

---

It even works on stack exchange. Not remembering how to untar a file just got a
lot easier.
![Stack Overflow](screenshots/stack-overflow.png)

---

It works on documentation websites for most projects I use on a daily basis.
Gork those PyTorch tutorials like a pro.
![Stack Overflow](screenshots/docs.png)

---

Heck it even works on many blogs!
![Stack Overflow](screenshots/blog.png)

## Features

The extension places a button in top right corner of each code block inside
the page. The buttons are invisible and only appear when you hover over them.
On some pages it is difficult to determine where the buttons are placed, so
there is an option to show all buttons inside the page. You can also remove all
copy buttons from the page, or add the entire page or domain to a blacklist
where the extension is blocked. The blacklist is stored locally, so it's not
shared between devices.
