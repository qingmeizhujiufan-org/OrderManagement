import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Tabs,
  Input,
  Icon,
  Menu,
  Breadcrumb,
  Dropdown,
  Notification,
  Select,
  Divider,
  Message,
  Modal,
  Collapse,
  Button
} from 'antd';
import assign from "lodash.assign";
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import Util from "Utils/util";

const TabPane = Tabs.TabPane;

const queryListUrl = restUrl.BASE_HOST + 'order/queryList';
const delUrl = restUrl.BASE_HOST + 'order/delete';
const exportOrderUrl = restUrl.BASE_HOST + 'order/exportOrder';

class OrderList extends React.Component {
  constructor(props) {
    super(props);

    this.dateColumns = [
      {
        title: '时间段: 9.1-9.10',
        align: 'left',
        children: [{
          title: '区域',
          width: 100,
          align: 'center',
          dataIndex: 'region',
          key: 'region',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index % 3 === 0) {
              obj.props.rowSpan = 3;
            } else {
              obj.props.rowSpan = 0;
            }
            return obj;
          }
        }, {
          title: '订单性质',
          width: 100,
          align: 'center',
          dataIndex: 'orderNature',
          key: 'orderNature'
        }, {
          title: '单数',
          width: 100,
          align: 'center',
          dataIndex: 'count',
          key: 'count',
        }, {
          title: '定金',
          width: 100,
          align: 'center',
          dataIndex: 'depositAmout',
          key: 'depositAmout',
          render: (text, record, index) => (
            <span>{Util.shiftThousands(text)}</span>
          )
        }, {
          title: '代收金额',
          width: 100,
          align: 'center',
          dataIndex: 'collectionAmout',
          key: 'collectionAmout',
          render: (text, record, index) => (
            <span>{Util.shiftThousands(text)}</span>
          )
        }, {
          title: '总金额',
          width: 100,
          align: 'center',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          render: (text, record, index) => (
            <span>{Util.shiftThousands(text)}</span>
          )
        }, {
          title: '货物成本',
          width: 100,
          align: 'center',
          dataIndex: 'costAmount',
          key: 'costAmount',
          render: (text, record, index) => (
            <span>{Util.shiftThousands(text)}</span>
          )
        }]
      }
    ];

    this.twoTimesColumns = [
      {
        title: '一个月内两次购买客户档案',
        align: 'left',
        children: [{
          title: '区域',
          width: 100,
          align: 'center',
          dataIndex: 'region',
          key: 'region'
        }, {
          title: '业务员',
          width: 100,
          align: 'center',
          dataIndex: 'orderNature',
          key: 'orderNature'
        }, {
          title: '客户',
          width: 100,
          align: 'center',
          dataIndex: 'count',
          key: 'count',
        }, {
          title: '两次总金额',
          width: 100,
          align: 'center',
          dataIndex: 'depositAmout',
          key: 'depositAmout',
          render: (text, record, index) => (
            <span>{Util.shiftThousands(text)}</span>
          )
        }]
      }
    ];

    this.threeTimesColumns = [
      {
        title: '一个月内三次购买客户档案',
        align: 'left',
        children: [{
          title: '区域',
          width: 100,
          align: 'center',
          dataIndex: 'region',
          key: 'region'
        }, {
          title: '业务员',
          width: 100,
          align: 'center',
          dataIndex: 'userName',
          key: 'userName'
        }, {
          title: '客户',
          width: 100,
          align: 'center',
          dataIndex: 'receiverName',
          key: 'receiverName',
        }, {
          title: '三次总金额',
          width: 100,
          align: 'center',
          dataIndex: 'depositAmout',
          key: 'depositAmout',
          render: (text, record, index) => (
            <span>{Util.shiftThousands(text)}</span>
          )
        }]
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
      keyWords: '123',
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

  render() {

    const {dataSource, pagination, loading, keyWords} = this.state;

    return (
      <div className="zui-content page-newsList">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>报表管理</Breadcrumb.Item>
              <Breadcrumb.Item>报表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>报表</h1>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><Icon type="clock-circle"/>时间段</span>} key="1">
                <Row>
                  <Col span={14}>
                    <ZZCard>
                      <Button
                        icon='download'
                        onClick={this.outOrderList}
                        style={{marginBottom: 15}}
                      >导出表格</Button>
                      <ZZTable
                        columns={this.dateColumns}
                        dataSource={dataSource}
                        loading={loading}
                      />
                    </ZZCard>
                  </Col>
                  <Col span={8}>
                    <ZZCard>
                      <Button
                        icon='download'
                        onClick={this.outOrderList}
                        style={{marginBottom: 15}}
                      >导出图表</Button>
                      <div>是是是</div>
                    </ZZCard>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={<span><Icon type="dollar"/>购买两次</span>} key="2">
                <Row>
                  <Col span={14}>
                    <ZZCard>
                      <Button
                        icon='download'
                        onClick={this.outOrderList}
                        style={{marginBottom: 15}}
                      >导出表格</Button>
                      <ZZTable
                        columns={this.twoTimesColumns}
                        dataSource={dataSource}
                        loading={loading}
                      />
                    </ZZCard>
                  </Col>
                  <Col span={8}>
                    <ZZCard>
                      <Button
                        icon='download'
                        onClick={this.outOrderList}
                        style={{marginBottom: 15}}
                      >导出图表</Button>
                      <div>是是是</div>
                    </ZZCard>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={<span><Icon type="pound"/>购买三次</span>} key="3">
                <Row>
                  <Col span={14}>
                    <ZZCard>
                      <Button
                        icon='download'
                        onClick={this.outOrderList}
                        style={{marginBottom: 15}}
                      >导出表格</Button>
                      <ZZTable
                        columns={this.threeTimesColumns}
                        dataSource={dataSource}
                        loading={loading}
                      />
                    </ZZCard>
                  </Col>
                  <Col span={8}>
                    <ZZCard>
                      <Button
                        icon='download'
                        onClick={this.outOrderList}
                        style={{marginBottom: 15}}
                      >导出图表</Button>
                      <div>是是是</div>
                    </ZZCard>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

OrderList.contextTypes = {
  router: PropTypes.object
}

export default OrderList;