import {connect} from 'react-redux'
import * as actions from '../actions/product';
import ProductList from '../modules/product/component/productList';

//将状态写入属性
const mapStateToProps = (state) => {
    return {
        dataSource: state.productReducer.dataSource,
        loading: state.productReducer.loading
    }
}

//将动作写入属性
const mapDispatchToProps = (dispatch) => {
    // return bindActionCreators(actions, dispatch)
    // console.log('mapDispatchToProps  ownProps ==== ', ownProps);
    return {
        getProductList: (url, params) => dispatch(actions.getProductList(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)