const chai = require('chai');
const sinon = require("sinon");
const mongoose = require("mongoose");
const UserModel = require("../models/user-model");
const UserController = require("../controllers/user-controller");

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
    it("gets whether a user is logged in", () => {
  
    });

    it("logs out a user", () => {
  
    });

    it("gets a user", () => {
  
    });

    // David: resetPassword
    it("resets a password", () => {
  
    });
});