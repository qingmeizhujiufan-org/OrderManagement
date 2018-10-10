import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Input,
    Icon,
    Badge,
    Menu,
    Form,
    DatePicker,
    Breadcrumb,
    Dropdown,
    Notification,
    Select,
    Message,
    Modal,
    Collapse,
    Button,
    Upload
} from 'antd';
import assign from 'lodash/assign';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";
import {formItemLayout, itemGrid} from 'Utils/formItemGrid';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

const queryListUrl = restUrl.BASE_HOST + 'order/queryList';
const delUrl = restUrl.BASE_HOST + 'order/delete';
const exportOrderUrl = restUrl.BASE_HOST + 'order/exportMultiPurchase';
//仓库回执信息导入接口地址
const importWarehouseReceiptUrl = restUrl.BASE_HOST + 'order/importWarehouseReceipt';

class OrderList extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '订单编号',
                width: 180,
                align: 'center',
                dataIndex: 'orderCode',
                key: 'orderCode',
                fixed: 'left',
                render: (text, record, index) => (
                    <Link to={`/frame/order/list/edit/${record.id}`}>{text}</Link>
                )
            }, {
                title: '业务员姓名',
                width: 120,
                align: 'center',
                dataIndex: 'userName',
                key: 'userName'
            }, {
                title: '区域',
                width: 100,
                align: 'center',
                dataIndex: 'region',
                key: 'region'
            }, {
                title: '所属仓库',
                width: 100,
                align: 'center',
                dataIndex: 'warehouse',
                key: 'warehouse',
                render: (text, record, index) => (
                    <div>{text === 0 ? '武汉' : '北京'}</div>
                )
            }, {
                title: '订单性质',
                width: 100,
                align: 'center',
                dataIndex: 'orderNature',
                key: 'orderNature'
            }, {
                title: '快递类别',
                width: 100,
                align: 'center',
                dataIndex: 'expressCompany',
                key: 'expressCompany',
                render: (text, record, index) => (
                    <div>{text === 0 ? '顺丰' : '邮政'}</div>
                )
            }, {
                title: '寄件电话',
                width: 120,
                align: 'center',
                dataIndex: 'serderPhone',
                key: 'serderPhone'
            }, {
                title: '寄件地址',
                width: 250,
                dataIndex: 'senderAddr',
                key: 'senderAddr'
            }, {
                title: '成单微信号',
                width: 120,
                align: 'center',
                dataIndex: 'orderWechatCode',
                key: 'orderWechatCode'
            }, {
                title: '成单日期',
                width: 120,
                align: 'center',
                dataIndex: 'orderDate',
                key: 'orderDate'
            }, {
                title: '发货日期',
                width: 120,
                align: 'center',
                dataIndex: 'deliverDate',
                key: 'deliverDate'
            }, {
                title: '收件人',
                width: 100,
                align: 'center',
                dataIndex: 'receiverName',
                key: 'receiverName'
            }, {
                title: '收件人电话',
                width: 120,
                align: 'center',
                dataIndex: 'ReceiverPhone',
                key: 'ReceiverPhone'
            }, {
                title: '收件人地址',
                width: 150,
                align: 'center',
                dataIndex: 'receiverAddr',
                key: 'receiverAddr'
            }, {
                title: '定金',
                width: 100,
                align: 'right',
                dataIndex: 'depositAmout',
                key: 'depositAmout',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '代收金额',
                width: 100,
                align: 'right',
                dataIndex: 'collectionAmout',
                key: 'collectionAmout',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '总金额',
                width: 100,
                align: 'right',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '国际件',
                width: 100,
                align: 'center',
                dataIndex: 'isForeignExpress',
                key: 'isForeignExpress',
                render: (text, record, index) => (
                    <div>{text === 0 ? '不是' : '是'}</div>
                )
            }, {
                title: '是否超过成本',
                width: 140,
                align: 'center',
                dataIndex: 'isOverCost',
                key: 'isOverCost',
                render: (text, record, index) => (
                    <div>{text === 0 ? '不是' : '是'}</div>
                )
            }, {
                title: '成本',
                width: 100,
                align: 'right',
                dataIndex: 'costAmount',
                key: 'costAmount',
                render: (text, record, index) => (
                    <span>{Util.shiftThousands(text)}</span>
                )
            }, {
                title: '快递单号',
                width: 150,
                align: 'center',
                dataIndex: 'expressCode',
                key: 'expressCode'
            }, {
                title: '广告渠道',
                width: 100,
                align: 'center',
                dataIndex: 'advertChannel',
                key: 'advertChannel channel'
            }, {
                title: '进线时间',
                width: 180,
                align: 'center',
                dataIndex: 'incomlineTime',
                key: 'incomlineTime'
            }, {
                title: '备注',
                align: 'center',
                dataIndex: 'remark',
                key: 'remark'
            }, {
                title: '订单状态',
                width: 120,
                align: 'center',
                fixed: 'right',
                dataIndex: 'orderState',
                key: 'orderState',
                render: (text, record, index) => {
                    if (text === 0) return <Badge status="default" text="编辑中"/>;
                    else if (text === 1) return <Badge status="warning" text="已锁定"/>;
                    else if (text === 2) return <Badge status="processing" text="已发快递"/>;
                    else if (text === 3) return <Badge status="success" text="成单"/>;
                }
            }, {
                title: '快递状态',
                width: 120,
                fixed: 'right',
                align: 'center',
                dataIndex: 'expressState',
                key: 'expressState',
                render: (text, record, index) => {
                    if (text === 0) return <Badge status="default" text="未发货"/>;
                    else if (text === 1) return <Badge status="processing" text="已发货"/>;
                    else if (text === 2) return <Badge status="warning" text="取消发货"/>;
                    else if (text === 3) return <Badge status="warning" text="未妥投"/>;
                    else if (text === 4) return <Badge status="error" text="退回"/>;
                    else if (text === 5) return <Badge status="success" text="签收"/>;
                }
            }, {
                title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
                key: 'operation',
                fixed: 'right',
                width: 120,
                align: 'center',
                render: (text, record, index) => (
                    <Dropdown
                        placement="bottomCenter"
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Link to={this.onEdit(record.id)}>编辑</Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <a onClick={() => this.onDelete(record)}>删除</a>
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <a className="ant-dropdown-link">操作</a>
                    </Dropdown>
                )
            }
        ];

        this.state = {
            loading: false,
            showUpload: false,
            fileList: [],
            dataSource: [],
            pagination: {},
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            keyWords: '',
            searchKey: {}
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryList();
    }

    queryList = () => {
        const {params, searchKey} = this.state;
        const param = assign({}, params, searchKey);
        this.setState({loading: true});
        ajax.getJSON(queryListUrl, param, data => {
            if (data.success) {
                if (data.backData) {
                    const backData = data.backData;
                    const dataSource = backData.content;
                    const total = backData.totalElements;
                    dataSource.map(item => {
                        item.key = item.id;
                    });

                    this.setState({
                        dataSource,
                        pagination: {total}
                    });
                } else {
                    this.setState({
                        dataSource: [],
                        pagination: {total: 0}
                    });
                }
            } else {
                Message.error('查询列表失败');
            }
            this.setState({loading: false});
        });
    }

    // 处理分页变化
    handlePageChange = param => {
        const params = assign({}, this.state.params, param);
        this.setState({params}, () => {
            this.queryList();
        });
    }

    exportOrderList = () => {
        const {searchKey} = this.state;
        console.log("searchKey2 ===", searchKey)

        fetch(exportOrderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': sessionStorage.token
            },
            body: JSON.stringify({orderNature: '热线', deliverMonth: '2018-09'})
        }).then((response) => response.blob()).then((blob) => {
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display:none');
            a.setAttribute('href', objectUrl);
            a.setAttribute('download', '订单表.xlsx');
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }

    showUploadModal = () => {
        this.setState({
            showUpload: !this.state.showUpload
        });
    }

    selectWarehouse = () => {

    }

    handleUpload = () => {

    }

    // 搜索
    onSearch = (val, event) => {
        this.getSearchKey(val, this.queryList)
    }

    //导出订单列表
    outOrderList = () => {
        let keyWords = this.state.keyWords;
        this.getSearchKey(keyWords, this.exportOrderList)
    }

    //获取查询参数
    getSearchKey = (val, callback) => {
        console.log('val == ', val);
        const values = this.props.form.getFieldsValue();
        const searchKey = {}
        values.keyWords = val;
        values.orderDate = values.orderDate ? values.orderDate.format("YYYY-MM-DD") : '';
        values.deliverBeginDate = values.deliverBeginDate ? values.deliverBeginDate.format("YYYY-MM-DD") : '';
        values.deliverEndDate = values.deliverEndDate ? values.deliverEndDate.format("YYYY-MM-DD") : '';
        values.deliverDate = values.deliverDate ? values.deliverDate.format("YYYY-MM-DD") : '';

        console.log('onsearch value == ', values);
        for (let key in values) {
            if (values[key] !== "" && values[key] !== undefined) {
                searchKey[key] = values[key]
            }
        }
        console.log('searchKey1 == ', searchKey);

        this.setState({
            searchKey: searchKey
        }, () => {
            if (typeof callback === 'function') callback();
        });
    }

    resetSearchKey = () => {
        this.props.form.resetFields();
    }

    addOrder = () => {
        this.context.router.push('/frame/order/add');
    }

    onEdit = id => {
        return `/frame/order/list/edit/${id}`
    }

    onDelete = (record) => {
        if (record.orderState === 0)
            Message.warning('当前订单无法删除');
        else {
            Modal.confirm({
                title: '提示',
                content: '确认要删除吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    let param = {};
                    param.id = record.id;
                    ajax.postJSON(delUrl, JSON.stringify(param), data => {
                        if (data.success) {
                            Notification.success({
                                message: '提示',
                                description: '删除成功！'
                            });

                            this.setState({
                                params: {
                                    pageNumber: 1
                                },
                            }, () => {
                                this.queryList();
                            });
                        } else {
                            Message.error(data.backMsg);
                        }
                    });
                }
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values ===', values)
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataSource, pagination, loading, keyWords, showUpload} = this.state;
        const customPanelStyle = {
            borderRadius: 4,
            border: 0,
            overflow: 'hidden',
        };
        return (
            <div className="zui-content page-newsList">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>订单列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>订单列表</h1>
                    <div className='search-area'>
                        <Row type='flex' justify="center" align="middle">
                            <Col span={8}>
                                <Search
                                    id="keyWords"
                                    placeholder="搜索订单名称关键字"
                                    enterButton='搜索'
                                    size="large"
                                    value={keyWords}
                                    onChange={e => this.setState({keyWords: e.target.value})}
                                    onSearch={this.onSearch}
                                />
                            </Col>
                            <Col span={3}>
                                <Button
                                    icon='plus'
                                    size="large"
                                    onClick={this.addOrder}
                                    style={{marginLeft: 25}}
                                >新增订单</Button>
                            </Col>
                        </Row>
                        <Collapse bordered={false} style={{marginTop: 20}}>
                            <Panel header="查询条件" key="1" style={customPanelStyle}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Row type='flex' justify="center" align="middle">
                                        <Col {...itemGrid}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="订单性质"
                                            >
                                                {getFieldDecorator('orderNature', {
                                                    rules: [{required: false}],
                                                    initialValue: ''
                                                })(
                                                    <Input/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...itemGrid} >
                                            <FormItem
                                                {...formItemLayout}
                                                label="成单日期"
                                            >
                                                {getFieldDecorator('orderDate', {
                                                    rules: [{required: false}],
                                                })(
                                                    <DatePicker style={{width: '100%'}} onChange={this.getDate}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...itemGrid}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="发货开始日期"
                                            >
                                                {getFieldDecorator('deliverBeginDate', {
                                                    rules: [{required: false}],
                                                })(
                                                    <DatePicker style={{width: '100%'}} onChange={this.getDate}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...itemGrid}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="发货结束日期"
                                            >
                                                {getFieldDecorator('deliverEndDate', {
                                                    rules: [{required: false}],
                                                })(
                                                    <DatePicker style={{width: '100%'}} onChange={this.getDate}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...itemGrid}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="发货日期"
                                            >
                                                {getFieldDecorator('deliverDate', {
                                                    rules: [{required: false}],
                                                })(
                                                    <DatePicker style={{width: '100%'}} onChange={this.getDate}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...itemGrid} >
                                            <FormItem
                                                {...formItemLayout}
                                                label="仓库"
                                            >
                                                {getFieldDecorator('warehouse', {
                                                    rules: [{required: false}],
                                                    initialValue: ''
                                                })(
                                                    <Select>
                                                        <Option key='0' value={0}>武汉</Option>
                                                        <Option key='1' value={1}>北京</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...itemGrid}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="快递状态"
                                            >
                                                {getFieldDecorator('expressState', {
                                                    rules: [{required: false}],
                                                    initialValue: ''
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
                                        </Col> <Col {...itemGrid}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="是否超过成本"
                                        >
                                            {getFieldDecorator('isOverCost', {
                                                rules: [{required: false}],
                                                initialValue: ''
                                            })(
                                                <Select>
                                                    <Option key='0' value={0}>否</Option>
                                                    <Option key='1' value={1}>是</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                        <Col {...itemGrid}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="订单状态"
                                            >
                                                {getFieldDecorator('orderState', {
                                                    rules: [{required: false}],
                                                    initialValue: ''
                                                })(
                                                    <Select>
                                                        <Option key='0' value={0}>编辑中</Option>
                                                        <Option key='1' value={1}>已锁定</Option>
                                                        <Option key='2' value={2}>已发货</Option>
                                                        <Option key='3' value={3}>已成单</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Button
                                            icon='reload'
                                            size="small"
                                            onClick={this.resetSearchKey}
                                            style={{marginBottom: 15, float: 'right'}}
                                        >重置</Button>
                                    </Row>
                                </Form>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
                <div className='pageContent'>
                    <ZZCard>
                        <Button
                            icon='download'
                            onClick={this.outOrderList}
                            style={{marginBottom: 15, marginRight: 10}}
                        >导出订单</Button>
                        <Button
                            icon='upload'
                            onClick={this.showUploadModal}
                            style={{marginBottom: 15, marginRight: 10}}
                        >仓库回执信息</Button>
                        <ZZTable
                            columns={this.columns}
                            dataSource={dataSource}
                            pagination={pagination}
                            loading={loading}
                            scroll={{x: 3500}}
                            handlePageChange={this.handlePageChange.bind(this)}
                        />
                    </ZZCard>
                </div>
                <Modal
                    title="导入仓库回执信息"
                    visible={showUpload}
                    onOk={this.handleOk}
                    onCancel={this.showUploadModal}
                >
                    <Row style={{marginBottom: 10}}>
                        <Col span={12}>
                            <label>仓库：</label>
                            <Select
                                placeholder="选择仓库"
                                style={{width: 150}}
                                onChange={this.selectWarehouse}
                            >
                                <Option key='0' value={0}>武汉</Option>
                                <Option key='1' value={1}>北京</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Upload
                        headers={{
                            'X-Auth-Token': sessionStorage.token
                        }}
                        name='file'
                        action={importWarehouseReceiptUrl}
                        data={{warehouse: 1}}
                        onChange={this.handleUpload}
                    >
                        <Button>
                            <Icon type="upload"/> 上传文件
                        </Button>
                    </Upload>
                </Modal>
            </div>
        );
    }
}

const orderList = Form.create()(OrderList);

OrderList.contextTypes = {
    router: PropTypes.object
}

export default orderList;