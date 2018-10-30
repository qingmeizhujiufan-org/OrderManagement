import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Breadcrumb,
  Notification,
  Message,
  Button,
  DatePicker,
  Form
} from 'antd';
import {
  Bar,
  Pie,
} from 'Comps/Charts';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import axios from "Utils/axios";
import '../index.less';
import {ZZCard} from 'Comps/zz-antD';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      submitLoading: false,
      periodLoading: false,
      dataSource: [],
      totalLineList: [],
      periodData: []
    };
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.queryBarData({
      deliverBeginDate: moment().add(0, 'year').month(moment().month()).startOf('month').format("YYYY-MM-DD"),
      deliverEndDate: moment().add(0, 'year').month(moment().month()).endOf('month').format("YYYY-MM-DD")
    });
  }

  queryBarData = (param, callback) => {
    this.setState({
      periodLoading: true
    });
    axios.post('order/countPeriodOrder', param).then(res => res.data).then(data => {
      this.setState({periodLoading: false});
      if (data.success) {
        if (data.backData) {
          const backData = data.backData;
          const periodData = [];

          backData.map(item => {
            periodData.push({
              x: item.region,
              y: item.totalAmount
            });
          });

          this.setState({
            periodData
          });
        }
      } else {
        Message.error(data.backMsg);
      }
      if (typeof callback === 'function') callback();
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('handleSubmit  values === ', values);
        this.setState({submitLoading: true});
        this.queryBarData({
          deliverBeginDate: values.deliverDate[0].format("YYYY-MM-DD"),
          deliverEndDate: values.deliverDate[1].format("YYYY-MM-DD")
        }, () => this.setState({submitLoading: false}));
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {submitLoading, periodLoading, periodData} = this.state;

    return (
      <div className="zui-content report">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>报表管理</Breadcrumb.Item>
              <Breadcrumb.Item>图表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>图表</h1>
        </div>
        <div className='pageContent'>
          <ZZCard
            title={(
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('deliverDate', {
                    rules: [{required: true, message: '请选择日期区间'}],
                    initialValue: [
                      moment().add(0, 'year').month(moment().month()).startOf('month'),
                      moment().add(0, 'year').month(moment().month()).endOf('month')
                    ]
                  })(
                    <RangePicker format={dateFormat}/>
                  )}
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitLoading}
                  >查询数据</Button>
                </FormItem>
              </Form>
            )}
          >
            <Row gutter={24}>
              <Col span={17}>
                <ZZCard title={'各区累计总金额柱状图'} loading={periodLoading}>
                  <Bar height={350} data={periodData} color='#5578DC'/>
                </ZZCard>
              </Col>
              <Col span={7}>
                <ZZCard title={'各区累计总金额扇形图'} loading={periodLoading}>
                  <Pie
                    hasLegend
                    subTitle="总计"
                    total={periodData.reduce((total, now) => total + now.y, 0)}
                    data={periodData}
                    height={344}
                    lineWidth={4}
                    colors={['#FAD337', '#4DCA73', '#5CDECF', '#39A0FF', '#9C91DB', '#425088', '#E9A574']}
                  />
                </ZZCard>
              </Col>
            </Row>
          </ZZCard>
        </div>
      </div>
    );
  }
}

const ReportList = Form.create()(Index);

Index.contextTypes = {
  router: PropTypes.object
}

export default ReportList;