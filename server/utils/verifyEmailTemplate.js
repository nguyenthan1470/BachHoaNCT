const verifyEmailTemplate = ({name, url}) => {
    return `
   <p>  Thân mến ${name} </p>
<p> Cảm ơn bạn đã đăng ký Bách Hóa NCT.</p>
<a href= ${url} style ="color : black; background : orange; margin-top: 10px,padding: 20px, display: block">
Xác minh Email
</a>

`
}

export default verifyEmailTemplate;