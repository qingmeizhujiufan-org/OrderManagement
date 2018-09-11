import assign from 'lodash/assign';

export const SHOW_PRODUCT_LIST = 'SHOW_PRODUCT_LIST';

//获取产品列表
export const getProductList = (url, params) => {
	return dispatch => {
		return (
            ajax.getJSON(url, null, (data) => {
            	if(data.success){	
		            data =  eval('(' + data.backData + ')');
		            data.map(function(item, index){
		            	item.key = index;
		            });

		            dispatch({
		            	type: SHOW_PRODUCT_LIST,
		            	data: assign({}, {dataSource: data, loading: false})
		            });
            	}
	        })
		)
	}
}

//这些方法都导出,在其他文件导入时候,使用import * as actions 就可以生成一个actions对象包含所有的export