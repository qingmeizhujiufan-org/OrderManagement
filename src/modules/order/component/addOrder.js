import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Tooltip, Icon, Cascader, Select, Breadcrumb, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const queryListUrl = restUrl.ADDR + 'user/queryList';
const delUrl = restUrl.ADDR + 'user/delete';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;


class Index extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
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

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({autoCompleteResult});
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {autoCompleteResult} = this.state;

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
              <Breadcrumb.Item>订单管理</Breadcrumb.Item>
              <Breadcrumb.Item>新增订单</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>新增订单</h1>
        </div>
        <div className='pageContent'>
          <ZZCard
            title="新增订单"
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                {getFieldDecorator('user_code', {
                  rules: [{
                    required: true, message: '请输入用户名',
                  }],
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="密码"
              >
                {getFieldDecorator('password', {
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
                {...formItemLayout}
                label="确认密码"
              >
                {getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: '请确认密码',
                  }, {
                    validator: this.compareToFirstPassword,
                  }],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="真实姓名"
              >
                {getFieldDecorator('user_name', {
                  rules: [{required: true, message: '请输入真实姓名', whitespace: true}],
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="个人电话"
              >
                {getFieldDecorator('phone', {
                  rules: [{required: true, message: '请输入个人电话'}],
                })(
                  <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="所属区域"
              >
                {getFieldDecorator('region', {
                  rules: [{required: true, message: '请输入所属区域'}],
                })(
                  <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {getFieldDecorator('agreement', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>我已同意<a href="">协议</a></Checkbox>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">提交</Button>
              </FormItem>
            </Form>
          </ZZCard>
        </div>
      </div>
    );
  }
}

const userAdd = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default userAdd;