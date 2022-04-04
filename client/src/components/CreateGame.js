import { React, useContext, useEffect, useCallback, useState } from 'react'

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CreateGame = (props) => {

    const [timePerRound, setTimePerRound] = useState(20);
    const handleTimerChange = (event, newValue) => {
        setTimePerRound(newValue);
        console.log("New time per round: " + newValue);
    };
    

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

    const [numRounds, setNumRounds] = useState(4);
    const handleNumRoundsChange = (event, newValue) => {
        setNumRounds(newValue);
        console.log("New num rounds: " + newValue);
    };
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

    // TODO - Hardcode this?
    let tagOptions = ["Comedy", "Family-Friendly", "Drama", "Pop Culture", "Anime", "Sports", "Gaming", "Tragedy", "Educational"];
    let selectedTags = [];

    const handleTagChange = (event) => {
        let id = event.target.id;
        let tagIndex = id.substring(id.indexOf("checkbox") + 8);
        let tag = tagOptions[tagIndex];

        console.log(selectedTags);
        if (event.target.checked) {
            console.log("User enabled " + tag);
            // User enabled this tag
            if (selectedTags.includes(tag)) {
                // Some fluke, it shouldn't already be in here, just leave it as is.
                return;
            }

            selectedTags.push(tag);
        }
        else {
            // User disabled this tag
            console.log("User disabled" + tag);
            let i = selectedTags.indexOf(tag);
            if (i !== -1) {
                selectedTags.splice(i, 1);
            }
        }
        console.log(selectedTags);
    }

    const handleStartGame = (event) => {
        console.log("start game");
    }
    
    return (
        <div>
        <Box alignItems="center" sx={{ display: {
            backgroundColor: "#6A8D92",

        } }}>

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
                    Tags For This Game
                </Typography>

                <FormGroup 
                        sx={{
                            marginTop:5,
                            marginLeft:10,
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                        sc={{bgcolor: "#6A8D92"}}>
                    {tagOptions.map((tag, i) => {
                        return (
                            <FormControlLabel labelPlacement="bottom" control={<Checkbox id={"checkbox" + i} onChange={handleTagChange} style={{color: "#493548"}}/>} label={tag} />
                        )
                        
                    })
                    }
                </FormGroup>
            </Box>
            
            <Box sx={{height:75}} />

            <Box alignItems="center" justifyContent="center" sx={{ 
                    width: 700,
                    marginLeft: "45%"
                    }}>
            

                <Button variant="contained"
                        style={{
                            borderRadius: 35,
                            backgroundColor: "#4b4e6d",
                            padding: "18px 36px",
                            fontSize: "18px",
                        }}
                        onClick={handleStartGame}
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
