import React from 'react';
import { Icon, Spin } from 'antd';
import './zzSpin.less';

class ZZSpin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: this.props.loading,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ loading: nextProps.loading });
  }

  render() {
    let { loading } = this.state;

    return (
      <div className="zzSpin">
        <div className="">
          <Spin size="large" delay={350} spinning={loading}>
          </Spin>
        </div>
      </div>
    );
  }
}

export default ZZSpin;
