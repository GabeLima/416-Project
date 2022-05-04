import { useTheme } from '@mui/material';
import { Box, Container, Typography } from '@mui/material';

import React from 'react'

const GameComment = ({username, content, postDate}) => {
  // console.log(postDate);
  // console.log(typeof(postDate));
  if(typeof(postDate) == "string"){
    postDate = new Date(postDate);
  }
  // console.log(username);
  // console.log(content);
  const theme = useTheme();
  return (
    <Box mb={4}>
      <Container style={{backgroundColor: theme.results.comment.bg, width:"70%", borderRadius:"20px"}}>
        <Typography variant="h6" align='left' style={{color: theme.results.comment.text, textDecoration:"underline"}} pt={2} ml={4} mr={2}>
            {username}:
        </Typography>
        <Typography variant="body1" align='left' style={{color: theme.results.comment.text}} pt={1} ml={4} mr={2}>
          {content}
        </Typography>
        <Typography variant="body1" align='right' style={{color: theme.results.comment.text}} pt={1} pb={2} mr={2}>
          Posted: {((postDate.getMonth() + 1) + "/" + postDate.getDate() + "/" + postDate.getFullYear())}
        </Typography>
      </Container>
    </Box>
  )
}

export default GameComment
