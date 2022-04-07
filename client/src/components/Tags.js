import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react'

const Tags = ({tag}) => {
  return (
    <Grid item>
        <Container style={{backgroundColor:"#A1E887", borderRadius:"20px"}}>
            <Typography variant="subtitle2">
                {tag}
            </Typography>
        </Container>
    </Grid>
  )
}

export default Tags
