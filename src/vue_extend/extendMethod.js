
export default {
    deepClone,
    dealNullValue,
    keys,
    values,
    entries,
    convertToElementObj
}

// 将对象或数组对象转换{label、value、children}对象
function convertToElementObj(obj, labelKey, valueKey, childrenKey) {
    if (typeof obj != 'object') {
        return obj;
    }
    let resObj = [];
    if (Array.isArray(obj)) {
        for (let value of values(obj)) {
            resObj.push(convertToElementObj(value, labelKey, valueKey, childrenKey));
        }
    } else {
        resObj = {};
        resObj.label = obj[labelKey];
        resObj.value = obj[valueKey] != null ? obj[valueKey] : Math.random(100);
        if (Array.isArray(obj[childrenKey]) && obj[childrenKey].length > 0) {
            resObj.children = convertToElementObj(obj[childrenKey], labelKey, valueKey, childrenKey);
        }
    }
    return resObj;
}

// 同Object.values方法，以兼容低版本浏览器
function values(obj) {
    if (Object.values) {
        let res = Object.values(obj); //chrome v49 該方法返回為true 結果返回空數組
        if (res.length > 0) {
            return res;
        } else {
            return ValuesFromKeys(obj);
        }
    } else {
        return ValuesFromKeys(obj);
    }
}
//供內部調用
function ValuesFromKeys(obj) {
    let keys = Object.keys(obj);
    let res = [];
    for (let key of keys) {
        res.push(obj[key]);
    }
    return res;
}


function keys(obj) {
    return Object.keys(obj);
}

// 同Object.entries方法，以兼容低版本浏览器
function entries(obj) {
    if (Object.entries) {
        return Object.entries(obj);
    } else {
        let keys = Object.keys(obj);
        let res = [];
        for (let key of keys) {
            res.push([key, obj[key]]);
        }
        return res;
    }
}

// 处理为值为null、undefined、''的对象，用-代替
function dealNullValue(obj) {
    if (!obj || typeof obj != 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        for (let value of values(obj)) {
            value = dealNullValue(value);
        }
    } else {
        for (let [key, value] of entries(obj)) {

            if (typeof value == 'object' && value) {
                value = dealNullValue(value);
            }
            if (!value && value != 0) {
                value = '-';
                obj[key] = value;
            }
        }
    }
    return obj;
}

// 深度克隆对象
function deepClone(obj) {

    if (!obj || typeof obj != 'object') {
        return obj;
    }

    let returnObj = {};
    if (Array.isArray(obj)) {
        // 是数组
        returnObj = [];
        for (let value of values(obj)) {
            returnObj.push(deepClone(value));
        }
    } else {
        // 是对象
        for (let [key, value] of entries(obj)) {

            if (typeof value == 'object' && value) {
                value = deepClone(value);
            }
            returnObj[key] = value;
        }
    }
    return returnObj;
}

//保留2~6位小數
function makeFloatNum(num) {
    if (!num || num == "{}" || num == {}) {
        return '';
    }
    if (num == 0) {
        return '0.00';
    }
    let isPositive = 1;
    if (num < 0) {
        isPositive = -1;
    }
    let power = 100;
    num *= power;
    while (num < 0.95 && num > -0.95) {
        power *= 10;
        if (power > 1000000) {
            return `${0.000001 * isPositive}`;
        }
        num *= 10;
    }
    let res = `${Math.round(num) / power}`;
    let index = res.indexOf('.');
    if (index < 0) {
        // console.log(num, res);
        return `${res}.00`
    }
    while (index > res.length - 3) {
        res += '0';
    }
    return res;

}

//僅保留整數，小數位不做處理,含負數處理為括號數
function filterIntFormat(cellValue) {
    if (!cellValue) return "-";
    if (isNaN(cellValue) || cellValue === '0') {
        return cellValue;
    }
    cellValue = Math.round(Number(cellValue));
    if (cellValue == 0) {
        return cellValue;
    }
    let num = getKsymbolNum(cellValue);
    num.indexOf('-') != -1 ? num = `(${num.slice(1)})` : "";
    return num;
}

//帶小數位的千分位方法，,含負數處理為括號數
function filterFormat(cellValue, makeFloat) {
    if (!cellValue) return "-";
    if (isNaN(cellValue) || cellValue === '0') {
        return cellValue;
    }
    cellValue = this.makeFloatNum(cellValue);
    let num = getKsymbolNum(cellValue);
    num.indexOf('-') != -1 ? num = `(${num.slice(1)})` : "";
    return num;

}

//獲取千分位數 String
function getKsymbolNum(cellValue) {
    let mNum = Number(cellValue);
    if (mNum) {
        let isPositive = 1; //用於處理正負
        if (mNum < 0) {
            isPositive = -1;
        }
        cellValue = `${cellValue}`;
        let arr = cellValue.split(".");
        let intPart = arr[0]; //获取整数部分
        intPart = `${Math.abs(intPart)}`;
        let regStr = /(\d)(?=(?:\d{3})+$)/g;
        let replaceStr = "$1,";
        let intStr = "";
        intStr = `${intPart}`;
        intPart != 0 ? intStr = `${intPart.toString().replace(regStr, replaceStr)}` : ""; //處理整數部分千分位
        isPositive == 1 ? intStr : intStr = `-${intStr}`; //處理正負數
        if (arr.length > 1) {
            return `${intStr + '.' + arr[1]}`;
        } else {
            return intStr;
        }

    } else {
        return cellValue;
    }
}

//將double類型的數據保留n位小數
function splitAndRound(a, n) {
    a = a * Math.pow(10, n);
    return (Math.round(a)) / (Math.pow(10, n));
}

// 鼠标移入单元格设置
function cellEnter(row, column, cell, event) {
    let columnClassName = column.className;
    let cells = document.getElementsByClassName(columnClassName);
    let cells1 = document.getElementsByClassName(
        _(cell.classList)
            .filter(item => {
                return item.startsWith("rowClass");
            })
            .value()[0]
    );
    for (let index = 0; index < cells.length; index++) {
        const element = cells[index];
        element.classList.add("cellClass");
    }
    for (let index = 0; index < cells1.length; index++) {
        const element = cells1[index];
        element.classList.add("cellClass");
    }
}
//鼠标从单元格离开
function cellLeave(row, column, cell) {
    let columnClassName = column.className;
    let cells = document.getElementsByClassName(columnClassName);
    let cells1 = document.getElementsByClassName(
        _.filter(cell.classList, item => {
            return item.startsWith("rowClass");
        })[0]
    );
    for (let index = 0; index < cells.length; index++) {
        const element = cells[index];
        element.classList.remove("cellClass");
    }
    for (let index = 0; index < cells1.length; index++) {
        const element = cells1[index];
        element.classList.remove("cellClass");
    }
}


function LastWeek_Nth(dateTime, num) {
    let dt0 = new Date(dateTime.toString("yyyy/MM/dd 07:40:00"));
    let dt1 = new Date(dateTime.toString("yyyy/1/1 07:40:00"));
    let dayOfWeek = dateTime.getDay() == 0 ? 7 : dateTime.getDay();
    let result = {};
    result['fromDate'] = dt0.addDays(-(dayOfWeek + num * 7));
    let fromDateDayOf = Math.ceil((result['fromDate'] - new Date(result['fromDate'].toString("yyyy/1/1 07:40:00"))) / (24 * 60 * 60 * 1000));
    result['toDate'] = dt0.addDays(7);
    result['nthOfYear'] = Math.ceil((fromDateDayOf + (dt1.getDay() == 0 ? 7 : dt1.getDay())) / 7 + 1)
    result['year'] = result.fromDate.getFullYear();
    if (result.nthOfYear == 53) {
        result.nthOfYear = 1;
        result.nthOfYear += 1;
    }
    return result;
}


// WEBPACK FOOTER //
// ./src/vue_extend/extendMethod.js