import React from 'react';
import { Card } from 'antd';
import './index.less';

class ZZCard extends React.Component {
    render() {
        return (
            <Card
                className='zzCard'
                {...this.props}
            />
        );
    }
}

ZZCard.defaultProps = {
    bordered: false
};

export default ZZCard;
