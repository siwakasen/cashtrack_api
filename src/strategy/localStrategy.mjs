import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { comparePassword } from "../utils/helper.mjs";

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


export default passport.use(
    new Strategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
            if (!user || !user.comparePassword(password)) {
                return done(null, false, { message: 'Invalid Credentials' });
            }
            done(null, user);
        } catch (error) {
            done(error, null,);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user._id);
});
