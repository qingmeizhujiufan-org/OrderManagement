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
        showQuickJumper: true,
        onChange: this.handelPageChange
      }
    })
  }

  handelPageChange = (pagination) => {
    console.log('this ===', this)
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.props.handleTableChange(pager);
  }


  render() {
    const { pagination} = this.state
    return (
      <Table
        className='zzTable'
        pagination={pagination}
        {...this.props}
      />
    );
  }
}

ZZTable.defaultProps = {
  bordered: true,
};

export default ZZTable;
