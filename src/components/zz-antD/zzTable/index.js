import React from 'react';
import {Table} from 'antd';
import _ from 'lodash';
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
        if (('dataSource' in nextProps && nextProps.dataSource.length !== this.props.dataSource.length)
            || ('pagination' in nextProps && _.isEqual(nextProps.pagination, this.props.pagination) !== true)) {
            this.setState({
                _dataSource: nextProps.dataSource
            });
        }
    }

    setData = () => {
        const {dataSource, pagination} = this.props;
        const total = pagination.total || 0;

        const _pagination = _.assign({}, this.state._pagination, {
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

        return (
            <Table
                className={`zzTable ${className}`}
                dataSource={_dataSource}
                pagination={_pagination}
                {...restProps}
            />
        );
    }
}

ZZTable.defaultProps = {
    bordered: true,
};

export default ZZTable;
