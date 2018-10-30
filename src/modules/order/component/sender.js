import React from 'react';
import PropTypes from 'prop-types';
import {
  Notification,
  Icon,
  Breadcrumb,
  Button,
  Message,
  Switch,
  Menu,
  Row,
  Col,
  Input,
  Form,
  Modal
} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD/index';

import find from "lodash/find";
import assign from "lodash/assign";
import '../../user/index.less';
import {formItemLayout} from 'Utils/formItemGrid';
import axios from "Utils/axios";

const Search = Input.Search;
const FormItem = Form.Item;

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '寄件方名称',
        align: 'left',
        dataIndex: 'senderName',
        key: 'senderName'
      }, {
        title: '寄件方电话',
        width: 120,
        align: 'center',
        dataIndex: 'serderPhone',
        key: 'serderPhone',
      }, {
        title: '寄件方地址',
        width: 250,
        align: 'left',
        dataIndex: 'senderAddr',
        key: 'senderAddr',
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
        title: '启用',
        fixed: 'right',
        width: 120,
        align: 'center',
        dataIndex: 'isEnabled',
        key: 'isEnabled',
        render: (text, record, index) => (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            checked={record.isEnabled === 1 ? true : false}
            onChange={checked => this.onFrozenChange(checked, record, index)}
          />
        )
      }, {
        title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
        key: 'operation',
        fixed: 'right',
        width: 120,
        align: 'center',
        render: (text, record, index) => (
          <div>
            <a onClick={() => this.onDelete(record.id)}>删除</a>
          </div>
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
      keyWords: '',
      addSenderModal: false,
      submitLoading: false
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
    axios.get('sender/queryList', param).then(res => res.data).then(data => {
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

  onFrozenChange = (checked, record, index) => {
    const param = {};
    const curObj = find(this.state.dataSource, function (o) {
      return o.isEnabled === 1;
    })
    if (curObj !== undefined && record.id !== curObj.id) {
      axios.post('sender/enabled', JSON.stringify({
        id: curObj.id,
        enabled: 0
      })).then(res => res.data).then(data => {

      })

    }
    param.id = record.id;
    param.enabled = checked ? 1 : 0;
    axios.post('sender/enabled', param).then(res => res.data).then(data => {
      if (data.success) {
        Notification.success({
          message: '提示',
          description: '地址启停用成功！'
        });

        this.setState({
          loading: true
        }, () => {
          this.queryList();
        });
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
        axios.post('sender/delete', param).then(res => res.data).then(data => {
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

  addSenderModal = () => {
    this.setState({
      addSenderModal: true
    });
  }

  setEnabled = () => {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if (!err) {
        values.isEnabled = values.isEnabled === true ? 1 : 0;
        axios.post('sender/save', values).then(res => res.data).then(data => {
          if (data.success) {
            Notification.success({
              message: '提示',
              description: '寄件信息保存成功！'
            });
            this.setState({
              addSenderModal: false,
              submitLoading: false
            }, () => {
              this.queryList()
            });

          } else {
            Message.error(data.backMsg);
          }
        });
      }
    })
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      addSenderModal: false,
    });
  }

  validatePhone = (rule, value, callback) => {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (value && value !== '' && !reg.test(value)) {
      callback(new Error('手机号格式不正确'));
    } else {
      callback();
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {dataSource, pagination, loading, addSenderModal, submitLoading} = this.state;

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
                  onClick={this.addSenderModal}
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
        <Modal
          title="新增寄件人信息"
          visible={addSenderModal}
          destroyOnClose='true'
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="寄件方姓名"
                >
                  {getFieldDecorator('senderName', {
                    rules: [{required: true, message: '请输入寄件人姓名'}]
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="寄件方电话"
                >
                  {getFieldDecorator('serderPhone', {
                    rules: [{required: true, message: '请输入寄件电话'}, {
                      validator: this.validatePhone
                    }]
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="寄件方地址"
                >
                  {getFieldDecorator('senderAddr', {
                    rules: [{required: true, message: '请输入寄件地址'}]
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center" style={{marginTop: 20}}>
              <Button onClick={this.handleCancel} style={{marginRight: 20}}>取消</Button>
              <Button type="primary" onClick={this.handleSubmit}
                      loading={submitLoading}>保存</Button>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

Index = Form.create({})(Index);
Index.contextTypes = {
  router: PropTypes.object
}

export default Index;