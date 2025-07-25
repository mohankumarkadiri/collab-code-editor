const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connectDB = require('../utils/connectToDB');
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            await connectDB();
            const email = profile?.emails[0]?.value;
            if (!email) {
                return done(null, false, { message: 'Email not provided' });
            }
            const updatedData = {
                name: profile.displayName,
                email: profile.email,
                profileImage: profile?.photos[0]?.value
            }
            let user = await User.findOneAndUpdate({ email }, { $set: updatedData }, { new: true, upsert: true })
            done(null, user);
        } catch (err) {
            done(err, false, { message: err.message || 'Error during Authentication' });
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user?._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectDB();
        const user = await User.findById(id);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        done(null, user);
    } catch (err) {
        done(err, false, { message: err?.message || "Error during deserialization" });
    }
});