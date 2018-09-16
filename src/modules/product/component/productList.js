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
  Divider,
  notification,
  Spin,
  Tabs,
  message,
  Modal,
  Radio,
  Button
} from 'antd';
import _ from 'lodash';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

const getLiveListUrl = restUrl.BASE_HOST + 'product/queryList';
const reviewUrl = restUrl.BASE_HOST + 'product/review';
const delLiveUrl = restUrl.BASE_HOST + 'product/delete';

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [{
      title: '仓库地址',
      dataIndex: 'warehouse',
      width: 250,
      key: 'warehouse'
    }, {
      title: '产品名称',
      width: 300,
      dataIndex: 'productName',
      key: 'productName'
    }, {
      title: '单位',
      align: 'center',
      dataIndex: 'productUnit',
      key: 'productUnit',
    }, {
      title: '成本价格',
      align: 'right',
      dataIndex: 'costPrice',
      key: 'costPrice',
    }, {
      title: '备注',
      width: 120,
      dataIndex: 'memo',
      key: 'memo'
    }, {
      title: '产品条码',
      align: 'center',
      dataIndex: 'productCode',
      key: 'productCode'
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
      loading: false,
      delLoading: false,
      dataSource: [],
      pagination: {},
      searchText: '',
      state: 999
    };
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.getList();
  }

  handleTableChange = (pagination) => {
    this.setState({
      pagination: pagination,
    }, () => {
      this.getList({
        pageSize: pagination.pageSize,
        pageNumber: pagination.current,
      });
    });

  }

  getList = (params = {}) => {
    ajax.getJSON(getLiveListUrl, {
      pageSize: 10,
      pageNumber: 1,
      ...params,
    }, data => {
      if (data.success) {
        const total = data.backData.totalElements;
        data = data.backData.content;
        data.map(item => {
          item.key = item.id;
        });

        this.setState({
          dataSource: data,
          total: total,
          loading: false
        });
      } else {
        message.error('查询产品列表失败');
      }
    });
  }

  addProduct = () => {
    return this.context.router.push('/frame/product/add');
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
        ajax.postJSON(delLiveUrl, JSON.stringify(param), data => {
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
            message.warning(data.backMsg);
          }
        });
      }
    });
  }

  render() {
    const {loading, delLoading, dataSource, searchText, state, total} = this.state;
    let n_dataSource = [...dataSource].filter(item => item.newsTitle.indexOf(searchText) > -1);
    if (state !== 999) {
      n_dataSource = n_dataSource.filter(item => item.state === state);
    }

    return (
      <div className="zui-content page-newsList">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>产品管理</Breadcrumb.Item>
              <Breadcrumb.Item>产品列表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>产品列表</h1>
          <div className='search-area'>
            <Row type='flex' justify="space-around" align="middle">
              <Col span={8}>
                <Search
                  placeholder="搜索产品关键字"
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
            extra={<Button type='primary' icon='plus' loading={delLoading}
                           onClick={this.addProduct}>新增产品</Button>}
          >
            <Spin spinning={loading} size='large'>
              <ZZTable
                dataSource={dataSource}
                columns={this.columns}
                total={total}
                onChange={this.handleTableChange.bind(this)}
                scroll={{x: 1500}}
              />
            </Spin>
          </ZZCard>
        </div>
      </div>
    );
  }
}

ProductList.contextTypes = {
  router: PropTypes.object
}

export default ProductList;