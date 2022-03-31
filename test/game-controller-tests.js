const chai = require('chai');
const gameController = require("../controllers/game-controller");

chai.should();

describe("how the game controller deals with requests", () => {
  
    before(() => {
    });
  
    after(() => {
    });
  
   
    // TODO - IMPLEMENT BELOW
    // Gabe: getGame 
    it("gets a game", () => {

    });


    // Tim: None

    // Vicky (leader): createGame
    it("creates a game", () => {

    });


    // David: search, updateGame, deleteGame
    it("searches for a game", () => {
        // query in req params
        let req = {
            params: {
                query: "realGameID"
            }
        }
        // "," seperated paramaters
        // defaults to tags
        // u: finds users (not sure if implemented)
        // find game with a tag
        // 200 on success
        // returns some games
    });

    it("updates a game", () => {
        // communityVotes and comments in body
        // gameID in req params
        let req = {
            params: {
                gameID: "realGameID",
            },
            body: {
                communityVotes: [],
                comments: ["pog", "gers"]
            }
        }
        // 200 on success
        // game returned
        // success: true
        // msg: "Game updated"
    });

    it("deletes a game", () => {
        // gameID in req params
        let req = {
            body: {
                gameID: "realGameID",
            }
        }

        sandbox.stub(mongoose.Model, "findOne").yields(null);

        UserController.resetPassword(req, res);

        sinon.assert.calledWith(UserModel.findOne, { email: 'test@gmail.com' });

        done();
        // 404 on failure
        // 200 on success
    });
});
