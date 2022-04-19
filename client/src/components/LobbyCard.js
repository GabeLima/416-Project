import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { useTheme } from '@mui/material';

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
);

export default function LobbyCard(props) {

  const { title, value } = props;
  
  const theme = useTheme();

  let card;
  if (value instanceof Array) {
    card = (
        <React.Fragment>
          <CardContent  >
            <Typography style={{color: theme.card.lobby.text}} sx={{textDecoration: 'underline'}} align="center" nowrap variant="h5" component="div" gutterBottom>
              {title}
            </Typography>
            <List align="center" nowrap style={{color: theme.card.lobby.text}}  sx={{ minHeight:"50px", maxHeight:"150px", overflow: "auto"}}>
              {value.map((value) => {
                  return (
                    <Typography nowrap style={{color: theme.card.lobby.text}} variant="h6" component="div" gutterBottom>
                        {bull}{value}
                    </Typography>
                  );
              })}
            </List>
          </CardContent>
        </React.Fragment>
      );
  }
  else {
    card = (
        <React.Fragment>
          <CardContent>
            <Typography sx={{textDecoration: 'underline'}} align="center" nowrap style={{color: theme.card.lobby.text}} variant="h5" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography align="center" nowrap style={{color: theme.card.lobby.text}} variant="h6" component="div" gutterBottom>
              {value}
            </Typography>
          </CardContent>
        </React.Fragment>
      );
  }

  return (
    <Box sx={{ minWidth: 275, maxWidth: 275
    }}>
      <Card variant="outlined"
            style={{
                borderRadius: "20px",
                borderStyle: "solid",
                borderWidth: "3px",
                borderColor: theme.card.lobby.border
            }}
            sx={{display: { backgroundColor: theme.card.lobby.bg}}}>
            {card}
        </Card>
    </Box>
  );
}