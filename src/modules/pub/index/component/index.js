import React from 'react';
import { Row, Col } from 'antd';
import ZZHeader from 'Comps/zzHeader/zzHeader';

class Index extends React.Component {
  constructor(props) {
    super(props); 
  }

  btnClick = (url) => {
    this.context.router.push(url);
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <ZZHeader />
          </Col>
          <Col span={12}>col-12</Col>
        </Row>
        <Row>
          <Col span={8}>col-8</Col>
          <Col span={8}>col-8</Col>
          <Col span={8}>col-8</Col>
        </Row>
      </div>
    );
  }
}

Index.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  Index;
