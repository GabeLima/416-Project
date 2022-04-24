import { React, useState } from 'react'

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import TextField from '@mui/material/TextField';

import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import { useContext } from 'react';
import { GlobalStoreContext } from '../store'
import GlobalGameContext from '../game';
import { useTheme } from '@mui/material';
const crypto = require("crypto");

const CreateGame = (props) => {

    const history = useHistory();
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const { game } = useContext(GlobalGameContext);
    //This doesnt work ATM for browser redirection, as getLoggedIn gets called after the component renders, and we aren't logged in :(
    // if(!auth.loggedIn === true){
    //     console.log("Redirecting user back to home page as they're not logged in!");
    //     store.setErrorMessage("You must be logged in to create a game!");
    //     history.push("/");
    // }


    const [timePerRound, setTimePerRound] = useState(20);
    const handleTimerChange = (event, newValue) => {
        setTimePerRound(newValue);
        console.log("New time per round: " + newValue);
    };
    
    const [numRounds, setNumRounds] = useState(4);
    const handleNumRoundsChange = (event, newValue) => {
        setNumRounds(newValue);
        console.log("New num rounds: " + newValue);
    };

    const [selectedTags, setSelectedTags] = useState([]);
    let tagOptions = ["Comedy", "Family-Friendly", "Drama", "Pop Culture", "Anime", "Sports", "Gaming", "Tragedy", "Educational"];

    const handleTagChange = (event) => {
        let id = event.target.id;
        let tagIndex = id.substring(id.indexOf("checkbox") + 8);
        let tag = tagOptions[tagIndex];

        if (event.target.checked) {
            console.log("User enabled " + tag);
            // User enabled this tag
            if (selectedTags.includes(tag)) {
                // Some fluke, it shouldn't already be in here, just leave it as is.
                return;
            }

            setSelectedTags((selectedTags) => [...selectedTags, tag]);
        }
        else {
            // User disabled this tag
            console.log("User disabled " + tag);
            let i = selectedTags.indexOf(tag);
            if (i !== -1) {
                //selectedTags.splice(i, 1);
                setSelectedTags((selectedTags) => [
                    ...selectedTags.filter((item, index) => index !== i)
                ]);
            }
        }
    }

    const [customTags, setCustomTags] = useState("");
    const handleKeyPress = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setCustomTags(event.target.value);
    }

    const timeSliderMarks = [
        {
            value: 10,
            label: "10 Seconds"
        },
        {
            value: 20,
            label: "20 Seconds"
        },
        {
            value: 30,
            label: "30 Seconds"
        },
        {
            value: 40,
            label: "40 Seconds"
        },
        {
            value: 50,
            label: "50 Seconds"
        },
        {
            value: 60,
            label: "60 Seconds"
        },

    ];

    
    const roundSliderMarks = [
        {
            value: 2,
            label: "2 rounds"
        },
        {
            value: 4,
            label: "4 rounds"
        },
        {
            value: 6,
            label: "6 rounds"
        },
        {
            value: 8,
            label: "8 rounds"
        },
        {
            value: 10,
            label: "10 rounds"
        },
    ];



    const handleCreateGame = (event) => {
        console.log("create game with parameters:");
        let selectedTags_copy = selectedTags.slice();

        if (customTags) {
            customTags.split(",")
                .map(i => i.trim())
                .forEach((elem, i) => {
                    // prevent dupes
                    if (!selectedTags_copy.includes(elem)) {
                        selectedTags_copy.push(elem);
                    }
            });
        }

        console.log(timePerRound);
        console.log(numRounds);
        console.log(selectedTags_copy);

        //Generate an id to create the game with
        const gameID = crypto.randomBytes(3).toString("hex");

        console.log(gameID);

        game.createGame({gameID:gameID, numRounds:numRounds, timePerRound:timePerRound, tags: selectedTags_copy, email: auth.user.email, username: auth.user.username, isComic:store.isComic});
    }
    
    let currentNumTags = selectedTags.length + customTags.split(",").filter((v) => v !== "").length;
    console.log("current num tags " + currentNumTags);
    let canCreate = (currentNumTags > 5 ? false : true);

    const theme = useTheme();

    return (
        <div>
            {/* "#6A8D92" display{backgroundColor:}*/}
        <Box alignItems="center" sx={{ bgcolor: 'background.default'}}>

            <Typography variant="h1"
                        noWrap
                        component="div"
                        align="center">
                Create a Game
            </Typography>

            <Box alignItems="center" justifyContent="center" sx={{ 
                    width: 700,
                    marginLeft: "30%"
                    }}>
                
                <Typography variant="h4"
                        noWrap
                        component="div"
                        sx={{
                            marginTop:10,
                            marginLeft:10,
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'}}>
                    Time Per Round:
                </Typography>
                <Slider
                    aria-label="Time Per Round"
                    defaultValue={20}
                    step = {1}
                    min={10}
                    max={60}
                    valueLabelDisplay="auto"
                    marks={timeSliderMarks}
                    onChangeCommitted={handleTimerChange}
                />
            </Box>

            <Box alignItems="center" justifyContent="center" sx={{ 
                    width: 700,
                    marginLeft: "30%"
                    }}>
                
                <Typography variant="h4"
                        noWrap
                        component="div"
                        sx={{
                            marginTop:10,
                            marginLeft:10,
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'}}>
                    Number of Rounds:
                </Typography>
                <Slider
                    aria-label="Number of Rounds"
                    defaultValue={4}
                    step = {1}
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    marks={roundSliderMarks}
                    onChangeCommitted={handleNumRoundsChange}
                />
            </Box>
            

            <Box alignItems="center" justifyContent="center" sx={{ 
                    width: 700,
                    marginLeft: "30%"
                    }}>
                {/*Altered marginLeft to make te text visible on screen*/}
                <Typography variant="h4"
                        noWrap
                        component="div"
                        sx={{
                            marginTop:10,
                            marginLeft:6,
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'}}>
                    Tags For This Game (Max 5 tags!)
                </Typography>
                        
                {/*sc={{bgcolor: "6A8D92"}}*/}
                <FormGroup 
                        sx={{
                            marginTop:5,
                            marginLeft:10,
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                        sc={{bgcolor: "secondary"}}>
                    {tagOptions.map((tag, i) => {
                        let disabled = (currentNumTags > 4 ? true : false);
                        if (selectedTags.includes(tag)) {
                            // leave the selected tags as clickable or else we get locked out
                            disabled = false;
                        }
                        return (
                            <>
                            {/* style={{color: "#493548"}}*/}
                            <FormControlLabel key={i} labelPlacement="bottom" control={<Checkbox disabled={disabled} id={"checkbox" + i} onChange={handleTagChange} color='secondary'/>} label={tag} />
                            </>
                        );
                        
                    })
                    }
                </FormGroup>

                {/*
                InputLabelProps={{
                            style: { color: '#493548' },
                        }}
                */}
                <Box display="flex" justifyContent="center">
                    <TextField id="standard-basic" label="Custom Tags (Comma Separated)" variant="filled"
                        fullWidth
                        sx={{
                            marginTop:5,
                            marginLeft:10,
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        color='secondary'
                        style={{
                            borderRadius: "10px",
                            borderStyle: "solid",
                            borderColor: "#6A6A6A"
                        }}
                        onChange={handleKeyPress}
                    
                    />
                </Box>
                
            </Box>
            
            <Box sx={{height:75}} />

            <Box alignItems="center" justifyContent="center" sx={{ 
                    width: 700,
                    marginLeft: "45%"
                    }}>
            
                {/* backgroundColor: "#4b4e6d", */}
                <Button variant="contained"
                        style={{
                            borderRadius: 35,
                            padding: "18px 36px",
                            fontSize: "18px",
                            backgroundColor: theme.button.bg
                        }}
                        sx={{color: theme.button.text}}
                        onClick={handleCreateGame}
                        disabled={!canCreate}
                        >
                    Create Game
                </Button>
            </Box>

            <Box sx= {{ height: 200}}/>

            
        </Box>
        </div>
    );
}

export default CreateGame;
