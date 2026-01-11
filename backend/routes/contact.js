const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');

// POST /api/contact - Save contact form message
router.post('/', async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        // Validation
        if (!name || !phone || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Save to database
        const contactMessage = new ContactMessage({
            name,
            phone,
            message
        });

        await contactMessage.save();
        console.log('✅ Contact message saved:', { name, phone });

        res.json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

// GET /api/contact - Get all messages (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/contact/:id/read - Mark message as read (Admin only)
router.put('/:id/read', auth, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/contact/:id - Delete message (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
