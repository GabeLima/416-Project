import React from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { useState } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { ToggleButtonGroup } from '@mui/material';
import { Grid } from '@mui/material';
import Tags from "./Tags"
import LiveGameCard from './LiveGameCard';
import PublishedGameCard from './PublishedGameCard';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import { useContext, useEffect, createRef } from 'react';
import { SocketContext } from "../context/socket";
import GlobalGameContext from "../game";
import api from '../api';

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
            fullWidth
            sx = {{
                px: 2,
                mb: 2, 
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

    let history = useHistory();

    const handleClick = (pageURL) => {
        console.log(pageURL);
        history.push(pageURL);
    };

    const { auth } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const { game } = useContext(GlobalGameContext);
    const { store } = useContext(GlobalStoreContext);

    const [publishedGames, setPublishedGames] = useState([]);

    let gameCodeInput = createRef();

    useEffect(() => {
        if (socket && auth.loggedIn && auth.user) {
            
            socket.emit("storeClientInfo", {email: auth.user.email});
        }
    }, [auth.loggedIn]);

    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            event.stopPropagation();
            event.preventDefault();
            // Pass off to the join game handler
            let gameID = event.target.value;
            console.log("Attempting to join game with ID " + gameID);
            game.joinGame({gameID: gameID, username: auth.user.username});
        }
    }

    const handleJoinClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log(gameCodeInput.current);
        console.log("Attempting to join game with ID " + gameCodeInput.current.value);
        game.joinGame({gameID: gameCodeInput.current.value, username: auth.user.username});
    }

    const [liveGames, setLiveGames] = useState([]);

    useEffect(() => {
        socket.emit("getAllGames");

        socket.on("gameList", (data) => {
            const filteredGames = [];
            data.forEach((g) => {
                if (g.isComic === store.isComic) {
                    filteredGames.push(g);
                }
            });
            console.log(store.isComic ? "loading comics" : "loading stories");
            console.log(filteredGames);
            setLiveGames(filteredGames);
        });

    }, [store.isComic, alignment]);

    // load comics by default
    useEffect(() => {
        socket.emit("getAllGames");

        socket.on("gameList", (data) => {
            const filteredGames = [];
            data.forEach((g) => {
                if (g.isComic) {
                    filteredGames.push(g);
                }
            });
            console.log("loading comics");
            console.log(filteredGames);
            setLiveGames(filteredGames);
        });
    }, []);

    //Load Published Games
    useEffect(() => {
        const getGames = async() => {
            api.getLatestGames().then((response) => {
                return response.data.games;
            }).then((data) => {
                console.log(data);
                setPublishedGames(data);
                return data;
            })
        }

        getGames();
    },[])

    function deleteCard(id){
        console.log("Deleting Card: ", id);
        console.log(publishedGames.filter(g => g.gameID != id));
        setPublishedGames(publishedGames.filter(g => g.gameID != id));
    }

    useEffect(() => {
        socket.emit("getAllGames");

        socket.on("gameList", (data) => {
            const filteredGames = [];
            data.forEach((g) => {
                if (g.isComic === store.isComic) {
                    filteredGames.push(g);
                }
            });
            console.log(store.isComic ? "loading comics" : "loading stories");
            console.log(filteredGames);
            setLiveGames(filteredGames);
        });

    }, [store.isComic, alignment]);

    // load comics by default
    useEffect(() => {
        socket.emit("getAllGames");

        socket.on("gameList", (data) => {
            const filteredGames = [];
            data.forEach((g) => {
                if (g.isComic) {
                    filteredGames.push(g);
                }
            });
            console.log("loading comics");
            console.log(filteredGames);
            setLiveGames(filteredGames);
        });
    }, []);

    // const publishedGames = []
    //     {
    //         creator:"vicky",
    //         gameID : "JYGS",
    //         panels: [
    //             ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"],
    //             ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
    //         ],
    //         communityVotes: [
    //             ["npc1", "npc2"],
    //             []
    //         ],
    //         comments: [
    //             {
    //               user:"user1",
    //               message:"WOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH I can't believe what i'm seeing this reminds me of this one scene from another series. This made me want to go back and reread that series again.",
    //               postDate:new Date()
    //             },
    //             {
    //               user:"user2",
    //               message:"Wow, this was the best thing I've ever seen in my life. I will never be the same. 10 out of 10, would recommend.",
    //               postDate:new Date()
    //             },
    //             {
    //               user:"user3",
    //               message:"This was my favorite part! I've looked at this for over  5 hours and can't get it out my head!",
    //               postDate:new Date()
    //             },
    //             {
    //               user:"user4",
    //               message:"I hope one day I can see something as beautiful as this again. I can't believe something as amazing as this exists!",
    //               postDate:new Date()
    //             },
    //             {
    //               user:"user5",
    //               message:"I hope the user above me has a good day",
    //               postDate:new Date()
    //             },
    //         ],
    //         tags : ["Unbelievable", "Pokemon", "Digimon", "War"]
    //     },
    //     {
    //         creator:"david",
    //         gameID : "KUGB",
    //         panels: [
    //             ["/images/mark_oukan_crown7_blue.png", "/images/4.png", "/images/4.png", "/images/4.png"],
    //             ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
    //         ],
    //         communityVotes: [
    //             [],
    //             []
    //         ],
    //         comments: [
    //             {
    //               user:"user1",
    //               message:"WOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH I can't believe what i'm seeing this reminds me of this one scene from another series. This made me want to go back and reread that series again.",
    //               postDate:new Date()
    //             },
    //             {
    //               user:"user2",
    //               message:"Wow, this was the best thing I've ever seen in my life. I will never be the same. 10 out of 10, would recommend.",
    //               postDate:new Date()
    //             },
    //             {
    //               user:"user3",
    //               message:"This was my favorite part! I've looked at this for over  5 hours and can't get it out my head!",
    //               postDate:new Date()
    //             }
    //         ],
    //         tags : ["NewPlayer", "Crown"]
    //     }
    // ];


    return (
        <>
        <Box className="back" pb={4}>
            <Typography align="center" variant="h1">Games</Typography>
            <Grid 
                container 
                direction='row'
            >
                <Grid item xs={10}>
                    {alignment === "live" ? 
                        <Grid container>
                            {liveGames.map(({creator, gameID, numRounds, timePerRound, tags}, i) => (
                                <LiveGameCard key={i} creator={creator} gameID={gameID} numRounds={numRounds} timePerRound={timePerRound} tags={tags}/>
                            ))}
                        </Grid> : ''
                    }

                    {alignment === "completed" ? 
                        <Grid container>
                            {publishedGames.map(({creator, tags, communityVotes, comments, panels, isComic, gameID}, i) => (
                                <PublishedGameCard key={gameID} creator={creator} tags={tags} votes={communityVotes} comments={comments} panels={panels} isComic={isComic} gameID={gameID} deleteCard={deleteCard}/>
                            ))}
                        </Grid> : ''
                    }
                </Grid>


                <Grid item xs={2}>
                    <Grid container justifyContent="right" pr={2}>
                        <Box>
                            <Typography align="center" variant="h4" sx={{mt: 3, mb: 2, width:'100%'}}>Filter Games</Typography>
                            <GameToggle alignment={alignment} setAlignment={setAlignment} />
                            <Typography align="center" variant="h4" sx={{mt: 3, width:'100%'}}>Join Game</Typography>
                            <TextField inputRef={gameCodeInput} color='secondary' disabled={!auth.loggedIn} onKeyPress={handleKeyPress} name="game-code" label="Game Code" id="game-code" sx={{mt: 3, mb: 2, width:'100%'}} />
                            <Button variant="contained" disabled={!auth.loggedIn} sx={{mt: 3, mb: 2, width:'100%', backgroundColor:"#4b4e6d", color:"white", fontWeight:"bold"}} onClick={handleJoinClick}>
                                Join Game
                            </Button>
                            <Button variant="contained" disabled={!auth.loggedIn} sx={{mt: 3, mb: 2, width:'100%', backgroundColor:"#4b4e6d", color:"white", fontWeight:"bold"}} onClick={() => handleClick('/create')}>
                                Create Game
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

            {/* 
            Hacky solution from whoever created GameLobby
            It just creates a big box so that the background color
            fills the whole screen
            
            <Box sx= {{ height: 400}}/>
            */}
        </Box>
        </>
    )
}

export default HomeScreen;