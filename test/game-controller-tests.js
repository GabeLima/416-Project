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
                query: "quirky"
            }
        }
        // "," seperated paramaters
        // defaults to tags
        // u: finds users (not sure if implemented)
        // find game with a tag
        // 200 on success
        // returns some games
    });

    // ripped from gabes updateUser tests
    it("updates a game successfully", () => {
        // communityVotes and comments in body
        // gameID in req params
        const date = new Date();
        const comment = {
            username: "user",
            email: "user@mail.com",
            content: "This comic is cringe",
            postDate: date
        };
        let req = {
            params: {
                gameID: "fakeID",
            },
            body: {
                communityVotes: [],
                comments: [comment]
            }
        }

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        GameController.updateGame(req, res);
        sinon.assert.calledWith(GameModel.findOne, { gameID: 'fakeID' });
        done();
        // 200 on success
        // game returned
        // success: true
        // msg: "Game updated"
    });

    it("updates a game unsuccessfully", (done) => {
        let req = {};

        // still works? findOne is called but the error is handled within
        sandbox.stub(mongoose.Model, "findOne").yields(null);
        GameController.updateUser(req, res);
        sinon.assert.notCalled(GameController.findOne);
        sinon.assert.calledWith(res.status, 400);
        done();
    });

    it("deletes a game", () => {
        // gameID in req params
        let req = {
            body: {
                gameID: "fakeID",
            }
        }

        sandbox.stub(mongoose.Model, "findOne").yields(null);

        GameController.deleteGame(req, res);

        sinon.assert.calledWith(GameModel.findOne, { gameID: 'fakeID' });

        done();
        // 404 on failure
        // 200 on success
    });
});
