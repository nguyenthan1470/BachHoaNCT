const contactTemplate = {
    adminNotification: ({ name, email, message }) => {
        return `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; background: #f8fffe; padding: 20px;">
                <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1); border: 1px solid #d1fae5;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px 24px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
                            📩 Phản hồi mới từ khách hàng
                        </h1>
                        <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">🔔 Thông báo dành cho quản trị viên</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 32px 24px;">
                        <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #10b981;">
                            <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 500; color: #1f2937;">👋 Kính chào Quý quản trị viên,</p>
                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">Hệ thống vừa nhận được phản hồi mới từ khách hàng. Chi tiết như sau:</p>
                        </div>
                        
                        <!-- Customer Info -->
                        <div style="border: 1px solid #d1fae5; border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
                            <div style="background: #ecfdf5; padding: 16px; border-bottom: 1px solid #d1fae5;">
                                <h3 style="margin: 0; color: #065f46; font-size: 16px; font-weight: 600;">👤 Thông tin khách hàng</h3>
                            </div>
                            <div style="padding: 20px;">
                                <table style="width: 100%; border-spacing: 0;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: 500; color: #374151; width: 80px;">📛 Tên:</td>
                                        <td style="padding: 8px 0; color: #1f2937;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: 500; color: #374151;">📧 Email:</td>
                                        <td style="padding: 8px 0; color: #1f2937;">${email}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Message -->
                        <div style="border: 1px solid #d1fae5; border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
                            <div style="background: #ecfdf5; padding: 16px; border-bottom: 1px solid #d1fae5;">
                                <h3 style="margin: 0; color: #065f46; font-size: 16px; font-weight: 600;">💬 Nội dung phản hồi</h3>
                            </div>
                            <div style="padding: 20px;">
                                <div style="background: #f9fafb; border-radius: 6px; padding: 16px; border-left: 3px solid #10b981; font-size: 14px; line-height: 1.6; color: #1f2937;">
                                    "${message}"
                                </div>
                            </div>
                        </div>
                        
                        <!-- Action Button -->
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="mailto:${email}" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; display: inline-block; transition: all 0.2s;">
                                ✉️ Phản hồi khách hàng
                            </a>
                        </div>
                        
                        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 16px; text-align: center;">
                            <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 500;">
                                ⏳ Vui lòng phản hồi trong vòng 24 giờ để đảm bảo chất lượng dịch vụ tốt nhất
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #10b981;">🏪 Bách Hóa NCT</h2>
                        <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">✨ Chất lượng - Uy tín - Phục vụ tận tâm</p>
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                            <p style="margin: 4px 0; font-size: 13px; color: #4b5563;">
                                🌐 <a href="https://bachhoanct.com" style="color: #10b981; text-decoration: none; font-weight: 500;">www.bachhoanct.com</a> | 
                                ☎️ <span style="font-weight: 500;">1900 1234</span> | 
                                📩 <a href="mailto:support@bachhoanct.com" style="color: #10b981; text-decoration: none;">support@bachhoanct.com</a>
                            </p>
                            <p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">
                                © 2025 Bách Hóa NCT. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    customerAcknowledgment: ({ name, message }) => {
        return `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; background: #f8fffe; padding: 20px;">
                <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1); border: 1px solid #d1fae5;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 24px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">🎉 Cảm ơn bạn đã liên hệ!</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 32px 24px;">
                        <div style="text-align: center; margin-bottom: 28px;">
                            <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1f2937; font-weight: 600;">👋 Xin chào ${name}!</h2>
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4b5563;">Cảm ơn bạn đã tin tưởng và gửi phản hồi đến <strong style="color: #10b981;">Bách Hóa NCT</strong>. Ý kiến của bạn rất quan trọng với chúng tôi.</p>
                        </div>
                        
                        <!-- Message Display -->
                        <div style="border: 1px solid #d1fae5; border-radius: 8px; margin-bottom: 28px; overflow: hidden;">
                            <div style="background: #ecfdf5; padding: 16px; border-bottom: 1px solid #d1fae5;">
                                <h3 style="margin: 0; color: #065f46; font-size: 16px; font-weight: 600;">💬 Nội dung phản hồi của bạn </h3>
                            </div>
                            <div style="padding: 20px;">
                                <div style="background: #f9fafb; border-radius: 6px; padding: 16px; border-left: 3px solid #10b981; font-size: 14px; line-height: 1.6; color: #1f2937; font-style: italic;">
                                    "${message}"
                                </div>
                            </div>
                        </div>
                        
                        <!-- Status Info -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px;">
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center;">
                                <div style="font-size: 24px; margin-bottom: 12px;">📌</div>
                                <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #065f46; font-weight: 600;">Đã tiếp nhận</h3>
                                <p style="margin: 0; font-size: 12px; color: #16a34a;">Chúng tôi đã tiếp nhận thông tin bạn cung cấp và sẽ nhanh chóng chuyển đến bộ phận liên quan để xem xét và xử lý trong thời gian sớm nhất.</p>
                            </div>
                            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; text-align: center;">
                                <div style="font-size: 24px; margin-bottom: 12px;">⏳</div>
                                <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #92400e; font-weight: 600;">Thời gian phản hồi</h3>
                                <p style="margin: 0; font-size: 12px; color: #d97706;">Trong vòng 24 giờ</p>
                            </div>
                        </div>
                        
                        <!-- Contact Info -->
                        <div style="background: linear-gradient(135deg, #e8f5e8, #f0fff0); border-radius: 16px; padding: 25px; text-align: center; border: 2px solid #28a745;">
                            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #28a745; font-weight: 600;">📞 Cần hỗ trợ ngay?</h3>
                            <p style="margin: 0 0 15px 0; font-size: 15px; color: #2c3e50; line-height: 1.6;">
                                Nếu bạn cần hỗ trợ khẩn cấp, vui lòng liên hệ trực tiếp:
                            </p>
                            <div style="display: inline-flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                                <a href="tel:19001234" style="background: #28a745; color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
                                    📞 1900 1234
                                </a>
                                <a href="mailto:support@bachhoanct.com" style="background: #17a2b8; color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
                                    ✉️ Email hỗ trợ
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #10b981;">🏪 Bách Hóa NCT</h2>
                        <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">🙏 Cảm ơn bạn đã tin tưởng chúng tôi!</p>
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                            <p style="margin: 4px 0; font-size: 13px; color: #4b5563;">
                                🌐 <a href="https://bachhoanct.com" style="color: #10b981; text-decoration: none; font-weight: 500;">www.bachhoanct.com</a> | 
                                ☎️ <span style="font-weight: 500;">1900 1234</span> | 
                                📩 <a href="mailto:support@bachhoanct.com" style="color: #10b981; text-decoration: none;">support@bachhoanct.com</a>
                            </p>
                            <p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">
                                © 2025 Bách Hóa NCT. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    reply: ({ name, reply }) => {
        return `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; background: #f8fffe; padding: 20px;">
                <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1); border: 1px solid #d1fae5;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 24px; text-align: center;">
                        <div style="font-size: 36px; margin-bottom: 16px;">✉️</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">📢 Phản hồi từ Bách Hóa NCT</h1>
                        <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">💡 Câu trả lời cho thắc mắc của bạn</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 32px 24px;">
                        <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #10b981;">
                            <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 500; color: #1f2937;">👋 Kính chào ${name || 'Quý khách'},</p>
                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">Cảm ơn bạn đã gửi thắc mắc đến <strong style="color: #10b981;">Bách Hóa NCT</strong>. Chúng tôi rất vui được hỗ trợ bạn!</p>
                        </div>
                        
                        <!-- Response Section -->
                        <div style="border: 1px solid #d1fae5; border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
                            <div style="background: #ecfdf5; padding: 16px; border-bottom: 1px solid #d1fae5;">
                                <h3 style="margin: 0; color: #065f46; font-size: 16px; font-weight: 600;">📩 Phản hồi chi tiết từ chúng tôi</h3>
                            </div>
                            <div style="padding: 24px;">
                                <div style="background: #f9fafb; border-radius: 6px; padding: 16px; border-left: 3px solid #10b981; font-size: 14px; line-height: 1.6; color: #1f2937;">
                                    ${reply}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Additional Support -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center;">
                                <div style="font-size: 24px; margin-bottom: 12px;">📞</div>
                                <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #065f46; font-weight: 600;">Hotline hỗ trợ</h3>
                                <p style="margin: 0; font-size: 12px; color: #16a34a;">1900 1234</p>
                            </div>
                            <div style="background: #e0f2fe; border: 1px solid #a5d6f6; border-radius: 8px; padding: 20px; text-align: center;">
                                <div style="font-size: 24px; margin-bottom: 12px;">📧</div>
                                <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #075985; font-weight: 600;">Email hỗ trợ</h3>
                                <p style="margin: 0; font-size: 12px; color: #1e40af;">support@bachhoanct.com</p>
                            </div>
                        </div>
                        
                        <!-- Call to Action -->
                        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; text-align: center;">
                            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e; font-weight: 600;">🤝 Cần thêm hỗ trợ?</h3>
                            <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563; line-height: 1.5;">Nếu bạn còn thắc mắc, hãy liên hệ ngay!</p>
                            <a href="https://bachhoanct.com/contact" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; display: inline-block;">
                                🌐 Liên hệ ngay
                            </a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #10b981;">🏪 Bách Hóa NCT</h2>
                        <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">🙏 Cảm ơn bạn đã tin tưởng chúng tôi!</p>
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                            <p style="margin: 4px 0; font-size: 13px; color: #4b5563;">
                                🌐 <a href="https://bachhoanct.com" style="color: #10b981; text-decoration: none; font-weight: 500;">www.bachhoanct.com</a> | 
                                ☎️ <span style="font-weight: 500;">1900 1234</span> | 
                                📩 <a href="mailto:support@bachhoanct.com" style="color: #10b981; text-decoration: none;">support@bachhoanct.com</a>
                            </p>
                            <p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">
                                © 2025 Bách Hóa NCT. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

export default contactTemplate;