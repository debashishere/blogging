const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');

module.exports = function (passport) {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://debashisblog.herokuapp.com/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //all db relataed work with profile and token
                let user = await User.findOne({ googleId: profile.id }).lean()
                if (user) {
                    done(null, user);
                } else {
                    //user not found
                    const newUser = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        image: profile.photos[0].value
                    });
                    newUser
                        .save()
                        .then(user => {
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