import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Tooltip, Icon, Cascader, Select, Breadcrumb, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import {ZZCard, ZZTable} from 'Comps/zz-antD';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {message} from "antd/lib/index";

const queryListUrl = restUrl.ADDR + 'user/queryList';
const delUrl = restUrl.ADDR + 'user/delete';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;


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
        ajax.getJSON(queryListUrl, null, data => {
          if (data.success) {
            data = data.backData;
            data.map(function (item, index) {
              item.key = index;
            });
            this.setState({
              dataSource: data,
              loading: false
            });
          } else {
            message.error(data.backMsg);
          }
        });
      }
    });
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
              <Breadcrumb.Item>产品管理</Breadcrumb.Item>
              <Breadcrumb.Item>新增产品</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>新增产品</h1>
        </div>
        <div className='pageContent'>
          <ZZCard
            title="新增产品"
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="所属仓库"
              >
                {getFieldDecorator('warehouse', {
                  rules: [{
                    required: true, message: '请输入',
                  }],
                })(
                  <Input placeholder="请输入所属仓库"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="产品名称"
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入产品名称',
                  }],
                })(
                  <Input placeholder="请输入产品名称"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="单位"
              >
                {getFieldDecorator('unit', {
                  rules: [
                    { required: true, message: '请选择产品单位'},
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value="red">Red</Option>
                    <Option value="green">Green</Option>
                    <Option value="blue">Blue</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="产品价格"
              >
                {getFieldDecorator('cost_price', {
                  rules: [{required: true, message: '请输入产品价格', whitespace: true}],
                })(
                  <Input placeholder="请输入产品价格"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="产品条码"
              >
                {getFieldDecorator('bar_code', {
                  rules: [{required: true, message: '请输入产品条码'}],
                })(
                  <Input placeholder="请输入产品条码"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                {getFieldDecorator('memo', {
                  initialValue: ''
                })(
                  <TextArea rows={4}/>
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

const productAdd = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default productAdd;