const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = name;
        await category.save();

        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    const products = await Product.find({ category: id });
    if (products.length > 0) {
        return res.status(400).json({ message: 'Category cannot be deleted if products belong to it' });
    }
    await category.deleteOne();
    res.status(200).json({ message: 'Category deleted successfully' });
};   

// Get All Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
