import { useTheme } from '@emotion/react';
import { Box, Container, Typography } from '@mui/material';

import React from 'react'

const GameComment = ({user, message, postDate}) => {
  const theme = useTheme();
  return (
    <Box mb={4}>
      <Container style={{backgroundColor: theme.results.comment.bg, width:"70%", borderRadius:"20px"}}>
        <Typography variant="h6" align='left' style={{color: theme.results.comment.text, textDecoration:"underline"}} pt={2} ml={4} mr={2}>
            {user}:
        </Typography>
        <Typography variant="body1" align='left' style={{color: theme.results.comment.text}} pt={1} ml={4} mr={2}>
          {message}
        </Typography>
        <Typography variant="body1" align='right' style={{color: theme.results.comment.text}} pt={1} pb={2} mr={2}>
          Posted: {(postDate.getMonth() + 1) + "/" + postDate.getDate() + "/" + postDate.getFullYear()}
        </Typography>
      </Container>
    </Box>
  )
}

export default GameComment
