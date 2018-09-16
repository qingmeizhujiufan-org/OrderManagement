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
  Upload,
  Icon,
  Spin,
  Message,
  Notification
} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const productSaveUrl = restUrl.BASE_HOST + 'product/save';
const queryDetailUrl = restUrl.BASE_HOST + 'product/findbyid';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 12},
};

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      loading: false,
      submitLoading: false
    };
  }

  componentDidMount = () => {
    this.queryDetail();
  }

  queryDetail = () => {
    const id = this.props.params.id;
    const param = {};
    param.id = id;
    this.setState({
      loading: true
    });
    ajax.getJSON(queryDetailUrl, param, data => {
      if (data.success) {
        let backData = data.backData;

        this.setState({
          data: backData,
          loading: false
        });
      } else {
        Message.error('订单信息查询失败');
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = this.props.params.id;
        console.log('handleSubmit  param === ', values);
        this.setState({
          submitLoading: true
        });
        ajax.postJSON(productSaveUrl, JSON.stringify(values), (data) => {
          if (data.success) {
            Notification.success({
              message: '提示',
              description: '订单信息保存成功！'
            });

            return this.context.router.push('/frame/order/list');
          } else {
            message.error(data.backMsg);
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
    const {data, loading, submitLoading} = this.state;

    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>订单管理</Breadcrumb.Item>
              <Breadcrumb.Item>订单列表</Breadcrumb.Item>
              <Breadcrumb.Item>更新订单信息</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>更新订单信息</h1>
        </div>
        <div className='pageContent'>
          <div className='ibox-content'>
            <Spin spinning={loading} size='large'>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="所属区域"
                    >
                      {getFieldDecorator('region', {
                        initialValue: data.region,
                        rules: [{
                          required: true, message: '请输入所属区域',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label="所属仓库"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('warehouse', {
                        initialValue: data.region,
                        rules: [{required: true, message: '所属仓库不能为空!'}]
                      })(
                        <Select>
                          <Option key='0' value='0'>武汉</Option>
                          <Option key='1' value='1'>北京</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="业务员id"
                    >
                      {getFieldDecorator('userId', {
                        initialValue: data.userId,
                        rules: [{
                          required: true, message: '请输入业务员id',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="业务员姓名"
                    >
                      {getFieldDecorator('userName', {
                        initialValue: data.userName,
                        rules: [{
                          required: true, message: '请输入业务员姓名',
                        }],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="订单编号"
                    >
                      {getFieldDecorator('orderCode', {
                        initialValue: data.orderCode,
                        rules: [{required: true, message: '请输入订单编号'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="订单性质"
                    >
                      {getFieldDecorator('orderNature', {
                        initialValue: data.orderNature,
                        rules: [{required: true, message: '请输入订单性质'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="寄件电话"
                    >
                      {getFieldDecorator('serderPhone', {
                        initialValue: data.serderPhone,
                        rules: [{required: true, message: '请输入寄件电话'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="寄件详细地址"
                    >
                      {getFieldDecorator('senderAddr', {
                        initialValue: data.senderAddr,
                        rules: [{required: true, message: '请输入寄件详细地址'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="成单微信号"
                    >
                      {getFieldDecorator('orderWechatCode', {
                        initialValue: data.orderWechatCode,
                        rules: [{required: true, message: '请输入成单微信号'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="成单日期"
                    >
                      {getFieldDecorator('orderDate', {
                        initialValue: data.orderDate,
                        rules: [{required: true, message: '请输入成单日期'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="发货日期"
                    >
                      {getFieldDecorator('deliverDate', {
                        initialValue: data.deliverDate,
                        rules: [{required: true, message: '请输入发货日期'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="收件人"
                    >
                      {getFieldDecorator('receiverName', {
                        initialValue: data.receiverName,
                        rules: [{required: true, message: '请输入收件人'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="收件人手机号"
                    >
                      {getFieldDecorator('receiverPhone', {
                        initialValue: data.receiverPhone,
                        rules: [{required: true, message: '请输入收件人手机号'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="收件人详细地址"
                    >
                      {getFieldDecorator('receiverAddr', {
                        initialValue: data.receiverAddr,
                        rules: [{required: true, message: '请输入收件人详细地址'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="广告渠道"
                    >
                      {getFieldDecorator('advertChannel', {
                        initialValue: data.advertChannel,
                        rules: [{required: true, message: '请输入广告渠道'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="进线时间"
                    >
                      {getFieldDecorator('incomlineTime', {
                        initialValue: data.incomlineTime,
                        rules: [{required: true, message: '请输入进线时间'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="定金"
                    >
                      {getFieldDecorator('depositAmout', {
                        initialValue: data.depositAmout,
                        rules: [{required: true, message: '请输入定金'}],
                      })(
                        <InputNumber
                          step={0.01}
                          precision={2}
                          min={0}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="代收金额"
                    >
                      {getFieldDecorator('collectionAmout', {
                        initialValue: data.collectionAmout,
                        rules: [{required: true, message: '请输入代收金额'}],
                      })(
                        <InputNumber
                          min={0}
                          step={0.01}
                          precision={2}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="总金额"
                    >
                      {getFieldDecorator('totalAmount', {
                        initialValue: data.totalAmount,
                        rules: [{required: true, message: '请输入总金额'}],
                      })(
                        <InputNumber
                          min={0}
                          step={0.1}
                          precision={2}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="是否国际件"
                    >
                      {getFieldDecorator('isForeignExpress', {
                        initialValue: data.isForeignExpress,
                        rules: [{required: true, message: '请选择'}],
                      })(
                        <RadioGroup>
                          <Radio value={0}>不是</Radio>
                          <Radio value={1}>是</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="订单状态"
                    >
                      {getFieldDecorator('orderState', {
                        initialValue: data.orderState,
                        rules: [{required: true, message: '请选择'}],
                      })(
                        <RadioGroup>
                          <Radio value={0}>编辑中</Radio>
                          <Radio value={1}>已锁定</Radio>
                          <Radio value={2}>已发快递</Radio>
                          <Radio value={3}>成单</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="是否超过成本"
                    >
                      {getFieldDecorator('isOverCost', {
                        initialValue: data.isOverCost,
                        rules: [{required: true, message: '请选择'}],
                      })(
                        <RadioGroup>
                          <Radio value={0}>不是</Radio>
                          <Radio value={1}>是</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="成本数据"
                    >
                      {getFieldDecorator('costAmount', {
                        rules: [{required: true, message: '请输入成本数据'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="成本比例"
                    >
                      {getFieldDecorator('costRatio', {
                        rules: [{required: true, message: '请输入成本比例'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="快递单号"
                    >
                      {getFieldDecorator('expressCode', {
                        rules: [{required: true, message: '请输入成本数据'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="快递状态"
                    >
                      {getFieldDecorator('expressState', {
                        rules: [{required: true, message: '请输入成本比例'}],
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className='toolbar'>
                  <div className='pull-right'>
                    <Button type="primary" size='large' htmlType="submit"
                            loading={submitLoading}>保存</Button>
                  </div>
                </div>
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

const orderEdit = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default orderEdit;