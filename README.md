# gatsby-source-kibela

[![npm version](https://img.shields.io/npm/v/gatsby-source-kibela.svg)](https://www.npmjs.com/package/gatsby-source-kibela)
[![install size](https://packagephobia.now.sh/badge?p=gatsby-source-kibela)](https://packagephobia.now.sh/result?p=gatsby-source-kibela)
[![test](https://github.com/shooontan/gatsby-source-kibela/actions/workflows/test.yml/badge.svg)](https://github.com/shooontan/gatsby-source-kibela/actions/workflows/test.yml)

Gatsby Source Plugin for [Kibela](https://kibe.la/).

## Install

```sh
# npm
$ npm install gatsby-source-kibela

# or yarn
$ yarn add gatsby-source-kibela
```

## Usage

### gatsby-config.js

You need setting options in `gatsby-config.js` to fetch contents from Kibela.

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-kibela',
      options: {
        accessToken: 'my/access/token',
        subDomain: 'blog',
      },
    },
  ],
};
```

### gatsby-node.js

You can query like the following. Gatsby creates pages based on Kibela contents.

```js
// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(
    `
      query {
        allKibelaNote {
          nodes {
            id
            noteId
            path
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panic(result.errors);
  }

  result.data.allKibelaNote.nodes.forEach((node, index) => {
    createPage({
      path: `/notes/${node.noteId}`,
      component: path.resolve('./src/templates/blog-note.js'),
      context: {
        slug: node.noteId,
      },
    });
  });
};
```

### Options

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-kibela',
      options: {
        /**
         * The authentication key for Kibela API requests. (Required)
         *
         * Type: string
         **/
        accessToken: 'YOUR_ACCESS_TOKEN',

        /**
         * Subdomain information. (Required)
         * subdomain.kibe.la
         *
         * Type: string
         **/
        subDomain: 'subdomain',

        /**
         * Graphql API request query. (Required)
         *
         * Type: string
         **/
        query: `
          query {
            notes(last: 100) {
              nodes {
                id
                title
                content
              }
            }
          }
        `,

        /**
         * This function let Gatsby system where Graphql data nodes is. (Optional)
         *
         * Type: function
         * Default: body => body.data.notes.nodes
         **/
        getNodes: body => body.data.group.notes.nodes,
      },
    },
  ],
};
```
