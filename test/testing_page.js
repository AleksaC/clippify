const insertPre = (parent, text) => {
  const pre = document.createElement('pre');
  pre.textContent = text;
  parent.appendChild(pre);
};

setTimeout(() => {
  insertPre(document.body, 'Added later to body');
  insertPre(
    document.querySelector('#insert-here'),
    'Added later deeper inside DOM'
  );
}, 1000);
