import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { Category } from '../mongoose/schemas/categorySchema.mjs';
import { createCategorySchema } from '../utils/validations.mjs';
import { formatValidationErrors } from '../utils/helper.mjs';
import { logger } from '../utils/middleware.mjs';

const router = Router();
const url = '/api/categories';
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ $or: [{ created_by: null }, { created_by: null }] });
        if (categories.length === 0) {
            return res.status(404).json({
                message: 'category not found',
                data: [],
            });
        }
        return res.status(200).json({
            message: 'success get all categories',
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error get all categories',
            data: [],
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, $or: [{ created_by: req.user._id }, { created_by: null }] });
        if (!category) {
            return res.status(404).json({
                message: 'category not found',
                data: [],
            });
        }
        return res.status(200).json({
            message: 'success get category by id',
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error get category by id',
            data: [],
        });
    }
});

router.post('/', checkSchema(createCategorySchema), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
        return res.status(201).json({
            message: 'success create category',
            data: newCategory
        });
    } catch (err) {
        return res.status(500).json({
            message: 'error create category',
            data: [],
        });
    }
});

export default router;
