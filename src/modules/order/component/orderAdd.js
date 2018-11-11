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
    Icon,
    DatePicker,
    Notification,
    Popconfirm,
    Message,
    Radio
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import {ZZTable} from 'Comps/zz-antD';
import '../index.less';
import {message} from "antd/lib/index";
import assign from "lodash/assign";
import uniqBy from 'lodash/uniqBy';
import includes from 'lodash/includes';
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: sessionStorage.userId,
            region: sessionStorage.region,
            isOperator: false,
            submitLoading: false,
            selectedProduct: [],
            selectedRowKeys: [],
            tempSelectedRowKeys: [],
            tempSelectedRow: [],
            showModal: false,
            loading: false,
            allProduct: [],
            pagination: {},
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            senderData: {}
        };

        this.productColumns = [
            {
                title: '产品名称',
                dataIndex: 'name',
                width: 250,
                align: 'center',
                key: 'name'
            }, {
                title: '所属仓库',
                dataIndex: 'wareHouse',
                width: 250,
                align: 'center',
                key: 'wareHouse',
                render: (text, record, index) => {
                    let house;
                    if (text === 0) house = '武汉1';
                    else if (text === 1) house = '北京';
                    else if (text === 2) house = '武汉2';
                    return (<div>{house}</div>)
                }
            }, {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                align: 'center',
                width: 100
            }, {
                title: '产品条码',
                dataIndex: 'barCode',
                align: 'center',
                width: 250,
                key: 'barCode'
            }]


        this.orderColumns = [
            {
                title: '产品名称',
                dataIndex: 'name',
                align: 'center',
                width: '25%',
                key: 'name'
            }, {
                title: '所属仓库',
                dataIndex: 'wareHouse',
                width: '15%',
                align: 'center',
                key: 'wareHouse',
                render: (text, record, index) => {
                    let house;
                    if (text === 0) house = '武汉1';
                    else if (text === 1) house = '北京';
                    else if (text === 2) house = '武汉2';
                    return (<div>{house}</div>)
                }
            }, {
                title: '产品条码',
                dataIndex: 'barCode',
                align: 'center',
                width: '25%',
                key: 'barCode'
            }, {
                title: '数量',
                dataIndex: 'number',
                align: 'center',
                width: '15%',
                key: 'number',
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
                dataIndex: 'unit',
                key: 'unit',
                width: '10%',
                align: 'center',
            }, {
                title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
                key: 'operation',
                width: '10%',
                align: 'center',
                render: (text, record, index) => (
                    <div>
                        <Popconfirm title="是否删除?" onConfirm={() => this.onDelete(record.id)}>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
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
        this.getSenderData();
    }

    componentDidMount = () => {
    }

    onDelete = id => {
        let {selectedProduct, selectedRowKeys} = this.state;
        selectedProduct = selectedProduct.filter(item => item.id !== id);
        this.setState({
            selectedRowKeys: selectedRowKeys.filter(item => item !== id),
            selectedProduct: selectedProduct
        });
    }

    getSenderData = () => {
        axios.get('sender/queryList').then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData;
                let senderData = backData ? backData.content : [];
                if (senderData.length == 0) {
                    Message.warning('请添加寄件人信息，否则无法新增订单');
                } else {
                    this.setState({
                        senderData: senderData[0]
                    });
                }
            }
        })
    }

    showModal = () => {
        const {selectedRowKeys, selectedProduct} = this.state
        this.setState({
            showModal: true,
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            tempSelectedRowKeys: selectedRowKeys,
            tempSelectedRow: selectedProduct
        }, () => {
            this.getList();
        })
    }

    handleCancel = () => {
        const {selectedRowKeys, selectedProduct} = this.state
        this.setState({
            tempSelectedRowKeys: selectedRowKeys,
            tempSelectedRow: selectedProduct,
            showModal: false
        });
    }

    handleOk = () => {
        let {tempSelectedRowKeys, tempSelectedRow} = this.state;
        tempSelectedRow = uniqBy(tempSelectedRow, 'key');
        tempSelectedRow = tempSelectedRow.filter(item => includes(tempSelectedRowKeys, item.key));

        for (let i in tempSelectedRow) {
            tempSelectedRow[i].number = 1;
        }

        this.setState({
            selectedRowKeys: tempSelectedRowKeys,
            selectedProduct: tempSelectedRow,
            showModal: false
        });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        const selectedNum = selectedRowKeys.length;

        let wareHouse = this.props.form.getFieldValue('warehouse');
        let houseName = (wareHouse === 0 && '武汉1')
            || (wareHouse === 1 && '北京')
            || (wareHouse === 2 && '武汉2');
        let res = selectedRows.find(item => item.wareHouse != wareHouse);
        if (res) {
            Message.warning(`当前订单仓库为${houseName},与选中产品仓库不匹配！`);
            return;
        }
        if (selectedNum <= 4) {
            this.setState({
                tempSelectedRowKeys: selectedRowKeys,
                tempSelectedRow: this.state.tempSelectedRow.concat(selectedRows)
            });
        } else {
            Message.warning('产品种类最多为四种');
        }
    }

    setEachProNumber = (val, record, index) => {
        let data = this.state.selectedProduct;
        record.number = val ? val : 1;
        data[index] = record;
        this.setState({
            selectedProduct: data
        })
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

// 处理分页变化
    handlePageChange = param => {
        const params = assign({}, this.state.params, param);
        this.setState({params}, () => {
            this.getList();
        });
    }

    getList = () => {
        const {params} = this.state;
        this.setState({loading: true});
        axios.get('product/queryList', {
            params: params
        }).then(res => res.data).then(data => {
            if (data.success) {
                const backData = data.backData
                const total = backData ? backData.totalElements : 0;
                data = backData ? backData.content : [];
                data.map(item => {
                    item.key = item.id;
                });

                this.setState({
                    allProduct: data,
                    loading: false,
                    pagination: {total}
                });
            } else {
                message.error('查询产品列表失败');
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {selectedProduct} = this.state;
                if (selectedProduct.length === 0) {
                    Message.warning('请添加相关产品！');
                    return;
                }

                values.orderDate = values.orderDate.format("YYYY-MM-DD");
                values.deliverDate = values.deliverDate.format("YYYY-MM-DD");
                values.incomlineTime = values.incomlineTime.format("YYYY-MM-DD HH:mm:ss");
                values.childrenDetail = selectedProduct.map(item => {
                    return {
                        productId: item.id,
                        productName: item.name,
                        pnumber: item.number,
                        productUnit: item.unit,
                        productBarCode: item.barCode,
                        orderId: null,
                        productCostPrice: item.costPrice,
                        voState: 1,
                        productWarehouse: item.wareHouse
                    }
                });

                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                axios.post('order/save', values).then(res => res.data).then(data => {
                    if (data.success) {
                        Notification.success({
                            message: '提示',
                            description: '新增订单成功！'
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
        const {userId, region, isOperator, senderData, selectedProduct, submitLoading, showModal, pagination, loading, allProduct, tempSelectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys: tempSelectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增订单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>新增订单</h1>
                </div>
                <div className='pageContent'>
                    <div className='ibox-content'>
                        <Divider>关联产品</Divider>
                        <div style={{
                            paddingBottom: 30,
                            textAlign: 'center'
                        }}>
                            <div style={{marginBottom: 15}}>
                                <Button
                                    type='dashed'
                                    icon='plus'
                                    onClick={this.showModal}
                                    style={{
                                        padding: '0 150px'
                                    }}
                                >选择产品</Button>
                            </div>
                            <ZZTable
                                dataSource={selectedProduct}
                                columns={this.orderColumns}
                            />
                        </div>
                        <Modal
                            title="添加产品"
                            visible={showModal}
                            destroyOnClose
                            width={800}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>返回</Button>,
                                <Button key="submit" type="primary" onClick={this.handleOk}>确定</Button>
                            ]}
                        >
                            <Row type='flex' justify="space-around" align="middle">
                                <Col span={8}>
                                    <Search
                                        placeholder="搜索产品名称关键字"
                                        enterButton
                                        size="default"
                                        onSearch={searchText => this.setState({searchText})}
                                    />
                                </Col>
                            </Row>
                            <h3 style={{marginBottom: 8}}>
                                {tempSelectedRowKeys.length ? `已选择 ${tempSelectedRowKeys.length} 个产品` : '未选择产品'}
                            </h3>
                            <ZZTable
                                columns={this.productColumns}
                                rowSelection={rowSelection}
                                dataSource={allProduct}
                                pagination={pagination}
                                loading={loading}
                                handlePageChange={this.handlePageChange.bind(this)}
                            />
                        </Modal>
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>订单信息</Divider>
                            <Row>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="所属区域"
                                    >
                                        {getFieldDecorator('region', {
                                            rules: [{required: true, message: '请输入所属区域'}],
                                            initialValue: region
                                        })(
                                            <Input disabled={isOperator}/>
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
                                            initialValue: moment()

                                        })(
                                            <DatePicker style={{width: '100%'}}/>
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
                                            initialValue: moment()
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
                                            rules: [{required: true, message: '请输入发货日期'}]

                                        })(
                                            <DatePicker
                                                disabledDate={currentDate => {
                                                    return currentDate <= moment() ? true : false
                                                }}
                                                style={{width: '100%'}}
                                            />
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
                                        })(
                                            <Input/>
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
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="业务员id"
                                    >
                                        {getFieldDecorator('userId', {
                                            rules: [{required: true, message: '请输入业务员id'}],
                                            initialValue: userId
                                        })(
                                            <Input disabled={isOperator}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="业务员姓名"
                                    >
                                        {getFieldDecorator('userName', {
                                            rules: [{required: true, message: '请输入业务员姓名'}],
                                            initialValue: sessionStorage.userName
                                        })(
                                            <Input disabled={isOperator}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="订单编号"
                                    >
                                        {getFieldDecorator('orderCode', {
                                            rules: [{required: false, message: '请输入订单编号'}],
                                            initialValue: null
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
                                            initialValue: senderData.serderPhone
                                        })(
                                            <Input disabled/>
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
                                            initialValue: senderData.senderAddr
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="订单状态"
                                    >
                                        {getFieldDecorator('orderState', {
                                            rules: [{required: false, message: '请选择'}],
                                            initialValue: 0
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
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="是否超过成本"
                                    >
                                        {getFieldDecorator('isOverCost', {
                                            rules: [{required: true, message: '请选择'}],
                                            initialValue: 0
                                        })(
                                            <RadioGroup>
                                                <Radio value={0}>不是</Radio>
                                                <Radio value={1}>是</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="成本数据"
                                    >
                                        {getFieldDecorator('costAmount', {
                                            rules: [{required: true, message: '请输入成本数据'}],
                                            initialValue: 0
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
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="成本比例"
                                    >
                                        {getFieldDecorator('costRatio', {
                                            rules: [{required: true, message: '请输入成本比例'}],
                                            initialValue: 0
                                        })(
                                            <Input disabled={isOperator}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="快递单号"
                                    >
                                        {getFieldDecorator('expressCode', {
                                            rules: [{required: false, message: '请输入快递单号'}],
                                            initialValue: null
                                        })(
                                            <Input disabled={isOperator}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid} style={{display: 'none'}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="快递状态"
                                    >
                                        {getFieldDecorator('expressState', {
                                            rules: [{required: false, message: '请选择快递状态'}],
                                            initialValue: 0
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
                                <Col {...itemGrid}>
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
                                <Col {...itemGrid}>
                                    <FormItem
                                        label="所属仓库"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('warehouse', {
                                            rules: [{required: true, message: '所属仓库不能为空!'}],
                                            initialValue: 0
                                        })(
                                            <Select>
                                                <Option key='0' value={0}>武汉1</Option>
                                                <Option key='1' value={1}>北京</Option>
                                                <Option key='2' value={2}>武汉2</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="快递类别"
                                    >
                                        {getFieldDecorator('expressCompany', {
                                            rules: [{required: true, message: '请输入快递公司'}],
                                            initialValue: 0
                                        })(
                                            <Select>
                                                <Option key='0' value={0}>顺丰</Option>
                                                <Option key='1' value={1}>邮政</Option>
                                            </Select>
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
                                            initialValue: 0
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
                                <Divider>收件人信息</Divider>
                                <Col {...itemGrid}>
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
                                <Col {...itemGrid}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="收件人手机号"
                                    >
                                        {getFieldDecorator('receiverPhone', {
                                            rules: [{required: true, message: '请输入收件人手机号'}, {
                                                validator: this.validatePhone,
                                            }]
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
                                        })(
                                            <Input/>
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
                            </Row>
                            <Row type="flex" justify="center" style={{marginTop: 40}}>
                                <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                                        loading={submitLoading}>提交</Button>
                            </Row>
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