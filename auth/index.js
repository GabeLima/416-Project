const jwt = require("jsonwebtoken")

function authManager() {
    /*
        Verify's that a user is capable of accessing a resource.
        STATUS CODES:
        401: Unauthorized
    */
    verify = function (req, res, next) {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = verified.userId;

            next();
        } catch (err) {
            console.log("Something went wrong in verify!");
            console.error(err);
            return res.status(401).json({
                errorMessage: "Unauthorized"
            });
        }
    }
    /*
        Signs a JWT for a logged in user, allowing them to access user-specific resources.
    */
    signToken = function (user) {
        console.log("Signing token");
        return jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;