import {connect} from 'react-redux'
import * as actions from '../actions/toggleMenu';
import ZZHeader from '../components/zzHeader/zzHeader';

//将状态写入属性
const mapStateToProps = (state) => {
    return {
        collapsed: state.toggleMenuReducer.collapsed
    }
}

//将动作写入属性
const mapDispatchToProps = (dispatch) => {
    return {
        onToggleClick: () => dispatch(actions.toggle())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZZHeader)