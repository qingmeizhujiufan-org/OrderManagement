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
const getLiveListUrl = restUrl.ADDR + 'product/queryListByAdmin';
const reviewUrl = restUrl.ADDR + 'product/review';
const delLiveUrl = restUrl.ADDR + 'product/delete';

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
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '单位',
      align: 'center',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '成本价格',
      align: 'right',
      dataIndex: 'cost_price',
      key: 'cost_price',
    }, {
      title: '备注',
      width: 120,
      dataIndex: 'memo',
      key: 'memo'
    }, {
      title: '产品条码',
      align: 'center',
      dataIndex: 'bar_code',
      key: 'bar_code'
    }, {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (text, record) => (
        <span>
          <a href="javascript:;">编辑</a>
          <Divider type="vertical"/>
          <a href="javascript:;">删除</a>
        </span>
      ),
    }];

    this.state = {
      loading: false,
      dataSource: [],
      searchText: '',
      state: 999
    };
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.getList();
  }

  getList = () => {
    // this.setState({
    //     loading: true
    // });
    // let param = {};
    // param.userId = sessionStorage.userId;
    // ajax.getJSON(getLiveListUrl, param, data => {
    //     if (data.success) {
    //         let backData = data.backData;
    //         backData.map(item => {
    //             item.key = item.id;
    //         });
    //         this.setState({
    //             dataSource: backData,
    //             loading: false
    //         });
    //     }
    // });
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
    const {loading, dataSource, searchText, state} = this.state;
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
          <ZZCard>
            <Button type="primary" icon='plus' onClick={this.addProduct} style={{marginBottom: 15}}>新增产品</Button>
            <ZZTable
              dataSource={n_dataSource}
              columns={this.columns}
            />
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