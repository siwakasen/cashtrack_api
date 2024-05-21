import bcrypt from 'bcrypt';
const saltRounds = 12;

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

export const formatValidationErrors = (errors) => {
    return errors.array().reduce((acc, error) => {
        acc[error.path] = error.msg;
        return acc;
    }, {});
};
