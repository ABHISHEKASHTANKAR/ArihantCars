const mongoose = require('mongoose');

const SiteConfigSchema = new mongoose.Schema({
    happyCustomers: { type: Number, default: 1000 },
    businessAddress: { type: String, default: '123, Auto Market Road, Nagpur' },
    businessPhone: { type: String, default: '+919876543210' },
    businessWhatsapp: { type: String, default: '919876543210' },
    businessEmail: { type: String, default: 'info@arihantcars.com' }
}, { collection: 'site_config' }); // Use a fixed collection name

module.exports = mongoose.model('SiteConfig', SiteConfigSchema);
