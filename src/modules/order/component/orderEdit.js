import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Select,
  Breadcrumb,
  Button,
  Modal,
  Divider,
  Spin,
  Icon,
  DatePicker,
  Notification,
  Message,
  Radio
} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const orderSaveUrl = restUrl.BASE_HOST + 'order/save';
const queryDetailUrl = restUrl.BASE_HOST + 'order/findbyid';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;

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
        ajax.postJSON(orderSaveUrl, JSON.stringify(values), (data) => {
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
                        rules: [{
                          required: true, message: '请输入所属区域',
                          initialValue: data.region

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
                        rules: [{required: true, message: '所属仓库不能为空!'}],
                        initialValue: data.warehouse == 0 ? '武汉': '北京'
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
                        rules: [{
                          required: true, message: '请输入业务员id',
                        }],
                        initialValue: data.userId

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
                        rules: [{
                          required: true, message: '请输入业务员姓名',
                        }],
                        initialValue: data.userName

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
                        rules: [{required: true, message: '请输入订单编号'}],
                        initialValue: data.orderCode

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
                        rules: [{required: true, message: '请输入订单性质'}],
                        initialValue: data.orderNature

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
                        rules: [{required: true, message: '请输入寄件电话'}, {
                          validator: this.validatePhone,
                        }],
                        initialValue: data.serderPhone

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
                        rules: [{required: true, message: '请输入寄件详细地址'}],
                        initialValue: data.senderAddr

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
                        rules: [{required: true, message: '请输入成单微信号'}],
                        initialValue: data.orderWechatCode

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
                        rules: [{required: true, message: '请输入成单日期'}],
                        // initialValue: data.orderDate

                      })(
                        <DatePicker style={{width: '100%'}}/>
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
                        rules: [{required: true, message: '请输入发货日期'}],
                        // initialValue: data.deliverDate
                      })(
                        <DatePicker style={{width: '100%'}}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="收件人"
                    >
                      {getFieldDecorator('receiverName', {
                        rules: [{required: true, message: '请输入收件人'}],
                        initialValue: data.receiverName

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
                        rules: [{required: true, message: '请输入收件人手机号'}, {
                          validator: this.validatePhone,
                        }],
                        initialValue: data.receiverPhone

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
                        rules: [{required: true, message: '请输入收件人详细地址'}],
                        initialValue: data.receiverAddr

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
                        rules: [{required: true, message: '请输入广告渠道'}],
                        initialValue: data.advertChannel

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
                        rules: [{required: true, message: '请输入进线时间'}],
                        initialValue: data.incomlineTime

                      })(
                        <DatePicker style={{width: '100%'}}/>
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
                        rules: [{required: true, message: '请输入定金'}],
                        initialValue: data.depositAmout

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
                        rules: [{required: true, message: '请输入代收金额'}],
                        initialValue: data.collectionAmout

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
                        rules: [{required: true, message: '请输入总金额'}],
                        initialValue: data.totalAmount

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
                        rules: [{required: true, message: '请选择'}],
                        initialValue: data.isForeignExpress

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
                        rules: [{required: true, message: '请选择'}],
                        initialValue: data.orderState

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
                        rules: [{required: true, message: '请选择'}],
                        initialValue: data.isOverCost

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
                        initialValue: data.costAmount

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
                        initialValue: data.costRatio

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
                        rules: [{required: true, message: '请输入快递单号'}],
                        initialValue: data.expressCode

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
                        rules: [{required: true, message: '请选择快递状态'}],
                        initialValue: data.expressState

                      })(
                        <Select>
                          <Option key='0' value='0'>未发货</Option>
                          <Option key='1' value='1'>已发货</Option>
                          <Option key='2' value='2'>取消发货</Option>
                          <Option key='3' value='3'>未妥投</Option>
                          <Option key='4' value='4'>退回</Option>
                          <Option key='5' value='5'>签收</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="center" style={{marginTop: 40}}>
                  <Button type="primary" size='large' style={{width: 120}} htmlType="submit"
                          loading={submitLoading}>提交</Button>
                </Row>
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