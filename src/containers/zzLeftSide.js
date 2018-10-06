import {connect} from 'react-redux';
import * as actions from '../actions/toggleMenu';
import ZZLeftSide from '../components/zzLeftSide/zzLeftSide';

//将状态写入属性
const mapStateToProps = (state) => {
  return {
    collapsed: state.toggleMenuReducer.collapsed
  }
}

//将动作写入属性
const mapDispatchToProps = (dispatch) => {
    return {
        onToggleClick: collapsed => dispatch(actions.toggle(collapsed))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZZLeftSide)