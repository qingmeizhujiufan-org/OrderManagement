import React from 'react';
import PropTypes from 'prop-types';
import {Breadcrumb, Spin, Radio} from 'antd';
import {ZZCard} from 'Comps/zz-antD';
import axios from "Utils/axios";
import {
  Bar,
} from 'Comps/Charts';
import '../index.less';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      type: 'week',
      loading: false
    };
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.getNewlyData();
  }

  getNewlyData = () => {
    let param = {};
    param.type = this.state.type;
    this.setState({loading: true});
    axios.get('user/getNewlyRegisterUserData', {
      params: param
    }).then(res => res.data).then(data => {
      if (data.success) {
        data = data.backData;
        const chartData = [];
        data.map(item => {
          chartData.push({
            x: item.countDate,
            y: item.num
          });
        });
        this.setState({
          data: chartData
        });
      } else {
        message.error(data.backMsg);
      }
      this.setState({loading: false});
    });
  }

  changeType = e => {
    console.log('e === ', e.target);
    if (this.state.type === e.target.value) return;
    this.setState({type: e.target.value}, () => {
      this.getNewlyData();
    });
  }

  render() {
    const {data, loading} = this.state;

    return (
      <div className="zui-content">
        <div className='pageHeader'>
          <div className="breadcrumb-block">
            <Breadcrumb>
              <Breadcrumb.Item>用户管理</Breadcrumb.Item>
              <Breadcrumb.Item>统计分析</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className='title'>人员统计分析</h1>
        </div>
        <div className='pageContent'>
          <ZZCard
            title="最近注册用户统计"
            extra={(
              <Radio.Group defaultValue="week" buttonStyle="solid" onChange={e => this.changeType(e)}>
                <Radio.Button value="threeday">最近三天</Radio.Button>
                <Radio.Button value="week">最近一周</Radio.Button>
                <Radio.Button value="month">最近一个月</Radio.Button>
              </Radio.Group>
            )}
          >
            <Spin spinning={loading} size='large'>
              <Bar height={400} title="最近一周注册用户统计" data={data}/>
            </Spin>
          </ZZCard>
        </div>
      </div>
    );
  }
}

Index.contextTypes = {
  router: PropTypes.object
}

export default Index;