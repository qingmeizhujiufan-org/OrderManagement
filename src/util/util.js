import _ from 'lodash';

export default {

    //日期格式
    FormatDate: function (date, type) {
        var seperator1 = "-";
        var seperator2 = ":";
        if (date == null) {
            date = new Date();
        } else if (typeof(date) === "number") {
            date = new Date(date);
        } else {
            date = new Date(date);
        }
        var curyear = date.getFullYear();
        var curmonth = date.getMonth() + 1;
        var curday = date.getDate();
        if (curmonth >= 1 && curmonth <= 9) {
            curmonth = "0" + curmonth;
        }
        if (curday >= 0 && curday <= 9) {
            curday = "0" + curday;
        }

        if ('date' === type) {
            var curDate = curyear + seperator1 + curmonth + seperator1 + curday; //可以获取当前日期
            return curDate;
        }
        else if ('dateHM' === type) {
            var curhour = date.getHours();
            if (curhour >= 0 && curhour <= 9) {
                curhour = "0" + curhour;
            }
            var curmin = date.getMinutes();
            if (curmin >= 0 && curmin <= 9) {
                curmin = "0" + curmin;
            }
            var curDate = curyear + seperator1 + curmonth + seperator1 + curday + " " +
                curhour + seperator2 + curmin; //可以获取当前时间
            return curDate;
        } else {
            var curhour = date.getHours();
            if (curhour >= 0 && curhour <= 9) {
                curhour = "0" + curhour;
            }
            var curmin = date.getMinutes();
            if (curmin >= 0 && curmin <= 9) {
                curmin = "0" + curmin;
            }
            var cursec = date.getSeconds();
            if (cursec >= 0 && cursec <= 9) {
                cursec = "0" + cursec;
            }
            var curDate = curyear + seperator1 + curmonth + seperator1 + curday + " " +
                curhour + seperator2 + curmin + seperator2 + cursec; //可以获取当前时间
            return curDate;
        }
    },

    //金钱格式
    fmoney: function (s, n) {
        var plus_minus = '';
        n = n > 0 && n <= 20 ? n : 2;
        if (parseFloat(s) < 0)
            plus_minus = '-';
        s = parseFloat((Math.abs(s) + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        var t = "";
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return plus_minus + t.split("").reverse().join("") + "." + r;
    },

    //list 转 tree
    listToTree: (list) => {
        if(list.length === 0) return;
        const _list = [];
        list.map(item => _list.push(_.assign({}, item)));
        let arr = [];
        //首先状态顶层节点
        _list.map(item => {
            if (!item.pId) {
                arr.push(item);
            }
        });
        let toDo = [];
        arr.map(item => {
            toDo.push(item);
        });
        while (toDo.length) {
            let node = toDo.shift();
            for (let i = 0; i < _list.length; i++) {
                let row = _list[i];
                if (node.id === row.pId) {
                    if (node.children) {
                        node.children.push(row);
                    } else {
                        node.children = [row];
                    }
                    toDo.push(row);
                }
            }
        }

        function sortNumber(a, b) {
            return new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
        }

        arr.sort(sortNumber);

        return arr;
    }
};