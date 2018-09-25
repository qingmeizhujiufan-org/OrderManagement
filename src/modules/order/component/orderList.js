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
    Breadcrumb,
    Dropdown,
    Notification,
    Spin,
    Tabs,
    message,
    Modal,
    Radio,
    Button, Message
} from 'antd';
import _ from 'lodash';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const Search = Input.Search;

const queryListUrl = restUrl.BASE_HOST + 'order/queryList';
const delUrl = restUrl.BASE_HOST + 'order/delete';

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
                fixed: 'left'
            }, {
                title: '业务员姓名',
                width: 120,
                dataIndex: 'userName',
                key: 'userName'
            }, {
                title: '区域',
                width: 100,
                dataIndex: 'region',
                key: 'region'
            }, {
                title: '所属仓库',
                width: 100,
                align: 'center',
                dataIndex: 'warehouse',
                key: 'warehouse'
            }, {
                title: '订单性质',
                width: 100,
                dataIndex: 'orderNature',
                key: 'orderNature'
            }, {
                title: '快递类别',
                width: 100,
                align: 'center',
                dataIndex: 'expressType',
                key: 'expressType'
            }, {
                title: '寄件电话',
                width: 100,
                dataIndex: 'serderPhone',
                key: 'serderPhone'
            }, {
                title: '寄件地址',
                width: 150,
                align: 'center',
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
                width: 150,
                align: 'center',
                dataIndex: 'orderDate',
                key: 'orderDate'
            }, {
                title: '发货日期',
                width: 150,
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
                key: 'isForeignExpress'
            }, {
                title: '订单状态',
                width: 100,
                align: 'center',
                dataIndex: 'orderState',
                key: 'orderState'
            }, {
                title: '是否超过成本',
                width: 120,
                align: 'center',
                dataIndex: 'isOverCost',
                key: 'isOverCost'
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
                title: '快递状态',
                width: 100,
                align: 'center',
                dataIndex: 'expressState',
                key: 'expressState'
            }, {
                title: '广告渠道',
                width: 100,
                align: 'center',
                dataIndex: 'advertChannel',
                key: 'advertChannel channel'
            }, {
                title: '进线时间',
                width: 100,
                align: 'center',
                dataIndex: 'incomlineTime',
                key: 'incomlineTime'
            }, {
                title: '备注',
                align: 'center',
                dataIndex: 'remark',
                key: 'remark'
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
                                    <Link to={this.onDetail(record.id)}>查看</Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link to={this.onEdit(record.id)}>编辑</Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <a onClick={() => this.onDelete(record.id)}>删除</a>
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
            dataSource: [],
            pagination: {},
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            keyWords: ''
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.queryList();
    }

    queryList = () => {
        const {params, keyWords} = this.state;
        const param = _.assign({}, params, {keyWords});
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
        const params = _.assign({}, this.state.params, param);
        this.setState({params}, () => {
            this.queryList();
        });
    }

    // 搜索
    onSearch = (value, event) => {
        console.log('onsearch value == ', value);
        this.setState({
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            keyWords: value
        }, () => {
            this.queryList();
        });
    }

    addOrder = () => {
        this.context.router.push('/frame/order/list/add');

    }

    onDetail = id => {
        return `/frame/order/list/detail/${id}`
    }

    onEdit = id => {
        return `/frame/order/list/edit/${id}`
    }

    onDelete = (key) => {
        Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = key;
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
                        message.error(data.backMsg);
                    }
                });
            }
        });
    }

    render() {
        const {dataSource, pagination, loading} = this.state;

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
                                    placeholder="搜索订单名称关键字"
                                    enterButton='搜索'
                                    size="large"
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
                    </div>
                </div>
                <div className='pageContent'>
                    <ZZCard>
                        <ZZTable
                            columns={this.columns}
                            dataSource={dataSource}
                            pagination={pagination}
                            loading={loading}
                            scroll={{x: 3000}}
                            handlePageChange={this.handlePageChange.bind(this)}
                        />
                    </ZZCard>
                </div>
            </div>
        );
    }
}

OrderList.contextTypes = {
    router: PropTypes.object
}

export default OrderList;