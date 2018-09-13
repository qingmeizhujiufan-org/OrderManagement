import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Select, Breadcrumb, Icon, Button, AutoComplete, Modal} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const userDetailUrl = restUrl.ADDR + 'user/qureyOneUser';
const delUrl = restUrl.ADDR + 'user/delete';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;


class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      userInfo: {}
    };
  }

  componentWillMount = () => {
    this.getUserDetail(this.props.params.id)
  }

  //获取用户详细信息
  getUserDetail = (id) => {
    let userInfo = {
      user_code: '222',
      pic_src: '../../../assets/img/cover.jpg',
      password: '1111',
      role_id: '11',
      user_name: 'ww',
      phone: '3244',
      is_frozen: 1,
      region: '2'
    }
    this.setState({
      userInfo: userInfo
    });
  }

  frozenUser = () => {
    const userInfo = this.state.userInfo;
    Modal.confirm({
      title: '提示',
      content: userInfo.is_frozen === 1 ? '确认要解冻该用户吗？' : '确认冻结该用户吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let param = {};
        param.id = userInfo.role_id;
        param.type = userInfo.is_frozen ? 0 : 1;
        console.log("param ===", param);
      }
    })
  }

  resetPassword = () => {
    console.log("reset")
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }


  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }


  render() {
    const {getFieldDecorator} = this.props.form;
    const {autoCompleteResult, userInfo} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: {span: 10},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 12},
        sm: {span: 8},
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 8,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{width: 70}}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>用户管理</Breadcrumb.Item>
              <Breadcrumb.Item>用户详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>用户详情</h1>
        </div>
        <div className='pageContent'>
          <ZZCard
            title="用户详情"
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                {getFieldDecorator('user_code', {
                  initialValue: userInfo.user_code
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="密码"
              >
                {getFieldDecorator('password', {
                  initialValue: userInfo.password
                })(
                  <Input type="password" disabled={true}
                         addonAfter={<span onClick={this.resetPassword}><Icon type="retweet"/>重置密码</span>}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户ID"
              >
                {getFieldDecorator('role_id', {
                  initialValue: userInfo.role_id
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="真实姓名"
              >
                {getFieldDecorator('user_name', {
                  initialValue: userInfo.user_name

                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="个人电话"
              >
                {getFieldDecorator('phone', {
                  initialValue: userInfo.phone
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="所属区域"
              >
                {getFieldDecorator('region', {
                  initialValue: userInfo.region
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {
                  userInfo.is_frozen === 1 ? (
                      <Button type="primary" onClick={this.frozenUser}>解冻</Button>
                    )
                    : (
                      <Button type="danger" onClick={this.frozenUser}>冻结</Button>
                    )
                }
              </FormItem>
            </Form>
          </ZZCard>
        </div>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        </Modal>
      </div>
    );
  }
}

const userAdd = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default userAdd;