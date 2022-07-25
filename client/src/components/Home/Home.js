import React, { useEffect, useState } from 'react'
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { getPosts, getPostsBySearch } from '../../actions/posts';
import Pagination from '../Pagination';
import { createSearchParams,useNavigate, useSearchParams } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';


function useQuery() {
   return new URLSearchParams(window.location.search);
};

const Home = () => {   
 const classes = useStyles();
 const dispatch = useDispatch();
 const [currentId, setCurrentId] = useState(null);
 const [search, setSearch] = useState('');
 const [tags, setTags] = useState([]);
 const query = useQuery();
 const page = query.get('page') || 1;
 const searchQuery = query.get('searchQuery');
 const navigate = useNavigate();

 const searchPost = () => {
   if(search.trim() || tags) {
   dispatch(getPostsBySearch({ search, tags: tags.join(',')}));
   navigate(`/posts/search?searchQuery=${search||'none'}&tags=${tags.join(',')||'none'}`);
   } else {
     navigate(`/`);
   }
 }
 
 const handleAddChip = (tag) => {
   setTags([...tags, tag])
  };
  
  const handleDeleteChip = (tagToDelete) => {
   setTags(tags.filter((tag) => tag !== tagToDelete))
  };

 const handleKeyPress = (e) => {
   if(e.keyCode === 13) {
     searchPost()
   }
 };
 
    return (
    <Grow in>
    <Container maxWidth="xl">
      <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
        <Grid item xs={12} sm={6} md={9}>
          <Posts setCurrentId={setCurrentId} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppBar className={classes.appBarSearch} position="static" color="inherit">
            <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
            <ChipInput
              style={{ margin: '10px 0' }}
              value={tags}
              onAdd={(chip) => handleAddChip(chip)}
              onDelete={(chip) => handleDeleteChip(chip)}
              label="Search Tags"
              variant="outlined"
            />
            <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
          </AppBar>
          <Form currentId={currentId} setCurrentId={setCurrentId} />
          {(!searchQuery && !tags.length) && (
            <Paper  elevation={6}>
              <Pagination className={classes.pagination} page={page} />
            </Paper>
          )}         
        </Grid>
      </Grid>
    </Container>
  </Grow>
    )
};

export default Home;
