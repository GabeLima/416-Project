const chai = require('chai');
const sinon = require("sinon");
const mongoose = require("mongoose");
const UserModel = require("../models/user-model");
const UserController = require("../controllers/user-controller");
const auth = require('../auth');
const Cookies =  require('js-cookie');

chai.should();
let sandbox = sinon.createSandbox();

describe("how the user controller deals with requests", () => {
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
    // Tim: changePassword
    it("changes a password", (done) => {
        let req = {
                body: {
                    email: "test@gmail.com",
                    password: "oldpassword",
                    newPassword: "newpassword",
                    newPasswordVerify: "newpassword"
                }
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);

        UserController.changePassword(req, res);

        sinon.assert.calledWith(UserModel.findOne, { email: 'test@gmail.com' });

        done();
    });

    it("changes a password unsuccessfully", (done) => {
        let req = {
                body: {
                    email: "test@gmail.com",
                    password: "oldpassword",
                    newPassword: "newpassword"
                }
        };
        sandbox.stub(mongoose.Model, "findOne").yields(null);

        UserController.changePassword(req, res);

        sinon.assert.calledWith(res.status, 400);

        done();
    });
    
    //Gabe: updateUser, loginUser, registerUser
    it("updates a user successfully", (done) => {
        const user = {
            username: "mckenna",
            email: "mckenna@gmail.com",
            passwordHash: "gorillamckilla",
            followers: [""],
            following: [""],
            followedTags: [""],
            securityQuestion: "Favorite 416 group?",
            securityAnswer: "Derit"
        };
        let req = {
                body: user
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.updateUser(req, res);

        sinon.assert.calledWith(UserModel.findOne, { email: 'mckenna@gmail.com' });
        done();
    });

    it("updates a user unsuccessfully", (done) => {
        let req = {
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.updateUser(req, res);
        sinon.assert.notCalled(UserModel.findOne);
        sinon.assert.calledWith(res.status, 400);
        done();
    });

    it("login a user successfully", (done) => {
        let req = {
            body: {
                email: "mckenna@gmail.com",
                password: "oldpassword",
            }
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.loginUser(req, res);

        sinon.assert.calledWith(UserModel.findOne, { email: 'mckenna@gmail.com' });
        done();
    });

    it("login a user unsuccessfully", (done) => {
        
        let req = {
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.loginUser(req, res);
        sinon.assert.notCalled(UserModel.findOne);
        sinon.assert.calledWith(res.status, 400);
        done();
    });

    it("register a user successfully", (done) => {
        let req = {
            body: {
                email: "mckenna@gmail.com",
                password: "oldpassword",
                passwordVerify: "oldpassword",
                username: "bob",
                securityQuestion: "Favorite 416 group?",
                securityAnswer: "Derit"
            }
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.registerUser(req, res);

        sinon.assert.calledWith(UserModel.findOne, { email: 'mckenna@gmail.com' });
        done();
    });

    it("register a user unsuccessfully", (done) => {
        let req = {
            body: {
                email: "mckenna@gmail.com",
                password: "oldpassword",
                passwordVerify: "DFSZGDRFJHDFHFDGE",
                username: "bob",
                securityQuestion: "Favorite 416 group?",
                securityAnswer: "Derit"
            }
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.registerUser(req, res);

        sinon.assert.notCalled(UserModel.findOne);
        sinon.assert.calledWith(res.status, 400);
        done();
    });

    // Vicky (leader): getLoggedIn, logoutUser, getUser
    it("gets whether a user is logged in", (done) => {
        let req = {
            userId : 1,
            cookies : {
                token : "token"
            }
        };

        sandbox.stub(auth, "verify").yields(null);
        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.getLoggedIn(req, res);

        sinon.assert.calledWith(UserModel.findOne, {_id : 1});
        done();
    });

    it("fails gets whether a user is logged in", (done) => {
        let req = {
            userId : 1,
            cookies : {
                token : "token"
            }
        };

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.getLoggedIn(req, res);

        sinon.assert.calledWith(res.status, 401);
        done();
    });

    it("logs out a user", (done) => {
        let req = {
            cookies : {
                token : "token"
            }
        }

        sandbox.stub(auth, "verify").callsFake((req, res) => {
            return res.status(200).json({loggedIn: true});
          });
        UserController.logoutUser(req, res);

        sinon.assert.calledWith(res.status, 200);
        done();
    });

    it("fail logs out a user, does not pass auth.verify", (done) => {
        let req = {
            cookies : {
                token : "token"
            }
        }

        UserController.logoutUser(req, res);

        sinon.assert.calledWith(res.status, 401);
        done();
    });

    it("gets a user", (done) => {
        let req = {
            params : {
                username : "kson2"
            }
        }

        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.getUser(req, res);

        sinon.assert.calledWith(UserModel.findOne, {username : "kson2"});
        //sinon.assert.calledWith(res.status, 200)
        done();
    });

    it("getUser but username not provided", (done) => {
        let req = {
            params : {}
        };
        
        sandbox.stub(mongoose.Model, "findOne").yields(null);
        UserController.getUser(req, res);

        sinon.assert.notCalled(UserModel.findOne);
        sinon.assert.calledWith(res.status, 400)
        done();
    });

    // David: resetPassword
    it("resets a password", () => {
  
    });
});