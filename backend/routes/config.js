const express = require('express');
const router = express.Router();
const SiteConfig = require('../models/SiteConfig');
const auth = require('../middleware/auth');

// Get Config (Public)
router.get('/', async (req, res) => {
    try {
        let config = await SiteConfig.findOne();
        if (!config) {
            config = new SiteConfig({
                happyCustomers: 1000,
                businessAddress: process.env.BUSINESS_ADDRESS || '123, Auto Market Road, Nagpur',
                businessPhone: process.env.BUSINESS_PHONE || '+919876543210',
                businessWhatsapp: process.env.BUSINESS_WHATSAPP || '919876543210',
                businessEmail: process.env.BUSINESS_EMAIL || 'info@arihantcars.com'
            });
            await config.save();
        }
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Config (Admin Only)
router.put('/', auth, async (req, res) => {
    try {
        const { happyCustomers, businessAddress, businessPhone, businessWhatsapp, businessEmail } = req.body;
        let config = await SiteConfig.findOne();
        if (!config) {
            config = new SiteConfig();
        }

        if (happyCustomers !== undefined) config.happyCustomers = happyCustomers;
        if (businessAddress !== undefined) config.businessAddress = businessAddress;
        if (businessPhone !== undefined) config.businessPhone = businessPhone;
        if (businessWhatsapp !== undefined) config.businessWhatsapp = businessWhatsapp;
        if (businessEmail !== undefined) config.businessEmail = businessEmail;

        await config.save();
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
