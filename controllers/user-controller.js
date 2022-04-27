const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const Cookies =  require('js-cookie');

/*
    Asserts that a user is logged in.
    STATUS CODES:
    200: Success
    401: Unauthorized
*/
getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                email: loggedInUser.email,
                username: loggedInUser.username,
                followers: loggedInUser.followers,
                following: loggedInUser.following,
                followedTags: loggedInUser.followedTags
            }
        });
    })
}

/*
    Expires the user's JWT, effectively logging them out.
    STATUS CODES:
    200: Success
    401: Unauthorized
    500: Error expiring token
*/
logoutUser = async (req, res) => {
    auth.verify(req, res, async function () {
        try{
            //let token = document.cookie.token;
            var token = Cookies.get("token");
            await res.cookie("token", token, {
                expires: new Date(Date.now() - 900000),
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
            });
        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
            return res.status(200);
    })
}
/*
    Updates a user's information in the database.
    Fields that you are updating will be overwitten.
    STATUS CODES:
    200: Success
    400: Body not provided
    404: Failure to update user
*/
updateUser = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a body to update',
        })
    }
    const { email} = req.body;
    User.findOne({ email: email }, async(err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found when trying to update!',
            })
        }

        //Updating username
        if(req.body.username){
            // console.log(req.body);
            //Comfirms password to actually change username
            let result = await compareAsync(req.body.password, user.passwordHash);
            console.log(result);
            if(!result){
                console.log("Bad password!");
                return res.status(400).json({ 
                    success: false,
                    errorMessage: "Bad password!"
                });
            }

            //Only reaches here if it passes password check
            user.username = req.body.username;
        }

        //Update Following
        if(req.body.following){
            user.following = req.body.following;
        }

        user
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}
/*
    Helper function to loginUser().
    Used to compare passwordHash.
*/

function compareAsync(param1, param2) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(param1, param2, function(err, res) {
            if (err) {
                reject(err);
           } else {
                resolve(res);
           }
        });
    });
}

/*
    Logs a user in and gives them a valid JWT.
    STATUS CODES:
    200: Success
    400: Bad body information
    500: Failure to create JWT
*/

loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ 
                    success: false,
                    errorMessage: "Please enter all required fields." 
                });
        }

        var loggedInUser = await User.findOne({ email: email });
        if(loggedInUser === null){
            return res
            .status(400)
            .json({ 
                success: false,
                errorMessage: "Couldn't find an account with that email!"
            });
        }
        
        var result = await compareAsync(password, loggedInUser.passwordHash);
        console.log(result);
        if(!result){
            console.log("Bad password!");
            return res.status(400).json({ 
                success: false,
                errorMessage: "Bad password!"
            });
        }
        console.log("Login successful!");
        
        //We may or may not have a JWT already.
        token = Cookies.get("token");
        if(!token){
            try{
                console.log("attempting to create a token");
                token = auth.signToken(loggedInUser);
                await res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                }).status(200).json({
                    success: true,
                    loggedIn: true,
                    user: {
                        email: loggedInUser.email,
                        username: loggedInUser.username,
                        followers: loggedInUser.followers,
                        following: loggedInUser.following,
                        followedTags: loggedInUser.followedTags
                    }
                }).send();
            }catch (err) {
                console.error(err);
                res.status(500).send();
            }
        }
        else{
            return res.status(200).json({
                success: true,
                loggedIn: true,
                user: {
                    email: loggedInUser.email,
                    username: loggedInUser.username,
                    followers: loggedInUser.followers,
                    following: loggedInUser.following,
                    followedTags: loggedInUser.followedTags
                }
            });
        }
    }catch(Exception){
        console.log(Exception);
        return res
        .status(400)
        .json({ 
            success: false,
            errorMessage: "Error logging in!"
        });
    }
}

/*
    Registers a user and gives them a valid JWT.
    STATUS CODES:
    200: Success
    400: Bad body information
    500: Failure to create JWT
*/

registerUser = async (req, res) => {
    try {
        console.log("Attempting to register the user");
        const {email, password, passwordVerify, username, securityQuestion, securityAnswer } = req.body;
        if (!email || !password || !passwordVerify || !username || !securityQuestion || !securityAnswer) {
            return res
                .status(400)
                .json({ 
                    success: false,
                    errorMessage: "Please enter all required fields." 
                });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Please enter the same password twice."
                })
        }
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const salt2 = await bcrypt.genSalt(saltRounds);
        const securityAnswerHash = await bcrypt.hash(securityAnswer, salt2);

        let followers = []
        let following = []
        let followedTags = []
        const newUser = new User({
            email, passwordHash, followers, following, followedTags, username, securityQuestion, securityAnswerHash
        });
        const savedUser = await newUser.save();

        const token = auth.signToken(savedUser);
        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                email: savedUser.email,
                username: savedUser.username,
                followers: savedUser.followers,
                following: savedUser.following,
                followedTags: savedUser.followedTags
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


updateFollowers = async (req, res) => {
    const email = req.body.email
    const followers = req.body.followers

    if(!email){
        return res.status(400).json({
            success: false,
            errorMessage: "A email has to be provided"
        });
    }
    if(!followers){
        return res.status(400).json({
            success: false,
            errorMessage: "A followers payload has to be provided"
        });
    }

    await User.findOne({email: email}, (err, user) => {
        if(err){
            return res.status(404).json({
                success:false,
                err,
                message: "Valid user with such email not found"
            });
        }
        else if(!user){
            return res.status(404).json({
                success:false,
                message: "Valid user with such email not found"
            });
        }

        user.followers = followers

        user.save().then(() => {
            return res.status(200).json({
                success: true,
                user: user,
                message: "User's followers has been updated"
            });
        }).catch(err => {
            console.log("FAILUREL " + JSON.stringify(err));
            return res.status(404).json({
                success: false,
                err,
                message: "User's followers has not been updated"
            });
        });
    });
}


getUser = async (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a username',
        });
    }

    console.log("reached");

    await User.findOne({username: username}, (err, user) => {
        if (err) {
            return res.status(404).json({
                success: false,
                err,
                message: "User not found!"
            });
        }
        else if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }
        return res.status(200).json({ success: true, user: user});
    });
}

removeUser = async(req, res)=>{
    const {email, password} = req.params;

    console.log(req.params);

    User.findOne({email:email}, async(err, user)=>{
        if (err) {
            return res.status(404).json({
                success: false,
                err,
                message: "Wrong email1"
            });
        }
        else if (!user) {
            return res.status(404).json({
                success: false,
                message: "Wrong email2"
            });
        }

        //Comfirms password to actually change password
        let result = await compareAsync(password, user.passwordHash);
        console.log(result);
        if(!result){
            console.log("Bad password!");
            return res.status(400).json({ 
                success: false,
                errorMessage: "Bad password!"
            });
        }

        User.findOneAndDelete({email:email}, () => {
            return res.status(200).json({ success: true })
        }).catch(err => console.log(err))

    })
}

getUserSecurityQuestion = async (req, res) => {
    const email = req.params.email;
    if (!email) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide an email',
        });
    }

    await User.findOne({email: email}, (err, user) => {
        if (err) {
            return res.status(404).json({
                success: false,
                err,
                message: "User not found!"
            });
        }
        else if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }
        return res.status(200).json({ success: true, securityQuestion: user.securityQuestion});
    });
}

/*
    Resets a user's passwordHash in the database.
    Requires a correct answer for that user's security question.
    STATUS CODES:
    200: Success
    400: Body not provided
    404: Failure to reset password
*/
resetPassword = async(req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a body to update',
        });
    }
    const {email, securityAnswer, newPassword, newPasswordVerify} = req.body;        
    if (!email || !securityAnswer || !newPassword || !newPasswordVerify) {
        return res
            .status(400)
            .json({ 
                success: false,
                errorMessage: "Please enter all required fields." 
            });
    }

    // verification
    var loggedInUser = await User.findOne({ email: email });
    if(!loggedInUser) {
        return res
        .status(400)
        .json({ 
            success: false,
            errorMessage: "Couldn't find an account with that email!"
        });
    }
    // verify sec answer
    var result = await compareAsync(securityAnswer, loggedInUser.securityAnswerHash);
    if(!result){
        console.log("Incorrect Answer");
        return res.status(400).json({ 
            success: false,
            errorMessage: "Incorrect Answer"
        });
    }
    if (newPassword.length < 8) {
        return res
            .status(400)
            .json({
                success: false,
                errorMessage: "Please enter a password of at least 8 characters."
            });
    }
    if (newPassword !== newPasswordVerify) {
        return res
            .status(400)
            .json({
                success: false,
                errorMessage: "Please enter the same password twice."
            });
    }

    // reseting password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    await User.findOne({email: email}, (err, user) => {
        if(err || !user) {
            return res.status(404).json({
                success:false,
                message: "Valid user with such email not found"
            });
        }

        user.passwordHash = newPasswordHash;

        user.save().then(() => {
            return res.status(200).json({
                success: true,
                user: user,
                message: "User's password has been reset"
            });
        }).catch(err => {
            console.log("FAILURE " + JSON.stringify(err));
            return res.status(404).json({
                success: false,
                err,
                message: "User's password has not been reset"
            });
        });
    });
}

/*
    Updates a user's passwordHash in the database.
    Requires the current password to be entered.
    STATUS CODES:
    200: Success
    400: Body not provided
    404: Failure to change password
*/
changePassword = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a body to update',
        });
    }
    const {email, password, newPasswordVerify, newPassword} = req.body;
    if (!email || !password || !newPassword || !newPasswordVerify) {
        return res
            .status(400)
            .json({ 
                success: false,
                errorMessage: "Please enter all required fields." 
            });
    }

    // verification
    var loggedInUser = await User.findOne({ email: email });
    if(!loggedInUser) {
        return res
        .status(400)
        .json({ errorMessage: "Couldn't find an account with that email!"});
    }
    // verify current password
    var result = await compareAsync(password, loggedInUser.passwordHash);
    if(!result){
        console.log("Incorrect Password");
        return res.status(400).json({ 
            success: false,
            errorMessage: "Incorrect Password"
        });
    }
    if (newPassword.length < 8) {
        return res
            .status(400)
            .json({
                success: false,
                errorMessage: "Please enter a password of at least 8 characters."
            });
    }
    if(newPassword !== newPasswordVerify) {
        return res
        .status(400)
        .json({ 
            success: false,
            errorMessage: "Please enter the same password twice."
        });
    }

    // changing password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    await User.findOne({email: email}, (err, user) => {
        if(err || !user) {
            return res.status(404).json({
                success:false,
                message: "Valid user with such email not found"
            });
        }

        user.passwordHash = newPasswordHash;

        user.save().then(() => {
            return res.status(200).json({
                success: true,
                user: user,
                message: "User's password has been changed"
            });
        }).catch(err => {
            console.log("FAILURE " + JSON.stringify(err));
            return res.status(404).json({
                success: false,
                err,
                message: "User's password has not been changed"
            });
        });
    });
}
module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    updateFollowers,
    getUser,
    getUserSecurityQuestion,
    resetPassword,
    changePassword,
    removeUser
}
