import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { Expense } from '../mongoose/schemas/expenseSchema.mjs';
import { Category } from '../mongoose/schemas/categorySchema.mjs';
import { createExpenseSchema, updateExpenseSchema } from '../utils/validations.mjs';
import { formatValidationErrors } from '../utils/helper.mjs';
import { isLoggedin, logger } from '../utils/middleware.mjs';

const router = Router();
const url = '/api/expenses';
router.get('/', isLoggedin, async (req, res) => {
    try {
        const expenses = await Expense.find({ user_id: req.user._id });
        if (expenses.length === 0) {
            logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
            return res.status(404).json({
                message: 'expense not found',
                data: [],
            });
        }
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(200).json({
            message: 'success get all expenses',
            data: expenses
        });
    } catch (error) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error get all expenses'
        });
    }
});

router.get('/:id', isLoggedin, async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user_id: req.user._id });
        if (!expense) {
            logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')}`);
            return res.status(404).json({
                message: 'expense not found',
                data: [],
            });
        }
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(200).json({
            message: 'success get expense by id',
            data: expense
        });
    } catch (error) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error get expense by id'
        });
    }
});

router.post('/', isLoggedin, checkSchema(createExpenseSchema), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(400).json({
            'errors': formatValidationErrors(errors)
        });
    }

    const { body } = req;
    const isCategoryExist = await Category.findOne({ _id: body.category_id, $or: [{ created_by: req.user._id }, { created_by: null }] });
    if (!isCategoryExist) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(400).json({
            message: 'category not found',
        });
    }

    const data = {
        ...body,
        user_id: req.user._id,
    };
    try {
        const newExpense = new Expense(data);
        await newExpense.save();
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(201).json({
            message: 'success create expense',
            data: newExpense
        });
    } catch (err) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error create expense'
        });
    }
});

router.patch('/:id', isLoggedin, checkSchema(updateExpenseSchema), async (req, res) => {
    const { params: { id }, body } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(400).json({
            'errors': formatValidationErrors(errors)
        });
    }
    if (!body.amount && !body.expense_name && !body.date_of_expense && !body.category_id) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(400).json({
            message: 'at least one field must be filled'
        });
    }
    if (body.category_id) {
        const isCategoryExist = await Category.findOne({ _id: body.category_id, $or: [{ created_by: req.user._id }, { created_by: null }] });
        if (!isCategoryExist) {
            logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
            return res.status(400).json({
                message: 'category not found',
            });
        }
    }

    const data = {
        ...body,
        updated_at: new Date(),
    };
    try {
        const expense = await Expense.findOneAndUpdate({ _id: id, $or: [{ created_by: req.user._id }, { created_by: null }] }, data, {
            new: true,
            runValidators: true,
        });
        if (!expense) {
            logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
            return res.status(404).json({
                message: 'expense not found',
            });
        }
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(200).json({
            message: 'success update expense',
            data: expense
        });
    } catch (error) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error update expense'
        });
    }
});

router.delete('/:id', isLoggedin, async (req, res) => {
    const { params: { id } } = req;
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: id, user_id: req.user._id });
        if (!deletedExpense) {
            logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
            return res.status(404).json({
                message: 'expense not found',
            });
        }
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(200).json({
            message: 'success delete expense',
            data: deletedExpense
        });
    } catch (error) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error delete expense'
        });
    }
});

export default router;
