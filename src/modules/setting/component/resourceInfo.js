import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Breadcrumb,
  Button,
  Message,
  Notification,
  Icon,
  Popconfirm
} from 'antd';

import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {ZZTable} from 'Comps/zz-antD';

const resourceSaveUrl = restUrl.BASE_HOST + 'user/saveUserOwnResources';
const queryDetailUrl = restUrl.BASE_HOST + 'user/qureyOneUser';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: sessionStorage.userId,
      count: 0,
      submitLoading: false,
      childrenDetail: []
    };

    this.columns = [
      {
        title: '用户ID',
        dataIndex: 'userId',
        align: 'center',
        width: 250,
        key: 'userId'
      }, {
        title: '用户电话',
        dataIndex: 'resourcePhone',
        align: 'center',
        width: 150,
        key: 'resourcePhone',
        render: (text, record, index) => (
          <Input
            defaultValue={record.resourcePhone}
            onChange={e => this.setResourcePhone(e, record, index)}
          />
        )
      }, {
        title: '用户微信',
        dataIndex: 'resourceWechatCode',
        align: 'center',
        width: 150,
        key: 'resourceWechatCode',
        render: (text, record, index) => (
          <Input
            defaultValue={record.resourceWechatCode}
            onChange={e => this.setWeixinNumber(e, record, index)}
          />
        )
      }, {
        title: '用户粉丝',
        dataIndex: 'minFans',
        key: 'minFans',
        width: 150,
        align: 'center',
        render: (text, record, index) => (
          <InputNumber
            style={{width: '50%'}}
            defaultValue={record.minFans}
            onChange={val => this.setMinFans(val, record, index)}
          />
        )
      }, {
        title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
        key: 'operation',
        width: 150,
        align: 'center',
        render: (text, record) => {
          return (
            this.state.childrenDetail.length >= 1
              ? (
                <Popconfirm title="是否删除?" onConfirm={() => this.handleDelete(record.key)}>
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              ) : null
          );
        },
      }]
  }

  componentDidMount = () => {
    this.queryDetail();
  }

  queryDetail = () => {
    const id = sessionStorage.userId;
    const param = {};
    param.id = id;
    this.setState({
      loading: true
    });
    ajax.getJSON(queryDetailUrl, param, data => {
      if (data.success) {
        const childrenDetail = data.backData.childrenDetail;
        childrenDetail.map((item, index) => {
          item.key = index;
        });
        this.setState({
          childrenDetail: childrenDetail,
          count: childrenDetail.length
        });
      } else {
        Message.error('用户资源查询失败');
      }
    });
  }

  setResourcePhone = (e, record, index) => {
    console.log('val ===', record)
    let data = this.state.childrenDetail;
    // if (this.validatePhone(val)) {
    //   Message.error('电话格式不正确');
    //   return;
    // }
    record.resourcePhone = e.target.value;
    data[index] = record;
    this.setState({
      childrenDetail: data
    })
  }

  setWeixinNumber = (e, record, index) => {
    let data = this.state.childrenDetail;
    record.resourceWechatCode = e.target.value;
    data[index] = record;
    this.setState({
      childrenDetail: data
    })
  }

  setMinFans = (val, record, index) => {
    let data = this.state.childrenDetail;
    record.minFans =val? val : 1;
    data[index] = record;
    this.setState({
      childrenDetail: data
    })
  }

  // validatePhone = (value) => {
  //   const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  //   return value && value !== '' && !reg.test(value)
  // }

  handleDelete = (key) => {
    const childrenDetail = [...this.state.childrenDetail];
    this.setState({childrenDetail: childrenDetail.filter(item => item.key !== key)});
  }

  handleAdd = () => {
    const {count, childrenDetail, userId} = this.state;
    const newData = {
      key: count,
      userId: userId,
      resourcePhone: '',
      resourceWechatCode: '',
      minFans: 1,
    };
    this.setState({
      childrenDetail: [...childrenDetail, newData],
      count: count + 1
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let childrenDetail = this.state.childrenDetail;
    childrenDetail.map(item => {
     delete item.key;
    });
    ajax.postJSON(resourceSaveUrl, JSON.stringify(childrenDetail), (data) => {
      if (data.success) {
        Notification.success({
          message: '提示',
          description: '资源信息保存成功！'
        });
        this.setState({
          childrenDetail: data.backData.childrenDetail
        });

      } else {
        Message.error(data.backMsg);
      }

      this.setState({
        submitLoading: false
      });
    });
  }


  render() {
    const {submitLoading, childrenDetail} = this.state;
    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>个人管理</Breadcrumb.Item>
              <Breadcrumb.Item>资源中心</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>个人中心</h1>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <Row>
              <Button onClick={this.handleAdd} type="primary" icon='plus' style={{marginBottom: 16}}>
                添加
              </Button>
              <ZZTable
                size='small'
                dataSource={childrenDetail}
                columns={this.columns}
              />
            </Row>
            <Row type="flex" justify="center" style={{marginTop: 40}}>
              <Button type="primary" size='large' style={{width: 120}} onClick={this.handleSubmit}
                      loading={submitLoading}>保存</Button>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const resource = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default resource;