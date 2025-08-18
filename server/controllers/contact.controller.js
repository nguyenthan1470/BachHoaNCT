import Contact from '../models/contact.model.js';
import sendContact from '../config/sendContact.js';
import contactTemplate from '../utils/contactTemplate.js';

export const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: 'Tất cả các trường là bắt buộc',
                error: true,
                success: false
            });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // Admin notification email
        await sendContact({
            sendTo: 'youradminemail@example.com',
            subject: `Tin nhắn liên hệ mới`,
            html: contactTemplate.adminNotification({ name, email, message }),
        });

        // Customer acknowledgment email
        await sendContact({
            sendTo: email,
            subject: 'Chúng tôi đã nhận được phản hồi của bạn',
            html: contactTemplate.customerAcknowledgment({ name, message }),
        });

        return res.json({
            message: 'Gửi liên hệ thành công',
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Submit contact error:', error);
        return res.status(500).json({
            message: error.message || 'Đã xảy ra lỗi',
            error: true,
            success: false
        });
    }
};

export const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Contact.find().sort({ isReplied: 1, createdAt: -1 });
        return res.json({
            message: 'Lấy danh sách phản hồi thành công',
            error: false,
            success: true,
            data: feedbacks
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        return res.status(500).json({
            message: error.message || 'Đã xảy ra lỗi',
            error: true,
            success: false
        });
    }
};

export const sendReply = async (req, res) => {
    try {
        const { feedbackId, reply, email, name } = req.body;

        if (!feedbackId || !reply || !email) {
            return res.status(400).json({
                message: 'Tất cả các trường là bắt buộc',
                error: true,
                success: false
            });
        }

        await Contact.findByIdAndUpdate(feedbackId, {
            reply,
            isReplied: true,
            repliedAt: new Date()
        });

        await sendContact({
            sendTo: email,
            subject: 'Phản hồi từ Bách Hóa NCT',
            html: contactTemplate.reply({ name, reply }),
        });

        return res.json({
            message: 'Gửi phản hồi thành công',
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Error sending reply:', error);
        return res.status(500).json({
            message: error.message || 'Đã xảy ra lỗi',
            error: true,
            success: false
        });
    }
};

export const submitFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: 'Tất cả các trường là bắt buộc',
                error: true,
                success: false
            });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // Admin notification email
        await sendContact({
            sendTo: 'youradminemail@example.com',
            subject: `Tin nhắn liên hệ mới`,
            html: contactTemplate.adminNotification({ name, email, message }),
        });

        // Customer acknowledgment email
        await sendContact({
            sendTo: email,
            subject: 'Chúng tôi đã nhận được phản hồi của bạn',
            html: contactTemplate.customerAcknowledgment({ name, message }),
        });

        return res.json({
            message: 'Gửi phản hồi thành công',
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Submit contact error:', error);
        return res.status(500).json({
            message: error.message || 'Đã xảy ra lỗi',
            error: true,
            success: false
        });
    }
};