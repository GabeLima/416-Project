import * as React from 'react';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/system';

export default function PlayerCard(props) {

    let { username, isCurrentUser } = props;

    const theme = useTheme();

    let cardElement =
        <ListItem
            id={"player"}
            
            sx={{ marginTop: '10px', bgcolor: theme.card.user.bg , height:"65px", minWidth:"100px", maxWidth:"500px"}}
            style={{
                fontSize: '24pt',
                width: '500%',
                justifyContent: "center",
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: "20px",
                borderStyle: "solid",
                borderWidth: "3px",
                borderColor: theme.card.user.border
            }}>
        
                <Typography variant="h4"
                            noWrap
                            component="div"
                            color={isCurrentUser ? theme.card.user.text : theme.card.user.otherPlayerText}
                            sx={{fontWeight: isCurrentUser ? "bold" : "", maxWidth: "200px"}}
                                >
                    {username}
                </Typography>

        </ListItem>

    return (cardElement);
}