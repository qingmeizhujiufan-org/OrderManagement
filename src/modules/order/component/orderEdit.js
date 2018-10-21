import React from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    Select,
    Breadcrumb,
    Button,
    Modal,
    Divider,
    Spin,
    Icon,
    DatePicker,
    Notification,
    Message,
    Alert,
    Radio
} from 'antd';
import moment from 'moment';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {ZZTable} from 'Comps/zz-antD';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';

const orderSaveUrl = restUrl.BASE_HOST + 'order/save';
const queryDetailUrl = restUrl.BASE_HOST + 'order/findbyid';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            proData: [],
            showTips: false,
            canEdit: true,
            loading: false,
            region: sessionStorage.region,
            isOperator: false,
            submitLoading: false
        };

        this.orderColumns = [
            {
                title: '产品名称',
                dataIndex: 'productName',
                align: 'center',
                width: 250,
                key: 'productName'
            }, {
                title: '产品条码',
                dataIndex: 'productBarCode',
                align: 'productBarCode',
                width: 250,
                key: 'productBarCode'
            }, {
                title: '数量',
                dataIndex: 'pnumber',
                align: 'center',
                width: 150,
                key: 'pnumber',
                render: (text, record, index) => (
                    <InputNumber
                        style={{width: '50%'}}
                        defaultValue={1}
                        min={1}
                        step={1}
                        onChange={value => this.setEachProNumber(value, record, index)}
                    />
                )
            }, {
                title: '单位',
                dataIndex: 'productUnit',
                key: 'productUnit',
                width: 150,
                align: 'center',
            }, {
                title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
                key: 'operation',
                width: 150,
                align: 'center',
                render: (text, record, index) => (
                    <div>
                        <a onClick={() => this.onDelete(index)}>删除</a>
                    </div>
                )
            }]
    }

    componentWillMount = () => {
        const type = sessionStorage.type;
        //业务员
        if (type === "3") {
            this.setState({isOperator: true});
        }
    }


    componentDidMount = () => {
        this.queryDetail();
    }

    queryDetail = () => {
        const id = this.props.params.id;
        const param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        ajax.getJSON(queryDetailUrl, param, data => {
            if (data.success) {
                let backData = data.backData;
                backData.childrenDetail.map(item => {
                    item.key = item.id;
                });

                this.setState({
                    data: backData,
                    proData: backData.childrenDetail,
                    loading: false
                }, () => {
                    this.showTips();
                    this.canEdit();
                });
            } else {
                Message.error('订单信息查询失败');
            }
        });
    }

    showTips = () => {
        const data = this.state.data;
        const deliverDate = data.deliverDate;
        const curDate = moment().format("YYYY-MM-DD");
        console.log(deliverDate === curDate);

        if (deliverDate === curDate) {
            this.setState({
                showTips: true
            });
        }
    }

    canEdit = () => {
        const data = this.state.data;
        const deliverDate = data.deliverDate;
        const curDate = moment();
        let canEdit = (data.orderState !== 0 || (curDate.hour() === 10 && curDate.format('YYYY-MM-DD') === deliverDate));
        if (!canEdit) {
            this.setState({
                canEdit: false
            });
        }
    }

    onDelete = index => {
        Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let proData = this.state.proData;
                proData.splice(index, 1);
                this.setState({
                    proData: proData,
                }, () => {
                    Notification.success({
                        message: '提示',
                        description: '删除成功！'
                    });
                });
            }
        });
    }

    /* 处理定金 */
    handleDepositAmoutChange = val => {
        const values = this.props.form.getFieldsValue();
        const {collectionAmout} = values;
        if (!isNaN(collectionAmout) && !isNaN(val)) {
            values.totalAmount = val + collectionAmout;
            this.props.form.setFieldsValue(values);
        }
    }

    /* 处理代收金额 */
    handleCollectionAmoutChange = val => {
        const values = this.props.form.getFieldsValue();
        const {depositAmout} = values;
        if (!isNaN(depositAmout) && !isNaN(val)) {
            values.totalAmount = depositAmout + val;
            this.props.form.setFieldsValue(values);
        }
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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = this.props.params.id;
                values.orderDate = values.orderDate.format("YYYY-MM-DD");
                values.deliverDate = values.deliverDate.format("YYYY-MM-DD");
                values.incomlineTime = values.incomlineTime.format("YYYY-MM-DD HH:mm:ss");
                values.costRatio = this.state.data.costRatio;
                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                values.childrenDetail = this.state.proData;
                ajax.postJSON(orderSaveUrl, JSON.stringify(values), (data) => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '订单信息保存成功！'
                        });
                        return this.context.router.push('/frame/order/list');
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
        const {data, proData, canEdit, showTips, isOperator, loading, submitLoading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>订单列表</Breadcrumb.Item>
                            <Breadcrumb.Item>更新订单信息</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>更新订单信息</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Alert visible={showTips} message="当前日期已过订单发货日期次日上午十点，则之后不允许修改" type="warning" showIcon/>,
                        <Spin spinning={loading} size='large'>
                            <Divider>产品信息</Divider>
                            <div style={{
                                paddingBottom: 30,
                                textAlign: 'center'
                            }}>
                                <ZZTable
                                    size='small'
                                    dataSource={proData}
                                    columns={this.orderColumns}
                                />
                            </div>
                            <Divider>订单信息</Divider>
                            <Form onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="所属区域"
                                        >
                                            {getFieldDecorator('region', {
                                                rules: [{required: true, message: '请输入所属区域'}],
                                                initialValue: data.region
                                            })(
                                                <Input disabled={isOperator}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            label="所属仓库"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('warehouse', {
                                                rules: [{required: true, message: '所属仓库不能为空!'}],
                                                initialValue: data.warehouse
                                            })(
                                                <Select>
                                                    <Option key='0' value={0}>武汉</Option>
                                                    <Option key='1' value={1}>北京</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="业务员id"
                                        >
                                            {getFieldDecorator('userId', {
                                                rules: [{required: true, message: '请输入业务员id'}],
                                                initialValue: data.userId
                                            })(
                                                <Input disabled={isOperator}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="业务员姓名"
                                        >
                                            {getFieldDecorator('userName', {
                                                rules: [{required: true, message: '请输入业务员姓名'}],
                                                initialValue: data.userName
                                            })(
                                                <Input disabled={isOperator}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="订单编号"
                                        >
                                            {getFieldDecorator('orderCode', {
                                                rules: [{required: false, message: '请输入订单编号'}],
                                                initialValue: data.orderCode
                                            })(
                                                <Input disabled={isOperator}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="寄件电话"
                                        >
                                            {getFieldDecorator('serderPhone', {
                                                rules: [{required: true, message: '请输入寄件电话'}, {
                                                    validator: this.validatePhone,
                                                }],
                                                initialValue: data.serderPhone
                                            })(
                                                <Input disabled={isOperator}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="寄件详细地址"
                                        >
                                            {getFieldDecorator('senderAddr', {
                                                rules: [{required: true, message: '请输入寄件详细地址'}],
                                                initialValue: data.senderAddr
                                            })(
                                                <Input disabled={isOperator}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="订单性质"
                                        >
                                            {getFieldDecorator('orderNature', {
                                                rules: [{required: true, message: '请输入订单性质'}],
                                                initialValue: data.orderNature
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="成单微信号"
                                        >
                                            {getFieldDecorator('orderWechatCode', {
                                                rules: [{required: true, message: '请输入成单微信号'}],
                                                initialValue: data.orderWechatCode
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="成单日期"
                                        >
                                            {getFieldDecorator('orderDate', {
                                                rules: [{required: true, message: '请输入成单日期'}],
                                                initialValue: moment(data.orderDate)

                                            })(
                                                <DatePicker style={{width: '100%'}} onChange={this.getDate}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="发货日期"
                                        >
                                            {getFieldDecorator('deliverDate', {
                                                rules: [{required: true, message: '请输入发货日期'}],
                                                initialValue: moment(data.deliverDate)

                                            })(
                                                <DatePicker style={{width: '100%'}}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="收件人"
                                        >
                                            {getFieldDecorator('receiverName', {
                                                rules: [{required: true, message: '请输入收件人'}],
                                                initialValue: data.receiverName
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="收件人手机号"
                                        >
                                            {getFieldDecorator('receiverPhone', {
                                                rules: [{required: true, message: '请输入收件人手机号'}, {
                                                    validator: this.validatePhone,
                                                }],
                                                initialValue: data.receiverPhone
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="收件人详细地址"
                                        >
                                            {getFieldDecorator('receiverAddr', {
                                                rules: [{required: true, message: '请输入收件人详细地址'}],
                                                initialValue: data.receiverAddr
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="广告渠道"
                                        >
                                            {getFieldDecorator('advertChannel', {
                                                rules: [{required: true, message: '请输入广告渠道'}],
                                                initialValue: data.advertChannel
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="进线时间"
                                        >
                                            {getFieldDecorator('incomlineTime', {
                                                rules: [{required: true, message: '请输入进线时间'}],
                                                initialValue: moment(data.incomlineTime)
                                            })(
                                                <DatePicker
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    style={{width: '100%'}}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="定金"
                                        >
                                            {getFieldDecorator('depositAmout', {
                                                rules: [{required: true, message: '请输入定金'}],
                                                initialValue: data.depositAmout
                                            })(
                                                <InputNumber
                                                    step={0.01}
                                                    precision={2}
                                                    min={0}
                                                    style={{width: '100%'}}
                                                    onChange={this.handleDepositAmoutChange}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="代收金额"
                                        >
                                            {getFieldDecorator('collectionAmout', {
                                                rules: [{required: true, message: '请输入代收金额'}],
                                                initialValue: data.collectionAmout
                                            })(
                                                <InputNumber
                                                    min={0}
                                                    step={0.01}
                                                    precision={2}
                                                    style={{width: '100%'}}
                                                    onChange={this.handleCollectionAmoutChange}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="总金额"
                                        >
                                            {getFieldDecorator('totalAmount', {
                                                rules: [{required: true, message: '请输入总金额'}],
                                                initialValue: data.totalAmount
                                            })(
                                                <InputNumber
                                                    min={0}
                                                    step={0.01}
                                                    precision={2}
                                                    style={{width: '100%'}}
                                                    disabled
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="是否国际件"
                                        >
                                            {getFieldDecorator('isForeignExpress', {
                                                rules: [{required: true, message: '请选择'}],
                                                initialValue: data.isForeignExpress
                                            })(
                                                <RadioGroup>
                                                    <Radio value={0}>不是</Radio>
                                                    <Radio value={1}>是</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="订单状态"
                                        >
                                            {getFieldDecorator('orderState', {
                                                rules: [{required: true, message: '请选择'}],
                                                initialValue: data.orderState
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
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="是否超过成本"
                                        >
                                            {getFieldDecorator('isOverCost', {
                                                rules: [{required: true, message: '请选择'}],
                                                initialValue: data.isOverCost
                                            })(
                                                <RadioGroup>
                                                    <Radio value={0}>不是</Radio>
                                                    <Radio value={1}>是</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="成本数据"
                                        >
                                            {getFieldDecorator('costAmount', {
                                                rules: [{required: true, message: '请输入成本数据'}],
                                                initialValue: data.costAmount
                                            })(
                                                <InputNumber
                                                    min={0}
                                                    step={0.1}
                                                    precision={2}
                                                    style={{width: '100%'}}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid}>
                                        {
                                            isOperator ?
                                                (<FormItem
                                                    {...formItemLayout}
                                                    label="成本比例"
                                                >
                                                    {getFieldDecorator('costRatio', {
                                                        rules: [{required: true, message: '请输入成本比例'}],
                                                        initialValue: data.costRatio > 1 ? '超过' : '不超过'
                                                    })(
                                                        <Input disabled={isOperator}/>
                                                    )}
                                                </FormItem>) :
                                                (<FormItem
                                                    {...formItemLayout}
                                                    label="成本比例"
                                                >
                                                    {getFieldDecorator('costRatio', {
                                                        rules: [{required: true, message: '请输入成本比例'}],
                                                        initialValue: data.costRatio
                                                    })(
                                                        <Input disabled={isOperator}/>
                                                    )}
                                                </FormItem>)
                                        }
                                    </Col>
                                    <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="快递类别"
                                        >
                                            {getFieldDecorator('expressCompany', {
                                                rules: [{required: true, message: '请输入快递公司'}],
                                                initialValue: data.expressCompany
                                            })(
                                                <Select>
                                                    <Option key='0' value={0}>顺丰</Option>
                                                    <Option key='1' value={1}>申通</Option>
                                                    <Option key='2' value={2}>中通</Option>
                                                    <Option key='3' value={3}>圆通</Option>
                                                    <Option key='4' value={4}>韵达</Option>
                                                    <Option key='5' value={5}>百世汇通</Option>
                                                    <Option key='6' value={6}>其他</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="快递单号"
                                        >
                                            {getFieldDecorator('expressCode', {
                                                rules: [{required: !isOperator, message: '请输入快递单号'}],
                                                initialValue: data.expressCode
                                            })(
                                                <Input disabled={isOperator}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: isOperator ? 'none' : 'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="快递状态"
                                        >
                                            {getFieldDecorator('expressState', {
                                                rules: [{required: !isOperator, message: '请选择快递状态'}],
                                                initialValue: data.expressState
                                            })(
                                                <Select disabled={isOperator}>
                                                    <Option key='0' value={0}>未发货</Option>
                                                    <Option key='1' value={1}>已发货</Option>
                                                    <Option key='2' value={2}>取消发货</Option>
                                                    <Option key='3' value={3}>未妥投</Option>
                                                    <Option key='4' value={4}>退回</Option>
                                                    <Option key='5' value={5}>签收</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col {...itemGrid} style={{display: 'none'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="备注"
                                        >
                                            {getFieldDecorator('memo', {
                                                rules: [{required: false}],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" style={{marginTop: 40}}>
                                    <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                            loading={submitLoading} disabled={canEdit}>提交</Button>
                                </Row>
                            </Form>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

const orderEdit = Form.create()(Index);

Index.contextTypes = {
    router: PropTypes.object
}

export default orderEdit;