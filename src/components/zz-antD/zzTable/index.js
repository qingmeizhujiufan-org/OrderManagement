import React from 'react';
import {Table} from 'antd';
import './index.less';
import ajax from "Utils/ajax";

class ZZTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: this.props.total,
      pagination: {}
    }
  }

  componentDidMount = () => {
    const total = this.state.total
    this.setState({
      pagination: {
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true
      }
    })
  }

  handelPageChange = (pagination) => {
    this.props.callback(pagination);
  }


  render() {
    const { pagination} = this.state
    return (
      <Table
        className='zzTable'
        pagination={pagination}
        onChange={this.handelPageChange}
        {...this.props}
      />
    );
  }
}

ZZTable.defaultProps = {
  bordered: true,
};

export default ZZTable;
