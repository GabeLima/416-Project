const GameController = require("../controllers/game-controller");
let GameModel = require("../models/game-model");
const chai = require('chai');
const sinon = require("sinon");
const mongoose = require("mongoose");

chai.should();
let sandbox = sinon.createSandbox();

describe("how the game controller deals with requests", () => {
  
    let res = {};
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        res = {
            json: sandbox.spy(),
            status: sandbox.stub().returns({end: sandbox.spy()})
        };
    });
  
    afterEach(() => {
        sandbox.restore();
    });
  
   
    // TODO - IMPLEMENT BELOW
    // Gabe: None
    


    // Tim: getGame
    it("gets a game", (done) => {

        let req = {
            params: {
                gameID: "fakeID"
            }
        };

        let mockFind = (callback) => {
            callback(null, "THEGAME");
        };

        sandbox.stub(mongoose.Model, "findOne").returns(mockFind);

        GameController.getGame(req, res);
        
        sinon.assert.calledWith(GameModel.findOne, {gameID: "fakeID"});
        done();
    });

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
