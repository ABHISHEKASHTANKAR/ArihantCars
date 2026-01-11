const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'arihant_cars',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({ storage: storage });

// Get all cars (Public) - with optional filtering
router.get('/', async (req, res) => {
    try {
        const { brand, minPrice, maxPrice, search, sort, page = 1, limit = 9 } = req.query;

        let query = {};
        let sortQuery = { createdAt: -1 }; // Default: Newest first

        if (sort === 'priceLowHigh') sortQuery = { price: 1 };
        if (sort === 'priceHighLow') sortQuery = { price: -1 };
        if (sort === 'newest') sortQuery = { createdAt: -1 };
        if (sort === 'oldest') sortQuery = { createdAt: 1 };

        if (brand) {
            const brands = brand.split(',');
            // Case-insensitive brand matching
            query.brand = {
                $in: brands.map(b => new RegExp(`^${b}$`, 'i'))
            };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        if (req.query.bodyType) {
            query.bodyType = req.query.bodyType;
        }

        const cars = await Car.find(query)
            .sort(sortQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Car.countDocuments(query);

        // Aggregation for Body Type Counts (Global or based on search? Let's do Global for sidebar consistency)
        // Or better: based on current search query (excluding bodyType itself) for "refine" behavior?
        // For now, let's just get counts of all available cars to match "Availability"
        const bodyTypeStats = await Car.aggregate([
            { $group: { _id: "$bodyType", count: { $sum: 1 } } }
        ]);

        const facets = {
            bodyType: bodyTypeStats.reduce((acc, curr) => {
                if (curr._id) acc[curr._id.toUpperCase()] = curr.count;
                return acc;
            }, {})
        };

        res.json({
            cars,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            facets // Return facets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get single car by ID or Slug (using ID for now, can add slug later)
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a car (Admin only)
router.post('/', auth, upload.array('images', 10), async (req, res) => {
    try {
        console.log('POST /api/cars body:', req.body);
        const imagePaths = req.files.map(file => file.path);
        const carData = { ...req.body, images: imagePaths };

        const car = new Car(carData);
        await car.save();
        res.status(201).json(car);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update a car (Admin only)
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
    try {
        console.log('PUT /api/cars/:id body:', req.body);

        // Handle image updates if new images are provided
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        }

        const car = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (err) {
        console.error('Error updating car:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Delete a car (Admin only)
// Delete a car (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        // Delete images from Cloudinary
        if (car.images && car.images.length > 0) {
            const deletePromises = car.images.map(imgUrl => {
                // Extract public_id: folder/filename (without extension)
                // URL example: .../arihant_cars/image_id.jpg
                const parts = imgUrl.split('/');
                const filename = parts.pop().split('.')[0];
                const folder = parts.pop();
                // Only delete if it matches our folder to avoid deleting other things by accident
                if (folder === 'arihant_cars') {
                    const publicId = `${folder}/${filename}`;
                    return cloudinary.uploader.destroy(publicId);
                }
                return Promise.resolve();
            });
            await Promise.all(deletePromises);
        }

        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: 'Car removed and images deleted' });
    } catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
