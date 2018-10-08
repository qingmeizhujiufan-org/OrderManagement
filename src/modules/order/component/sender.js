import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
    Notification,
    Icon,
    Breadcrumb,
    Button,
    Message,
    Dropdown,
    Menu,
    Row,
    Col,
    Input,
    Modal
} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD/index';

import assign from "lodash.assign";
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../../user/index.less';

const Search = Input.Search;

const queryListUrl = restUrl.BASE_HOST + 'sender/queryList';
const deleteUrl = restUrl.BASE_HOST + 'sender/delete';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '寄件方名称',
                align: 'center',
                dataIndex: 'senderName',
                key: 'senderName',
                render: (text, record, index) => (
                    <Link to={this.onDetail(record.id)}>{text}</Link>
                )
            }, {
                title: '寄件方电话',
                align: 'center',
                dataIndex: 'serderPhone',
                key: 'serderPhone',
            }, {
                title: '寄件方地址',
                width: 150,
                align: 'center',
                dataIndex: 'senderAddr',
                key: 'senderAddr',
            }, {
                title: '备注',
                width: 150,
                dataIndex: 'memo',
                key: 'memo',
            }, {
                title: '更新时间',
                width: 200,
                align: 'center',
                dataIndex: 'updateTime',
                key: 'updateTime',
            }, {
                title: '创建时间',
                width: 200,
                align: 'center',
                dataIndex: 'createTime',
                key: 'createTime',
            }, {
                title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
                key: 'operation',
                fixed: 'right',
                width: 180,
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
            }];

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
        this.queryList()
    }

    queryList = () => {
        const {params, keyWords} = this.state;
        const param = assign({}, params, {keyWords});
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

    addUser = () => {
        return this.context.router.push('/frame/user/list/add');
    }

    onDetail = id => {
        return `/frame/user/list/detail/${id}`
    }

    onEdit = id => {
        return `/frame/user/list/edit/${id}`
    }

    onFrozenChange = (checked, record, index) => {
        const param = {};
        param.id = record.id;
        param.isFrozen = checked ? 1 : 0;
        ajax.postJSON(frozenUserUrl, JSON.stringify(param), data => {
            if (data.success) {
                Notification.success({
                    message: '提示',
                    description: '冻结设置成功！'
                });
                const dataSource = this.state.dataSource;
                dataSource[index].isFrozen = checked ? 1 : 0;
                this.setState({dataSource});
            } else {
                Message.error(data.backMsg);
            }
        })
    }

    onDelete = id => {
        Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = id;
                ajax.postJSON(deleteUrl, JSON.stringify(param), data => {
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

    render() {
        const {dataSource, pagination, loading} = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>寄件信息列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>寄件信息列表</h1>
                    <div className='search-area'>
                        <Row type='flex' justify="center" align="middle">
                            <Col span={8}>
                                <Search
                                    placeholder="搜索关键字"
                                    enterButton='搜索'
                                    size="large"
                                    onSearch={this.onSearch}
                                />
                            </Col>
                            <Col span={3}>
                                <Button
                                    icon='plus'
                                    size="large"
                                    onClick={this.addUser}
                                    style={{marginLeft: 25}}
                                >新增寄件方信息</Button>
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
                            scroll={{x: 1500}}
                            handlePageChange={this.handlePageChange.bind(this)}
                        />
                    </ZZCard>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: PropTypes.object
}

export default Index;