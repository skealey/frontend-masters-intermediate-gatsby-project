import React from 'react';
import slugify from 'slugify';
import { graphql, Link } from 'gatsby';

export const query = graphql`
  query AuthorPage($id: String!) {
    author(id: { eq: $id }) {
      name
      books {
        id
        name
        series
        seriesOrder
      }
    }
  }
`;

export default function AuthorPage({ data }) {
  const author = data.author;
  const books = author.books;

  return (
    <div>
      <h1>{author.name}</h1>
      <pre>{JSON.stringify(books, null, 2)}</pre>
    </div>
  );
}
