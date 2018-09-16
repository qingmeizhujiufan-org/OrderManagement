import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Form, Input, Select, Breadcrumb, Button, Upload, Icon, Spin, Notification, Message, Radio} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const userAddUrl = restUrl.BASE_HOST + 'user/save';
const uploadUrl = restUrl.BASE_HOST + 'assessory/upload';
const queryRoleUrl = restUrl.BASE_HOST + 'role/queryList';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

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
                                        label="业务员id"
                                    >
                                        {getFieldDecorator('userId', {
                                            rules: [{
                                                required: true, message: '请输入业务员id',
                                            }],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="业务员姓名"
                                    >
                                        {getFieldDecorator('userName', {
                                            rules: [{
                                                required: true, message: '请输入业务员姓名',
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
                                        label="订单编号"
                                    >
                                        {getFieldDecorator('orderCode', {
                                            rules: [{required: true, message: '请输入订单编号'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="订单性质"
                                    >
                                        {getFieldDecorator('orderNature', {
                                            rules: [{required: true, message: '请输入订单性质'}],
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
                                        label="寄件电话"
                                    >
                                        {getFieldDecorator('serderPhone', {
                                            rules: [{required: true, message: '请输入寄件电话'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="寄件详细地址"
                                    >
                                        {getFieldDecorator('senderAddr', {
                                            rules: [{required: true, message: '请输入寄件详细地址'}],
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
                                        label="成单微信号"
                                    >
                                        {getFieldDecorator('orderWechatCode', {
                                            rules: [{required: true, message: '请输入成单微信号'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="成单日期"
                                    >
                                        {getFieldDecorator('orderDate', {
                                            rules: [{required: true, message: '请输入成单日期'}],
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
                                        label="发货日期"
                                    >
                                        {getFieldDecorator('deliverDate', {
                                            rules: [{required: true, message: '请输入发货日期'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="收件人"
                                    >
                                        {getFieldDecorator('receiverName', {
                                            rules: [{required: true, message: '请输入收件人'}],
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
                                        label="收件人手机号"
                                    >
                                        {getFieldDecorator('receiverPhone', {
                                            rules: [{required: true, message: '请输入收件人手机号'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="收件人详细地址"
                                    >
                                        {getFieldDecorator('receiverAddr', {
                                            rules: [{required: true, message: '请输入收件人详细地址'}],
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
                                        label="广告渠道"
                                    >
                                        {getFieldDecorator('advertChannel', {
                                            rules: [{required: true, message: '请输入广告渠道'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="进线时间"
                                    >
                                        {getFieldDecorator('incomlineTime', {
                                            rules: [{required: true, message: '请输入进线时间'}],
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
                                        label="定金"
                                    >
                                        {getFieldDecorator('depositAmout', {
                                            rules: [{required: true, message: '请输入定金'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="代收金额"
                                    >
                                        {getFieldDecorator('collectionAmout', {
                                            rules: [{required: true, message: '请输入代收金额'}],
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
                                        label="总金额"
                                    >
                                        {getFieldDecorator('totalAmount', {
                                            rules: [{required: true, message: '请输入总金额'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="是否国际件"
                                    >
                                        {getFieldDecorator('isForeignExpress', {
                                            rules: [{required: true, message: '请选择'}],
                                        })(
                                            <RadioGroup>
                                                <Radio value={0}>不是</Radio>
                                                <Radio value={1}>是</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="订单状态"
                                    >
                                        {getFieldDecorator('orderState', {
                                            rules: [{required: true, message: '请选择'}],
                                        })(
                                            <RadioGroup>
                                                <Radio value={0}>编辑中</Radio>
                                                <Radio value={1}>已锁定</Radio>
                                                <Radio value={2}>已发快递</Radio>
                                                <Radio value={3}>成单</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="是否超过成本"
                                    >
                                        {getFieldDecorator('isOverCost', {
                                            rules: [{required: true, message: '请选择'}],
                                        })(
                                            <RadioGroup>
                                                <Radio value={0}>不是</Radio>
                                                <Radio value={1}>是</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="成本数据"
                                    >
                                        {getFieldDecorator('costAmount', {
                                            rules: [{required: true, message: '请输入成本数据'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="成本比例"
                                    >
                                        {getFieldDecorator('costRatio', {
                                            rules: [{required: true, message: '请输入成本比例'}],
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
                                        label="快递单号"
                                    >
                                        {getFieldDecorator('expressCode', {
                                            rules: [{required: true, message: '请输入成本数据'}],
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="快递状态"
                                    >
                                        {getFieldDecorator('expressState', {
                                            rules: [{required: true, message: '请输入成本比例'}],
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