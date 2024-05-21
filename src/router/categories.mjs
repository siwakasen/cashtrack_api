import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { Category } from '../mongoose/schemas/categorySchema.mjs';
import { createCategorySchema } from '../utils/validations.mjs';
import { formatValidationErrors } from '../utils/helper.mjs';
import { isLoggedin, logger } from '../utils/middleware.mjs';

const router = Router();
const url = '/api/categories';
router.get('/', isLoggedin, async (req, res) => {
    try {
        const categories = await Category.find({ $or: [{ created_by: req.user._id }, { created_by: null }] });
        if (categories.length === 0) {
            logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
            return res.status(404).json({
                message: 'category not found',
                data: [],
            });
        }
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(200).json({
            message: 'success get all categories',
            data: categories
        });
    } catch (error) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error get all categories'
        });
    }
});

router.get('/:id', isLoggedin, async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, $or: [{ created_by: req.user._id }, { created_by: null }] });
        if (!category) {
            logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
            return res.status(404).json({
                message: 'category not found',
                data: [],
            });
        }
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(200).json({
            message: 'success get category by id',
            data: category
        });
    } catch (error) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error get category by id'
        });
    }
});

router.post('/', isLoggedin, checkSchema(createCategorySchema), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(400).json({
            'errors': formatValidationErrors(errors)
        });
    }

    const { body } = req;
    const data = {
        ...body,
        created_by: req.user._id,
    };
    try {
        const newCategory = new Category(data);
        await newCategory.save();
        logger.info(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(201).json({
            message: 'success create category',
            data: newCategory
        });
    } catch (err) {
        logger.error(`Received ${req.method} ${url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(500).json({
            message: 'error create category'
        });
    }
});

export default router;
