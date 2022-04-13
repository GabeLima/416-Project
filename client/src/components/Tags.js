import { Container, Grid, Typography } from '@mui/material';
import React from 'react'
import useTheme from '@mui/material/styles/useTheme';

const Tags = ({tag}) => {
  let theme = useTheme();
  return (
    <Grid item>
        <Container style={{backgroundColor: theme.lobby.button.main, borderRadius:"20px"}}>
            <Typography variant="subtitle2">
                {tag}
            </Typography>
        </Container>
    </Grid>
  )
}

export default Tags
