import React from 'react';
import PropTypes from 'prop-types';
import {Form, Icon, Row, Col, Input, Button, Message} from 'antd';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../login.less';

import loginBg from 'Img/login-bg.jpg';
import Logo from 'Img/logo.png';

const FormItem = Form.Item;

const loginUrl = restUrl.BASE_HOST + 'user/login';
const roleDetailUrl = restUrl.BASE_HOST + 'role/findbyid';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentDidMount = () => {
        sessionStorage.clear();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                ajax.postJSON(loginUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        let backData = data.backData;
                        sessionStorage.setItem('token', backData.token);
                        sessionStorage.setItem('expireDate', backData.outofServicetime);
                        const loginedUser = backData.loginedUser;
                        if (loginedUser) {
                            sessionStorage.setItem('userId', loginedUser.id);
                            sessionStorage.setItem('region', loginedUser.region);

                            sessionStorage.setItem('userName', loginedUser.userName);
                            sessionStorage.setItem('roleId', loginedUser.roleId);
                            if (loginedUser.assessorys && loginedUser.assessorys.length > 0) {
                                sessionStorage.setItem('avatar', restUrl.ADDR + loginedUser.assessorys[0].path + loginedUser.assessorys[0].name);
                            }

                            ajax.getJSON(roleDetailUrl, {id: loginedUser.roleId}, res => {
                                this.setState({loading: false});

                                if (res.success) {
                                    const role = res.backData;
                                    let type = null;
                                    let initUrl = null;
                                    // 管理员
                                    if (role.roleCode === '002') {
                                        type = 1;
                                        initUrl = '/frame/report/list'
                                    }
                                    // 二级管理员
                                    else if (role.roleCode === '003') {
                                        type = 2;
                                        initUrl = '/frame/order/list'
                                    }
                                    // 业务员
                                    else if (role.roleCode === '004') {
                                        type = 3;
                                        initUrl = '/frame/order/list'
                                    }
                                    sessionStorage.setItem('type', type);
                                    return this.context.router.push(initUrl);
                                } else {
                                    Message.error('获取用户权限失败');
                                }
                            })
                        }
                    } else {
                        this.setState({loading: false});
                        Message.error('登录失败，请检查用户名及密码！');
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="login">
                <img src={loginBg} className="login-bg"/>
                <div className="backup"></div>
                <div className="login-box">
                    <Row>
                        <Col span={13} style={{height: '400px', backgroundColor: 'rgba(85, 120, 220, .65)'}}>
                            <div style={{margin: '85px 0 40px', textAlign: 'center'}}>
                                {/*<Icon type="windows" theme='filled' style={{fontSize: 90, color: '#fff'}}/>*/}
                                <img src={Logo} style={{width: '70%'}}/>
                            </div>
                            <div
                                style={{paddingTop: 30, textAlign: 'center', fontSize: 20, color: '#fff'}}>订单管理系统
                            </div>
                        </Col>
                        <Col span={11} style={{height: '400px', padding: '20px 35px', backgroundColor: '#fff'}}>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <FormItem>
                                    <h1 style={{margin: '15px 0 0 0'}}>欢迎登录</h1>
                                    <p style={{margin: '0', color: '#999'}}>Welcome!</p>
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('loginName', {
                                        rules: [{required: true, message: '请输入您的用户名!'}],
                                    })(
                                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               className="login-input" placeholder="用户编码/手机号"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{required: true, message: '请输入您的密码!'}],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password" className="login-input" placeholder="密码"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        size='large'
                                        htmlType="submit"
                                        className="login-form-button"
                                        loading={this.state.loading}
                                    >登录</Button>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const WrappedLogin = Form.create()(Login);

Login.contextTypes = {
    router: PropTypes.object
}

export default WrappedLogin;
