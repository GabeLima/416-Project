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
    it("successfully creates a game", (done) => {
        let req = {
            body : {
                isComic : true,
                players : [],
                panels : [[]],
                playerVotes : [[]],
                communityVotes : [[]],
                gameID : "game1",
                comments : [],
                tags : [],
                creator : "user1"
            }
        };

        sandbox.stub(GameModel.prototype, "save").resolves(res.status(201));

        GameController.createGame(req, res);

        //sinon.assert.called(GameModel.save);
        sinon.assert.calledWith(res.status, 201);
        done();
    });

    it("unsuccessful creates a game", (done) => {
        let req = {
            body : {}
        };

        sandbox.stub(GameModel.prototype, "save").rejects(res.status(400));

        GameController.createGame(req, res);

        sinon.assert.calledWith(res.status, 400);
        done();
    });


    // David: search, updateGame, deleteGame
    it("searches for a game", () => {

    });

    it("updates a game", () => {

    });

    it("deletes a game", () => {

    });
});
