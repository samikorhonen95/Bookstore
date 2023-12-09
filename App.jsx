import React from 'react';
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

const url = ('https://bookstore-b9219-default-rtdb.europe-west1.firebasedatabase.app/books/.json');

function App() { 
  const [books, setBooks] = useState([]);

  const columnDefs = [
    {field: 'title', sortable: true, filter: true},
    {field: 'author', sortable: true, filter: true},
    {field: 'year', sortable: true, filter: true},
    {field: 'isbn', sortable: true, filter: true},
    {field: 'price', sortable: true, filter: true},
    { headerName: '', field: 'id', width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon/>
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch(url)
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(error => console.error(error));
  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
      Object.defineProperty(item, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  const addBook = (newBook) => {
    fetch(url,
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchBooks())
    .catch(error => console.error(error))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-b9219-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchBooks())
    .catch(error => console.error(error))
  }

  return (
    <>
      <AppBar position="static" style={{width: '1280px'}}>
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook}/>
      <div className='ag-theme-material' style={{height: '400px', width: '1280px'}}>
        <AgGridReact 
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;