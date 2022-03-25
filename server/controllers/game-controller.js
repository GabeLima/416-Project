const Game = require("../models/game-model");


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


search = (req, res) => {
    const query = req.body.query;
    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a search query.',
        });
    }

    // TODO - implement searching by user? We could find all games that have a specified user(s) present. Currently only searching by tag.

    const searchTags = query.split(",").map(i => i.trim());

    // Any game w/ at least one matching tag will be returned.
    await Game.find( {tags: { $in: searchTags }}, (err, games) => {
        if (err) {
            return res.status(400).json({ success: false, error: err});
        }
        return res.status(200).json({ success: true, data: games});
    });
}


getGame = (req, res) => {
    const gameID = req.body.gameID;
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
        return res.status(200).json({ success: true, game: game});
    });
}


updateGame = (req, res) => {
    const {isLive, players, panels, playerVotes, communityVotes, gameID, comments, rounds, timePerRound, isPublic, tags} = req.body;

    // ALL of these must be present.
    // players, panels, playerVotes, rounds, timePerRound, isPublic, tags will be immutable after a game is published.
    // TODO - We could have the client selectively send the relevant fields, but that might be something we discuss later when implementing front end.

    if (isLive) {
        return res.status(400).json({ errorMessage: "This game is running."});
    }

    await Game.findOne({gameID: gameID}, (err, game) => {
        if (!game) {
            return res.status(404).json({
                success: false,
                message: "This game does not exist."
            });
        }

        // TODO - This blindly assumes the client will properly update these fields. Bad practice? Or is this fine?
        game.communityVotes = communityVotes;
        game.comments = comments;

        game.
            save().
            then(() => {
                return res.status.too(200).json({
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
