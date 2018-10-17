import React from 'react';
import {Table} from 'antd';
import assign from "lodash/assign";
import isEqual from 'lodash/isEqual';
import './index.less';

class ZZTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            _dataSource: [],
            _pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onChange,
                onShowSizeChange: this.onShowSizeChange
            }
        };
    }

    componentDidMount = () => {
        this.setData();
    }

    componentWillReceiveProps = nextProps => {
        this.setState({
            _dataSource: nextProps.dataSource,
            _pagination: nextProps.pagination
        });
    }

    setData = () => {
        const {dataSource, pagination} = this.props;
        const total = (pagination ? pagination.total : null) || 0;
        const _pagination = assign({}, this.state._pagination, {
            total,
            showTotal: total => `共 ${total} 条`
        });

        this.setState({
            _dataSource: dataSource,
            _pagination
        });
    }

    onChange = (page, pageSize) => {
        this.props.handlePageChange({
            pageNumber: page,
            pageSize: pageSize
        });
    }

    onShowSizeChange = (current, size) => {
        this.props.handlePageChange({
            pageNumber: 1,
            pageSize: size
        });
    }

    render() {
        const {_dataSource, _pagination} = this.state;
        const {className, dataSource, pagination, handlePageChange, ...restProps} = this.props;
        _dataSource.map((item, index) => {
            if (item.key === undefined || item.key === null || item.key === '') {
                item.key = index;
            }
        });

        return (
            <Table
                className={`zzTable ${className}`}
                dataSource={_dataSource}
                pagination={pagination ? _pagination : false}
                {...restProps}
            />
        );
    }
}

ZZTable.defaultProps = {
    bordered: true,
};

export default ZZTable;
