import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Breadcrumb,
  Button,
  Notification,
  Message,
  InputNumber
} from 'antd';

import {formItemLayout, itemGrid} from 'Utils/formItemGrid';
import axios from "Utils/axios";

import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class Index extends React.Component {
  state = {
    confirmDirty: false,
    fileList: [],
    submitLoading: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        delete values.picSrc;
        this.setState({
          submitLoading: true
        });

        console.log('handleSubmit  param === ', values);
        this.setState({
          submitLoading: true
        });
        axios.post('product/save', values).then(res => res.data).then(data => {
          if (data.success) {
            Notification.success({
              message: '提示',
              description: '新增产品成功！'
            });

            return this.context.router.push('/frame/product/list');
          } else {
            Message.error(data.backMsg);
          }
          this.setState({
            submitLoading: false
          });
        });
      }
    });
  }


  render() {
    const {getFieldDecorator} = this.props.form;
    const {fileList, submitLoading} = this.state;

    return (

      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>产品管理</Breadcrumb.Item>
              <Breadcrumb.Item>新增产品</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>新增产品</h1>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="所属仓库"
                  >
                    {getFieldDecorator('wareHouse', {
                      rules: [{
                        required: true, message: '请输入所属仓库',
                      }],
                    })(
                      <Select placeholder="请输入所属仓库">
                        <Option value='0'>武汉</Option>
                        <Option value='1'>北京</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="产品条码"
                  >
                    {getFieldDecorator('barCode', {
                      rules: [{required: true, message: '请输入产品条码'}],
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="产品名称"
                  >
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '请输入产品名称',
                      }],
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="产品单位"
                  >
                    {getFieldDecorator('unit', {
                      rules: [{
                        required: true, message: '请输入产品单位',
                      }],
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="成本价格"
                  >
                    {getFieldDecorator('costPrice', {
                      rules: [{
                        required: true, message: '请输入成本价格',
                      }],
                    })(
                      <InputNumber
                        min={0}
                        precision={2}
                        step={1}
                        style={{width: '100%'}}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...itemGrid}>
                  <FormItem
                    {...formItemLayout}
                    label="备注"
                  >
                    {getFieldDecorator('memo', {
                      rules: [{
                        required: false, message: '请输入备注',
                      }],
                    })(
                      <TextArea/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center" style={{marginTop: 40}}>
                <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                        loading={submitLoading}>提交</Button>
              </Row>
            </Form>
          </div>
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