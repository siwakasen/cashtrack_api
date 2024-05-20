export const createUserSchema = {
    name: {
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isLength: {
            options: {
                max: 50,
            },
            errorMessage: 'Name must be less than 50 characters',
        },
    },
    email: {
        notEmpty: {
            errorMessage: 'Email is required',
        },
        isEmail: {
            errorMessage: 'Invalid email',
        },
    },

};

export const updateUserSchema = {
    name: {
        optional: true,
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isLength: {
            options: {
                max: 50,
            },
            errorMessage: 'Name must be less than 50 characters',
        },
    },
    email: {
        optional: true,
        notEmpty: {
            errorMessage: 'Email is required',
        },
        isEmail: {
            errorMessage: 'Invalid email',
        },
    },
};
