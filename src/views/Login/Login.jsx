import React, { Component } from 'react'
import { Layout, Input, Form, Button, Divider, message, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { RsaEncrypt } from '@/utils/encrypt'
import { get_public_key, post_login } from '@/api/api'
import '@/style/view-style/login.scss'

class Login extends Component {
    state = {
        loading: false
    }

    enterLoading = () => {
        this.setState({
            loading: true
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { username, password } = values
                this.getPublicKey()
                    .then(publicKey => {
                        console.log(publicKey)
                        password = RsaEncrypt(publicKey, password)
                        post_login({
                            data: { userName: username, passWord: password },
                            headers: { 'No-Token': true, 'Content-Type': 'application/x-www-form-urlencoded' }
                        })
                            .then(res => {
                                const { data } = res
                                localStorage.setItem('access_token', data.access_token)
                                localStorage.setItem('token_type', data.token_type)
                                localStorage.setItem('refresh_token', data.refresh_token)
                                localStorage.setItem('expires_in', data.expires_in)
                                localStorage.setItem('scope', data.scope)
                                localStorage.setItem('expires_at', new Date().getTime() / 1000 + data.expires_in)
                                this.props.history.push('/')
                                values.auth = 0
                                localStorage.setItem('user', JSON.stringify(values))
                                this.enterLoading()
                                this.timer = setTimeout(() => {
                                    message.success('登录成功!')
                                    this.props.history.push('/')
                                }, 2000)
                            })
                            .catch(err => {
                                // 这里处理一些错误信息
                                message.error('登录失败!')
                            })
                    })
                    .catch(err => {
                        message.error('获取公钥信息失败!')
                    })
                // 这里可以做权限校验 模拟接口返回用户权限标识
                // switch (values.username) {
                //     case 'admin':
                //         values.auth = 0
                //         break
                //     default:
                //         values.auth = 1
                // }

                // localStorage.setItem('user', JSON.stringify(values))
                // this.enterLoading()
                // this.timer = setTimeout(() => {
                //     message.success('登录成功!')
                //     this.props.history.push('/')
                // }, 2000)
            }
        })
    }

    async getPublicKey() {
        // 先尝试获取rsa公钥
        const result = new Promise((resolve, reject) => {
            get_public_key({ headers: { 'No-Token': true } })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {})
        })
        return await result
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Layout className='login animated fadeIn'>
                <div className='model'>
                    <div className='login-form'>
                        <h3>后台管理系统</h3>
                        <Divider />
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入用户名!' }]
                                })(
                                    <Input
                                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder='用户名'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码' }]
                                })(
                                    <Input
                                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type='password'
                                        placeholder='密码'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    loading={this.state.loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Form.create()(Login))
