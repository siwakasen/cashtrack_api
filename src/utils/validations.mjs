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

export const createCategorySchema = {
    category_name: {
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
};

export const createExpenseSchema = {
    amount: {
        isInt: {
            errorMessage: 'Amount must be a number',
        },
        custom: {
            options: (value) => {
                if (parseInt(value) <= 0) {
                    throw new Error('Amount must be greater than 0');
                }
                return true;
            }
        }
    },
    expense_name: {
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isLength: {
            options: {
                max: 100,
            },
            errorMessage: 'Name must be less than 50 characters',
        },
    },
    date_of_expense: {
        optional: true,
        isDate: {
            errorMessage: 'Invalid date',
        },
    },
    category_id: {
        notEmpty: {
            errorMessage: 'Category is required',
        },
        isMongoId: {
            errorMessage: 'Invalid category',
        },
    },
};

export const updateExpenseSchema = {
    amount: {
        optional: true,
        isInt: {
            errorMessage: 'Amount must be a number',
        },
        custom: {
            options: (value) => {
                if (parseInt(value) <= 0) {
                    throw new Error('Amount must be greater than 0');
                }
                return true;
            }
        }
    },
    expense_name: {
        optional: true,
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isLength: {
            options: {
                max: 100,
            },
            errorMessage: 'Name must be less than 50 characters',
        },
    },
    date_of_expense: {
        optional: true,
        isDate: {
            errorMessage: 'Invalid date',
        },
    },
    category_id: {
        optional: true,
        isMongoId: {
            errorMessage: 'Invalid category',
        },
    },
}
