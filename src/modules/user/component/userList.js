import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
  Icon,
  Divider,
  Pagination,
  Breadcrumb,
  Spin,
  Button,
  Message,
  Dropdown,
  Menu,
  Switch,
  Row,
  Col,
  Input
} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

import _ from 'lodash';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const Search = Input.Search;

const queryListUrl = restUrl.BASE_HOST + 'user/userList';
const frozenUserUrl = restUrl.BASE_HOST + 'user/frozenUser';
const deleteUrl = restUrl.BASE_HOST + '';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [{
      title: '用户编码',
      align: 'center',
      dataIndex: 'userCode',
      key: 'userCode',
      render: (text, record, index) => (
        <Link to={this.onDetail(record.id)}>{text}</Link>
      )
    }, {
      title: '姓名',
      align: 'center',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '个人手机号',
      width: 150,
      align: 'center',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '区域',
      width: 150,
      align: 'center',
      dataIndex: 'region',
      key: 'region',
    }, {
      title: '用户角色',
      width: 120,
      align: 'center',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (text, record, index) => {
        let role = _.find(this.state.roleList, {id: text});
        return (<span>{role ? role.name : null}</span>)
      }
    }, {
      title: '是否冻结',
      width: 120,
      align: 'center',
      dataIndex: 'isFrozen',
      key: 'isFrozen',
      render: (text, record, index) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          checked={text === 1 ? true : false}
          onChange={checked => this.onFrozenChange(checked, record, index)}
        />
      )
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
    }];
    this.state = {
      roleList: [{
        id: '4a347f25084654cf73a88d8dc7262990',
        name: '管理员'
      }, {
        id: '7ed07b2360b38b78d8864df188f0b704',
        name: '业务员'
      }, {
        id: 'a8d93d94b49d3b46fd2df429178c9454',
        name: 'sys管理员'
      }, {
        id: 'b99514487e9004f63740643f0fe7523f',
        name: '二级管理员'
      }],
      searchText: '',
      dataSource: [],
      loading: true,
      pagination: {},
      delLoading: false,
    };
  }

  componentWillMount = () => {
  }

  handleTableChange = (pagination) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getList({
      pageSize: pagination.pageSize,
      page: pagination.current,
    });
  }

  componentDidMount = () => {
    this.getList();
  }

  getList = (params = {}) => {
    ajax.getJSON(queryListUrl, {
      pageSize: 10,
      page: 1,
      ...params,
    }, data => {
      if (data.success) {
        const pagination = {...this.state.pagination};
        const total= data.backData.totalElements;
        pagination.total = total;
        pagination.showQuickJumper = true;
        pagination.showSizeChanger = true;
        pagination.showTotal = total => `共 ${total} 条记录`;
        console.log("pagination ==", pagination)
        data = data.backData.content;
        data.map(function (item, index) {
          item.key = index;
        });

        this.setState({
          dataSource: data,
          pagination,
          total: pagination.total,
          loading: false
        });
      } else {
        message.error(data.backMsg);
      }
    });
  }

  addUser = () => {
    return this.context.router.push('/frame/user/add');
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
    param.type = checked ? 1 : 0;
    ajax.getJSON(frozenUserUrl, param, data => {
      if (data.success) {
        notification.open({
          message: '冻结设置成功！',
          icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
        });
        const dataSource = [...this.state.dataSource];
        dataSource[index].isForzen = checked ? 1 : 0;

        this.setState({
          dataSource,
        });
      } else {
        Message.warning(data.backMsg);
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
            notification.open({
              message: '删除成功！',
              icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
            });

            const dataSource = [...this.state.dataSource].filter(item => item.key !== id);

            this.setState({
              dataSource,
            });
          } else {
            Message.warning(data.backMsg);
          }
        });
      }
    });
  }

  render() {
    const {searchText, dataSource, loading, delLoading, pagination} = this.state;

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
          <div className='search-area'>
            <Row type='flex' justify="space-around" align="middle">
              <Col span={8}>
                <Search
                  placeholder="搜索用户名关键字"
                  enterButton
                  size="large"
                  onSearch={searchText => this.setState({searchText})}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className='pageContent'>
          <ZZCard
            title="用户列表"
            extra={<Button type='primary' icon='plus' loading={delLoading}
                           onClick={this.addUser}>新增用户</Button>}
          >
            <Spin spinning={loading}>
              <ZZTable
                dataSource={dataSource}
                columns={this.columns}
                pagination={pagination}
                onChange={this.handleTableChange}
                scroll={{x: 1500}}
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