import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { Expense } from '../mongoose/schemas/expenseSchema.mjs';
import { Category } from '../mongoose/schemas/categorySchema.mjs';
import { createExpenseSchema, updateExpenseSchema } from '../utils/validations.mjs';
import { formatValidationErrors } from '../utils/helper.mjs';
import { logger } from '../utils/middleware.mjs';

const url = '/api/expenses';
const router = Router();
const getCurrentMonthDateRange = () => {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59));
    return { startOfMonth, endOfMonth };
};

const { startOfMonth, endOfMonth } = getCurrentMonthDateRange();

//get current month expenses
router.get('/', async (req, res) => {
    try {
        console.log(req.user._id);
        const expenses = await Expense.find({ user_id: req.user._id, date_of_expense: { $gte: startOfMonth, $lte: endOfMonth } })
            .populate('category_id')
            .sort({ date_of_expense: 'desc' });

        if (expenses.length === 0) {
            return res.status(200).json({
                message: 'expense not found',
                data: [],
            });
        }

        const groupedExpenses = expenses.reduce((acc, expense) => {
            const date = expense.date_of_expense.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { data_expenses: [], total_expense: 0 };
            }
            acc[date].data_expenses.push(expense);
            acc[date].total_expense += expense.amount;
            return acc;
        }, {});

        const data = Object.keys(groupedExpenses).map(date => ({
            date_of_expenses: date,
            total_expense: groupedExpenses[date].total_expense,
            data_expenses: groupedExpenses[date].data_expenses.sort((a, b) => new Date(b.date_of_expense) - new Date(a.date_of_expense))
        }));
        return res.status(200).json({
            message: 'success get all expenses',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error get all expenses',
            error: error.message,
            data: [],
        });
    }
});

router.get('/month/:month', async (req, res) => {
    const month = parseInt(req.params.month);
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);
    try {
        const expenses = await Expense.find({ user_id: req.user._id, date_of_expense: { $gte: startOfMonth, $lt: endOfMonth } })
            .populate('category_id')
            .sort({ date_of_expense: 'asc' });
        if (expenses.length === 0) {
            return res.status(200).json({
                message: 'expense not found',
                data: [],
            });
        }
        return res.status(200).json({
            message: 'success get all expenses',
            data: expenses
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error get all expenses',
            data: [],
        });
    }
});

//get expense by id
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user_id: req.user._id });
        if (!expense) {
            return res.status(200).json({
                message: 'expense not found',
                data: [],
            });
        }
        return res.status(200).json({
            message: 'success get expense by id',
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error get expense by id',
            data: [],
        });
    }
});

router.post('/', checkSchema(createExpenseSchema), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            'errors': formatValidationErrors(errors)
        });
    }

    const { body } = req;
    const isCategoryExist = await Category.findOne({ _id: body.category_id, $or: [{ created_by: null }, { created_by: null }] });
    if (!isCategoryExist) {
        return res.status(400).json({
            message: 'category not found',
            data: [],
        });
    }

    const data = {
        ...body,
        user_id: req.user._id,
    };
    try {
        const newExpense = new Expense(data);
        await newExpense.save();
        return res.status(201).json({
            message: 'success create expense',
            data: newExpense
        });
    } catch (err) {
        return res.status(500).json({
            message: 'error create expense',
            error: err.message,
            data: [],
        });
    }
});

router.patch('/:id', checkSchema(updateExpenseSchema), async (req, res) => {
    const { params: { id }, body } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            'errors': formatValidationErrors(errors)
        });
    }
    if (!body.amount && !body.expense_name && !body.date_of_expense && !body.category_id) {
        return res.status(400).json({
            message: 'at least one field must be filled',
            data: [],
        });
    }
    if (body.category_id) {
        const isCategoryExist = await Category.findOne({ _id: body.category_id, $or: [{ created_by: req.user._id }, { created_by: null }] });
        if (!isCategoryExist) {
            return res.status(400).json({
                message: 'category not found',
                data: [],
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
            return res.status(200).json({
                message: 'expense not found',
                data: [],
            });
        }
        return res.status(200).json({
            message: 'success update expense',
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error update expense',
            data: [],
        });
    }
});

router.delete('/:id', async (req, res) => {
    const { params: { id } } = req;
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: id, user_id: req.user._id });
        if (!deletedExpense) {
            return res.status(200).json({
                message: 'expense not found',
                data: [],
            });
        }
        return res.status(200).json({
            message: 'success delete expense',
            data: deletedExpense
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error delete expense',
            data: [],
        });
    }
});

export default router;
