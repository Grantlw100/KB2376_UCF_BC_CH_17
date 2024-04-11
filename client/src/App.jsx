import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Adjust the URI to your GraphQL endpoint
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('id_token') || '',
  },
});

function App() {
  return (
    <ApolloProvider client={client} >
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
