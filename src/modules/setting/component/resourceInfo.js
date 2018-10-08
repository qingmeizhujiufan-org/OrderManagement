import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    Breadcrumb,
    Button,
    Message,
    Notification
} from 'antd';

import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';

const FormItem = Form.Item;

const resourceSaveUrl = restUrl.BASE_HOST + 'user/saveUserOwnResources';
const queryDetailUrl = restUrl.BASE_HOST + 'user/qureyOneUser';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: sessionStorage.userId,
            submitLoading: false,
            childrenDetail: []
        };
    }

    componentDidMount = () => {
        this.queryDetail();
    }

    queryDetail = () => {
        const id = sessionStorage.userId;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        ajax.getJSON(queryDetailUrl, param, data => {
            if (data.success) {
                const childrenDetail = data.backData.childrenDetail;
                this.setState({
                    childrenDetail: childrenDetail
                });
            } else {
                Message.error('用户资源查询失败');
            }
        });
    }

    validatePhone = (rule, value, callback) => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value && value !== '' && !reg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let childrenDetail = this.state.childrenDetail;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    submitLoading: true
                });
                const index = _.findIndex(childrenDetail, {resourceWechatCode: values.resourceWechatCode});
                console.log('index ===', index)

                if (index !== -1) {
                    childrenDetail[index] = Object.assign(childrenDetail[index], values)
                } else {
                    childrenDetail.push(values)
                }
                console.log('childrenDetail ===', childrenDetail);
                ajax.postJSON(resourceSaveUrl, JSON.stringify(childrenDetail), (data) => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '资源信息保存成功！'
                        });
                        this.setState({
                            childrenDetail: data.backData.childrenDetail
                        });

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
        const {submitLoading, userId} = this.state;
        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>个人管理</Breadcrumb.Item>
                            <Breadcrumb.Item>资源中心</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>个人中心</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户ID"
                                    >
                                        {getFieldDecorator('userId', {
                                            rules: [{required: true, message: '请输入个人电话'}],
                                            initialValue: userId
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户微信"
                                    >
                                        {getFieldDecorator('resourceWechatCode', {
                                            rules: [{required: true, message: '请输入用户微信'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户电话"
                                    >
                                        {getFieldDecorator('resourcePhone', {
                                            rules: [{required: true, message: '请输入用户手机号'}, {
                                                validator: this.validatePhone,
                                            }],
                                            initialValue: '18634348921'
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="用户粉丝数"
                                    >
                                        {getFieldDecorator('minFans', {
                                            rules: [{required: true, message: '请输入用户粉丝数'}],
                                            initialValue: 0
                                        })(
                                            <InputNumber
                                                min={0}
                                                step={1}
                                                precision={0}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" style={{marginTop: 40}}>
                                <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                        loading={submitLoading}>保存</Button>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const resource = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default resource;