require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');

async function seedCategories() {
    try {
        await connectDB();

        const names = ['Electronics', 'Accessories', 'Keys', 'Documents', 'Other'];

        for (const name of names) {
            await Category.updateOne({ name }, { name }, { upsert: true });
        }

        console.log('Categories are ready');
    } catch (error) {
        console.error(error.message);
    } finally {
        await mongoose.connection.close();
    }
}

seedCategories();
