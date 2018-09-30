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
    Table,
    Spin,
    Icon,
    DatePicker,
    Notification,
    Message,
    Radio
} from 'antd';
import moment from 'moment';
import Chance from 'chance';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {message} from "antd/lib/index";
import _ from "lodash";

const orderAddUrl = restUrl.BASE_HOST + 'order/save';
const getProuctListUrl = restUrl.BASE_HOST + 'product/queryList';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const chance = new Chance();

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: sessionStorage.userId,
            submitLoading: false,
            selectedProduct: [],
            selectedRowKeys: [],
            showModal: false,
            loading: false,
            allProduct: [],
            submitProduct: [],
            pagination: {},
            params: {
                pageNumber: 1,
                pageSize: 10,
            },

        };

        this.productColumns = [{
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
            render: (text, record, index) => (
                <span>
          {record.wareHouse == 1 ? '北京' : '武汉'}
        </span>)
        }, {
            title: '成本价格',
            dataIndex: 'costPrice',
            width: 200,
            align: 'center',
            key: 'costPrice'
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
                width: 250,
                key: 'name'
            }, {
                title: '产品条码',
                dataIndex: 'barCode',
                align: 'center',
                width: 250,
                key: 'barCode'
            }, {
                title: '数量',
                dataIndex: 'number',
                align: 'center',
                width: 150,
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
                title: '单价',
                dataIndex: 'costPrice',
                align: 'center',
                width: 150,
                key: 'costPrice',
                render: (text, record, index) => (
                    <InputNumber
                        style={{width: '60%'}}
                        defaultValue={record.costPrice}
                        min={0.01}
                        step={0.01}
                        precision={2}
                        onChange={value => this.setEachPrice(value, record, index)}
                    />
                )
            }, {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: 150,
                align: 'center',
            }, {
                title: '小计',
                dataIndex: 'total',
                align: 'center',
                width: 150,
                key: 'total'
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

    componentDidMount = () => {
    }

    onDelete = index => {
        Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let selectedProduct = this.state.selectedProduct;
                let selectedRowKeys = this.state.selectedRowKeys;
                selectedProduct.splice(index, 1);
                selectedRowKeys.splice(index, 1);
                console.log('selectedRowKeys ===', selectedRowKeys)
                this.setState({
                    selectedProduct,
                    selectedRowKeys
                }, () => {
                    Notification.success({
                        message: '提示',
                        description: '删除成功！'
                    });
                });
            }
        });
    }

    showModal = () => {
        this.setState({
            showModal: true,
        }, () => {
            this.getList();
        })
    }

    handleCancel = () => {
        this.setState({
            showModal: false
        });
    }

    handleOk = () => {
        let selectedProduct = this.state.selectedProduct;
        for (let i in selectedProduct) {
            selectedProduct[i].number = 1;
            selectedProduct[i] = this.setTotalAmount(selectedProduct[i])
        }
        this.setState({
            submitProduct: selectedProduct,
            showModal: false
        }, () => {
        });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        const selectedNum = selectedRowKeys.length;
        if (selectedNum <= 4) {
            this.setState({
                selectedRowKeys: selectedRowKeys,
                selectedProduct: selectedRows
            });
        } else {
            message.warning('产品种类最多为四种');
        }
        console.log('selectedRowKeys changed: ', selectedRows);

    }

    setEachProNumber = (val, record, index) => {
        let data = this.state.submitProduct;
        record.number = val ? val : 1;
        record = this.setTotalAmount(record);
        data[index] = record;
        this.setState({
            submitProduct: data
        })
    }

    setEachPrice = (val, record, index) => {
        let data = this.state.submitProduct;
        record.costPrice = val ? val : record.costPrice;
        record = this.setTotalAmount(record);
        data[index] = record;
        this.setState({
            submitProduct: data
        })
    }

    setTotalAmount = (record) => {
        record.total = (record.number * record.costPrice).toFixed(2);
        return record
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
        const params = _.assign({}, this.state.params, param);
        this.setState({params}, () => {
            this.getList();
        });
    }

    getList = () => {
        const {params} = this.state;
        this.setState({loading: true});
        ajax.getJSON(getProuctListUrl, params, data => {
            if (data.success) {
                const total = data.backData.totalElements;
                data = data.backData.content;
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
                const {submitProduct} = this.state;
                values.orderDate = values.orderDate.format("YYYY-MM-DD");
                values.deliverDate = values.deliverDate.format("YYYY-MM-DD");
                values.incomlineTime = values.incomlineTime.format("YYYY-MM-DD HH:mm:ss");

                values.childrenDetail = submitProduct.map(item => {
                    return {
                        productId: item.id,
                        productName: item.name,
                        pnumber: item.number,
                        productUnit: item.unit,
                        productBarCode: item.barCode,
                        orderId: null,
                        productCostPrice: item.costPrice,
                        voState: 1
                    }
                });

                console.log('handleSubmit  param === ', values);
                this.setState({
                    submitLoading: true
                });
                ajax.postJSON(orderAddUrl, JSON.stringify(values), (data) => {
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
        const {userId, submitProduct, submitLoading, showModal, pagination, loading, allProduct, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
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
                        <ZZCard
                            extra={<Button type='dashed' icon='plus'
                                           onClick={this.showModal}>选择产品</Button>
                            }
                        >
                            <Table
                                bordered
                                dataSource={submitProduct}
                                columns={this.orderColumns}
                                pagination={false}
                            />
                        </ZZCard>
                        <Modal
                            title="添加产品"
                            visible={showModal}
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
                                {selectedRowKeys.length ? `已选择 ${selectedRowKeys.length} 个产品` : '未选择产品'}
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
                        <Divider>订单信息</Divider>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="所属区域"
                                    >
                                        {getFieldDecorator('region', {
                                            rules: [{required: true, message: '请输入所属区域'}],
                                            initialValue: chance.string()
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
                                            rules: [{required: true, message: '所属仓库不能为空!'}],
                                            initialValue: 1
                                        })(
                                            <Select>
                                                <Option key='0' value={0}>武汉</Option>
                                                <Option key='1' value={1}>北京</Option>
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
                                            rules: [{required: true, message: '请输入业务员id'}],
                                            initialValue: userId
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="业务员姓名"
                                    >
                                        {getFieldDecorator('userName', {
                                            rules: [{required: true, message: '请输入业务员姓名'}],
                                            initialValue: sessionStorage.userName
                                        })(
                                            <Input disabled/>
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
                                            initialValue: chance.string()
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
                                            initialValue: chance.string()
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
                                            rules: [{required: true, message: '请输入寄件电话'}, {
                                                validator: this.validatePhone,
                                            }],
                                            initialValue: '18634348921'
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
                                            initialValue: chance.address()
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
                                            initialValue: chance.string()
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
                                            initialValue: moment()

                                        })(
                                            <DatePicker style={{width: '100%'}} onChange={this.getDate}/>
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
                                            initialValue: moment()

                                        })(
                                            <DatePicker style={{width: '100%'}}/>
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
                                            initialValue: chance.string()
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
                                            rules: [{required: true, message: '请输入收件人手机号'}, {
                                                validator: this.validatePhone,
                                            }],
                                            initialValue: '18634348921'
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
                                            initialValue: chance.address()
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
                                            initialValue: chance.string()
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
                                            initialValue: moment()

                                        })(
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                                style={{width: '100%'}}
                                            />
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
                                            initialValue: 1000
                                        })(
                                            <InputNumber
                                                step={0.01}
                                                precision={2}
                                                min={0}
                                            />
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
                                            initialValue: 200
                                        })(
                                            <InputNumber
                                                min={0}
                                                step={0.01}
                                                precision={2}
                                            />
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
                                            initialValue: 1200
                                        })(
                                            <InputNumber
                                                min={0}
                                                step={0.1}
                                                precision={2}
                                            />
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
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="订单状态"
                                    >
                                        {getFieldDecorator('orderState', {
                                            rules: [{required: true, message: '请选择'}],
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
                                <Col span={12}>
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
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="成本数据"
                                    >
                                        {getFieldDecorator('costAmount', {
                                            rules: [{required: true, message: '请输入成本数据'}],
                                            initialValue: 30
                                        })(
                                            <InputNumber/>
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
                                            initialValue: 0.3
                                        })(
                                            <InputNumber/>
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
                                            rules: [{required: true, message: '请输入快递单号'}],
                                            initialValue: chance.string()
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
                                            rules: [{required: true, message: '请选择快递状态'}],
                                            initialValue: 0
                                        })(
                                            <Select>
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
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="快递公司"
                                    >
                                        {getFieldDecorator('expressCompany', {
                                            rules: [{required: true, message: '请输入快递公司'}],
                                            initialValue: 0
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