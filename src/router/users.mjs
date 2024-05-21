import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { User } from '../mongoose/schemas/userSchema.mjs';
import { createUserSchema, updateUserSchema } from '../utils/validations.mjs';
import { hashPassword, formatValidationErrors } from '../utils/helper.mjs';
import { isLoggedin } from '../utils/middleware.mjs';

const router = Router();

//GET
router.get('/', isLoggedin, async (req, res) => {
    const { query: { query } } = req;
    if (query) {
        const filteredUsers = await User.find({ name: new RegExp(query, 'i') });
        if (filteredUsers.length === 0) {
            return res.status(404).json({
                message: 'user not found'
            });
        }
        filteredUsers.forEach(user => {
            user.password = undefined;
        });
        return res.status(200).json({
            message: 'success get users',
            data: filteredUsers
        });
    }
    const users = await User.find();
    users.forEach(user => {
        user.password = undefined;
    });
    return res.status(200).json({
        message: 'success get all users',
        data: users
    });
});

router.get('/:id', isLoggedin, (req, res) => {
    const user = User.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(404).json({
            message: 'user not found'
        });
    }
    user.password = undefined;
    return res.status(200).json({
        message: 'success get user by id',
        data: user
    });
});


//INSERT
router.post('/', isLoggedin, checkSchema(createUserSchema), async (req, res) => {
    const { body } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            'errors': formatValidationErrors(errors)
        });
    }
    //find user in mongoose database
    if (await User.findOne({ email: body.email })) {
        return res.status(400).json({
            message: 'Email is already taken'
        });
    }
    body.password = await hashPassword(body.password);
    try {
        const newUser = new User(body);
        const savedUser = await newUser.save();
        savedUser.password = undefined;
        return res.status(201).json({
            message: 'success create new user',
            "data": savedUser
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

//UPDATE
router.patch('/:id', isLoggedin, checkSchema(updateUserSchema), async (req, res) => {
    const { params: { id }, body } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            'errors': formatValidationErrors(errors)
        });
    }
    try {
        const updatedUser = await User.findOneAndUpdate({
            _id: id,
        }, body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({
                message: 'user not found'
            });
        }
        updatedUser.password = undefined;
        return res.status(200).json({
            message: 'success update user',
            data: updatedUser
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Bad request',
            error: error.message
        });
    }
});


//DELETE
router.delete("/:id", isLoggedin, async (req, res) => {
    const { params: { id } } = req;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        deletedUser.password = undefined;
        return res.status(200).json({
            message: "Delete user success",
            data: deletedUser
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Bad request',
            error: error.message
        });
    }
});

export default router;
