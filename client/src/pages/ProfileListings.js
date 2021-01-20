import React , { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, CssBaseline, Grid, TextField, Typography } from '@material-ui/core/';

import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ProfileCard from '../components/profileListings/profileCard';


const useStyles = makeStyles(theme => ({
    search: {
        marginTop: theme.spacing(10),
    },
    searchInputs: {
        margin: theme.spacing(0),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      },
    dateField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(0),
        width: 200,
      },
      textField: {
        fontWeight:"bold"
      },
      gridContainer: {
          marginTop: theme.spacing(5),
          paddingRight: theme.spacing(5),
          paddingLeft: theme.spacing(5)
      },
      errorAndLoading: {
          textAlign:'center'
      }
}))

function ProfileListings(){
    const classes = useStyles();
    const url = '/api/profile/'

    const [sitters, setSitters] = useState({
        loading: false,
        data: null,
        error: undefined
    });
    
    useEffect(() =>{
        setSitters({
            loading: true,
            data: null,
            error: undefined,
        })
        axios.get(url)
            .then(response => {
                setSitters({
                    loading: false,
                    data: response.data,
                    error: undefined
                })
            }).catch(error => {
                setSitters({
                    loading: false,
                    data: null,
                    error: error.message
                })
            })
    }, [url])

    let content = null;

    //set sitters content to display
    if(sitters.error){ //if error occurs, display error message
        content = <h1>
            {sitters.error}
        </h1>
    }
    if(sitters.loading){ // display a loading page while page is requesting data
        content = <h1>Loading...</h1>
    }
    if(sitters.data){ // set profile data to display
        content = 
        sitters.data.map((sitter, key) => 
            <ProfileCard 
                firstName={sitter.firstName} 
                lastName={sitter.lastName}
                profilePicture={sitter.profilePicture}
                rating="4"
                description={sitter.description} />
        )
    }

    return(
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.search}>
                <Typography 
                    component="h5" 
                    variant="h5" 
                    align="center"
                    style={{fontWeight:"bold", marginBottom: "10px"}}>
                    Your search results
                </Typography>
                {/* Search buttons */}
                   <div className={classes.searchInputs}>
                   <Grid container spacing={0} justify="center" alignItems="flex-end">
                     <Grid item>
                       <SearchIcon style={{color: '#f04040'}}/>
                     </Grid>
                     <Grid item>
                       <TextField 
                            id="input-with-icon-grid" 
                            label="location" 
                            variant="standard"
                            className={classes.textField}/>
                     </Grid>
                     <Grid item>
                     <form className={classes.container} noValidate>
                        <TextField
                            id="date-picker-inline"
                            label="Drop off"
                            type="date"
                            defaultValue="today"
                            className={classes.dateField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                        <TextField
                            id="date"
                            label="Pickup"
                            type="date"
                            defaultValue="today"
                            className={classes.dateField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </form>
                    </Grid>
                   </Grid>
                </div>
            </Container>
            <Grid container direction="row" spacing={3} justify="flex-start" align="center"  className={classes.gridContainer}>
            {content}
            </Grid>

        </React.Fragment>
    );
}

export default ProfileListings;