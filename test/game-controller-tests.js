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
    it("searches for a game successfully", (done) => {
        let req = {
            params: {
                query: "quirky, u:gamer, u:gorillamckilla"
            }
        }
        let mockFind = (callback) => {
            callback(null, "THEGAME");
        };

        sandbox.stub(mongoose.Model, "find").returns(mockFind);
        GameController.search(req, res);
        sinon.assert.calledWith(GameModel.find, {tags: {'$in': ["quirky"]}, players: {'$all': ["gamer", "gorillamckilla"]}});
        done();
    });

    // ripped from gabes updateUser tests
    it("updates a game successfully", (done) => {
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
        let mockFind = (callback) => {
            callback(null, "THEGAME");
        };

        sandbox.stub(mongoose.Model, "findOne").returns(mockFind);
        GameController.updateGame(req, res);
        sinon.assert.calledWith(GameModel.findOne, { gameID: 'fakeID' });
        done();
    });

    it("deletes a game successfully", (done) => {
        let req = {
            params: {
                gameID: "fakeID",
            }
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        sandbox.stub(mongoose.Model, "findOneAndDelete").yields(null);
        GameController.deleteGame(req, res);
        sinon.assert.calledWith(GameModel.findOneAndDelete, { gameID: 'fakeID' });

        done();
    });
});
