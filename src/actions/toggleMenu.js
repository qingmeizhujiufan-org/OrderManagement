export const TOGGLE_MENU = 'TOGGLE_MENU'

export function toggle(collapsed) {
    return {
        type: TOGGLE_MENU,
        payload: {
            collapsed
        }
    }
}

//这些方法都导出,在其他文件导入时候,使用import * as actions 就可以生成一个actions对象包含所有的export