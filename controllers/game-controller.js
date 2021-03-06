const Game = require("../models/game-model");
const Image = require("../models/image-model");
const Text = require("../models/text-model");

createGame = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a properly formatted Game Object.',
        });
    }

    const newGame = new Game(body);

    if (!newGame) {
        return res.status(400).json({ success: false, error: err })
    }
    console.log("Creating game: " + JSON.stringify(newGame));

    newGame.
        save().
        then(() => {
            return res.status(201).json({
                success: true,
                game: newGame,
                message: 'Game Created!'
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error,
                message: 'Game Not Created!'
            })
        });
}


search = async (req, res) => {
    const query = req.params.query;
    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a search query.',
        });
    }

    const tags = []; // search must include AT LEAST ONE TAG
    const users = []; // search must include ALL USERS

    query.split(",")
        .map(i => i.trim())
        .forEach((elem, i) => {
            elem.substring(0, 2) === "u:" ? users.push(elem.substring(2)) : tags.push(elem);

    });
    console.log("Query with:");
    console.log(tags);
    console.log(users);

    if (users.length === 0) {
        await Game.find( {tags: { $in: tags }}, (err, games) => {
            if (err) {
                return res.status(400).json({ success: false, error: err});
            }
            return res.status(200).json({ success: true, data: games});
        });
    }
    else if (tags.length === 0) {
        await Game.find( {players: { $all: users}}, (err, games) => {
            if (err) {
                return res.status(400).json({ success: false, error: err});
            }
            return res.status(200).json({ success: true, data: games});
        });
    }
    else {
        await Game.find( {tags: { $in: tags }, players: { $all: users}}, (err, games) => {
            if (err) {
                return res.status(400).json({ success: false, error: err});
            }
            return res.status(200).json({ success: true, data: games});
        });
    }

}


getGame = async (req, res) => {
    const gameID = req.params.gameID;
    if (!gameID) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a game ID',
        });
    }

    await Game.findOne({gameID: gameID}, (err, game) => {
        if (err) {
            return res.status(404).json({
                success: false,
                err,
                message: "Game not found!"
            });
        }
        else if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found!"
            });
        }
        console.log("Game Found");
        console.log(game);
        return res.status(200).json({ success: true, game: game});
    });
}


updateGame = async (req, res) => {
    const {communityVotes, comments, email, unVote} = req.body;
    const gameID = req.params.gameID;

    // ALL of these must be present.
    // players, panels, playerVotes, rounds, timePerRound, isPublic, tags will be immutable after a game is published.
    // TODO - We could have the client selectively send the relevant fields, but that might be something we discuss later when implementing front end.

    await Game.findOne({gameID: gameID}, (err, game) => {
        if (!game) {
            return res.status(404).json({
                success: false,
                message: "This game does not exist."
            });
        }

        // console.log("Vote: ", communityVotes);
        // console.log("Email: ", email);
        // console.log("Unvote: ", unVote);
        if(communityVotes !== undefined){
            // game.communityVotes = communityVotes;
            //removing existing vote
            let votes = [...game.communityVotes];
            for(let i = 0; i < votes.length; i++)
            {
                let removedI = votes[i].indexOf(email);
                if(removedI > -1)
                {
                    votes[i].splice(removedI, 1);
                    break;
                }
            }

            if(!unVote){    //If the user is not unvoting
                votes[communityVotes].push(email);
            }

            game.communityVotes = votes;
            game.markModified("communityVotes");
        }

        console.log("Votes after: ", game.communityVotes);

        if(comments){
            game.comments.push(comments);
        }

        game.
            save().
            then(() => {
                return res.status(200).json({
                    success: true,
                    game: game,
                    message: "Game updated"
                });
            }).catch(err => {
                console.log("FAILURE: " + JSON.stringify(err));
                return res.status(404).json({
                    success: false,
                    err,
                    message: "Game not updated"
                })
            });
    });
}

deleteGame = async (req, res) => {
    const gameID = req.params.gameID;
    Game.findOne({gameID: gameID}, (err, game) => {
        if (err || !game) {
            return res.status(404).json({
                err,
                message: 'Game not found!',
            })
        }
        // generate list of ids to delete
        let ids = []
        for(let i=0; i<game.panels.length; i++) {
            for(let j=0; j<game.panels[i].length; j++) {
                let id = game.panels[i][j]
                if(!ids.includes(id))
                    ids.push(id)
            }
        }

        console.log("deleteGame: list of ids to delete", ids)

        // delete images/text from db
        if (game.isComic) {
            console.log("deleteGame: deleting images")
            ids.forEach( id => Image.findOneAndDelete({imageID: id}, (err, img)=>{
                if(err || !img)
                    console.log("deleteGame: couldn't delete ", id)
            }))
        }
        else {
            console.log("deleteGame: deleting text")
            ids.forEach( id => Text.findOneAndDelete({textID: id}, (err, txt)=>{
                if(err || !txt)
                    console.log("deleteGame: couldn't delete ", id)
            }))
        }

        // delete game from db
        Game.findOneAndDelete({ gameID: gameID }, () => {
            return res.status(200).json({ success: true })
        }).catch(err => console.log(err))
    });
}

getImage = async(req, res) => {
    const {panels} = req.body;
    let result = [];

    try{
        console.log("Inside getImage! ImageID: ", panels);
        if(panels === undefined){
            console.log("imageID was not provided as parameter");
            return res.status(404).json({
                message: 'panels not provided!',
            })
        }


        console.log("Searching for imageID: ", panels);

        // Image.findOne({imageID: imageID}, (err, data) => {
        //     if(err ||!data) {
        //         console.log("Error in getImage: " + err);
        //         return res.status(404).json({
        //             err,
        //             message: 'Image not found!',
        //         })
        //     }

        //     console.log("Got Image: ", imageID);
        //     return res.status(200).json({ success: true, image: data.image.toString()});
        // });
        for(let i = 0; i < panels.length; i++){
            //Get images in a round
            let round = await Image.find({imageID : {$in : panels[i]}}).sort({imageID : 1});

            let temp = [];
            for(let j = 0; j < round.length; j++){
                temp.push(round[j].image.toString());
            }
            // console.log(`Round ${i}: `, temp);
            result.push(temp);
        }

        console.log("Got Image: ", panels);
        return res.status(200).json({ success: true, image: result});
    }
    catch(err){
        console.log(err);
        console.log("Exception in getImage");
        return res.status(404).json({
            message: 'Excetion!',
        })
    }
}

getText = async(req, res) => {
    const {panels} = req.body;
    let result = [];

    try{
        console.log("Inside getText! TextID: ", panels);
        if(panels === undefined){
            console.log("textID was not provided as parameter");
            return res.status(404).json({
                message: 'panels not provided!',
            })
        }


        console.log("Searching for textID: ", panels);

        // Image.findOne({imageID: imageID}, (err, data) => {
        //     if(err ||!data) {
        //         console.log("Error in getImage: " + err);
        //         return res.status(404).json({
        //             err,
        //             message: 'Image not found!',
        //         })
        //     }

        //     console.log("Got Image: ", imageID);
        //     return res.status(200).json({ success: true, image: data.image.toString()});
        // });
        for(let i = 0; i < panels.length; i++){
            //Get images in a round
            let round = await Text.find({textID : {$in : panels[i]}}).sort({textID : 1});

            let temp = [];
            for(let j = 0; j < round.length; j++){
                temp.push(round[j].text.toString());
            }
            // console.log(`Round ${i}: `, temp);
            result.push(temp);
        }

        console.log("Got Text: ", panels);
        return res.status(200).json({ success: true, text: result});
    }
    catch(err){
        console.log(err);
        console.log("Exception in getText");
        return res.status(404).json({
            message: 'Excetion!',
        })
    }
}


getLatestGames = async (req, res) => {
    try{
        let gameQuery = await Game.find().sort({createdAt : -1});

        console.log(gameQuery);

        return res.status(200).json({ success: true, games: gameQuery});
    }
    catch(err){
        console.log(err);
        return res.status(404).json({
            success: false,
            message: "Getting Game Has Error!"
        });
    }
}

module.exports = {
    createGame,
    search,
    getGame,
    updateGame,
    deleteGame,
    getImage,
    getText,
    getLatestGames
}