import {connect} from 'react-redux';
import * as actions from '../actions/toggleMenu';
import ZZLeftSide from '../components/zzLeftSide/zzLeftSide';

//将状态写入属性
const mapStateToProps = (state) => {
    return {
        collapsed: state.toggleMenuReducer.collapsed
    }
}

export default connect(mapStateToProps)(ZZLeftSide)