const { memoize, shellCommand } = require('cerebro-tools');

// TODO: Add Loader (https://github.com/KELiON/cerebro-ui#preload)

const GI_ICON = require('./gitignore_ico.png');
const ID = 'gitignore-builder';

const fetchData = memoize((terms) => {
  return fetch(`https://www.gitignore.io/api/${terms}`)
    .then(response => response.text())
});

const searchForTerms = (terms, display, actions) => {
  fetchData(terms).then(gitignoreResponse => {
    // console.log(gitignoreResponse);
    actions.copyToClipboard(gitignoreResponse);
    display({
      id: ID,
      title: 'Built! Press ENTER to save into your clipboard!',
      GI_ICON,
      onSelect: () => actions.copyToClipboard(gitignoreResponse)
    });
  })
};

const plugin = ({term, display, update, actions}) => {
  const match = term.match(/^gib\s(.+)/);
  if (match) {
    const termsToUse = match[1];
    display({
      id: ID,
      GI_ICON,
      title: `Press ENTER to build .gitignore for: ${termsToUse}`,
      subtitle: 'After built, it will be available in your clipboard =)',
      onSelect: (event) => {
        event.preventDefault();
        searchForTerms(termsToUse, display, actions);
      }
    });
  } else if (term.match(/^gib\s?/)) {
    display({
      id: ID,
      title: 'Like: java,java-web,python,ruby,visualstudiocode,eclipse,intellij',
      subtitle: 'More info (Just hit ENTER): https://www.gitignore.io',
      GI_ICON,
      onSelect: () => {
        actions.open(`https://www.gitignore.io`)
        actions.hideWindow()
      }
    });
  }
}

module.exports = {
  name: '.gitignore builder',
  fn: plugin,
  keyword: 'gib',
};