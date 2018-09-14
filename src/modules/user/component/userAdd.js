import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Input, Select, Breadcrumb, Button, Upload, Icon, Spin, notification} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const userAddUrl = restUrl.BASE_HOST + 'user/save';
const uploadUrl = restUrl.BASE_HOST + 'assessory/upload';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            confirmDirty: false,
            roleList: [{
                id: '4a347f25084654cf73a88d8dc7262990',
                name: '管理员'
            }, {
                id: '7ed07b2360b38b78d8864df188f0b704',
                name: '业务员'
            }, {
                id: 'a8d93d94b49d3b46fd2df429178c9454',
                name: 'sys管理员'
            }, {
                id: 'b99514487e9004f63740643f0fe7523f',
                name: '二级管理员'
            }],
            roleLoading: false,
            submitLoading: false
        };
    }

    handleChange = ({fileList}) => this.setState({fileList})

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // values.assessorys = values.picSrc.map(item => {
                //     return item.response.backData;
                // });
                delete values.picSrc;
                delete values.confirm;
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(userAddUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        notification.open({
                            message: '新增用户成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                        });

                        return this.context.router.push('/frame/user/list');
                    } else {
                        message.error(data.backMsg);
                    }

                    this.setState({
                        submitLoading: false
                    });
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {fileList, roleList, roleLoading, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增用户</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增用户</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        label="头像"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('picSrc', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                            rules: [{required: false, message: '头像不能为空!'}],
                                        })(
                                            <Upload
                                                name='bannerImage'
                                                action={uploadUrl}
                                                listType={'picture'}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 1 ? null :
                                                    <Button><Icon type="upload"/> 上传</Button>}
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="角色选择"
                                        {...formItemLayout}
                                    >
                                        <Spin spinning={roleLoading} indicator={<Icon type="loading"/>}>
                                            {getFieldDecorator('roleId', {
                                                rules: [{required: true, message: '角色不能为空!'}]
                                            })(
                                                <Select>
                                                    {
                                                        roleList.map(item => {
                                                            return (<Option key={item.id}
                                                                            value={item.id}>{item.name}</Option>)
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Spin>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户编码"
                                    >
                                        {getFieldDecorator('userCode', {
                                            rules: [{
                                                required: true, message: '请输入用户编码',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户名"
                                    >
                                        {getFieldDecorator('userName', {
                                            rules: [{
                                                required: true, message: '请输入用户名',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="密码"
                                    >
                                        {getFieldDecorator('password', {
                                            rules: [{
                                                required: true, message: '请输入密码',
                                            }, {
                                                validator: this.validateToNextPassword,
                                            }],
                                        })(
                                            <Input type="password"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="确认密码"
                                    >
                                        {getFieldDecorator('confirm', {
                                            rules: [{
                                                required: true, message: '请确认密码',
                                            }, {
                                                validator: this.compareToFirstPassword,
                                            }],
                                        })(
                                            <Input type="password" onBlur={this.handleConfirmBlur}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="个人电话"
                                    >
                                        {getFieldDecorator('phone', {
                                            rules: [{required: true, message: '请输入个人电话'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="所属区域"
                                    >
                                        {getFieldDecorator('region', {
                                            rules: [{required: true, message: '请输入所属区域'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div className='toolbar'>
                                <div className='pull-right'>
                                    <Button type="primary" size='large' htmlType="submit"
                                            loading={submitLoading}>提交</Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const userAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default userAdd;