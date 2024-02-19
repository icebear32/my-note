const userApi = {
    loginEmailPassword: {
        name: '邮箱密码登录',
        url: "/user/login/email/password",
        method: 'POST',
        userPower: false,
        dataParam: true,
        successMessage: true
    },
    emailRegister: {
        name: '邮箱注册账号',
        url: "/user/register/email",
        method: 'POST',
        userPower: false,
        dataParam: true,
        successMessage: false
    }
}

export default userApi