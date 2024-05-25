import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../mongoose/schemas/userSchema.mjs";
import dotenv from 'dotenv';
dotenv.config();
export default passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}`,
    scope: ['email', 'profile']
},
    (accessToken, refreshToken, profile, cb) => {
        const { displayName, emails } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;
        User.findOne({ email: email }).then(async (user) => {
            if (!user) {
                user = new User({
                    name: displayName,
                    email: email
                });
                await user.save();
            } else {
                if (!user.name || user.name !== displayName) {
                    user.name = displayName;
                }
                if (!user.email || user.email !== email) {
                    user.email = email;
                }
                await user.save();
            }
            cb(null, user);
        }).catch((err) => {
            cb(err, null);
        });
    }
));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.serializeUser((user, done) => {
    done(null, user._id);
});
