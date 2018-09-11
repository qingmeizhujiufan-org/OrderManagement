import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Divider, Breadcrumb, Spin, Button, message, Alert} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const queryListUrl = restUrl.ADDR + 'user/queryList';
const delUrl = restUrl.ADDR + 'user/delete';

const columns = [{
  title: '用户名',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '密码',
  dataIndex: 'password',
  key: 'password',
}, {
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '个人手机号',
  dataIndex: 'telphone',
  key: 'telphone',
}, {
  title: '区域',
  dataIndex: 'area',
  key: 'area',
}, {
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
}, {
  title: '操作',
  key: 'action',
  align: 'center',
  width: 150,
  render: (text, record) => (
    <span>
      <a href="javascript:;">编辑</a>
      <Divider type="vertical"/>
      <a href="javascript:;">删除</a>
    </span>
  ),
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
      if (data.success) {
        data = data.backData;
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

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  batchDel = () => {
    const param = {};
    param.ids = this.state.selectedRowKeys.join(',');
    console.log('ids === ', param);
    this.setState({
      delLoading: true
    });
    ajax.postJSON(delUrl, JSON.stringify(param), data => {
      if (data.success) {
        const dataSource = [...this.state.dataSource].filter(item => item.id.indexOf(param.ids) <= -1);
        this.setState({
          dataSource,
          selectedRowKeys: []
        });
      } else {
        message.error(data.backMsg);
      }
      this.setState({
        delLoading: false
      });
    });
  }

  addUser = () => {

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
              <Breadcrumb.Item>新增用户</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>新增用户</h1>
        </div>
        <div className='pageContent'>
          <ZZCard
            title="用户信息"
          >
              <ZZTable
                dataSource={dataSource}
                columns={columns}
                rowKey={record => record.id}
                rowSelection={rowSelection}
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