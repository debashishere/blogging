const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //all db relataed work with profile and token
                let user = await User.findOne({ googleId: profile.id })
                console.log(user)
                if (user) {
                    done(null, user);
                } else {
                    //user not found
                    // insert a new user
                    const newUser = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        firstName: profile.given_name,
                        lastName: profile.family_name,
                        image: profile.picture
                    });
                    newUser
                        .save()
                        .then(user => {
                            console.log(user)
                            done(null, user)
                        })
                        .catch(err => {
                            console.log(err);
                        })


                }
            }
            catch (err) {
                console.log(err);
                res.redirect('/');
                process.exit(1);
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    })

    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user) => {
            done(err, user);
        })

    })
}