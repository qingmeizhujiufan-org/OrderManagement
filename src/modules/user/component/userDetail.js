import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Breadcrumb, Icon, Button, Modal, Upload, Row, Col} from 'antd';
import {ZZCard} from 'Comps/zz-antD';
import {formItemLayout} from 'Utils/formItemGrid';
import axios from "Utils/axios";
import restUrl from 'RestUrl';
import '../index.less';
import assign from "lodash/assign";

const FormItem = Form.Item;

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      userInfo: {},
      visible: false
    };
  }

  componentWillMount = () => {
    this.getUserDetail(this.props.params.id)
  }

  //获取用户详细信息
  getUserDetail = (id) => {
    this.setState({
      loading: true
    });
    let param = {};
    param.id = id;
    axios.get('user/qureyOneUser', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        let backData = data.backData;
        if (backData.assessorys) {
          backData.assessorys.map((item, index) => {
            backData.assessorys[index] = assign({}, item, {
              uid: item.id,
              status: 'done',
              url: restUrl.ADDR + item.path + item.name,
              response: {
                data: item
              }
            });
          });
        } else {
          backData.assessorys = [];
        }

        this.setState({
          userInfo: backData,
          loading: false
        });
      }
    })
  }

  resetPassword = () => {
    this.setState({
      visible: true
    });
    console.log("reset")
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
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
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的密码不一样!');
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

    const modalFormItemLayout = {
      labelCol: {
        xs: {span: 8},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 16},
        sm: {span: 12},
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 8,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    const mainForm = (
        <Form>
          <Row type='flex' justify='center'>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                {getFieldDecorator('userName', {
                  initialValue: userInfo.userName
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户编号"
              >
                {getFieldDecorator('userCode', {
                  initialValue: userInfo.userCode
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
                         addonAfter={<span onClick={this.resetPassword}><Icon
                           type="retweet"/>重置密码</span>}/>
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
                label="创建时间"
              >
                {getFieldDecorator('createTime', {
                  initialValue: userInfo.createTime
                })(
                  <Input disabled={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="更新时间"
              >
                {getFieldDecorator('updateTime', {
                  initialValue: userInfo.updateTime
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
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="头像"
              >
                {getFieldDecorator('assessorys', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [{required: false, message: '头像不能为空!'}],
                  initialValue: userInfo.assessorys
                })(
                  <Upload
                    disabled={true}
                    listType="picture-card"
                  >
                  </Upload>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      )
    ;

    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>用户管理</Breadcrumb.Item>
              <Breadcrumb.Item>用户详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>用户详情</h1>
        </div>
        <div className='pageContent'>
          <ZZCard>
            {mainForm}
          </ZZCard>
        </div>
        <Modal
          title="重置密码"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...modalFormItemLayout}
              label="原始密码"
            >
              {getFieldDecorator('oldPassword', {
                rules: [{
                  required: true, message: '请输入密码',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password"/>
              )}
            </FormItem>
            <FormItem
              {...modalFormItemLayout}
              label="新密码"
            >
              {getFieldDecorator('newPassword', {
                rules: [{
                  required: true, message: '请输入密码',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password"/>
              )}
            </FormItem>
            <FormItem
              {...modalFormItemLayout}
              label="确认密码"
            >
              {getFieldDecorator('confirmNewPassword', {
                rules: [{
                  required: true, message: '请确认密码',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur}/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提交</Button>
            </FormItem>
          </Form>
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