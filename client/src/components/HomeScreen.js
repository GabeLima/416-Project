import React from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { useContext, useState } from 'react'
import { Container, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { ToggleButtonGroup } from '@mui/material';
import { Grid } from '@mui/material';
import Tags from "./Tags"
import LiveGameCard from './LiveGameCard';
import PublishedGameCard from './PublishedGameCard';


// toggles between live and completed games
const GameToggle = ({alignment, setAlignment}) => {
        const handleChange = (event, newAlignment) => {
            if(newAlignment !== null) {
                setAlignment(newAlignment);
            }
        };
        return (
        <ToggleButtonGroup 
            exclusive 
            onChange={handleChange}
            value={alignment}
            sx = {{
                px: 2
            }}
        >
            <ToggleButton color="secondary" value="completed">
                <Typography><strong>Completed</strong></Typography>
            </ToggleButton>
            <ToggleButton color="secondary" value="live">
                <Typography><strong>Live</strong></Typography>
            </ToggleButton>
        </ToggleButtonGroup>
        );
};

const HomeScreen = () => {
    const [alignment, setAlignment] = useState('completed');
    //const { auth } = useContext(AuthContext);
    //const { store } = useContext(GlobalStoreContext);


    // useEffect(() => {
    //     store.loadIdNamePairs();
    // }, []);

    // obtain a list of cards based on what is being asked
    // Story/Comic
    // Completed/Joinable

    //Example data
    const liveGames = [
        {
            players:["tim", "gabe", "david", "vicky"],
            creator:"tim",
            gameID : "IYBH",
            numRounds : 5,
            timePerRound : 30,
            tags : ["Anime", "Superpower", "Stickman", "Basic"]
        },
        {
            players:["tim", "gabe", "david", "vicky"],
            creator:"gabe",
            gameID : "JYGS",
            numRounds : 2,
            timePerRound : 10,
            tags : ["notCool"]
        },
        {
            players:["jan", "tim", "gabe", "david", "vicky"],
            creator:"jan",
            gameID : "YGFV",
            numRounds : 4,
            timePerRound : 27,
            tags : ["b"]
        },
        {
            players:["jack", "tim", "gabe", "david", "vicky"],
            creator:"jack",
            gameID : "KUGH",
            numRounds : 8,
            timePerRound : 35,
            tags : []
        },
    ];

    const publishedGames = [
        {
            creator:"vicky",
            gameID : "JYGS",
            panels: [
                ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"],
                ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
            ],
            communityVotes: [
                ["npc1", "npc2"],
                []
            ],
            comments: [
                {
                  user:"user1",
                  message:"WOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH I can't believe what i'm seeing this reminds me of this one scene from another series. This made me want to go back and reread that series again.",
                  postDate:new Date()
                },
                {
                  user:"user2",
                  message:"Wow, this was the best thing I've ever seen in my life. I will never be the same. 10 out of 10, would recommend.",
                  postDate:new Date()
                },
                {
                  user:"user3",
                  message:"This was my favorite part! I've looked at this for over  5 hours and can't get it out my head!",
                  postDate:new Date()
                },
                {
                  user:"user4",
                  message:"I hope one day I can see something as beautiful as this again. I can't believe something as amazing as this exists!",
                  postDate:new Date()
                },
                {
                  user:"user5",
                  message:"I hope the user above me has a good day",
                  postDate:new Date()
                },
            ],
            tags : ["Unbelievable", "Pokemon", "Digimon", "War"]
        },
        {
            creator:"david",
            gameID : "KUGB",
            panels: [
                ["/images/mark_oukan_crown7_blue.png", "/images/4.png", "/images/4.png", "/images/4.png"],
                ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
            ],
            communityVotes: [
                [],
                []
            ],
            comments: [
                {
                  user:"user1",
                  message:"WOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH I can't believe what i'm seeing this reminds me of this one scene from another series. This made me want to go back and reread that series again.",
                  postDate:new Date()
                },
                {
                  user:"user2",
                  message:"Wow, this was the best thing I've ever seen in my life. I will never be the same. 10 out of 10, would recommend.",
                  postDate:new Date()
                },
                {
                  user:"user3",
                  message:"This was my favorite part! I've looked at this for over  5 hours and can't get it out my head!",
                  postDate:new Date()
                }
            ],
            tags : ["NewPlayer", "Crown"]
        }
    ];

    return (
        <>
        <Box className="back" pb={4}>
            <Typography align="center" variant="h1">Games</Typography>
            <Grid 
                container 
                direction='row'
            >
                <Grid item xs={10}>
                    {alignment == "live" ? 
                        <Grid container>
                            {liveGames.map(({creator, gameID, numRounds, timePerRound, tags}) => (
                                <LiveGameCard creator={creator} gameID={gameID} numRounds={numRounds} timePerRound={timePerRound} tags={tags}/>
                            ))}
                        </Grid> : ''
                    }

                    {alignment == "completed" ? 
                        <Grid container>
                            {publishedGames.map(({creator, tags, communityVotes, comments, panels}) => (
                                <PublishedGameCard creator={creator} tags={tags} votes={communityVotes} comments={comments} panels={panels}/>
                            ))}
                        </Grid> : ''
                    }
                </Grid>


                <Grid item xs={2}>
                    <Grid container justifyContent="right" pr={2}>
                        <Box>
                            <Typography align="center" variant="h4">Filter Games</Typography>
                            <GameToggle alignment={alignment} setAlignment={setAlignment}/>
                            <Typography align="center" variant="h4">Join Game</Typography>
                            <TextField name="game-code" label="Game Code" id="game-code"/>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

        </Box>
        </>
    )
}

export default HomeScreen;