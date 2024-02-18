const mailApi = {
    getRegisterVC: {
        name: '获取邮箱注册账号验证码',
        url: "mail/register/vc",
        method: 'GET',
        userPower: false,
        dataParam: false,
        successMessage: true
    }
}

export default mailApi