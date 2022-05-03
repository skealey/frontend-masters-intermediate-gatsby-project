const { createRemoteFileNode } = require('gatsby-source-filesystem');
const authors = require('./src/data/authors.json');
const books = require('./src/data/books.json');

exports.sourceNodes = ({ actions, createContentDigest, createNodeId }) => {
  const { createNode, createTypes } = actions;

  createTypes(`
    type Author implements Node {
       books: [Book!]! @link(from: "slug" by: "author.slug")
    }

    type Book implements Node {
       author: Author! @link(from: "author" by: "slug")
    }
  `);

  authors.forEach((author) => {
    createNode({
      ...author,
      id: createNodeId(`author-${author.slug}`),
      parent: null,
      children: [],
      internal: {
        type: 'Author',
        content: JSON.stringify(author),
        contentDigest: createContentDigest(author),
      },
    });
  });

  books.forEach((book) => {
    createNode({
      ...book,
      id: createNodeId(`book-${book.isbn}`),
      parent: null,
      children: [],
      internal: {
        type: 'Book',
        content: JSON.stringify(book),
        contentDigest: createContentDigest(book),
      },
    });
  });
};

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: '/custom',
    component: require.resolve('./src/templates/custom.js'),
    context: {
      title: 'A Custom Page!',
      description: 'A Custom Page with context.',
    },
  });
};

exports.createResolvers = ({
  createResolvers,
  actions,
  cache,
  createNodeId,
  store,
  reporter,
}) => {
  const { createNode } = actions;
  const resolvers = {
    Book: {
      buyLink: {
        type: 'String',
        resolve: (source) =>
          `https://www.powells.com/searchresults?keyword=${source.isbn}`,
      },
      cover: {
        type: 'File',
        resolve: (source) => {
          return createRemoteFileNode({
            url: `https://covers.openlibrary.org/b/isbn/${source.isbn}-L.jpg`,
            store,
            cache,
            createNode,
            createNodeId,
            reporter,
          });
        },
      },
    },
  };

  createResolvers(resolvers);
};
