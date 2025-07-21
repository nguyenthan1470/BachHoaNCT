import Contact from '../models/contact.model.js';
import sendContact from '../config/sendContact.js';

export const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        const html = `
            <h3>Contact From ${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `;

        await sendContact({
            sendTo: 'youradminemail@example.com',
            subject: `New Contact Message`,
            html,
        });

        const ackHtml = `
            <p>Xin chào ${name},</p>
            <p>Chúng tôi đã nhận được những ý kiến từ bạn. Trong thời gian sớm nhất, chúng tôi sẽ phản hồi lại bạn.</p>
            <p>Cảm ơn bạn đã liên hệ với Bách Hóa NCT!</p>
        `;

        await sendContact({
            sendTo: email,
            subject: 'Chúng tôi đã nhận được phản hồi của bạn',
            html: ackHtml,
        });

        res.status(200).json({ message: 'Contact submitted successfully' });
    } catch (error) {
        console.error('Submit contact error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Contact.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const sendReply = async (req, res) => {
    try {
        const { feedbackId, reply, email, name } = req.body;

        if (!feedbackId || !reply || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await Contact.findByIdAndUpdate(feedbackId, { reply });

        const html = `
            <p>Xin chào ${name || 'Quý khách'},</p>

            <p>Chúng tôi xin chân thành cảm ơn bạn đã dành thời gian để gửi phản hồi tới Bách Hóa NCT. Chúng tôi luôn trân trọng và lắng nghe mọi ý kiến từ khách hàng để không ngừng hoàn thiện và nâng cao chất lượng sản phẩm, dịch vụ.</p>

            <p>Về thắc mắc/ý kiến bạn đã gửi, chúng tôi xin được phản hồi như sau:</p>
            <blockquote style="border-left: 4px solid #ccc; margin: 10px 0; padding-left: 10px;">
                ${reply}
            </blockquote>

            <p>Chúng tôi hy vọng phản hồi này sẽ giúp bạn giải đáp được những thắc mắc của mình. Nếu bạn còn bất kỳ câu hỏi nào khác hoặc cần hỗ trợ thêm, đừng ngần ngại liên hệ lại với chúng tôi qua email này hoặc hotline: <strong>1900 1234</strong>.</p>

            <p>Một lần nữa, Bách Hóa NCT xin cảm ơn sự quan tâm và tin tưởng của bạn. Chúng tôi luôn mong muốn được phục vụ bạn tốt hơn trong thời gian tới.</p>

            <p>Trân trọng,<br/>
            Đội ngũ Chăm sóc Khách hàng<br/>
            Bách Hóa NCT</p>
        `;

        await sendContact({
            sendTo: email,
            subject: 'Phản hồi từ Bách Hóa NCT',
            html,
        });

        res.status(200).json({ message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


export const submitfeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save to database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email notification to admin
    const html = `
      <h3>Contact From ${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendContact({
      sendTo: 'youradminemail@example.com',
      subject: `New Contact Message`,
      html,
    });

    // Send acknowledgment email to customer
    const ackHtml = `
      <p>Xin chào ${name},</p>

      <p>Chúng tôi xin chân thành cảm ơn bạn đã tin tưởng và gửi phản hồi tới Bách Hóa NCT. Ý kiến của bạn là nguồn động lực vô giá giúp chúng tôi không ngừng hoàn thiện và nâng cao chất lượng sản phẩm cũng như dịch vụ.</p>

      <p>Chúng tôi đã tiếp nhận thông tin bạn cung cấp và sẽ nhanh chóng chuyển đến bộ phận liên quan để xem xét và xử lý trong thời gian sớm nhất. Nếu có bất kỳ thông tin bổ sung nào hoặc cần hỗ trợ thêm, bạn vui lòng liên hệ trực tiếp với chúng tôi qua email này hoặc qua hotline <strong>1900 1234</strong> để được hỗ trợ kịp thời.</p>

      <p>Rất mong tiếp tục nhận được sự ủng hộ và đồng hành của bạn trong thời gian tới. Một lần nữa, chúng tôi xin chân thành cảm ơn và chúc bạn một ngày tốt lành!</p>

      <p>Trân trọng,<br/>
      Đội ngũ Chăm sóc Khách hàng<br/>
      Bách Hóa NCT</p>
    `;

    await sendContact({
      sendTo: email,
      subject: 'Chúng tôi đã nhận được phản hồi của bạn',
      html: ackHtml,
    });

    res.status(200).json({ message: 'Contact submitted successfully' });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

