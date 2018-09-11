import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Divider, Breadcrumb, Spin, Button, message, Alert } from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const queryListUrl = restUrl.ADDR + 'user/queryList';
const delUrl = restUrl.ADDR + 'user/delete';

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
}, {
    title: '电话',
    dataIndex: 'telephone',
    key: 'telephone',
}];

class Index extends React.Component {
    constructor(props) {
        super(props);

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
            if(data.success){
                data = data.backData;
                data.map(function (item, index) {
                    item.key = index;
                });
                this.setState({
                    dataSource: data,
                    loading: false
                });
            }else {
                message.error(data.backMsg);
            }
        });
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    batchDel = () => {
        const param = {};
        param.ids = this.state.selectedRowKeys.join(',');
        console.log('ids === ', param);
        this.setState({
            delLoading: true
        });
        ajax.postJSON(delUrl, JSON.stringify(param), data => {
            if(data.success){
                const dataSource = [...this.state.dataSource].filter(item => item.id.indexOf(param.ids) <= -1);
                this.setState({
                    dataSource,
                    selectedRowKeys: []
                });
            }else {
                message.error(data.backMsg);
            }
            this.setState({
                delLoading: false
            });
        });
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
                        <Button type='primary' icon='close' loading={delLoading} style={{marginBottom: 15}} onClick={() => this.batchDel()}>批量删除</Button>
                        <Alert style={{marginBottom: 15}} message={<span>已选择 <a>{rowSelection.selectedRowKeys.length}</a> 项<a style={{marginLeft: 20}}>清空</a></span>} type="info" showIcon />
                        <Spin spinning={loading}>
                            <ZZTable
                                dataSource={dataSource}
                                columns={columns}
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