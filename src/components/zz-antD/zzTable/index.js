import React from 'react';
import {Message, Table} from 'antd';
import _ from 'lodash';
import './index.less';
import ajax from "Utils/ajax";

class ZZTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            _params: {
                pageNumber: 1,
                pageSize: 10
            },
            dataSource: [],
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true
            },
            loading: false
        };
    }

    componentDidMount = () => {
        this.getList();
    }

    getList = () => {
        const {_params} = this.state;
        const {queryUrl, params} = this.props;
        const param = _.assign({}, _params, params);

        this.setState({loading: true});
        ajax.getJSON(queryUrl, param, data => {
            if (data.success) {
                const backData = data.backData;
                const dataSource = backData.content;
                dataSource.map(item => {
                    item.key = item.id;
                });
                this.setPagination(backData.totalElements);

                this.setState({
                    dataSource
                });
            } else {
                Message.error('查询列表失败');
            }
            this.setState({loading: false});
        });
    }

    setPagination = totalElements => {
        let {pagination} = this.state;
        const total = totalElements;
        pagination = _.assign(pagination, {
            total,
            showTotal: total => `共 ${total} 条`,
            onChange: this.onChange,
            onShowSizeChange: this.onShowSizeChange
        });

        this.setState({pagination});
    }

    onChange = (page, pageSize) => {
        const {_params} = this.state;
        const params = _.assign(_params, {
            pageNumber: page,
            pageSize: pageSize
        });

        this.setState({
            _params: params
        }, () => {
            this.getList();
        });
    }

    onShowSizeChange = (current, size) => {
        const {_params} = this.state;
        const params = _.assign(_params, {
            pageNumber: 1,
            pageSize: size
        });

        this.setState({
            _params: params
        }, () => {
            this.getList();
        });
    }

    render() {
        const {dataSource, pagination, loading} = this.state;
        const {queryUrl, className, ...restProps} = this.props;
        return (
            <Table
                className={`zzTable ${className}`}
                dataSource={dataSource}
                pagination={pagination}
                loading={loading}
                {...restProps}
            />
        );
    }
}

ZZTable.defaultProps = {
    bordered: true,
};

export default ZZTable;
