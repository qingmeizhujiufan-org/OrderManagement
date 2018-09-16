import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Input, Select, Breadcrumb, Button, Upload, Icon, Spin, Notification, Message} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const userAddUrl = restUrl.BASE_HOST + 'user/save';
const uploadUrl = restUrl.BASE_HOST + 'assessory/upload';
const queryRoleUrl = restUrl.BASE_HOST + 'role/queryList';

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
            roleList: [],
            roleLoading: false,
            submitLoading: false
        };
    }

    componentDidMount = () => {
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                delete values.picSrc;
                delete values.confirm;
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(userAddUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '新增用户成功！'
                        });

                        return this.context.router.push('/frame/user/list');
                    } else {
                        Message.error(data.backMsg);
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
        const {fileList, roleList, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增订单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增订单</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="所属区域"
                                    >
                                        {getFieldDecorator('region', {
                                            rules: [{
                                                required: true, message: '请输入所属区域',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        label="所属仓库"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('warehouse', {
                                            rules: [{required: true, message: '所属仓库不能为空!'}]
                                        })(
                                            <Select>
                                                <Option key='0' value='0'>武汉</Option>
                                                <Option key='1' value='1'>北京</Option>
                                            </Select>
                                        )}
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
                                            rules: [{required: true, message: '请输入密码'}],
                                        })(
                                            <Input type="password"/>
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

const orderAdd = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default orderAdd;