import * as React from 'react';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';

export default function PlayerCard(props) {

    const { username, isCurrentUser } = props;

    let cardElement =
        <ListItem
            id={"player"}
            
            sx={{ marginTop: '10px',bgcolor: "#4b4e6d", height:"65px", minWidth:"100px", maxWidth:"500px"}}
            style={{
                fontSize: '24pt',
                width: '500%',
                borderRadius: "15px",
                justifyContent: "center",
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: "20px",
                borderStyle: "solid",
                borderWidth: "3px",
                borderColor: "#80b192"
            }}>
        
                <Typography variant="h4"
                            noWrap
                            component="div"
                            color={isCurrentUser ? "#A1E887" : "#EEEEFF"}
                            sx={{fontWeight: isCurrentUser ? "bold" : ""}}
                                >
                    {username}
                </Typography>

        </ListItem>

    return (cardElement);
}