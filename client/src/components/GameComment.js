import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';

import React from 'react'

const GameComment = ({user, message, postDate}) => {
  return (
    <Box mb={4}>
      <Container style={{backgroundColor:"white", width:"70%", borderRadius:"20px"}}>
        <Typography variant="h6" align='left' style={{color:"#4b4e6d", textDecoration:"underline"}} pt={2} ml={4} mr={2}>
            {user}:
        </Typography>
        <Typography variant="body1" align='left' style={{color:"#4b4e6d"}} pt={1} ml={4} mr={2}>
          {message}
        </Typography>
        <Typography variant="body1" align='right' style={{color:"#4b4e6d"}} pt={1} pb={2} mr={2}>
          Posted: {postDate.getMonth() + "/" + postDate.getDate() + "/" + postDate.getFullYear()}
        </Typography>
      </Container>
    </Box>
  )
}

export default GameComment
