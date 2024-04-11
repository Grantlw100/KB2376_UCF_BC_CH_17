import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [deleteBook] = useMutation(DELETE_BOOK);
  const { data, loading, error } = useQuery(GET_ME);

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (error) {
    console.error('Failed to fetch user data:', error.message);
    return <p>Error loading saved books!</p>;
  }

  const savedBooks = data?.me?.savedBooks || [];

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook({
        variables: { bookId },
        update(cache) {
          const existingBooks = cache.readQuery({ query: GET_ME });
          const newBooks = existingBooks?.me?.savedBooks.filter(b => b.bookId !== bookId);
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...existingBooks.me, savedBooks: newBooks } },
          });
        },
      });
      removeBookId(bookId);
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };
  

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container fluid>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {savedBooks.length
            ? `Viewing ${savedBooks.length} saved ${savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
