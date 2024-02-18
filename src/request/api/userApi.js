const userApi = {
    loginEmailPassword: {
        name: '邮箱密码登录',
        url: "/user/login/email/password",
        method: 'POST',
        userPower: false,
        dataParam: true,
        successMessage: true
    }
}

export default userApi