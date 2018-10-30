import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Input,
  Breadcrumb,
  Message,
  Notification,
  Icon,
} from 'antd';
import axios from "Utils/axios";
import restUrl from 'RestUrl';
import '../index.less';
import {ZZTable} from 'Comps/zz-antD';
import assign from "lodash/assign";

const queryListUrl = restUrl.BASE_HOST + 'user/userORList';

const Search = Input.Search;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: sessionStorage.userId,
      loading: false,
      pagination: {},
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      keyWords: '',
      dataSource: []
    };

    this.columns = [
      {
        title: '序号',
        dataIndex: 'userId',
        align: 'left',
        key: 'userId',
        render: (text, record, index) => (
          <div>{index + 1}</div>
        )
      }, {
        title: '用户电话',
        dataIndex: 'resourcePhone',
        align: 'center',
        key: 'resourcePhone'
      }, {
        title: '用户微信',
        dataIndex: 'resourceWechatCode',
        align: 'left',
        key: 'resourceWechatCode'
      }, {
        title: '用户粉丝数',
        dataIndex: 'minFans',
        key: 'minFans',
        align: 'right'
      }]
  }

  componentDidMount = () => {
    this.queryList();
  }

  queryList = () => {
    const {params, keyWords} = this.state;
    const param = assign({}, params, {keyWords});
    this.setState({loading: true});
    axios.get('user/userORList', {
      params: param
    }).then(res => res.data).then(data => {
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

  //简单搜索
  onSearch = (val) => {
    this.setState({
      searchKey: {
        keyWords: val
      }
    }, () => {
      this.queryList();
    });
  }

  render() {
    const {dataSource, keyWords, pagination, loading} = this.state;

    return (
      <div className="zui-content resourceInfo">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>用户管理</Breadcrumb.Item>
              <Breadcrumb.Item>用户资源</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>用户资源</h1>
          <div className='search-area'>
            <Row type='flex' justify="center" align="middle">
              <Col span={8}>
                <Search
                  id="keyWords"
                  placeholder="微信号/资源手机号/用户名/用户编码"
                  enterButton='搜索'
                  size="large"
                  value={keyWords}
                  onChange={e => this.setState({keyWords: e.target.value})}
                  onSearch={this.onSearch}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <ZZTable
              columns={this.columns}
              dataSource={dataSource}
              pagination={pagination}
              loading={loading}
              handlePageChange={this.handlePageChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}


Index.contextTypes = {
  router: PropTypes.object
}

export default Index;