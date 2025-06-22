const forgotPasswordTemplate = ({ name, otp }) => {
    return `
<div>
<p> ${name} thân mến</p>
<p>
Bạn được yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP sau để đặt lại mật khẩu.
</p>
<div style ="background : yellow; font-size: 20px;padding: 20px;
text-align:center; font-weight: 800; color: black;">
${otp}
</div>
<p>
Otp này chỉ có hiệu lực trong 1 giờ. Nhập Otp này vào trang web Bách Hóa NCT để tiến hành đặt lại mật khẩu của bạn. </p>
<br/>

</br>
<p>
Cảm ơn
</p>

<p>Bách Hóa NCT</p>

</div>


`
}

export default forgotPasswordTemplate