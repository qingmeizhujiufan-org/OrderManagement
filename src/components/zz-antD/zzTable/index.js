import React from 'react';
import { Table } from 'antd';
import './index.less';

class ZZTable extends React.Component {
    render() {
        return (
            <Table
                className='zzTable'
                {...this.props}
            />
        );
    }
}

ZZTable.defaultProps = {
    bordered: true,
    pagination: {
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true
    }
};

export default ZZTable;
