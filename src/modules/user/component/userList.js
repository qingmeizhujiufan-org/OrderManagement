import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Divider, Breadcrumb, Spin, Button, message, Alert} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const queryListUrl = restUrl.BASE_HOST + 'user/userList';
const frozenUserUrl = restUrl.BASE_HOST + 'user/frozenUser';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [{
            title: '用户名',
            dataIndex: 'user_code',
            key: 'user_code',
        }, {
            title: '密码',
            dataIndex: 'password',
            key: 'password',
        }, {
            title: '姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        }, {
            title: '个人手机号',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '区域',
            dataIndex: 'region',
            key: 'region',
        }, {
            title: '用户角色',
            dataIndex: 'role_id',
            key: 'role_id',
        }, {
            title: '是否冻结',
            dataIndex: 'is_frozen',
            key: 'is_frozen',
        }, {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
        }, {
            title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
            key: 'operation',
            width: 120,
            align: 'center',
            render: (text, record, index) => (
                <span>
            <a onClick={this.checkDetail}>详情</a>
            <Divider type="vertical"/>
            <a href="javascript:;">删除</a>
          </span>
            )
        }];
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            dataSource: [],
            loading: true,
            delLoading: false
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.getList();
    }

    getList = () => {
        ajax.getJSON(queryListUrl, null, data => {
            if (data.success) {
                data = data.backData.content;
                data.map(function (item, index) {
                    item.key = index;
                });
                this.setState({
                    dataSource: data,
                    loading: false
                });
            } else {
                message.error(data.backMsg);
            }
        });
    }

    checkDetail = () => {

    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    }

    addUser = () => {
        return this.context.router.push('/frame/user/add');
    }

    render() {
        const {dataSource, selectedRowKeys, loading, delLoading} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                            <Breadcrumb.Item>用户列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>用户列表</h1>
                </div>
                <div className='pageContent'>
                    <ZZCard
                        title="用户列表"
                    >
                        <Button type='primary' icon='plus' loading={delLoading} style={{marginBottom: 15}}
                                onClick={() => this.addUser()}>新增用户</Button>
                        <Spin spinning={loading}>
                            <ZZTable
                                dataSource={dataSource}
                                columns={this.columns}
                                rowKey={record => record.id}
                                rowSelection={rowSelection}
                            />
                        </Spin>
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