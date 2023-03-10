/**
 * 自定义元素管理器
 */
class DefineElementManager {
    /**
     * 添加自定义元素类
     * @param clazz     自定义元素类或类数组
     * @param alias     别名
     */
    static add(clazz, alias) {
        if (Array.isArray(clazz)) {
            for (let c of clazz) {
                this.elements.set(c.name.toUpperCase(), c);
            }
        }
        else {
            this.elements.set((alias || clazz.name).toUpperCase(), clazz);
        }
    }
    /**
     * 获取自定义元素类
     * @param tagName   元素名
     * @returns         自定义元素类
     */
    static get(tagName) {
        return this.elements.get(tagName.toUpperCase());
    }
    /**
     * 是否存在自定义元素
     * @param tagName   元素名
     * @returns         存在或不存在
     */
    static has(tagName) {
        return this.elements.has(tagName.toUpperCase());
    }
}
/**
 * 自定义element
 */
DefineElementManager.elements = new Map();

/**
 * 指令类
 */
class DirectiveType {
    /**
     * 构造方法
     * @param name      指令类型名
     * @param handle    渲染时执行方法
     * @param prio      类型优先级
     */
    constructor(name, handle, prio) {
        this.name = name;
        this.prio = prio >= 0 ? prio : 10;
        this.handle = handle;
    }
}

/**
 * 指令管理器
 */
class DirectiveManager {
    /**
     * 增加指令映射
     * @param name      指令类型名
     * @param handle    渲染处理函数
     * @param prio      类型优先级
     */
    static addType(name, handle, prio) {
        this.directiveTypes.set(name, new DirectiveType(name, handle, prio));
    }
    /**
     * 移除指令映射
     * @param name  指令类型名
     */
    static removeType(name) {
        this.directiveTypes.delete(name);
    }
    /**
     * 获取指令
     * @param name  指令类型名
     * @returns     指令类型或undefined
     */
    static getType(name) {
        return this.directiveTypes.get(name);
    }
    /**
     * 是否含有某个指令
     * @param name  指令类型名
     * @returns     true/false
     */
    static hasType(name) {
        return this.directiveTypes.has(name);
    }
}
/**
 * 指令映射
 */
DirectiveManager.directiveTypes = new Map();

/*
 * 消息js文件 中文文件
 */
const NodomMessage_en = {
    /**
     * tip words
     */
    TipWords: {
        application: "Application",
        system: "System",
        module: "Module",
        moduleClass: 'ModuleClass',
        model: "Model",
        directive: "Directive",
        directiveType: "Directive-type",
        expression: "Expression",
        event: "Event",
        method: "Method",
        filter: "Filter",
        filterType: "Filter-type",
        data: "Data",
        dataItem: 'Data-item',
        route: 'Route',
        routeView: 'Route-container',
        plugin: 'Plugin',
        resource: 'Resource',
        root: 'Root',
        element: 'VirtualDom'
    },
    /**
     * error info
     */
    ErrorMsgs: {
        unknown: "unknown error",
        paramException: "{0} '{1}' parameter error，see api",
        invoke: "method {0} parameter {1} must be {2}",
        invoke1: "method {0} parameter {1} must be {2} or {3}",
        invoke2: "method {0} parameter {1} or {2} must be {3}",
        invoke3: "method {0} parameter {1} not allowed empty",
        exist: "{0} is already exist",
        exist1: "{0} '{1}' is already exist",
        notexist: "{0} is not exist",
        notexist1: "{0} '{1}' is not exist",
        notupd: "{0} not allow to change",
        notremove: "{0} not allow to delete",
        notremove1: "{0} {1} not allow to delete",
        namedinvalid: "{0} {1} name error，see name rules",
        initial: "{0} init parameter error",
        jsonparse: "JSON parse error",
        timeout: "request overtime",
        config: "{0} config parameter error",
        config1: "{0} config parameter '{1}' error",
        itemnotempty: "{0} '{1}' config item '{2}' not allow empty",
        itemincorrect: "{0} '{1}' config item '{2}' error",
        wrongTemplate: "wrong template"
    },
    /**
     * form info
     */
    FormMsgs: {
        type: "please input valid {0}",
        unknown: "input error",
        required: "is required",
        min: "min value is {0}",
        max: "max value is {0}"
    },
    WeekDays: {
        "0": "Sun",
        "1": "Mon",
        "2": "Tue",
        "3": "Wed",
        "4": "Thu",
        "5": "Fri",
        "6": "Sat"
    }
};

/**
 * 异常处理类
 * @since       1.0.0
 */
class NError extends Error {
    constructor(errorName, p1, p2, p3, p4) {
        super(errorName);
        let msg = NodomMessage_en.ErrorMsgs[errorName];
        if (msg === undefined) {
            this.message = "未知错误";
            return;
        }
        //复制请求参数
        let params = [msg];
        for (let i = 1; i < arguments.length; i++) {
            params.push(arguments[i]);
        }
        this.message = this.compile.apply(null, params);
    }
    /**
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    compile(src, p1, p2, p3, p4, p5) {
        let reg;
        let args = arguments;
        let index = 0;
        for (;;) {
            if (src.indexOf('\{' + index + '\}') !== -1) {
                reg = new RegExp('\\{' + index + '\\}', 'g');
                src = src.replace(reg, args[index + 1]);
                index++;
            }
            else {
                break;
            }
        }
        return src;
    }
}

/**
 * 基础服务库
 * @since       1.0.0
 */
class Util {
    /**
     * 唯一主键
     */
    static genId() {
        return this.generatedId++;
    }
    /**
     * 初始化保留字map
     */
    static initKeyMap() {
        this.keyWordMap.set('arguments', true);
        this.keyWordMap.set('boolean', true);
        this.keyWordMap.set('break', true);
        this.keyWordMap.set('byte', true);
        this.keyWordMap.set('catch', true);
        this.keyWordMap.set('char', true);
        this.keyWordMap.set('const', true);
        this.keyWordMap.set('default', true);
        this.keyWordMap.set('delete', true);
        this.keyWordMap.set('do', true);
        this.keyWordMap.set('double', true);
        this.keyWordMap.set('else', true);
        this.keyWordMap.set('enum', true);
        this.keyWordMap.set('eval', true);
        this.keyWordMap.set('false', true);
        this.keyWordMap.set('float', true);
        this.keyWordMap.set('for', true);
        this.keyWordMap.set('function', true);
        this.keyWordMap.set('goto', true);
        this.keyWordMap.set('if', true);
        this.keyWordMap.set('in', true);
        this.keyWordMap.set('instanceof', true);
        this.keyWordMap.set('int', true);
        this.keyWordMap.set('let', true);
        this.keyWordMap.set('long', true);
        this.keyWordMap.set('new', true);
        this.keyWordMap.set('null', true);
        this.keyWordMap.set('return', true);
        this.keyWordMap.set('short', true);
        this.keyWordMap.set('switch', true);
        this.keyWordMap.set('this', true);
        this.keyWordMap.set('throw', true);
        this.keyWordMap.set('true', true);
        this.keyWordMap.set('try', true);
        this.keyWordMap.set('this', true);
        this.keyWordMap.set('throw', true);
        this.keyWordMap.set('typeof', true);
        this.keyWordMap.set('var', true);
        this.keyWordMap.set('while', true);
        this.keyWordMap.set('with', true);
        this.keyWordMap.set('Array', true);
        this.keyWordMap.set('Date', true);
        this.keyWordMap.set('JSON', true);
        this.keyWordMap.set('Set', true);
        this.keyWordMap.set('Map', true);
        this.keyWordMap.set('eval', true);
        this.keyWordMap.set('function', true);
        this.keyWordMap.set('Infinity', true);
        this.keyWordMap.set('isFinite', true);
        this.keyWordMap.set('isNaN', true);
        this.keyWordMap.set('isPrototypeOf', true);
        this.keyWordMap.set('Math', true);
        this.keyWordMap.set('NaN', true);
        this.keyWordMap.set('Number', true);
        this.keyWordMap.set('Object', true);
        this.keyWordMap.set('prototype', true);
        this.keyWordMap.set('String', true);
        this.keyWordMap.set('isPrototypeOf', true);
        this.keyWordMap.set('undefined', true);
        this.keyWordMap.set('valueOf', true);
    }
    /**
     * 是否为 js 保留关键字
     * @param name  名字
     * @returns     如果为保留字，则返回true，否则返回false
     */
    static isKeyWord(name) {
        return this.keyWordMap.has(name);
    }
    /******对象相关******/
    /**
     * 对象复制
     * @param srcObj    源对象
     * @param expKey    不复制的键正则表达式或名
     * @param extra     clone附加参数
     * @returns         复制的对象
     */
    static clone(srcObj, expKey, extra) {
        let me = this;
        let map = new WeakMap();
        return clone(srcObj, expKey, extra);
        /**
         * clone对象
         * @param src      待clone对象
         * @param expKey   不克隆的键
         * @param extra    clone附加参数
         * @returns        克隆后的对象
         */
        function clone(src, expKey, extra) {
            //非对象或函数，直接返回            
            if (!src || typeof src !== 'object' || Util.isFunction(src)) {
                return src;
            }
            let dst;
            //带有clone方法，则直接返回clone值
            if (src.clone && Util.isFunction(src.clone)) {
                return src.clone(extra);
            }
            else if (me.isObject(src)) {
                dst = new Object();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                map.set(src, dst);
                Object.getOwnPropertyNames(src).forEach((prop) => {
                    //不克隆的键
                    if (expKey) {
                        if (expKey.constructor === RegExp && expKey.test(prop) //正则表达式匹配的键不复制
                            || Util.isArray(expKey) && expKey.includes(prop) //被排除的键不复制
                        ) {
                            return;
                        }
                    }
                    dst[prop] = getCloneObj(src[prop], expKey, extra);
                });
            }
            else if (me.isMap(src)) {
                dst = new Map();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                src.forEach((value, key) => {
                    //不克隆的键
                    if (expKey) {
                        if (expKey.constructor === RegExp && expKey.test(key) //正则表达式匹配的键不复制
                            || expKey.includes(key)) { //被排除的键不复制
                            return;
                        }
                    }
                    dst.set(key, getCloneObj(value, expKey, extra));
                });
            }
            else if (me.isArray(src)) {
                dst = new Array();
                //把对象加入map，如果后面有新克隆对象，则用新克隆对象进行覆盖
                src.forEach(function (item, i) {
                    dst[i] = getCloneObj(item, expKey, extra);
                });
            }
            return dst;
        }
        /**
         * 获取clone对象
         * @param value     待clone值
         * @param expKey    排除键
         * @param extra     附加参数
         */
        function getCloneObj(value, expKey, extra) {
            if (typeof value === 'object' && !Util.isFunction(value)) {
                let co = null;
                if (!map.has(value)) { //clone新对象
                    co = clone(value, expKey, extra);
                }
                else { //从map中获取对象
                    co = map.get(value);
                }
                return co;
            }
            return value;
        }
    }
    /**
     * 合并多个对象并返回
     * @param   参数数组
     * @returns 返回对象
     */
    static merge(o1, o2, o3, o4, o5, o6) {
        let me = this;
        for (let i = 0; i < arguments.length; i++) {
            if (!this.isObject(arguments[i])) {
                throw new NError('invoke', 'Util.merge', i + '', 'object');
            }
        }
        let retObj = Object.assign.apply(null, arguments);
        subObj(retObj);
        return retObj;
        //处理子对象
        function subObj(obj) {
            for (let o of Object.keys(obj)) {
                if (me.isObject(obj[o]) || me.isArray(obj[o])) { //对象或数组
                    retObj[o] = me.clone(retObj[o]);
                }
            }
        }
    }
    /**
     * 把obj2对象所有属性赋值给obj1
     * @returns 返回对象obj1
     */
    static assign(obj1, obj2) {
        if (Object.assign) {
            Object.assign(obj1, obj2);
        }
        else {
            this.getOwnProps(obj2).forEach(function (p) {
                obj1[p] = obj2[p];
            });
        }
        return obj1;
    }
    /**
     * 比较两个对象值是否相同(只比较object和array)
     * @param src   源对象
     * @param dst   目标对象
     * @returns     值相同则返回true，否则返回false
     */
    static compare(src, dst, deep) {
        if (!src && !dst) {
            return true;
        }
        if (typeof src !== 'object' || typeof dst !== 'object') {
            return false;
        }
        const keys = Object.getOwnPropertyNames(src);
        if (keys.length !== Object.getOwnPropertyNames(dst).length) {
            return false;
        }
        for (let k of keys) {
            if (src[k] !== dst[k]) {
                return false;
            }
        }
        //深度比较
        if (deep) {
            for (let k of keys) {
                let r = this.compare(src[k], dst[k]);
                if (!r) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * 获取对象自有属性
     * @param obj   需要获取属性的对象
     * @returns     返回属性数组
     */
    static getOwnProps(obj) {
        if (!obj) {
            return [];
        }
        return Object.getOwnPropertyNames(obj);
    }
    /**************对象判断相关************/
    /**
     * 判断是否为函数
     * @param foo   检查的对象
     * @returns     true/false
     */
    static isFunction(foo) {
        return foo !== undefined && foo !== null && foo.constructor === Function;
    }
    /**
     * 判断是否为数组
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isArray(obj) {
        return Array.isArray(obj);
    }
    /**
     * 判断是否为map
     * @param obj   检查的对象
     */
    static isMap(obj) {
        return obj !== null && obj !== undefined && obj.constructor === Map;
    }
    /**
     * 判断是否为对象
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isObject(obj) {
        return obj !== null && obj !== undefined && obj.constructor === Object;
    }
    /**
     * 判断是否为整数
     * @param v     检查的值
     * @returns     true/false
     */
    static isInt(v) {
        return Number.isInteger(v);
    }
    /**
     * 判断是否为number
     * @param v     检查的值
     * @returns     true/false
     */
    static isNumber(v) {
        return typeof v === 'number';
    }
    /**
     * 判断是否为boolean
     * @param v     检查的值
     * @returns     true/false
     */
    static isBoolean(v) {
        return typeof v === 'boolean';
    }
    /**
     * 判断是否为字符串
     * @param v     检查的值
     * @returns     true/false
     */
    static isString(v) {
        return typeof v === 'string';
    }
    /**
     * 判断是否为数字串
     * @param v     检查的值
     * @returns     true/false
     */
    static isNumberString(v) {
        return /^\d+\.?\d*$/.test(v);
    }
    /**
     * 判断对象/字符串是否为空
     * @param obj   检查的对象
     * @returns     true/false
     */
    static isEmpty(obj) {
        if (obj === null || obj === undefined)
            return true;
        let tp = typeof obj;
        if (this.isObject(obj)) {
            let keys = Object.keys(obj);
            if (keys !== undefined) {
                return keys.length === 0;
            }
        }
        else if (tp === 'string') {
            return obj === '';
        }
        return false;
    }
    /**
     * 把srcNode替换为nodes
     * @param srcNode       源dom
     * @param nodes         替换的dom或dom数组
     */
    static replaceNode(srcNode, nodes) {
        let pnode = srcNode.parentNode;
        let bnode = srcNode.nextSibling;
        if (pnode === null) {
            return;
        }
        pnode.removeChild(srcNode);
        const nodeArr = this.isArray(nodes) ? nodes : [nodes];
        nodeArr.forEach(function (node) {
            if (bnode === undefined || bnode === null) {
                pnode.appendChild(node);
            }
            else {
                pnode.insertBefore(node, bnode);
            }
        });
    }
    /**
     * 清空子节点
     * @param el   需要清空的节点
     */
    static empty(el) {
        let nodes = el.childNodes;
        for (let i = nodes.length - 1; i >= 0; i--) {
            el.removeChild(nodes[i]);
        }
    }
    /******日期相关******/
    /**
     * 日期格式化
     * @param srcDate    时间戳串
     * @param format     日期格式
     * @returns          日期串
     */
    static formatDate(srcDate, format) {
        //时间戳
        let timeStamp;
        if (this.isString(srcDate)) {
            //排除日期格式串,只处理时间戳
            let reg = /^\d+$/;
            if (reg.test(srcDate) === true) {
                timeStamp = parseInt(srcDate);
            }
        }
        else if (this.isNumber(srcDate)) {
            timeStamp = srcDate;
        }
        else {
            throw new NError('invoke', 'this.formatDate', '0', 'date string', 'date');
        }
        //得到日期
        let date = new Date(timeStamp);
        // invalid date
        if (isNaN(date.getDay())) {
            return '';
        }
        let o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds() //毫秒
        };
        //年
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substring(4 - RegExp.$1.length));
        }
        //月日
        this.getOwnProps(o).forEach(function (k) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length)));
            }
        });
        //星期
        if (/(E+)/.test(format)) {
            format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + NodomMessage_en.WeekDays[date.getDay() + ""]);
        }
        return format;
    }
    /******字符串相关*****/
    /**
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    static compileStr(src, p1, p2, p3, p4, p5) {
        let reg;
        let args = arguments;
        let index = 0;
        for (;;) {
            if (src.indexOf('\{' + index + '\}') !== -1) {
                reg = new RegExp('\\{' + index + '\\}', 'g');
                src = src.replace(reg, args[index + 1]);
                index++;
            }
            else {
                break;
            }
        }
        return src;
    }
    /**
     * 函数调用
     * @param foo   函数
     * @param obj   this指向
     * @param args  参数数组
     */
    static apply(foo, obj, args) {
        if (!foo) {
            return;
        }
        return Reflect.apply(foo, obj || null, args);
    }
    /**
     * 合并并修正路径，即路径中出现'//','///','\/'的情况，统一置换为'/'
     * @param paths     待合并路径数组
     * @returns         返回路径
     */
    static mergePath(paths) {
        return paths.join('/').replace(/(\/{2,})|\\\//g, '\/');
    }
    /**
     * eval
     * @param evalStr   eval串
     * @returns         eval值
     */
    static eval(evalStr) {
        return new Function(`return(${evalStr})`)();
    }
    /**
     * 改造 dom key，避免克隆时重复，格式为：key_id
     * @param node    节点
     * @param id      附加id
     * @param deep    是否深度处理
     */
    static setNodeKey(node, id, deep) {
        node.key += '_' + (id || Util.genId());
        if (deep && node.children) {
            for (let c of node.children) {
                Util.setNodeKey(c, id, deep);
            }
        }
    }
    /**
     * 设置dom asset
     * @param dom       渲染后的dom节点
     * @param name      asset name
     * @param value     asset value
     */
    static setDomAsset(dom, name, value) {
        if (!dom.assets) {
            dom.assets = {};
        }
        dom.assets[name] = value;
    }
    /**
     * 删除dom asset
     * @param dom   渲染后的dom节点
     * @param name  asset name
     * @returns
     */
    static delDomAsset(dom, name) {
        if (!dom.assets) {
            return;
        }
        delete dom.assets[name];
    }
}
/**
 * 全局id
 */
Util.generatedId = 1;
/**
 * js 保留字 map
 */
Util.keyWordMap = new Map();
//初始化keymap
Util.initKeyMap();

/**
 * 表达式类
 */
class Expression {
    /**
     * @param exprStr	表达式串
     */
    constructor(exprStr) {
        this.id = Util.genId();
        this.allModelField = true;
        if (!exprStr) {
            return;
        }
        const funStr = this.compile(exprStr);
        this.execFunc = new Function('$model', `return ` + funStr);
    }
    /**
     * 编译表达式串，替换字段和方法
     * @param exprStr   表达式串
     * @returns         编译后的表达式串
     */
    compile(exprStr) {
        //字符串，object key，有效命名(函数或字段)
        const reg = /('[\s\S]*?')|("[\s\S]*?")|(`[\s\S]*?`)|([a-zA-Z$_][\w$]*\s*?:)|((\.{3}|\.)?[a-zA-Z$_][\w$]*(\.[a-zA-Z$_][\w$]*)*(\s*[\[\(](\s*\))?)?)/g;
        let r;
        let retS = '';
        let index = 0; //当前位置
        while ((r = reg.exec(exprStr)) !== null) {
            let s = r[0];
            if (index < r.index) {
                retS += exprStr.substring(index, r.index);
            }
            if (s[0] === "'" || s[0] === '"' || s[0] === '`') { //字符串
                retS += s;
            }
            else {
                let lch = s[s.length - 1];
                if (lch === ':') { //object key
                    retS += s;
                }
                else if (lch === '(' || lch === ')') { //函数，非内部函数
                    retS += handleFunc(s);
                }
                else { //字段 this $model .field等不做处理
                    if (s.startsWith('this.') || s === '$model' || s.startsWith('$model.') || Util.isKeyWord(s) || (s[0] === '.' && s[1] !== '.')) { //非model属性
                        retS += s;
                    }
                    else { //model属性
                        let s1 = '';
                        if (s.startsWith('...')) { // ...属性名
                            s1 = '...';
                            s = s.substring(3);
                        }
                        retS += s1 + '$model.' + s;
                        //存在‘.’，则变量不全在在当前模型中
                        if (s.indexOf('.') !== -1) {
                            this.allModelField = false;
                        }
                    }
                }
            }
            index = reg.lastIndex;
        }
        if (index < exprStr.length) {
            retS += exprStr.substring(index);
        }
        return retS;
        /**
         * 处理函数串
         * @param str   源串
         * @returns     处理后的串
         */
        function handleFunc(str) {
            let ind = str.indexOf('.');
            //中间无'.'
            if (ind === -1) {
                let ind1 = str.lastIndexOf('(');
                let fn = str.substring(0, ind1);
                //末尾字符
                if (!Util.isKeyWord(fn)) {
                    let lch = str[str.length - 1];
                    if (lch !== ')') { //有参数
                        return 'this.invokeMethod("' + fn + '",';
                    }
                    else { //无参数
                        return 'this.invokeMethod("' + fn + '")';
                    }
                }
            }
            else if (str[0] !== '.') { //第一个为点不处理
                let fn = str.substring(0, ind);
                if (!Util.isKeyWord(fn)) { //首字段非关键词，则为属性
                    return '$model.' + str;
                }
            }
            return str;
        }
    }
    /**
     * 表达式计算
     * @param module    模块
     * @param model 	模型
     * @returns 		计算结果
     */
    val(module, model) {
        let v;
        try {
            v = this.execFunc.apply(module, [model]);
        }
        catch (e) {
            // console.error(e);
        }
        this.value = v;
        return v;
    }
    /**
     * 克隆
     */
    clone() {
        return this;
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * 过滤器工厂，存储模块过滤器
 */
class ModuleFactory {
    /**
     * 添加模块到工厂
     * @param item  模块对象
     */
    static add(item) {
        // 第一个为主模块
        if (this.modules.size === 0) {
            this.mainModule = item;
        }
        this.modules.set(item.id, item);
        //添加模块类
        this.addClass(item.constructor);
    }
    /**
     * 获得模块
     * @param name  类、类名或实例id
     */
    static get(name) {
        if (typeof name === 'number') {
            return this.modules.get(name);
        }
        else {
            return this.getInstance(name);
        }
    }
    /**
     * 是否存在模块类
     * @param clazzName     模块类名
     * @returns     true/false
     */
    static hasClass(clazzName) {
        return this.classes.has(clazzName.toLowerCase());
    }
    /**
     * 添加模块类
     * @param clazz     模块类
     * @param alias     注册别名
     */
    static addClass(clazz, alias) {
        //转换成小写
        let name = clazz.name.toLowerCase();
        if (this.classes.has(name)) {
            return;
        }
        this.classes.set(name, clazz);
        if (alias) {
            this.classes.set(alias.toLowerCase(), clazz);
        }
    }
    /**
     * 获取模块实例（通过类名）
     * @param className     模块类或类名
     * @param props         模块外部属性
     */
    static getInstance(clazz) {
        let className = (typeof clazz === 'string') ? clazz : clazz.name.toLowerCase();
        let cls;
        // 初始化模块
        if (!this.classes.has(className) && typeof clazz === 'function') {
            cls = clazz;
        }
        else {
            cls = this.classes.get(className);
        }
        if (!cls) {
            return;
        }
        let m = Reflect.construct(cls, []);
        m.init();
        return m;
    }
    /**
     * 从工厂移除模块
     * @param id    模块id
     */
    static remove(id) {
        this.modules.delete(id);
    }
    /**
     * 设置主模块
     * @param m 	模块
     */
    static setMain(m) {
        this.mainModule = m;
    }
    /**
     * 获取主模块
     * @returns 	应用的主模块
     */
    static getMain() {
        return this.mainModule;
    }
}
/**
 * 模块对象工厂 {moduleId:{key:容器key,className:模块类名,instance:模块实例}}
 */
ModuleFactory.modules = new Map();
/**
 * 模块类集合 {className:class}
 */
ModuleFactory.classes = new Map();

/**
 * css 管理器
 * 针对不同的rule，处理方式不同
 * CssStyleRule 进行保存和替换，同时 scopeInModule(模块作用域)有效
 * CssImportRule 路径不重复添加，因为必须加在stylerule前面，所以需要记录最后的import索引号
 */
class CssManager {
    /**
     * 处理style 元素
     * @param module    模块
     * @param dom       虚拟dom
     * @param root      模块root dom
     * @param add       是否添加根模块类名
     * @returns         如果是styledom，则返回true，否则返回false
     */
    static handleStyleDom(module, dom, root, add) {
        if (dom.tagName.toLowerCase() !== 'style') {
            return false;
        }
        if (add) {
            let cls = this.cssPreName + module.id;
            if (root.props['class']) {
                root.props['class'] = dom.props['class'] + ' ' + cls;
            }
            else {
                root.props['class'] = cls;
            }
        }
        return true;
    }
    /**
     * 处理 style 下的文本元素
     * @param module    模块
     * @param dom       style text element
     * @returns         如果是styleTextdom返回true，否则返回false
     */
    static handleStyleTextDom(module, dom) {
        if (!dom.parent || dom.parent.tagName.toLowerCase() !== 'style') {
            return false;
        }
        //scope=this，在模块根节点添加 限定 class
        CssManager.addRules(module, dom.textContent, dom.parent.props['scope'] === 'this' ? '.' + this.cssPreName + module.id : undefined);
        return true;
    }
    /**
     * 添加多个css rule
     * @param cssText           rule集合
     * @param module            模块
     * @param scopeName         作用域名(前置选择器)
     */
    static addRules(module, cssText, scopeName) {
        //sheet 初始化
        if (!this.sheet) {
            //safari不支持 cssstylesheet constructor，用 style代替
            let sheet = document.createElement('style');
            document.head.appendChild(sheet);
            this.sheet = document.styleSheets[0];
        }
        //如果有作用域，则清除作用域下的rule
        if (scopeName) {
            this.clearModuleRules(module);
        }
        //是否限定在模块内
        //cssRule 获取正则式  @import
        const reg = /(@[a-zA-Z]+\s+url\(.+?\))|([.#@a-zA-Z]\S*(\s*\S*\s*?)?{)|\}/g;
        //import support url正则式
        const regImp = /@[a-zA-Z]+\s+url/;
        // keyframe font page support... 开始 位置
        let startIndex = -1;
        // { 个数，遇到 } -1 
        let beginNum = 0;
        let re;
        while ((re = reg.exec(cssText)) !== null) {
            if (regImp.test(re[0])) { //import namespace
                handleImport(re[0]);
            }
            else if (re[0] === '}') { //回收括号，单个样式结束判断
                if (startIndex >= 0 && --beginNum <= 0) { //style @ end
                    let txt = cssText.substring(startIndex, re.index + 1);
                    if (txt[0] === '@') { //@开头
                        this.sheet.insertRule(txt, CssManager.sheet.cssRules ? CssManager.sheet.cssRules.length : 0);
                    }
                    else { //style
                        handleStyle(module, txt, scopeName);
                    }
                    startIndex = -1;
                    beginNum = 0;
                }
            }
            else { //style 或 @内部
                if (startIndex === -1) {
                    startIndex = re.index;
                    beginNum++;
                }
                else {
                    beginNum++;
                }
            }
        }
        /**
         * 处理style rule
         * @param module         模块
         * @param cssText        css 文本
         * @param scopeName      作用域名(前置选择器)
         * @returns              如果css文本最后一个"{"前没有字符串，则返回void
         */
        function handleStyle(module, cssText, scopeName) {
            const reg = /.+(?=\{)/; //匹配字符"{"前出现的所有字符
            let r = reg.exec(cssText);
            if (!r) {
                return;
            }
            // 保存样式名，在模块 object manager 中以数组存储
            if (scopeName) {
                let arr = module.objectManager.get('$cssRules');
                if (!arr) {
                    arr = [];
                    module.objectManager.set('$cssRules', arr);
                }
                arr.push((scopeName + ' ' + r[0]));
                //为样式添加 scope name
                cssText = scopeName + ' ' + cssText;
            }
            //加入到样式表
            CssManager.sheet.insertRule(cssText, CssManager.sheet.cssRules ? CssManager.sheet.cssRules.length : 0);
        }
        /**
         * 处理import rule
         * @param cssText   css文本
         * @returns         如果cssText中"()"内有字符串且importMap中存在键值为"()"内字符串的第一个字符，则返回void
         */
        function handleImport(cssText) {
            let ind = cssText.indexOf('(');
            let ind1 = cssText.lastIndexOf(')');
            if (ind === -1 || ind1 === -1 || ind >= ind1) {
                return;
            }
            let css = cssText.substring(ind, ind1);
            if (CssManager.importMap.has(css)) {
                return;
            }
            //插入import rule
            CssManager.sheet.insertRule(cssText, CssManager.importIndex++);
            CssManager.importMap.set(css, true);
        }
    }
    /**
     * 清除模块css rules
     * @param module  模块
     * @returns       如果模块不存在css rules，则返回void
     */
    static clearModuleRules(module) {
        let rules = module.objectManager.get('$cssRules');
        if (!rules || rules.length === 0) {
            return;
        }
        //从sheet清除
        for (let i = 0; i < this.sheet.cssRules.length; i++) {
            let r = this.sheet.cssRules[i];
            if (r.selectorText && rules.indexOf(r.selectorText) !== -1) {
                this.sheet.deleteRule(i--);
            }
        }
        //置空cache
        module.objectManager.set('$cssRules', []);
    }
}
/**
 * import url map，用于存储import的url路径
 */
CssManager.importMap = new Map();
/**
 * importrule 位置
 */
CssManager.importIndex = 0;
/**
 * css class 前置名
 */
CssManager.cssPreName = '___nodommodule___';

/**
 * 事件类
 * @remarks
 * 事件分为自有事件和代理事件
 * @author      yanglei
 * @since       1.0
 */
class NEvent {
    /**
     * @param eventName     事件名
     * @param eventStr      事件串或事件处理函数,以“:”分割,中间不能有空格,结构为: 方法名[:delg(代理到父对象):nopopo(禁止冒泡):once(只执行一次):capture(useCapture)]
     *                      如果为函数，则替代第三个参数
     * @param handler       事件执行函数，如果方法不在module methods中定义，则可以直接申明，eventStr第一个参数失效，即eventStr可以是":delg:nopopo..."
     */
    constructor(module, eventName, eventStr, handler) {
        this.id = Util.genId();
        this.module = module;
        this.name = eventName;
        // GlobalCache.saveEvent(this);
        //如果事件串不为空，则不需要处理
        if (eventStr) {
            let tp = typeof eventStr;
            if (tp === 'string') {
                let eStr = eventStr.trim();
                eStr.split(':').forEach((item, i) => {
                    item = item.trim();
                    if (i === 0) { //事件方法
                        this.handler = item;
                    }
                    else { //事件附加参数
                        switch (item) {
                            case 'delg':
                                this.delg = true;
                                break;
                            case 'nopopo':
                                this.nopopo = true;
                                break;
                            case 'once':
                                this.once = true;
                                break;
                            case 'capture':
                                this.capture = true;
                                break;
                        }
                    }
                });
            }
            else if (tp === 'function') {
                handler = eventStr;
            }
        }
        //新增事件方法（不在methods中定义）
        if (handler) {
            this.handler = handler;
        }
        if (document.ontouchend) { //触屏设备
            switch (this.name) {
                case 'click':
                    this.name = 'tap';
                    break;
                case 'mousedown':
                    this.name = 'touchstart';
                    break;
                case 'mouseup':
                    this.name = 'touchend';
                    break;
                case 'mousemove':
                    this.name = 'touchmove';
                    break;
            }
        }
        else { //转非触屏
            switch (this.name) {
                case 'tap':
                    this.name = 'click';
                    break;
                case 'touchstart':
                    this.name = 'mousedown';
                    break;
                case 'touchend':
                    this.name = 'mouseup';
                    break;
                case 'touchmove':
                    this.name = 'mousemove';
                    break;
            }
        }
    }
    /**
     * 设置附加参数值
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     * @param value     参数值
     */
    setParam(module, dom, name, value) {
        module.objectManager.setEventParam(this.id, dom.key, name, value);
    }
    /**
     * 获取附加参数值
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     * @returns         附加参数值
     */
    getParam(module, dom, name) {
        return module.objectManager.getEventParam(this.id, dom.key, name);
    }
    /**
     * 移除参数
     * @param module    模块
     * @param dom       虚拟dom
     * @param name      参数名
     */
    removeParam(module, dom, name) {
        return module.objectManager.removeEventParam(this.id, dom.key, name);
    }
    /**
     * 清参数cache
     * @param module    模块
     * @param dom       虚拟dom
     */
    clearParam(module, dom) {
        module.objectManager.clearEventParam(this.id, dom.key);
    }
}

/**
 * 事件管理器
 */
class EventManager {
    /**
     * 绑定事件
     * @param module
     * @param dom
     */
    static bind(module, dom) {
        const eobj = module.eventFactory.getEvent(dom.key);
        if (!eobj) {
            return;
        }
        //判断并设置事件绑定标志
        const parent = dom.parent;
        for (let evt of eobj) {
            if (evt[0] === 'bindMap') {
                continue;
            }
            //代理事件
            if (evt[1].toDelg) {
                for (let i = 0; i < evt[1].toDelg.length; i++) {
                    let ev = evt[1].toDelg[i];
                    //事件添加到父dom
                    module.eventFactory.addEvent(parent.key, ev, dom.key);
                    module.eventFactory.bind(parent.key, evt[0], handler, ev.capture);
                }
            }
            //自己的事件
            if (evt[1].own) {
                // 保存handler
                module.eventFactory.bind(dom.key, evt[0], handler, evt[1].capture);
            }
        }
        /**
         * 事件handler
         * @param e  Event
         */
        function handler(e) {
            //从事件element获取事件
            let el = e.currentTarget;
            const dom = module.getVirtualDom(el['vdom']);
            const eobj = module.eventFactory.getEvent(dom.key);
            if (!dom || !eobj || !eobj.has(e.type)) {
                return;
            }
            const evts = eobj.get(e.type);
            if (evts.capture) { //先执行自己的事件
                doOwn(evts.own);
                doDelg(evts.delg);
            }
            else {
                if (!doDelg(evts.delg)) {
                    doOwn(evts.own);
                }
            }
            if (evts.own && evts.own.length === 0) {
                delete evts.own;
            }
            if (evts.delg && evts.delg.length === 0) {
                delete evts.delg;
            }
            /**
             * 处理自有事件
             * @param events
             * @returns
             */
            function doOwn(events) {
                if (!events) {
                    return;
                }
                let nopopo = false;
                for (let i = 0; i < events.length; i++) {
                    const ev = events[i];
                    if (typeof ev.handler === 'string') {
                        module.invokeMethod(ev.handler, dom.model, dom, ev, e);
                    }
                    else if (typeof ev.handler === 'function') {
                        ev.handler.apply(module, [dom.model, dom, ev, e]);
                    }
                    if (ev.once) { //移除事件
                        events.splice(i--, 1);
                    }
                    nopopo = ev.nopopo;
                }
                if (nopopo) {
                    e.stopPropagation();
                }
            }
            /**
             * 处理代理事件
             * @param events
             * @returns         是否禁止冒泡
             */
            function doDelg(events) {
                if (!events) {
                    return false;
                }
                let nopopo = false;
                for (let i = 0; i < events.length; i++) {
                    const evo = events[i];
                    const ev = evo.event;
                    for (let j = 0; j < e.path.length && e.path[j] !== el; j++) {
                        if (e.path[j]['vdom'] === evo.key) {
                            let dom1 = module.getVirtualDom(evo.key);
                            if (typeof ev.handler === 'string') {
                                module.invokeMethod(ev.handler, dom.model, dom, ev, e);
                            }
                            else if (typeof ev.handler === 'function') {
                                ev.handler.apply(module, [dom.model, dom, ev, e]);
                            }
                            nopopo = ev.nopopo;
                            if (ev.once) { //移除代理事件，需要从被代理元素删除
                                //从当前dom删除
                                events.splice(i--, 1);
                                //从被代理dom删除
                                module.eventFactory.removeEvent(dom1.key, ev, null, true);
                            }
                            break;
                        }
                    }
                }
                return nopopo;
            }
        }
    }
    /**
     * 处理外部事件
     * @param dom       dom节点
     * @param event     事件对象
     * @returns         如果有是外部事件，则返回true，否则返回false
     */
    static handleExtendEvent(module, dom, event) {
        let evts = this.get(event.name);
        if (!evts) {
            return false;
        }
        for (let key of Object.keys(evts)) {
            let ev = new NEvent(module, key, evts[key]);
            ev.capture = event.capture;
            ev.nopopo = event.nopopo;
            ev.delg = event.delg;
            ev.once = event.once;
            //设置依赖事件
            ev.dependEvent = event;
            module.eventFactory.addEvent(dom.key, ev);
        }
        return true;
    }
    /**
      * 注册扩展事件
      * @param eventName    事件名
      * @param handleObj    事件处理集
      */
    static regist(eventName, handleObj) {
        this.extendEventMap.set(eventName, handleObj);
    }
    /**
     * 取消注册扩展事件
     * @param eventName     事件名
     */
    static unregist(eventName) {
        return this.extendEventMap.delete(eventName);
    }
    /**
     * 获取扩展事件
     * @param eventName     事件名
     * @returns             事件处理集
     */
    static get(eventName) {
        return this.extendEventMap.get(eventName);
    }
}
/**
 * 外部事件集
 */
EventManager.extendEventMap = new Map();

/**
 * 渲染器
 */
class Renderer {
    /**
     * 添加到渲染列表
     * @param module 模块
     */
    static add(module) {
        //如果已经在列表中，不再添加
        if (!this.waitList.includes(module.id)) {
            //计算优先级
            this.waitList.push(module.id);
        }
    }
    /**
     * 从渲染队列移除
     * @param moduleId
     */
    static remove(moduleId) {
        let index;
        if ((index = this.waitList.indexOf(moduleId)) !== -1) {
            //不能破坏watiList顺序，用null替换
            this.waitList.splice(index, 1, null);
        }
    }
    /**
     * 队列渲染
     */
    static render() {
        for (; this.waitList.length > 0;) {
            let id = this.waitList[0];
            if (id) { //存在id为null情况，remove方法造成
                ModuleFactory.get(id).render();
            }
            //渲染后移除
            this.waitList.shift();
        }
    }
    /**
     * 渲染dom
     * @param module            模块
     * @param src               源dom
     * @param model             模型，如果src已经带有model，则此参数无效
     * @param parent            父dom
     * @param key               key 附加key，放在domkey的后面
     * @returns
     */
    static renderDom(module, src, model, parent, key) {
        let dst = {
            key: key ? src.key + '_' + key : src.key,
            vdom: src
        };
        module.saveVirtualDom(dst);
        if (src.tagName) {
            dst.tagName = src.tagName;
            dst.props = {};
        }
        else {
            dst.textContent = src.textContent;
        }
        //设置model
        model = src.model || model;
        //设置当前根root
        if (!parent) {
            this.currentModuleRoot = dst;
        }
        else {
            if (!model) {
                model = parent.model;
            }
            // 设置父对象
            dst.parent = parent;
        }
        // 默认根model
        if (!model) {
            model = module.model;
        }
        dst.model = model;
        dst.staticNum = src.staticNum;
        if (src.staticNum > 0) {
            src.staticNum--;
        }
        //先处理model指令
        if (src.directives && src.directives.length > 0 && src.directives[0].type.name === 'model') {
            src.directives[0].exec(module, dst);
        }
        if (dst.tagName) {
            if (!dst.notChange) {
                handleProps();
                //处理style，如果为style，则不处理assets和events
                if (!CssManager.handleStyleDom(module, src, Renderer.currentModuleRoot, src.getProp('scope') === 'this')) {
                    //assets
                    if (src.assets && src.assets.size > 0) {
                        for (let p of src.assets) {
                            dst[p[0]] = p[1];
                        }
                    }
                }
                if (!handleDirectives()) {
                    return null;
                }
            }
            //复制源dom事件到事件工厂
            if (src.events && !module.eventFactory.getEvent(dst.key)) {
                for (let evt of src.events) {
                    module.eventFactory.addEvent(dst.key, evt);
                }
            }
            // 子节点
            if (src.children && src.children.length > 0) {
                dst.children = [];
                for (let c of src.children) {
                    Renderer.renderDom(module, c, dst.model, dst, key ? key : null);
                }
            }
        }
        else if (!dst.notChange) {
            if (src.expressions) { //文本节点
                let value = '';
                src.expressions.forEach((v) => {
                    if (v instanceof Expression) { //处理表达式
                        let v1 = v.val(module, dst.model);
                        value += v1 !== undefined ? v1 : '';
                    }
                    else {
                        value += v;
                    }
                });
                dst.textContent = value;
                dst.staticNum = -1;
            }
            else {
                dst.textContent = src.textContent;
            }
        }
        //添加到dom tree
        if (parent) {
            parent.children.push(dst);
        }
        return dst;
        /**
         * 处理指令
         * @returns     true继续执行，false不执行后续渲染代码
         */
        function handleDirectives() {
            if (!src.directives || src.directives.length === 0) {
                return true;
            }
            dst.staticNum = -1;
            for (let d of src.directives) {
                //model指令不执行
                if (d.type.name === 'model') {
                    continue;
                }
                if (!d.exec(module, dst)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * 处理属性（带表达式）
         */
        function handleProps() {
            if (!src.props || src.props.size === 0) {
                return;
            }
            //因为存在大小写，所以用正则式进行匹配
            const styleReg = /^style$/i;
            const classReg = /^class$/i;
            let value;
            for (let k of src.props) {
                if (Array.isArray(k[1])) { //数组，需要合并
                    value = [];
                    for (let i = 0; i < k[1].length; i++) {
                        let a = k[1][i];
                        if (a instanceof Expression) {
                            value.push(a.val(module, dst.model));
                            dst.staticNum = -1;
                        }
                        else {
                            value.push(a);
                        }
                    }
                    if (styleReg.test(k[0])) {
                        value = src.getStyleString(value);
                    }
                    else if (classReg.test(k[0])) {
                        value = src.getClassString(value);
                    }
                }
                else if (k[1] instanceof Expression) {
                    value = k[1].val(module, dst.model);
                    dst.staticNum = -1;
                }
                else {
                    value = k[1];
                }
                dst.props[k[0]] = value;
            }
        }
    }
    /**
     * 渲染为html element
     * @param module 	        模块
     * @param src               渲染节点
     * @param parentEl 	        父html
     * @param isRenderChild     是否渲染子节点
     */
    static renderToHtml(module, src, parentEl, isRenderChild) {
        let el = module.getNode(src.key);
        if (el) { //html dom节点已存在
            if (src.tagName) {
                let attrs = el.attributes;
                let arr = [];
                for (let i = 0; i < attrs.length; i++) {
                    arr.push(attrs[i].name);
                }
                //设置属性
                for (let p of Object.keys(src.props)) {
                    el.setAttribute(p, src.props[p] === undefined ? '' : src.props[p]);
                    let ind;
                    if ((ind = arr.indexOf(p)) !== -1) {
                        arr.splice(ind, 1);
                    }
                }
                //清理多余attribute
                if (arr.length > 0) {
                    for (let a of arr) {
                        el.removeAttribute(a);
                    }
                }
                handleAssets(src, el);
            }
            else { //文本节点
                el.textContent = src.textContent;
            }
        }
        else {
            if (src.tagName) {
                el = newEl(src);
            }
            else {
                el = newText(src);
            }
            //先创建子节点，再添加到html dom树，避免频繁添加
            if (el && src.tagName && isRenderChild) {
                genSub(el, src);
            }
            if (el && parentEl) {
                parentEl.appendChild(el);
            }
        }
        return el;
        /**
         * 新建element节点
         * @param dom 		虚拟dom
         * @returns 		新的html element
         */
        function newEl(dom) {
            //style不处理
            if (dom.tagName.toLowerCase() === 'style') {
                return;
            }
            //创建element
            let el = document.createElement(dom.tagName);
            //保存虚拟dom
            el['vdom'] = dom.key;
            //把el引用与key关系存放到cache中
            module.saveNode(dom.key, el);
            //保存自定义key对应element
            if (dom.props['key']) {
                module.saveElement(dom.props['key'], el);
            }
            //子模块容器的处理由子模块处理
            if (!dom.subModuleId) {
                //设置属性
                for (let p of Object.keys(dom.props)) {
                    el.setAttribute(p, dom.props[p] === undefined ? '' : dom.props[p]);
                }
                //asset
                if (dom.assets) {
                    for (let p of Object.keys(dom.assets)) {
                        el[p] = dom.assets[p];
                    }
                }
                //处理event
                EventManager.bind(module, dom);
            }
            return el;
        }
        /**
         * 新建文本节点
         */
        function newText(dom) {
            //样式表处理，如果是样式表文本，则不添加到dom树
            if (CssManager.handleStyleTextDom(module, dom)) {
                return;
            }
            let node = document.createTextNode(dom.textContent || '');
            module.saveNode(dom.key, node);
            return node;
        }
        /**
         * 生成子节点
         * @param pEl 	父节点
         * @param vdom  虚拟dom节点
         */
        function genSub(pEl, vdom) {
            if (vdom.children && vdom.children.length > 0) {
                vdom.children.forEach(item => {
                    let el1;
                    if (item.tagName) {
                        el1 = newEl(item);
                        genSub(el1, item);
                    }
                    else {
                        el1 = newText(item);
                    }
                    if (el1) {
                        pEl.appendChild(el1);
                    }
                });
            }
        }
        /**
         * 处理assets
         */
        function handleAssets(dom, el) {
            //处理asset
            if (dom.assets) {
                for (let k of Object.keys(dom.assets)) {
                    el[k] = dom.assets[k];
                }
            }
        }
    }
    /**
     * 处理更改的dom节点
     * @param module        待处理模块
     * @param changeDoms    更改的dom参数数组
     */
    static handleChangedDoms(module, changeDoms) {
        for (let item of changeDoms) {
            let [n1, n2, pEl] = [
                item[1] ? module.getNode(item[1].key) : null,
                item[2] && typeof item[2] === 'object' ? module.getNode(item[2].key) : null,
                item[3] ? module.getNode(item[3].key) : null
            ];
            switch (item[0]) {
                case 1: //添加
                    //把新dom缓存添加到旧dom缓存
                    Renderer.renderToHtml(module, item[1], pEl, true);
                    n1 = module.getNode(item[1].key);
                    if (!n2) { //不存在添加节点或为索引号
                        if (typeof item[2] === 'number' && pEl.childNodes.length - 1 > item[2]) {
                            pEl.insertBefore(n1, pEl.childNodes[item[2]]);
                        }
                        else {
                            pEl.appendChild(n1);
                        }
                    }
                    else {
                        pEl.insertBefore(n1, n2);
                    }
                    break;
                case 2: //修改
                    Renderer.renderToHtml(module, item[1], null, false);
                    break;
                case 3: //删除
                    //从模块移除
                    module.freeNode(item[1]);
                    break;
                case 4: //移动
                    if (item[4]) { //相对节点后
                        if (n2 && n2.nextSibling) {
                            pEl.insertBefore(n1, n2.nextSibling);
                        }
                        else {
                            pEl.appendChild(n1);
                        }
                    }
                    else {
                        pEl.insertBefore(n1, n2);
                    }
                    break;
                default: //替换
                    n1 = Renderer.renderToHtml(module, item[1], null, true);
                    n2 = module.getNode(item[2].key);
                    if (pEl) {
                        pEl.replaceChild(n1, n2);
                    }
                    module.freeNode(item[2]);
            }
        }
    }
}
/**
 * 等待渲染列表（模块名）
 */
Renderer.waitList = [];

/**
 * 路由类
 */
class Route {
    /**
     *
     * @param config 路由配置项
     */
    constructor(config, parent) {
        /**
         * 路由参数名数组
         */
        this.params = [];
        /**
         * 路由参数数据
         */
        this.data = {};
        /**
         * 子路由
         */
        this.children = [];
        if (!config || Util.isEmpty(config.path)) {
            return;
        }
        this.id = Util.genId();
        //参数赋值
        for (let o of Object.keys(config)) {
            this[o] = config[o];
        }
        this.parent = parent;
        //解析路径
        if (this.path) {
            this.parse();
        }
        if (parent) {
            parent.addChild(this);
        }
        //子路由
        if (config.routes && Array.isArray(config.routes)) {
            config.routes.forEach((item) => {
                new Route(item, this);
            });
        }
    }
    /**
     * 添加子路由
     * @param child
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    /**
     * 通过路径解析路由对象
     */
    parse() {
        let pathArr = this.path.split('/');
        let node = this.parent;
        let param = [];
        let paramIndex = -1; //最后一个参数开始
        let prePath = ''; //前置路径
        for (let i = 0; i < pathArr.length; i++) {
            let v = pathArr[i].trim();
            if (v === '') {
                pathArr.splice(i--, 1);
                continue;
            }
            if (v.startsWith(':')) { //参数
                if (param.length === 0) {
                    paramIndex = i;
                }
                param.push(v.substring(1));
            }
            else {
                paramIndex = -1;
                param = []; //上级路由的参数清空
                this.path = v; //暂存path
                let j = 0;
                for (; j < node.children.length; j++) {
                    let r = node.children[j];
                    if (r.path === v) {
                        node = r;
                        break;
                    }
                }
                //没找到，创建新节点
                if (j === node.children.length) {
                    if (prePath !== '') {
                        new Route({ path: prePath }, node);
                        node = node.children[node.children.length - 1];
                    }
                    prePath = v;
                }
            }
            //不存在参数
            this.params = paramIndex === -1 ? [] : param;
        }
    }
    /**
     * 克隆
     * @returns 克隆对象
     */
    clone() {
        let r = new Route();
        Object.getOwnPropertyNames(this).forEach(item => {
            if (item === 'data') {
                return;
            }
            r[item] = this[item];
        });
        if (this.data) {
            r.data = Util.clone(this.data);
        }
        return r;
    }
}

/**
 * 模块状态类型
 */
var EModuleState;
(function (EModuleState) {
    /**
     * 初始化
     */
    EModuleState[EModuleState["INITED"] = 1] = "INITED";
    /**
     * 非激活(休眠态)
     */
    EModuleState[EModuleState["UNACTIVE"] = 2] = "UNACTIVE";
    /**
     * 未挂载到html dom
     */
    EModuleState[EModuleState["UNMOUNTED"] = 3] = "UNMOUNTED";
    /**
     * 已渲染到dom树
     */
    EModuleState[EModuleState["RENDERED"] = 4] = "RENDERED";
})(EModuleState || (EModuleState = {}));

/**
 * 路由管理类
 * @since 	1.0
 */
class Router {
    /**
     * 把路径加入跳转列表(准备跳往该路由)
     * @param path 	路径
     */
    static go(path) {
        //相同路径不加入
        if (path === this.currentPath) {
            return;
        }
        //添加路径到等待列表，已存在，不加入
        if (this.waitList.indexOf(path) === -1) {
            this.waitList.push(path);
        }
        //延迟加载，避免同一个路径多次加入
        setTimeout(() => {
            this.load();
        }, 0);
    }
    /**
     * 启动加载
     */
    static load() {
        //在加载，或无等待列表，则返回
        if (this.waitList.length === 0) {
            return;
        }
        let path = this.waitList.shift();
        this.start(path).then(() => {
            //继续加载
            this.load();
        });
    }
    /**
     * 切换路由
     * @param path 	路径
     */
    static start(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let diff = this.compare(this.currentPath, path);
            // 当前路由依赖的容器模块
            let parentModule;
            if (diff[0] === null) {
                parentModule = ModuleFactory.getMain();
            }
            else {
                parentModule = yield this.getModule(diff[0]);
            }
            //onleave事件，从末往前执行
            for (let i = diff[1].length - 1; i >= 0; i--) {
                const r = diff[1][i];
                if (!r.module) {
                    continue;
                }
                let module = yield this.getModule(r);
                if (Util.isFunction(this.onDefaultLeave)) {
                    this.onDefaultLeave(module.model);
                }
                if (Util.isFunction(r.onLeave)) {
                    r.onLeave(module.model);
                }
                // 清理map映射
                this.activeFieldMap.delete(module.id);
                //module置为不激活
                module.unactive();
            }
            if (diff[2].length === 0) { //路由相同，参数不同
                let route = diff[0];
                if (route !== null) {
                    let module = yield this.getModule(route);
                    // 模块处理
                    this.dependHandle(module, route, diff[3] ? diff[3].module : null);
                }
            }
            else { //路由不同
                //加载模块
                for (let ii = 0; ii < diff[2].length; ii++) {
                    let route = diff[2][ii];
                    //路由不存在或路由没有模块（空路由）
                    if (!route || !route.module) {
                        continue;
                    }
                    let module = yield this.getModule(route);
                    // 模块处理
                    this.dependHandle(module, route, parentModule);
                    //默认全局路由enter事件
                    if (Util.isFunction(this.onDefaultEnter)) {
                        this.onDefaultEnter(module.model);
                    }
                    //当前路由进入事件
                    if (Util.isFunction(route.onEnter)) {
                        route.onEnter(module.model);
                    }
                    parentModule = module;
                }
            }
            //如果是history popstate，则不加入history
            if (this.startStyle === 0) {
                let path1 = (Router.basePath || '') + path;
                //子路由，替换state
                if (path.startsWith(this.currentPath)) {
                    history.replaceState(path1, '', path1);
                }
                else { //路径push进history
                    history.pushState(path1, '', path1);
                }
            }
            //修改currentPath
            this.currentPath = path;
            //设置start类型为正常start
            this.startStyle = 0;
        });
    }
    /*
     * 重定向
     * @param path 	路径
     */
    static redirect(path) {
        this.go(path);
    }
    /**
     * 获取module
     * @param route 路由对象
     * @returns     路由对应模块
     */
    static getModule(route) {
        return __awaiter(this, void 0, void 0, function* () {
            let module = route.module;
            //已经是模块实例
            if (typeof module === 'object') {
                return module;
            }
            //非模块类，是加载函数
            if (!module.__proto__.name) {
                const m = yield module();
                //通过import的模块，查找模块类
                for (let k of Object.keys(m)) {
                    if (m[k].name) {
                        module = m[k];
                        break;
                    }
                }
            }
            //模块类
            if (typeof module === 'function') {
                module = ModuleFactory.get(module);
            }
            route.module = module;
            return module;
        });
    }
    /**
     * 比较两个路径对应的路由链
     * @param path1 	第一个路径
     * @param path2 	第二个路径
     * @returns 		数组 [父路由或不同参数的路由，第一个需要销毁的路由数组，第二个需要增加的路由数组，不同参数路由的父路由]
     */
    static compare(path1, path2) {
        // 获取路由id数组
        let arr1 = null;
        let arr2 = null;
        if (path1) {
            //采用克隆方式复制，避免被第二个路径返回的路由覆盖参数
            arr1 = this.getRouteList(path1, true);
        }
        if (path2) {
            arr2 = this.getRouteList(path2);
        }
        let len = 0;
        if (arr1 !== null) {
            len = arr1.length;
        }
        if (arr2 !== null) {
            if (arr2.length < len) {
                len = arr2.length;
            }
        }
        else {
            len = 0;
        }
        //需要销毁的旧路由数组
        let retArr1 = [];
        //需要加入的新路由数组
        let retArr2 = [];
        let i = 0;
        for (i = 0; i < len; i++) {
            //找到不同路由开始位置
            if (arr1[i].id === arr2[i].id) {
                //比较参数
                if (JSON.stringify(arr1[i].data) !== JSON.stringify(arr2[i].data)) {
                    i++;
                    break;
                }
            }
            else {
                break;
            }
        }
        //旧路由改变数组
        if (arr1 !== null) {
            retArr1 = arr1.slice(i);
        }
        //新路由改变数组（相对于旧路由）
        if (arr2 !== null) {
            retArr2 = arr2.slice(i);
        }
        //上一级路由或参数不同的当前路由
        let p1 = null;
        //上二级路由或参数不同路由的上一级路由
        let p2 = null;
        if (arr2 && i > 0) {
            // 可能存在空路由，需要向前遍历
            for (let j = i - 1; j >= 0; j--) {
                if (!p1) {
                    if (arr2[j].module) {
                        p1 = arr2[j];
                        continue;
                    }
                }
                else if (!p2) {
                    if (arr2[j].module) {
                        p2 = arr2[j];
                        break;
                    }
                }
            }
        }
        return [p1, retArr1, retArr2, p2];
    }
    /**
     * 添加激活字段
     * @param module    模块
     * @param path      路由路径
     * @param model     激活字段所在model
     * @param field     字段名
     */
    static addActiveField(module, path, model, field) {
        if (!model || !field) {
            return;
        }
        let arr = Router.activeFieldMap.get(module.id);
        if (!arr) { //尚未存在，新建
            Router.activeFieldMap.set(module.id, [{ path: path, model: model, field: field }]);
        }
        else if (arr.find(item => item.model === model && item.field === field) === undefined) { //不重复添加
            arr.push({ path: path, model: model, field: field });
        }
    }
    /**
     * 依赖模块相关处理
     * @param module 	模块
     * @param pm        依赖模块
     * @param path 		view对应的route路径
     */
    static dependHandle(module, route, pm) {
        const me = this;
        //深度激活
        module.active();
        //设置参数
        let o = {
            path: route.path
        };
        if (!Util.isEmpty(route.data)) {
            o['data'] = route.data;
        }
        module.model['$route'] = o;
        if (pm) {
            if (pm.state === EModuleState.RENDERED) { //被依赖模块处于渲染后状态
                module.setContainer(pm.getNode(Router.routerKeyMap.get(pm.id)));
                this.setDomActive(pm, route.fullPath);
            }
            else { //被依赖模块不处于被渲染后状态
                if (pm['onRender']) {
                    const foo = pm['onRender'];
                    pm['onRender'] = (model) => {
                        foo(model);
                        module.setContainer(pm.getNode(Router.routerKeyMap.get(pm.id)));
                        me.setDomActive(pm, route.fullPath);
                        //还原onRender方法
                        pm['onRender'] = foo;
                    };
                }
                else {
                    pm['onRender'] = (model) => {
                        module.setContainer(pm.getNode(Router.routerKeyMap.get(pm.id)));
                        me.setDomActive(pm, route.fullPath);
                        //只执行一次
                        delete pm['onRender'];
                    };
                }
            }
        }
    }
    /**
     * 设置路由元素激活属性
     * @param module    模块
     * @param path      路径
     * @returns
     */
    static setDomActive(module, path) {
        let arr = Router.activeFieldMap.get(module.id);
        if (!arr) {
            return;
        }
        for (let o of arr) {
            o.model[o.field] = o.path === path;
        }
    }
    /**
     * 获取路由数组
     * @param path 	要解析的路径
     * @param clone 是否clone，如果为false，则返回路由树的路由对象，否则返回克隆对象
     * @returns     路由对象数组
     */
    static getRouteList(path, clone) {
        if (!this.root) {
            return [];
        }
        let pathArr = path.split('/');
        let node = this.root;
        let paramIndex = 0; //参数索引
        let retArr = [];
        let fullPath = ''; //完整路径
        let preNode = this.root; //前一个节点
        for (let i = 0; i < pathArr.length; i++) {
            let v = pathArr[i].trim();
            if (v === '') {
                continue;
            }
            let find = false;
            for (let j = 0; j < node.children.length; j++) {
                if (node.children[j].path === v) {
                    //设置完整路径
                    if (preNode !== this.root) {
                        preNode.fullPath = fullPath;
                        preNode.data = node.data;
                        retArr.push(preNode);
                    }
                    //设置新的查找节点
                    node = clone ? node.children[j].clone() : node.children[j];
                    //参数清空
                    node.data = {};
                    preNode = node;
                    find = true;
                    //参数索引置0
                    paramIndex = 0;
                    break;
                }
            }
            //路径叠加
            fullPath += '/' + v;
            //不是孩子节点,作为参数
            if (!find) {
                if (paramIndex < node.params.length) { //超出参数长度的废弃
                    node.data[node.params[paramIndex++]] = v;
                }
            }
        }
        //最后一个节点
        if (node !== this.root) {
            node.fullPath = fullPath;
            retArr.push(node);
        }
        return retArr;
    }
}
/**
 * path等待链表
 */
Router.waitList = [];
/**
 * 启动方式 0:直接启动 1:popstate 启动
 */
Router.startStyle = 0;
/**
 * 激活Dom map，格式为{moduleId:[]}
 */
Router.activeFieldMap = new Map();
/**
 * 绑定到module的router指令对应的key，即router容器对应的key，格式为 {moduleId:routerKey,...}
 */
Router.routerKeyMap = new Map();
/**
 * 根路由
 */
Router.root = new Route();
//处理popstate事件
window.addEventListener('popstate', function (e) {
    //根据state切换module
    const state = history.state;
    if (!state) {
        return;
    }
    Router.startStyle = 1;
    Router.go(state);
});

/**
 * 调度器，用于每次空闲的待操作序列调度
 */
class Scheduler {
    static dispatch() {
        Scheduler.tasks.forEach((item) => {
            if (Util.isFunction(item.func)) {
                if (item.thiser) {
                    item.func.call(item.thiser);
                }
                else {
                    item.func();
                }
            }
        });
    }
    /**
     * 启动调度器
     * @param scheduleTick 	渲染间隔
     */
    static start(scheduleTick) {
        Scheduler.dispatch();
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(Scheduler.start);
        }
        else {
            window.setTimeout(Scheduler.start, scheduleTick || 50);
        }
    }
    /**
     * 添加任务
     * @param foo 		任务和this指向
     * @param thiser 	this指向
     */
    static addTask(foo, thiser) {
        if (!Util.isFunction(foo)) {
            throw new NError("invoke", "Scheduler.addTask", "0", "function");
        }
        Scheduler.tasks.push({ func: foo, thiser: thiser });
    }
    /**
     * 移除任务
     * @param foo 	任务
     */
    static removeTask(foo) {
        if (!Util.isFunction(foo)) {
            throw new NError("invoke", "Scheduler.removeTask", "0", "function");
        }
        let ind = -1;
        if ((ind = Scheduler.tasks.indexOf(foo)) !== -1) {
            Scheduler.tasks.splice(ind, 1);
        }
    }
}
Scheduler.tasks = [];

/**
 * nodom提示消息
 */
var NodomMessage;
/**
 * 新建一个App
 * @param clazz     模块类
 * @param el        el选择器
 */
function nodom(clazz, el) {
    //渲染器启动渲染
    Scheduler.addTask(Renderer.render, Renderer);
    //启动调度器
    Scheduler.start();
    NodomMessage = NodomMessage_en;
    let mdl = ModuleFactory.get(clazz);
    mdl.setContainer(document.querySelector(el));
    mdl.active();
}
/**
 * 暴露的创建路由方法
 * @param config  数组或单个配置
 */
function createRoute(config, parent) {
    let route;
    parent = parent || Router.root;
    if (Util.isArray(config)) {
        for (let item of config) {
            route = new Route(item, parent);
        }
    }
    else {
        route = new Route(config, parent);
    }
    return route;
}
/**
 * 创建指令
 * @param name      指令名
 * @param priority  优先级（1最小，1-10为框架保留优先级）
 * @param init      初始化方法
 * @param handler   渲染时方法
 */
function createDirective(name, handler, priority) {
    return DirectiveManager.addType(name, handler, priority);
}
/**
 * 注册模块
 * @param clazz     模块类
 * @param name      注册名，如果没有，则为类名
 */
function registModule(clazz, name) {
    ModuleFactory.addClass(clazz, name);
}
/**
 * ajax 请求
 * @param config    object 或 string
 *                  如果为string，则直接以get方式获取资源
 *                  object 项如下:
 *                  参数名|类型|默认值|必填|可选值|描述
 *                  -|-|-|-|-|-
 *                  url|string|无|是|无|请求url
 *					method|string|GET|否|GET,POST,HEAD|请求类型
 *					params|Object/FormData|{}|否|无|参数，json格式
 *					async|bool|true|否|true,false|是否异步
 *  				timeout|number|0|否|无|请求超时时间
 *                  type|string|text|否|json,text|
 *					withCredentials|bool|false|否|true,false|同源策略，跨域时cookie保存
 *                  header|Object|无|否|无|request header 对象
 *                  user|string|无|否|无|需要认证的请求对应的用户名
 *                  pwd|string|无|否|无|需要认证的请求对应的密码
 *                  rand|bool|无|否|无|请求随机数，设置则浏览器缓存失效
 */
function request(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            if (typeof config === 'string') {
                config = {
                    url: config
                };
            }
            config.params = config.params || {};
            //随机数
            if (config.rand) { //针对数据部分，仅在app中使用
                config.params.$rand = Math.random();
            }
            let url = config.url;
            const async = config.async === false ? false : true;
            const req = new XMLHttpRequest();
            //设置同源策略
            req.withCredentials = config.withCredentials;
            //类型默认为get
            const method = (config.method || 'GET').toUpperCase();
            //超时，同步时不能设置
            req.timeout = async ? config.timeout : 0;
            req.onload = () => {
                if (req.status === 200) {
                    let r = req.responseText;
                    if (config.type === 'json') {
                        try {
                            r = JSON.parse(r);
                        }
                        catch (e) {
                            reject({ type: "jsonparse" });
                        }
                    }
                    resolve(r);
                }
                else {
                    reject({ type: 'error', url: url });
                }
            };
            req.ontimeout = () => reject({ type: 'timeout' });
            req.onerror = () => reject({ type: 'error', url: url });
            //上传数据
            let data = null;
            switch (method) {
                case 'GET':
                    //参数
                    let pa;
                    if (Util.isObject(config.params)) {
                        let ar = [];
                        for (let k of Object.keys(config.params)) {
                            const v = config.params[k];
                            if (v === undefined || v === null) {
                                continue;
                            }
                            ar.push(k + '=' + v);
                        }
                        pa = ar.join('&');
                    }
                    if (pa !== undefined) {
                        if (url.indexOf('?') !== -1) {
                            url += '&' + pa;
                        }
                        else {
                            url += '?' + pa;
                        }
                    }
                    break;
                case 'POST':
                    if (config.params instanceof FormData) {
                        data = config.params;
                    }
                    else {
                        let fd = new FormData();
                        for (let k of Object.keys(config.params)) {
                            const v = config.params[k];
                            if (v === undefined || v === null) {
                                continue;
                            }
                            fd.append(k, v);
                        }
                        data = fd;
                    }
                    break;
            }
            req.open(method, url, async, config.user, config.pwd);
            //设置request header
            if (config.header) {
                Util.getOwnProps(config.header).forEach((item) => {
                    req.setRequestHeader(item, config.header[item]);
                });
            }
            req.send(data);
        }).catch((re) => {
            switch (re.type) {
                case "error":
                    throw new NError("notexist1", NodomMessage.TipWords['resource'], re.url);
                case "timeout":
                    throw new NError("timeout");
                case "jsonparse":
                    throw new NError("jsonparse");
            }
        });
    });
}

/**
 * 指令类
 */
class Directive {
    /**
     * 构造方法
     * @param type  	类型名
     * @param value 	指令值
     */
    constructor(type, value) {
        this.id = Util.genId();
        if (type) {
            this.type = DirectiveManager.getType(type);
            if (!this.type) {
                throw new NError('notexist1', NodomMessage.TipWords['directive'], type);
            }
        }
        if (Util.isString(value)) {
            this.value = value.trim();
        }
        else if (value instanceof Expression) {
            this.expression = value;
        }
        else {
            this.value = value;
        }
    }
    /**
     * 执行指令
     * @param module    模块
     * @param dom       渲染目标节点对象
     * @returns         true/false
     */
    exec(module, dom) {
        //禁用，不执行
        if (this.disabled) {
            return true;
        }
        if (this.expression) {
            this.value = this.expression.val(module, dom.model);
        }
        return this.type.handle.apply(this, [module, dom]);
    }
    /**
     * 克隆
     */
    clone() {
        let d = new Directive();
        d.type = this.type;
        d.expression = this.expression;
        d.value = this.value;
        return d;
    }
}

/**
 * 虚拟dom
 */
class VirtualDom {
    /**
     * @param tag       标签名
     * @param key       key
     */
    constructor(tag, key, module) {
        /**
         * staticNum 静态标识数
         *  0 表示静态，不进行比较
         *  > 0 每次比较后-1
         *  < 0 不处理
         */
        this.staticNum = 0;
        /**
         * 对应的所有表达式的字段都属于dom model内
         */
        this.allModelField = true;
        this.key = key || ((module ? module.getDomKeyId() : Util.genId()) + '');
        if (tag) {
            this.tagName = tag;
        }
    }
    /**
     * 移除多个指令
     * @param directives 	待删除的指令类型数组或指令类型
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirectives(directives) {
        if (!this.directives) {
            return;
        }
        //数组
        directives.forEach(d => {
            this.removeDirective(d);
        });
    }
    /**
     * 移除指令
     * @param directive 	待删除的指令类型名
     * @returns             如果虚拟dom上的指令集为空，则返回void
     */
    removeDirective(directive) {
        if (!this.directives) {
            return;
        }
        let ind;
        if ((ind = this.directives.findIndex(item => item.type.name === directive)) !== -1) {
            this.directives.splice(ind, 1);
        }
        if (this.directives.length === 0) {
            delete this.directives;
        }
    }
    /**
     * 添加指令
     * @param directive     指令对象
     * @param sort          是否排序
     * @returns             如果虚拟dom上的指令集不为空，且指令集中已经存在传入的指令对象，则返回void
     */
    addDirective(directive, sort) {
        if (!this.directives) {
            this.directives = [];
        }
        else if (this.directives.find(item => item.type.name === directive.type.name)) {
            return;
        }
        this.directives.push(directive);
        //指令按优先级排序
        if (sort) {
            this.sortDirective();
        }
    }
    /**
     * 指令排序
     * @returns           如果虚拟dom上指令集为空，则返回void
     */
    sortDirective() {
        if (!this.directives) {
            return;
        }
        if (this.directives.length > 1) {
            this.directives.sort((a, b) => {
                return DirectiveManager.getType(a.type.name).prio < DirectiveManager.getType(b.type.name).prio ? -1 : 1;
            });
        }
    }
    /**
     * 是否有某个类型的指令
     * @param typeName 	    指令类型名
     * @returns             如果指令集不为空，且含有传入的指令类型名则返回true，否则返回false
     */
    hasDirective(typeName) {
        return this.directives && this.directives.findIndex(item => item.type.name === typeName) !== -1;
    }
    /**
     * 获取某个类型的指令
     * @param module            模块
     * @param directiveType 	指令类型名
     * @returns                 如果指令集为空，则返回void；否则返回指令类型名等于传入参数的指令对象
     */
    getDirective(directiveType) {
        if (!this.directives) {
            return;
        }
        return this.directives.find(item => item.type.name === directiveType);
    }
    /**
     * 添加子节点
     * @param dom       子节点
     * @param index     指定位置，如果不传此参数，则添加到最后
     */
    add(dom, index) {
        if (!this.children) {
            this.children = [];
        }
        if (index) {
            this.children.splice(index, 0, dom);
        }
        else {
            this.children.push(dom);
        }
        dom.parent = this;
    }
    /**
     * 移除子节点
     * @param dom   子节点
     */
    remove(dom) {
        let index = this.children.indexOf(dom);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
    /**
     * 添加css class
     * @param cls class名或表达式,可以多个，以“空格”分割
     */
    addClass(cls) {
        this.addProp('class', cls);
        //需要从remove class map 移除
        if (this.removedClassMap && this.removedClassMap.size > 0) {
            let arr = cls.trim().split(/\s+/);
            for (let a of arr) {
                if (a === '') {
                    continue;
                }
                this.removedClassMap.delete(a);
            }
        }
    }
    /**
     * 删除css class，因为涉及到表达式，此处只记录删除标识
     * @param cls class名,可以多个，以“空格”分割
     */
    removeClass(cls) {
        let pv = this.getProp('class');
        if (!pv) {
            return;
        }
        if (!this.removedClassMap) {
            this.removedClassMap = new Map();
        }
        let arr = cls.trim().split(/\s+/);
        for (let a of arr) {
            if (a === '') {
                continue;
            }
            this.removedClassMap.set(a, true);
        }
        this.setStaticOnce();
    }
    /**
     * 获取class串
     * @returns class 串
     */
    getClassString(values) {
        let clsArr = [];
        for (let pv of values) {
            let arr = pv.trim().split(/\s+/);
            for (let a of arr) {
                if (!this.removedClassMap || !this.removedClassMap.has(a)) {
                    if (!clsArr.includes(a)) {
                        clsArr.push(a);
                    }
                }
            }
        }
        if (clsArr.length > 0) {
            return clsArr.join(' ');
        }
    }
    /**
     * 添加style
     *  @param style style字符串或表达式
     */
    addStyle(style) {
        this.addProp('style', style);
        if (typeof style === 'string') {
            //需要从remove class map 移除
            if (this.removedStyleMap && this.removedStyleMap.size > 0) {
                let arr = style.trim().split(/\s*;\s*/);
                for (let a of arr) {
                    if (a === '') {
                        continue;
                    }
                    let sa1 = a.split(/\s*:\s*/);
                    let p = sa1[0].trim();
                    if (p !== '') {
                        this.removedClassMap.delete(sa1[0].trim());
                    }
                }
            }
        }
    }
    /**
     * 删除style
     * @param styleStr style字符串，多个style以空格' '分割
     */
    removeStyle(styleStr) {
        if (!this.removedClassMap) {
            this.removedClassMap = new Map();
        }
        let arr = styleStr.trim().split(/\s+/);
        for (let a of arr) {
            if (a === '') {
                continue;
            }
            this.removedClassMap.set(a, true);
        }
        this.setStaticOnce();
    }
    /**
     * 获取style串
     * @returns style 串
     */
    getStyleString(values) {
        let map = new Map();
        for (let pv of values) {
            let sa = pv.trim().split(/\s*;\s*/);
            for (let s of sa) {
                if (s === '') {
                    continue;
                }
                let sa1 = s.split(/\s*:\s*/);
                //不在移除style map才能加入
                if (!this.removedStyleMap || !this.removedStyleMap.has(sa1[0])) {
                    map.set(sa1[0], sa1[1]);
                }
            }
        }
        if (map.size > 0) {
            return [...map].map(item => item.join(':')).join(';');
        }
    }
    /**
     * 是否拥有属性
     * @param propName  属性名
     * @param isExpr    是否只检查表达式属性
     * @returns         如果属性集含有传入的属性名返回true，否则返回false
     */
    hasProp(propName) {
        if (this.props) {
            return this.props.has(propName);
        }
    }
    /**
     * 获取属性值
     * @param propName  属性名
     * @param isExpr    是否只获取表达式属性
     * @returns         传入属性名的value
     */
    getProp(propName, isExpr) {
        if (this.props) {
            return this.props.get(propName);
        }
    }
    /**
     * 设置属性值
     * @param propName  属性名
     * @param v         属性值
     */
    setProp(propName, v) {
        if (!this.props) {
            this.props = new Map();
        }
        if (propName === 'style') {
            if (this.removedStyleMap) { //清空removedStyleMap
                this.removedStyleMap.clear();
            }
        }
        else if (propName === 'class') {
            if (this.removedClassMap) { //清空removedClassMap
                this.removedClassMap.clear();
            }
        }
        this.props.set(propName, v);
    }
    /**
     * 添加属性，如果原来的值存在，则属性值变成数组
     * @param pName     属性名
     * @param pValue    属性值
     */
    addProp(pName, pValue) {
        let pv = this.getProp(pName);
        if (!pv) {
            this.setProp(pName, pValue);
        }
        else if (Array.isArray(pv)) {
            if (pv.includes(pValue)) {
                return false;
            }
            pv.push(pValue);
        }
        else if (pv !== pValue) {
            this.setProp(pName, [pv, pValue]);
        }
        else {
            return false;
        }
        this.setStaticOnce();
        return true;
    }
    /**
     * 删除属性
     * @param props     属性名或属性名数组
     * @returns         如果虚拟dom上的属性集为空，则返回void
     */
    delProp(props) {
        if (!this.props) {
            return;
        }
        if (Util.isArray(props)) {
            for (let p of props) {
                this.props.delete(p);
            }
        }
        else {
            this.props.delete(props);
        }
        //设置静态标志，至少要比较一次
        this.setStaticOnce();
    }
    /**
     * 设置asset
     * @param assetName     asset name
     * @param value         asset value
     */
    setAsset(assetName, value) {
        if (!this.assets) {
            this.assets = new Map();
        }
        this.assets.set(assetName, value);
    }
    /**
     * 删除asset
     * @param assetName     asset name
     * @returns             如果虚拟dom上的直接属性集为空，则返回void
     */
    delAsset(assetName) {
        if (!this.assets) {
            return;
        }
        this.assets.delete(assetName);
    }
    /**
     * 获取html dom
     * @param module    模块
     * @returns         对应的html dom
     */
    getEl(module) {
        return module.getNode(this.key);
    }
    /**
     * 查找子孙节点
     * @param key 	element key
     * @returns		虚拟dom/undefined
     */
    query(key) {
        if (this.key === key) {
            return this;
        }
        if (this.children) {
            for (let i = 0; i < this.children.length; i++) {
                let dom = this.children[i].query(key);
                if (dom) {
                    return dom;
                }
            }
        }
    }
    /**
     * 设置cache参数
     * @param module    模块
     * @param name      参数名
     * @param value     参数值
     */
    setParam(module, name, value) {
        module.objectManager.setDomParam(this.key, name, value);
    }
    /**
     * 获取参数值
     * @param module    模块
     * @param name      参数名
     * @returns         参数值
     */
    getParam(module, name) {
        return module.objectManager.getDomParam(this.key, name);
    }
    /**
     * 移除参数
     * @param module    模块
     * @param name      参数名
     */
    removeParam(module, name) {
        module.objectManager.removeDomParam(this.key, name);
    }
    /**
     * 设置单次静态标志
     */
    setStaticOnce() {
        if (this.staticNum !== -1) {
            this.staticNum = 1;
        }
    }
    /**
     * 克隆
     */
    clone() {
        let dst = new VirtualDom(this.tagName, this.key);
        if (this.tagName) {
            //属性
            if (this.props && this.props.size > 0) {
                for (let p of this.props) {
                    dst.setProp(p[0], p[1]);
                }
            }
            if (this.assets && this.assets.size > 0) {
                for (let p of this.assets) {
                    dst.setAsset(p[0], p[1]);
                }
            }
            if (this.directives && this.directives.length > 0) {
                dst.directives = [];
                for (let d of this.directives) {
                    dst.directives.push(d.clone());
                }
            }
            //复制事件
            dst.events = this.events;
            //子节点clone
            if (this.children) {
                for (let c of this.children) {
                    dst.add(c.clone());
                }
            }
        }
        else {
            dst.expressions = this.expressions;
            dst.textContent = this.textContent;
        }
        dst.staticNum = this.staticNum;
        return dst;
    }
    /**
     * 保存事件
     * @param key       dom key
     * @param event     事件对象
     */
    addEvent(event) {
        if (!this.events) {
            this.events = [];
        }
        this.events.push(event);
    }
}

class Compiler {
    /**
     * 构造器
     * @param module
     */
    constructor(module) {
        this.module = module;
    }
    /**
    * 编译
    * @param elementStr     待编译html串
    * @returns              虚拟dom
    */
    compile(elementStr) {
        return this.compileTemplate(elementStr);
    }
    /**
     * 编译模版串
     * @param srcStr    源串
     * @returns
     */
    compileTemplate(srcStr) {
        const me = this;
        // 清理comment
        srcStr = srcStr.replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '');
        // 正则式分解标签和属性
        // const regWhole = /((?<!\\)'[\s\S]*?(?<!\\)')|((?<!\\)"[\s\S]*?(?<!\\)")|((?<!\\)`[\s\S]*?(?<!\\)`)|({{{*)|(}*}})|([\w$-]+(\s*=)?)|(<\s*[a-zA-Z][a-zA-Z0-9-_]*)|(\/?>)|(<\/\s*[a-zA-Z][a-zA-Z0-9-_]*>)/g;
        const regWhole = /('[\s\S]*?')|("[\s\S]*?")|(`[\s\S]*?`)|({{{*)|(}*}})|([\w$-]+(\s*=)?)|(<\s*[a-zA-Z][a-zA-Z0-9-_]*)|(\/?>)|(<\/\s*[a-zA-Z][a-zA-Z0-9-_]*>)/g;
        //属性名正则式
        const propReg = /^[a-zA-Z_$][$-\w]*?\s*?=?$/;
        //不可见字符正则式
        const regSpace = /^[\s\n\r\t\v]+$/;
        //dom数组
        let domArr = [];
        //已闭合的tag，与domArr对应
        let closedTag = [];
        //文本开始index
        let txtStartIndex = 0;
        //属性值
        let propName;
        //pre标签标志
        let isPreTag = false;
        //当前标签名
        let tagName;
        //表达式开始index
        let exprStartIndex = 0;
        //表达式计数器
        let exprCount = 0;
        //当前dom节点
        let dom;
        //正则式匹配结果
        let result;
        while ((result = regWhole.exec(srcStr)) !== null) {
            let re = result[0];
            if (re.startsWith('{{')) { //表达式开始符号
                //整除2个数
                if (exprCount === 0) { //表达式开始
                    exprStartIndex = result.index;
                }
                exprCount += re.length / 2 | 0;
            }
            else if (re.endsWith('}}')) { //表达式结束
                exprCount -= re.length / 2 | 0;
                if (exprCount === 0) {
                    handleExpr();
                }
            }
            //不在表达式中
            if (exprCount === 0) {
                if (re[0] === '<') { //标签
                    //处理文本
                    handleText(srcStr.substring(txtStartIndex, result.index));
                    if (re[1] === '/') { //标签结束
                        finishTag(re);
                    }
                    else { //标签开始
                        tagName = re.substring(1).trim().toLowerCase();
                        txtStartIndex = undefined;
                        isPreTag = (tagName === 'pre');
                        //新建dom节点
                        dom = new VirtualDom(tagName, this.genKey());
                        //第一个dom为root
                        if (!me.root) {
                            me.root = dom;
                        }
                        domArr.push(dom);
                        closedTag.push(false);
                    }
                }
                else if (re === '>') { //标签头结束
                    finishTagHead();
                }
                else if (re === '/>') { //标签结束
                    finishTag();
                }
                else if (dom && dom.tagName) { //属性
                    if (propReg.test(re)) {
                        if (propName) { //propName=无值 情况，当无值处理
                            handleProp();
                        }
                        if (re.endsWith('=')) { //属性带=，表示后续可能有值
                            propName = re.substring(0, re.length - 1).trim();
                        }
                        else { //只有属性，无属性值
                            propName = re;
                            handleProp();
                        }
                    }
                    else if (propName) { //属性值
                        handleProp(re);
                    }
                }
            }
        }
        //异常情况
        if (domArr.length > 1 || exprCount !== 0) {
            throw new NError('wrongTemplate');
        }
        return domArr[0];
        /**
         * 标签结束
         * @param ftag      结束标签
         */
        function finishTag(ftag) {
            if (ftag) {
                let finded = false;
                const tag = ftag.substring(2, ftag.length - 1).trim().toLowerCase();
                //反向查找
                for (let i = domArr.length - 1; i >= 0; i--) {
                    if (!closedTag[i] && domArr[i].tagName === tag) {
                        domArr[i].children = domArr.slice(i + 1);
                        //设置parent
                        for (let d of domArr[i].children) {
                            d.parent = domArr[i];
                            extraHandle(d);
                        }
                        //删除后续节点
                        domArr.splice(i + 1);
                        //标注该节点已闭合
                        closedTag.splice(i + 1);
                        finded = true;
                        break;
                    }
                }
                if (!finded) {
                    throw new NError('wrongTemplate');
                }
            }
            //设置标签关闭
            let ele = domArr[domArr.length - 1];
            if (ele === me.root) {
                extraHandle(ele);
            }
            closedTag[closedTag.length - 1] = true;
            dom = undefined;
            propName = undefined;
            txtStartIndex = regWhole.lastIndex;
            exprCount = 0;
            exprStartIndex = 0;
            // ele.allModelField = allModelField;    
        }
        /**
         * 特殊处理
         * @param dom   待处理节点
         */
        function extraHandle(dom) {
            //文本不处理
            if (!dom.tagName) {
                return;
            }
            me.postHandleNode(dom);
            dom.sortDirective();
            me.handleSlot(dom);
        }
        /**
         * 标签头结束
         */
        function finishTagHead() {
            if (dom) {
                txtStartIndex = regWhole.lastIndex;
            }
            dom = undefined;
            propName = undefined;
            exprCount = 0;
            exprStartIndex = 0;
        }
        /**
         * 处理属性
         * @param value     属性值
         */
        function handleProp(value) {
            if (!dom || !propName) {
                return;
            }
            if (value) {
                //去掉字符串两端
                if (['"', "'", '`'].includes(value[0]) && ['"', "'", '`'].includes(value[value.length - 1])) {
                    value = value.substring(1, value.length - 1).trim();
                }
            }
            //指令
            if (propName.startsWith("x-")) {
                //不排序
                dom.addDirective(new Directive(propName.substring(2), value));
            }
            else if (propName.startsWith("e-")) { //事件
                dom.addEvent(new NEvent(me.module, propName.substring(2), value));
            }
            else { //普通属性
                dom.setProp(propName, value);
            }
            propName = undefined;
        }
        /**
         * 处理表达式
         */
        function handleExpr() {
            //处理表达式前的文本
            if (txtStartIndex > 0 && exprStartIndex > txtStartIndex) {
                handleText(srcStr.substring(txtStartIndex, exprStartIndex));
            }
            const s = srcStr.substring(exprStartIndex + 2, regWhole.lastIndex - 2);
            exprCount = 0;
            exprStartIndex = 0;
            //新建表达式
            let expr = new Expression(s);
            if (dom && dom.tagName) { //标签
                handleProp(expr);
            }
            else { //文本节点
                setTxtDom(expr);
                //文本节点，移动txt节点开始位置
                txtStartIndex = regWhole.lastIndex;
            }
            //设置所有字段都在model内标识
            dom.allModelField = expr.allModelField;
        }
        /**
         * 处理txt为文本节点
         * @param txt 文本串
         */
        function handleText(txt) {
            if (txt === '' || !isPreTag && regSpace.test(txt)) { //非pre 标签且全为不可见字符，不处理
                return;
            }
            txt = me.preHandleText(txt);
            setTxtDom(txt);
        }
        /**
         * 新建文本节点
         * @param txt   文本串
         */
        function setTxtDom(txt) {
            if (!dom) {
                dom = new VirtualDom(null, me.genKey());
                domArr.push(dom);
                closedTag.push(false);
            }
            if (dom.expressions) {
                dom.expressions.push(txt);
            }
            else {
                if (typeof txt === 'string') { //字符串
                    dom.textContent = txt;
                }
                else { //表达式
                    if (dom.textContent) { //之前的文本进数组
                        dom.expressions = [dom.textContent, txt];
                        delete dom.textContent;
                    }
                    else {
                        dom.expressions = [txt];
                    }
                }
            }
        }
    }
    /**
     * 处理模块子节点为slot节点
     * @param dom   dom节点
     */
    handleSlot(dom) {
        if (!dom.children || dom.children.length === 0 || !dom.hasDirective('module')) {
            return;
        }
        let slotCt;
        for (let j = 0; j < dom.children.length; j++) {
            let c = dom.children[j];
            if (c.hasDirective('slot')) { //带slot的不处理
                continue;
            }
            if (!slotCt) { //第一个直接被slotCt替换
                slotCt = new VirtualDom('div', this.genKey());
                slotCt.addDirective(new Directive('slot', null));
                //当前位置，用slot替代
                dom.children.splice(j, 1, slotCt);
            }
            else {
                //直接删除
                dom.children.splice(j--, 1);
            }
            slotCt.add(c);
        }
    }
    /**
     * 后置处理
     * 包括：模块类元素、自定义元素
     * @param node  虚拟dom节点
     */
    postHandleNode(node) {
        // 自定义元素判断
        let clazz = DefineElementManager.get(node.tagName);
        if (clazz) { //自定义元素
            Reflect.construct(clazz, [node, this.module]);
        }
        // 模块类判断
        if (ModuleFactory.hasClass(node.tagName)) {
            const dir = new Directive('module', node.tagName);
            dir.params = { srcId: this.module.id };
            node.addDirective(dir);
            node.tagName = 'div';
        }
    }
    /**
     * 预处理html保留字符 如 &nbsp;,&lt;等
     * @param str   待处理的字符串
     * @returns     解析之后的串
     */
    preHandleText(str) {
        let reg = /&[a-z]+;/;
        if (reg.test(str)) {
            let div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent;
        }
        return str;
    }
    /**
     * 产生dom key
     * @returns   dom key
     */
    genKey() {
        return this.module.getDomKeyId() + '';
    }
}

/**
 * 比较器
 */
class DiffTool {
    /**
     * 比较节点
     * @param src           待比较节点（新树节点）
     * @param dst 	        被比较节点 (旧树节点)
     * @param changeArr     增删改的节点数组
     * @returns	            [[type(add 1, upd 2,del 3,move 4 ,rep 5),dom(操作节点),dom1(被替换或修改节点),parent(父节点),loc(位置)]]
     */
    static compare(src, dst, changeArr) {
        if (!src.tagName) { //文本节点
            if (!dst.tagName) {
                if ((src.staticNum || dst.staticNum) && src.textContent !== dst.textContent) {
                    addChange(2, src, null, dst.parent);
                }
            }
            else { //节点类型不同
                addChange(5, src, null, dst.parent);
            }
        }
        else {
            //相同子模块节点不比较
            if (src.subModuleId && src.subModuleId === dst.subModuleId) {
                return;
            }
            //element节点
            if (src.tagName !== dst.tagName) { //节点类型不同
                addChange(5, src, null, dst.parent);
            }
            else if (src.staticNum || dst.staticNum) { //节点类型相同，但有一个不是静态节点，进行属性和asset比较
                let change = false;
                for (let p of ['props', 'assets']) {
                    //属性比较
                    if (!src[p] && dst[p] || src[p] && !dst[p]) {
                        change = true;
                    }
                    else if (src[p] && dst[p]) {
                        let keys = Object.keys(src[p]);
                        let keys1 = Object.keys(dst[p]);
                        if (keys.length !== keys1.length) {
                            change = true;
                        }
                        else {
                            for (let k of keys) {
                                if (src[p][k] !== dst[p][k]) {
                                    change = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (change) {
                    addChange(2, src, null, dst.parent);
                }
            }
        }
        if (src.staticNum > 0) {
            src.staticNum--;
        }
        //子节点处理
        if (!src.children || src.children.length === 0) {
            // 旧节点的子节点全部删除
            if (dst.children && dst.children.length > 0) {
                dst.children.forEach(item => addChange(3, item, null, dst));
            }
        }
        else {
            //全部新加节点
            if (!dst.children || dst.children.length === 0) {
                src.children.forEach(item => addChange(1, item, null, dst));
            }
            else { //都有子节点
                //存储比较后需要add的key
                let addObj = {};
                //子节点对比策略
                let [oldStartIdx, oldStartNode, oldEndIdx, oldEndNode] = [0, dst.children[0], dst.children.length - 1, dst.children[dst.children.length - 1]];
                let [newStartIdx, newStartNode, newEndIdx, newEndNode] = [0, src.children[0], src.children.length - 1, src.children[src.children.length - 1]];
                while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                    if (sameKey(oldStartNode, newStartNode)) {
                        DiffTool.compare(newStartNode, oldStartNode, changeArr);
                        newStartNode = src.children[++newStartIdx];
                        oldStartNode = dst.children[++oldStartIdx];
                    }
                    else if (sameKey(oldEndNode, newEndNode)) {
                        DiffTool.compare(newEndNode, oldEndNode, changeArr);
                        newEndNode = src.children[--newEndIdx];
                        oldEndNode = dst.children[--oldEndIdx];
                    }
                    else if (sameKey(newStartNode, oldEndNode)) {
                        //新前旧后
                        DiffTool.compare(newStartNode, oldEndNode, changeArr);
                        //跳过插入点会提前移动的节点
                        while (addObj.hasOwnProperty(oldStartNode.key)) {
                            changeArr[addObj[oldStartNode.key]][0] = 4;
                            delete addObj[oldStartNode.key];
                            oldStartNode = dst.children[++oldStartIdx];
                        }
                        //接在待操作老节点前面
                        addChange(4, oldEndNode, oldStartNode, dst);
                        newStartNode = src.children[++newStartIdx];
                        oldEndNode = dst.children[--oldEndIdx];
                    }
                    else if (sameKey(newEndNode, oldStartNode)) {
                        DiffTool.compare(newEndNode, oldStartNode, changeArr);
                        //跳过插入点会提前移动的节点
                        while (addObj.hasOwnProperty(oldEndNode.key)) {
                            changeArr[addObj[oldEndNode.key]][0] = 4;
                            delete addObj[oldEndNode.key];
                            oldEndNode = dst.children[--oldEndIdx];
                        }
                        //接在 oldEndIdx 之后，但是再下一个节点可能移动位置，所以记录oldEndIdx节点
                        addChange(4, oldStartNode, oldEndNode, dst, 1);
                        newEndNode = src.children[--newEndIdx];
                        oldStartNode = dst.children[++oldStartIdx];
                    }
                    else {
                        //跳过插入点会提前移动的节点
                        if (addObj.hasOwnProperty(oldStartNode.key)) {
                            while (addObj.hasOwnProperty(oldStartNode.key)) {
                                changeArr[addObj[oldStartNode.key]][0] = 4;
                                delete addObj[oldStartNode.key];
                                oldStartNode = dst.children[++oldStartIdx];
                            }
                            continue; //继续diff，暂不add
                        }
                        //加入到addObj
                        addObj[newStartNode.key] = addChange(1, newStartNode, oldStartNode, dst) - 1;
                        newStartNode = src.children[++newStartIdx];
                    }
                }
                //有新增或删除节点
                if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
                    if (oldStartIdx > oldEndIdx) {
                        //没有老节点
                        for (let i = newStartIdx; i <= newEndIdx; i++) {
                            // 添加到dst.children[i]前面
                            addChange(1, src.children[i], i, dst);
                        }
                    }
                    else {
                        //有老节点，需要删除
                        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                            let ch = dst.children[i];
                            //如果要删除的节点在addArr中，则表示move，否则表示删除
                            if (!addObj.hasOwnProperty(ch.key)) {
                                addChange(3, ch, null, dst);
                            }
                            else {
                                changeArr[addObj[ch.key]][0] = 4;
                            }
                        }
                    }
                }
            }
        }
        /**
         * 是否有相同key
         * @param src   源节点
         * @param dst   目标节点
         * @returns     相同key为true，否则为false
         */
        function sameKey(src, dst) {
            return src.key === dst.key;
        }
        /**
         * 添加刪除替換
        * @param type       类型 add 1, upd 2,del 3,move 4 ,rep 5
        * @param dom        虚拟节点
        * @param dom1       相对节点
        * @param parent     父节点
        * @param extra      move时 0:相对节点前，1:相对节点后
        */
        function addChange(type, dom, dom1, parent, loc) {
            return changeArr.push([type, dom, dom1, parent, loc]);
        }
    }
}

/**
 * 自定义元素
 * 用于扩充定义，主要对ast obj进行前置处理
 */
class DefineElement {
    /**
     * 构造器，在dom编译后执行
     * @param node
     * @param module
     */
    constructor(node) {
        if (node.hasProp('tag')) {
            node.tagName = node.getProp('tag');
            node.delProp('tag');
        }
        else {
            node.tagName = 'div';
        }
    }
}

/**
 * 事件工厂
 * 每个模块一个事件工厂，用于管理模块内虚拟dom对应的事件对象
 */
class EventFactory {
    /**
     * 构造器
     * @param module 模块
     */
    constructor(module) {
        this.module = module;
        this.eventMap = new Map();
    }
    /**
     * 保存事件
     * @param key       dom key
     * @param event     事件对象
     * @param key1      当key1存在时，表示代理子dom事件
     */
    addEvent(key, event, key1) {
        let eobj;
        if (!this.eventMap.has(key)) {
            this.eventMap.set(key, new Map());
        }
        eobj = this.eventMap.get(key);
        if (!eobj.has(event.name)) {
            eobj.set(event.name, {});
        }
        let obj = eobj.get(event.name);
        if (key1) { //代理事件
            if (!obj.delg) {
                obj.delg = [{ key: key1, event: event }];
            }
            else {
                let arr = obj.delg;
                //事件不重复添加
                if (!arr.find(item => item.key === key1 && item.event === event)) {
                    arr.push({ key: key1, event: event });
                }
            }
        }
        else {
            if (event.delg) { //需要被代理的对象
                if (!obj.toDelg) {
                    obj.toDelg = [event];
                }
                else {
                    let arr = obj.toDelg;
                    //事件不重复添加
                    if (arr.findIndex(item => item === event) === -1) {
                        arr.push(event);
                    }
                }
            }
            else {
                if (!obj.own) {
                    obj.own = [event];
                }
                else {
                    let arr = obj.own;
                    //事件不重复添加
                    if (arr.findIndex(item => item === event) === -1) {
                        arr.push(event);
                    }
                }
            }
            // 设置事件capture
            obj.capture = event.capture;
        }
    }
    /**
     * 获取事件对象
     * @param key   dom key
     * @returns     事件对象
     */
    getEvent(key) {
        return this.eventMap.get(key);
    }
    /**
     * 删除事件
     * @param event     事件对象
     * @param key       对应dom keys
     * @param key1      被代理的dom key
     * @param toDelg    从待代理的数组移除（针对虚拟dom自己）
     */
    removeEvent(key, event, key1, toDelg) {
        if (!this.eventMap.has(key)) {
            return;
        }
        let eobj = this.eventMap.get(key);
        if (!eobj.has(event.name)) {
            return;
        }
        let obj = eobj.get(event.name);
        if (key1) { //代理事件
            if (!obj.delg) {
                return;
            }
            else {
                let index = obj.delg.findIndex(item => item.key === key1 && item.event === event);
                if (index !== -1) {
                    obj.delg.splice(index, 1);
                    if (obj.delg.length === 0) {
                        delete obj.delg;
                    }
                }
            }
        }
        else if (toDelg && obj.toDelg) {
            let index = obj.toDelg.findIndex(item => item === event);
            if (index !== -1) {
                obj.toDelg.splice(index, 1);
                if (obj.toDelg.length === 0) {
                    delete obj.toDelg;
                }
            }
        }
        else if (obj.own) {
            let index = obj.own.findIndex(item => item === event);
            if (index !== -1) {
                obj.own.splice(index, 1);
                if (obj.own.length === 0) {
                    delete obj.own;
                }
            }
        }
    }
    /**
     * 绑定事件记录
     * 当绑定到html element时，需要记录
     * @param key           dom key
     * @param eventName     事件名
     * @param handler       事件处理器
     * @param capture       useCapture
     * @returns             是否绑定成功，如果已绑定或不存在，则返回false，否则返回true
     */
    bind(key, eventName, handler, capture) {
        if (!this.eventMap.has(key)) {
            return false;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj.has(eventName)) {
            return false;
        }
        if (!eobj.bindMap) {
            eobj.bindMap = new Map();
        }
        else if (eobj.bindMap.has(eventName)) { //已绑定，不再绑
            return false;
        }
        const el = this.module.getNode(key);
        if (el) {
            el.addEventListener(eventName, handler, capture);
        }
        eobj.bindMap.set(eventName, {
            handler: handler,
            capture: capture
        });
        return true;
    }
    /**
     * 从eventfactory解绑所有事件
     * @param key           dom key
     * @param eventName     事件名
     */
    unbind(key, eventName) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj.bindMap || !eobj.has(eventName)) {
            return;
        }
        const el = this.module.getNode(key);
        const cfg = eobj.bindMap.get(eventName);
        //从html element解绑
        if (el && cfg) {
            el.removeEventListener(eventName, cfg.handler, cfg.capture);
        }
        eobj.bindMap.delete(eventName);
    }
    /**
     * 从eventfactory解绑事件
     * @param key           dom key
     */
    unbindAll(key) {
        if (!this.eventMap.has(key)) {
            return;
        }
        const eobj = this.eventMap.get(key);
        if (!eobj.bindMap) {
            return;
        }
        const el = this.module.getNode(key);
        if (el) {
            for (let evt of eobj.bindMap) {
                el.removeEventListener(evt[0], evt[1].handler, evt[1].capture);
            }
        }
        eobj.bindMap.clear();
    }
    /**
     * 是否拥有key对应的事件对象
     * @param key   dom key
     * @returns     如果key对应事件存在，返回true，否则返回false
     */
    hasEvent(key) {
        return this.eventMap.has(key);
    }
    /**
     * 克隆事件对象
     * @param srcKey    源dom key
     * @param dstKey    目标dom key
     */
    cloneEvent(srcKey, dstKey) {
        if (srcKey === dstKey) {
            return;
        }
        let eObj = this.eventMap.get(srcKey);
        if (!eObj) {
            return;
        }
        let map = new Map();
        for (let evt of eObj) {
            if (evt[0] === 'bindMap') { //bindMap不复制
                continue;
            }
            let obj = { capture: evt[1].capture };
            if (evt[1].own) {
                obj['own'] = evt[1].own.slice(0);
            }
            if (evt[1].delg) {
                obj['delg'] = evt[1].delg.slice(0);
            }
            if (evt[1].toDelg) {
                obj['toDelg'] = evt[1].toDelg.slice(0);
            }
            map.set(evt[0], obj);
        }
        this.eventMap.set(dstKey, map);
    }
}

/**
 * NCache模块-存储在内存中
 */
class NCache {
    constructor() {
        /**
         * 订阅map，格式为 {key:[{module:订阅模块,handler:},...]}
         */
        this.subscribeMap = new Map();
        this.cacheData = {};
    }
    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key   键，支持"."（多级数据分割）
     * @reutrns     值或undefined
     */
    get(key) {
        let p = this.cacheData;
        if (key.indexOf('.') !== -1) {
            let arr = key.split('.');
            if (arr.length > 1) {
                for (let i = 0; i < arr.length - 1 && p; i++) {
                    p = p[arr[i]];
                }
                if (p) {
                    key = arr[arr.length - 1];
                }
            }
        }
        if (p) {
            return p[key];
        }
    }
    /**
     * 通过提供的键名和值将其存储在内存中
     * @param key       键
     * @param value     值
     */
    set(key, value) {
        let p = this.cacheData;
        let key1 = key;
        if (key.indexOf('.') !== -1) {
            let arr = key.split('.');
            if (arr.length > 1) {
                for (let i = 0; i < arr.length - 1; i++) {
                    if (!p[arr[i]] || typeof p[arr[i]] !== 'object') {
                        p[arr[i]] = {};
                    }
                    p = p[arr[i]];
                }
                key = arr[arr.length - 1];
            }
        }
        if (p) {
            p[key] = value;
        }
        //处理订阅
        if (this.subscribeMap.has(key1)) {
            let arr = this.subscribeMap.get(key1);
            for (let a of arr) {
                this.invokeSubscribe(a.module, a.handler, value);
            }
        }
    }
    /**
     * 通过提供的键名将其移除
     * @param key   键
     */
    remove(key) {
        let p = this.cacheData;
        if (key.indexOf('.') !== -1) {
            let arr = key.split('.');
            if (arr.length > 1) {
                for (let i = 0; i < arr.length - 1 && p; i++) {
                    p = p[arr[i]];
                }
                if (p) {
                    key = arr[arr.length - 1];
                }
            }
        }
        if (p) {
            delete p[key];
        }
    }
    /**
     * 订阅
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    subscribe(module, key, handler) {
        if (!this.subscribeMap.has(key)) {
            this.subscribeMap.set(key, [{ module: module, handler: handler }]);
        }
        else {
            let arr = this.subscribeMap.get(key);
            if (!arr.find(item => item.module === module && item.handler === handler)) {
                arr.push({ module: module, handler: handler });
            }
        }
        //如果存在值，则执行订阅回调
        let v = this.get(key);
        if (v) {
            this.invokeSubscribe(module, handler, v);
        }
    }
    /**
     * 调用订阅方法
     * @param module    模块
     * @param foo       方法或方法名
     * @param v         值
     */
    invokeSubscribe(module, foo, v) {
        if (typeof foo === 'string') {
            module.invokeMethod(foo, v);
        }
        else {
            foo.call(module, v);
        }
    }
}

/**
 * 全局缓存
 */
class GlobalCache {
    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
    static set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    static get(key) {
        return this.cache.get(key);
    }
    /**
     * 订阅
     * @param module    订阅的模块
     * @param key       字段key
     * @param handler   回调函数 参数为key对应value
     */
    static subscribe(module, key, handler) {
        this.cache.subscribe(module, key, handler);
    }
    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    static remove(key) {
        this.cache.remove(key);
    }
}
//NCache实例
GlobalCache.cache = new NCache();

/**
 * 工厂基类
 */
class NFactory {
    /**
     * @param module 模块
     */
    constructor(module) {
        /**
         * 工厂item对象
         */
        this.items = new Map();
        if (module !== undefined) {
            this.moduleId = module.id;
        }
    }
    /**
     * 添加到工厂
     * @param name 	item name
     * @param item	item
     */
    add(name, item) {
        this.items.set(name, item);
    }
    /**
     * 获得item
     * @param name 	item name
     * @returns     item
     */
    get(name) {
        return this.items.get(name);
    }
    /**
     * 从容器移除
     * @param name 	item name
     */
    remove(name) {
        this.items.delete(name);
    }
    /**
     * 是否拥有该项
     * @param name  item name
     * @return      true/false
     */
    has(name) {
        return this.items.has(name);
    }
}

/*
 * 消息js文件 中文文件
 */
const NodomMessage_zh = {
    /**
     * 提示单词
     */
    TipWords: {
        application: "应用",
        system: "系统",
        module: "模块",
        moduleClass: '模块类',
        model: "模型",
        directive: "指令",
        directiveType: "指令类型",
        expression: "表达式",
        event: "事件",
        method: "方法",
        filter: "过滤器",
        filterType: "过滤器类型",
        data: "数据",
        dataItem: '数据项',
        route: '路由',
        routeView: '路由容器',
        plugin: '插件',
        resource: '资源',
        root: '根',
        element: '元素'
    },
    /**
     * 异常信息
     */
    ErrorMsgs: {
        unknown: "未知错误",
        paramException: "{0}'{1}'方法参数错误，请参考api",
        invoke: "{0}方法调用参数{1}必须为{2}",
        invoke1: "{0}方法调用参数{1}必须为{2}或{3}",
        invoke2: "{0}方法调用参数{1}或{2}必须为{3}",
        invoke3: "{0}方法调用参数{1}不能为空",
        exist: "{0}已存在",
        exist1: "{0}'{1}'已存在",
        notexist: "{0}不存在",
        notexist1: "{0}'{1}'不存在",
        notupd: "{0}不可修改",
        notremove: "{0}不可删除",
        notremove1: "{0}{1}不可删除",
        namedinvalid: "{0}{1}命名错误，请参考用户手册对应命名规范",
        initial: "{0}初始化参数错误",
        jsonparse: "JSON解析错误",
        timeout: "请求超时",
        config: "{0}配置参数错误",
        config1: "{0}配置参数'{1}'错误",
        itemnotempty: "{0} '{1}' 配置项 '{2}' 不能为空",
        itemincorrect: "{0} '{1}' 配置项 '{2}' 错误",
        compile1: "{0}标签未闭合",
        compile2: "结束标签{0}未找到与之匹配的开始标签",
        compile3: "请检查模板标签闭合情况，模板需要有一个闭合的根节点",
        wrongTemplate: "模版格式错误"
    },
    /**
     * 表单信息
     */
    FormMsgs: {
        type: "请输入有效的{0}",
        unknown: "输入错误",
        required: "不能为空",
        min: "最小输入值为{0}",
        max: "最大输入值为{0}"
    },
    WeekDays: {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    }
};

/**
 * 模型工厂
 */
class ModelManager {
    /**
     * 添加到 dataNModelMap
     * @param data      数据对象
     * @param model     模型
     */
    static addToMap(data, model) {
        this.modelMap.set(model.$key, { data: data, model: model });
    }
    /**
     * 删除从 dataNModelMap
     * @param key       model key
     */
    static delFromMap(key) {
        if (!this.modelMap.has(key)) {
            return;
        }
        this.modelMap.get(key);
        this.modelMap.delete(key);
    }
    /**
     * 从dataNModelMap获取model
     * @param data      数据对象
     * @returns         model
     */
    static getModel(key) {
        if (this.modelMap.has(key)) {
            return this.modelMap.get(key)['model'];
        }
    }
    /**
     * 获取数据对象
     * @param key   model key
     * @returns     data
     */
    static getData(key) {
        if (this.modelMap.has(key)) {
            return this.modelMap.get(key)['data'];
        }
    }
    /**
     * 绑定model到module
     * @param model     模型
     * @param module    模块
     * @returns
     */
    static bindToModule(model, module) {
        if (!model || !this.modelMap.has(model.$key)) {
            return;
        }
        let obj = this.modelMap.get(model.$key);
        let mid = typeof module === 'number' ? module : module.id;
        if (!obj.modules) {
            obj.modules = [mid];
        }
        else {
            let arr = obj.modules;
            if (arr.indexOf(mid) === -1) {
                arr.push(mid);
            }
        }
        //级联设置
        Object.getOwnPropertyNames(model).forEach(item => {
            if (model[item] && typeof model[item] === 'object' && model[item].$key) {
                ModelManager.bindToModule(model[item], module);
            }
        });
    }
    /**
     * 绑定model到多个module
     * @param model     模型
     * @param ids       模块id数组
     * @returns
     */
    static bindToModules(model, ids) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        let obj = this.modelMap.get(model.$key);
        if (!obj.modules) {
            obj.modules = ids;
        }
        else {
            let arr = obj.modules;
            for (let mid of ids) {
                if (arr.indexOf(mid) === -1) {
                    arr.push(mid);
                }
            }
        }
        //级联设置
        Object.getOwnPropertyNames(model).forEach(item => {
            if (typeof model[item] === 'object' && model[item].$key) {
                ModelManager.bindToModules(model[item], ids);
            }
        });
    }
    /**
     * model从module解绑
     * @param model     模型
     * @param module    模块
     * @returns
     */
    static unbindFromModule(model, module) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        let obj = this.modelMap.get(model.$key);
        if (!obj.modules) {
            return;
        }
        let mid = typeof module === 'number' ? module : module.id;
        let arr = obj.modules;
        let ind;
        if ((ind = arr.indexOf(mid)) === -1) {
            arr.splice(ind);
        }
        //级联解绑
        Object.getOwnPropertyNames(model).forEach(item => {
            if (typeof model[item] === 'object' && model[item].$key) {
                ModelManager.unbindFromModule(model[item], module);
            }
        });
    }
    /**
     * 获取model绑定的moduleId
     * @param model     模型
     * @returns model绑定的模块id数组
     */
    static getModuleIds(model) {
        if (!this.modelMap.has(model.$key)) {
            return;
        }
        return this.modelMap.get(model.$key).modules;
    }
    /**
     * 更新导致渲染
     * 如果不设置oldValue和newValue，则直接强制渲染
     * @param model     model
     * @param key       属性
     * @param oldValue  旧值
     * @param newValue  新值
     * @param force     强制渲染
     */
    static update(model, key, oldValue, newValue, force) {
        const modules = this.getModuleIds(model);
        if (!modules) {
            return;
        }
        //第一个module为watcher对应module
        for (let mid of modules) {
            const m = ModuleFactory.get(mid);
            if (m) {
                Renderer.add(m);
            }
        }
        //监听器
        if (model.$watchers) {
            //对象监听器
            if (model.$watchers.$this) {
                for (let cfg of model.$watchers.$this) {
                    for (let mid of cfg.modules) {
                        const m = ModuleFactory.get(mid);
                        if (m) {
                            cfg.f.call(m, model, oldValue, newValue);
                        }
                    }
                }
            }
            //属性监听器
            if (model.$watchers[key]) {
                for (let cfg of model.$watchers[key]) {
                    for (let mid of cfg.modules) {
                        const m = ModuleFactory.get(mid);
                        if (m) {
                            cfg.f.call(m, model, oldValue, newValue);
                        }
                    }
                }
            }
        }
    }
}
/**
 * 模型map
 * 样式为 {modelKey:{data:data,model:model,modules:[]}，
 * 其中：
 *      modelkey表示model对应key，
 *      data为原始数据，
 *      model为代理对象,
 *      modules为该数据对象绑定的模块id数组
 */
ModelManager.modelMap = new Map();

/**
 * 模型类
 */
class Model {
    /**
     * @param data 		数据
     * @param module 	模块对象
     * @returns         模型代理对象
     */
    constructor(data, module) {
        //模型管理器
        let proxy = new Proxy(data, {
            set(src, key, value, receiver) {
                //值未变,proxy 不处理
                if (src[key] === value) {
                    return true;
                }
                //不处理原型属性
                if (['__proto__'].includes(key)) {
                    return true;
                }
                let ov = src[key];
                let r = Reflect.set(src, key, value, receiver);
                //非对象，null，非model设置代理
                if (value && !value.$key && (value.constructor === Object)) {
                    value = new Model(value, module);
                }
                ModelManager.update(receiver, key, ov, value);
                return r;
            },
            get(src, key, receiver) {
                let res = Reflect.get(src, key, receiver);
                if (res && (res.constructor === Object || res.constructor === Array)) {
                    if (res.$key) {
                        return ModelManager.getModel(res.$key);
                    }
                    else { //未代理对象，需要创建模型
                        return new Model(res, module);
                    }
                }
                return res;
            },
            deleteProperty(src, key) {
                //如果删除对象且不为数组元素，从modelmanager中同步删除
                if (src[key] && src[key].$key && !(Array.isArray(src) && /^\d+$/.test(key))) {
                    ModelManager.delFromMap(src[key].$key);
                }
                delete src[key];
                ModelManager.update(src, key, null, null, true);
                return true;
            }
        });
        for (let k of ['$watch', '$unwatch', '$get', '$set']) {
            proxy[k] = this[k];
        }
        proxy.$key = Util.genId();
        ModelManager.addToMap(data, proxy);
        //绑定到模块
        if (module) {
            ModelManager.bindToModule(proxy, module);
        }
        if (Array.isArray(data)) {
            this.arrayOverload(proxy);
        }
        return proxy;
    }
    /**
     * 重载数组删除元素方法
     * 用于处理从数组中移除的model，从modelmap移除
     * @param data  数组
     */
    arrayOverload(data) {
        data.splice = function () {
            const count = arguments[1];
            let r = Array.prototype['splice'].apply(data, arguments);
            if (count > 0) {
                for (let i = 0; i < r.length; i++) {
                    if (r[i].$key) {
                        ModelManager.delFromMap(r[i].$key);
                        delete r[i].$key;
                    }
                }
            }
            return r;
        };
        data.shift = function () {
            let d = data[0];
            Array.prototype['shift'].apply(data);
            if (d && d.$key) {
                ModelManager.delFromMap(d.$key);
                delete d.$key;
            }
            return d;
        };
        data.pop = function () {
            let d = data[data.length - 1];
            Array.prototype['pop'].apply(data);
            if (d && d.$key) {
                ModelManager.delFromMap(d.$key);
                delete d.$key;
            }
            return d;
        };
    }
    /**
     * 观察(取消观察)某个数据项
     * @param key       数据项名或数组
     * @param operate   数据项变化时执行方法
     * @param deep      是否深度观察，如果是深度观察，则子对象更改，也会触发观察事件
     */
    $watch(key, operate, deep) {
        let mids = ModelManager.getModuleIds(this);
        let arr = [];
        if (Array.isArray(key)) {
            for (let k of key) {
                watchOne(this, k, operate);
            }
        }
        else {
            watchOne(this, key, operate);
        }
        //返回取消watch函数
        return () => {
            for (let f of arr) {
                const foos = f.m.$watchers[f.k];
                if (foos) {
                    for (let i = 0; i < foos.length; i++) {
                        //方法相同则撤销watch
                        if (foos[i].f === f.f) {
                            foos.splice(i, 1);
                            if (foos.length === 0) {
                                delete f.m.$watchers[f.k];
                            }
                        }
                    }
                }
            }
            //释放arr
            arr = null;
        };
        function watchOne(model, key, operate) {
            let index = -1;
            //如果带'.'，则只取最里面那个对象
            if ((index = key.lastIndexOf('.')) !== -1) {
                model = this.$get(key.substring(0, index));
                key = key.substring(index + 1);
            }
            if (!model) {
                return;
            }
            const listener = { modules: mids, f: operate };
            if (!model.$watchers) {
                model.$watchers = {};
            }
            if (!model.$watchers[key]) {
                model.$watchers[key] = [listener];
            }
            else {
                model.$watchers[key].push(listener);
            }
            //保存用于撤销watch
            arr.push({ m: model, k: key, f: operate });
            //对象，监听整个对象
            if (deep && typeof model[key] === 'object') {
                for (let k of Object.keys(model[key])) {
                    if (k !== '$key' && typeof model[key][k] !== 'function') {
                        watchOne(model[key], k, operate);
                    }
                }
            }
        }
    }
    /**
     * 查询子属性
     * @param key   子属性，可以分级，如 name.firstName
     * @returns     属性对应model proxy
     */
    $get(key) {
        let model = this;
        if (key.indexOf('.') !== -1) { //层级字段
            let arr = key.split('.');
            for (let i = 0; i < arr.length - 1; i++) {
                model = model[arr[i]];
                if (!model) {
                    break;
                }
            }
            if (!model) {
                return;
            }
            key = arr[arr.length - 1];
        }
        return model[key];
    }
    /**
     * 设置值
     * @param key       子属性，可以分级，如 name.firstName
     * @param value     属性值
     * @param module    需要绑定的新模块
     */
    $set(key, value, module) {
        let model = this;
        let mids = ModelManager.getModuleIds(this);
        if (key.indexOf('.') !== -1) { //层级字段
            let arr = key.split('.');
            for (let i = 0; i < arr.length - 1; i++) {
                //不存在，则创建新的model
                if (!model[arr[i]]) {
                    let m = new Model({});
                    ModelManager.bindToModules(m, mids);
                    model[arr[i]] = m;
                }
                model = model[arr[i]];
            }
            key = arr[arr.length - 1];
        }
        //绑定model到模块
        if (typeof value === 'object' && module) {
            ModelManager.bindToModule(value, module);
        }
        model[key] = value;
    }
}

/**
 * 指令管理器
 * $directives  指令集
 * $expressions 表达式集
 * $events      事件集
 * $savedoms    dom相关缓存 包括 html dom 和 参数
 * $doms        渲染树
 */
class ObjectManager {
    /**
     * module   模块
     * @param module
     */
    constructor(module) {
        this.module = module;
        this.cache = new NCache();
    }
    /**
     * 保存到cache
     * @param key       键，支持"."（多级数据分割）
     * @param value     值
     */
    set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * 从cache读取
     * @param key   键，支持"."（多级数据分割）
     * @returns     缓存的值或undefined
     */
    get(key) {
        return this.cache.get(key);
    }
    /**
     * 从cache移除
     * @param key   键，支持"."（多级数据分割）
     */
    remove(key) {
        this.cache.remove(key);
    }
    /**
     * 设置事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @param value     参数值
     */
    setEventParam(id, key, name, value) {
        this.cache.set('$events.' + id + '.$params.' + key + '.' + name, value);
    }
    /**
     * 获取事件参数值
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getEventParam(id, key, name) {
        return this.get('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 移除事件参数
     * @param id        事件id
     * @param key       dom key
     * @param name      参数名
     */
    removeEventParam(id, key, name) {
        this.remove('$events.' + id + '.$params.' + key + '.' + name);
    }
    /**
     * 清空事件参数
     * @param id        事件id
     * @param key       dom key
     */
    clearEventParam(id, key) {
        if (key) { //删除对应dom的事件参数
            this.remove('$events.' + id + '.$params.' + key);
        }
        else { //删除所有事件参数
            this.remove('$events.' + id + '.$params');
        }
    }
    /**
     * 设置dom参数值
     * @param key       dom key
     * @param name      参数名
     * @param value     参数值
     */
    setDomParam(key, name, value) {
        this.set('$domparam.' + key + '.' + name, value);
    }
    /**
     * 获取dom参数值
     * @param key       dom key
     * @param name      参数名
     * @returns         参数值
     */
    getDomParam(key, name) {
        return this.get('$domparam.' + key + '.' + name);
    }
    /**
     * 移除dom参数值
     * @param key       dom key
     * @param name      参数名
     */
    removeDomParam(key, name) {
        this.remove('$domparam.' + key + '.' + name);
    }
    /**
     * 清除element 参数集
     * @param key   dom key
     */
    clearDomParams(key) {
        this.remove('$domparam.' + key);
    }
    /**
     * 清除缓存dom对象集
     */
    clearAllDomParams() {
        this.remove('$domparam');
    }
}

/**
 * 模块类
 * 模块方法说明：模版内使用的方法，包括事件，都直接在模块内定义
 *      方法this：指向module实例
 *      事件参数: model(当前按钮对应model),dom(事件对应虚拟dom),eventObj(事件对象),e(实际触发的html event)
 *      表达式方法：参数按照表达式方式给定即可
 * 模块事件
 *      onBeforeFirstRender 首次渲染前
 *      onFirstRender       首次渲染后
 *      onBeforeRender      每次渲染前
 *      onRender            每次渲染后
 *      onCompile           编译后
 */
class Module {
    /**
     * 构造器
     */
    constructor() {
        /**
         * 子模块id数组
         */
        this.children = [];
        /**
         * 用于保存每个key对应的html node
         */
        this.keyNodeMap = new Map();
        /**
         * 用户自定义key htmlelement映射
         */
        this.keyElementMap = new Map();
        /**
         * key virtualdom map
         */
        this.keyVDomMap = new Map();
        this.id = Util.genId();
        this.objectManager = new ObjectManager(this);
        this.changedModelMap = new Map();
        this.eventFactory = new EventFactory(this);
        //加入模块工厂
        ModuleFactory.add(this);
    }
    /**
     * 初始化
     */
    init() {
        // 设置状态为初始化
        this.state = EModuleState.INITED;
        //初始化model
        this.model = new Model(this.data() || {}, this);
        //注册子模块
        if (this.modules && Array.isArray(this.modules)) {
            for (let cls of this.modules) {
                ModuleFactory.addClass(cls);
            }
            delete this.modules;
        }
    }
    /**
     * 模版串方法，使用时重载
     * @param props     props对象，在模版容器dom中进行配置，从父模块传入
     * @returns         模版串
     */
    template(props) {
        return null;
    }
    /**
     * 数据方法，使用时重载
     * @returns      model数据
     */
    data() {
        return {};
    }
    /**
     * 模型渲染
     */
    render() {
        if (this.state === EModuleState.UNACTIVE) {
            return;
        }
        //检测模版并编译
        let templateStr = this.template(this.props);
        if (templateStr !== this.oldTemplate) {
            this.oldTemplate = templateStr;
            this.compile();
        }
        //不存在，不渲染
        if (!this.originTree) {
            return;
        }
        //渲染前事件返回true，则不进行渲染
        if (this.doModuleEvent('onBeforeRender')) {
            return;
        }
        if (!this.hasRendered) { //首次渲染
            this.doModuleEvent('onBeforeFirstRender');
        }
        const oldTree = this.renderTree;
        this.renderTree = Renderer.renderDom(this, this.originTree, this.model);
        if (!this.renderTree) {
            this.unmount();
            this.hasRendered = true;
            return;
        }
        if (this.state === EModuleState.UNMOUNTED) { //未挂载
            //渲染到html dom
            Renderer.renderToHtml(this, this.renderTree, null, true);
            this.mount();
        }
        else if (oldTree && this.model) {
            let changeDoms = [];
            // 比较节点
            DiffTool.compare(this.renderTree, oldTree, changeDoms);
            //执行更改
            if (changeDoms.length > 0) {
                Renderer.handleChangedDoms(this, changeDoms);
            }
        }
        if (!this.hasRendered) { //首次渲染
            this.doModuleEvent('onFirstRender');
            this.hasRendered = true;
        }
        //设置已渲染状态
        this.state = EModuleState.RENDERED;
        //执行每次渲染后事件
        this.doModuleEvent('onRender');
        this.changedModelMap.clear();
    }
    /**
     * 添加子模块
     * @param module    模块id或模块
     */
    addChild(module) {
        let mid;
        if (typeof module === 'number') {
            mid = module;
            module = ModuleFactory.get(mid);
        }
        else {
            mid = module.id;
        }
        if (!this.children.includes(mid)) {
            this.children.push(mid);
            module.parentId = this.id;
            //首次添加，激活
            module.active();
        }
    }
    /**
     * 移除子模块
     * @param module    子模块
     */
    removeChild(module) {
        let ind = this.children.indexOf(module.id);
        if (ind !== -1) {
            module.unactive();
            this.children.splice(ind, 1);
        }
    }
    /**
     * 激活模块(添加到渲染器)
     * @param type  0 手动， 1父节点setProps激活，默认0
     */
    active(type) {
        //如果为手动active，srcdom存在且不在renderTree中，则不active
        if (!type && this.srcDom) {
            const pm = this.getParent();
            if (pm && !pm.getRenderedDom(this.srcDom.key)) {
                return;
            }
        }
        //设置unmount状态
        if (this.state === EModuleState.UNACTIVE || this.state === EModuleState.INITED) {
            this.state = EModuleState.UNMOUNTED;
        }
        Renderer.add(this);
    }
    /**
     * 取消激活
     */
    unactive() {
        if (ModuleFactory.getMain() === this) {
            return;
        }
        //从render列表移除
        Renderer.remove(this.id);
        //清空event factory
        this.eventFactory = new EventFactory(this);
        //删除渲染树
        delete this.renderTree;
        //module根与源el切换
        const el = this.getNode('1');
        if (el) {
            if (this.container) { //带容器(路由方法加载)
                this.container.removeChild(el);
            }
            else if (this.srcDom) {
                const pm = this.getParent();
                if (!pm) {
                    return;
                }
                const srcElement = document.createTextNode("");
                if (el.parentElement) {
                    el.parentElement.replaceChild(srcElement, el);
                }
                pm.saveNode(this.srcDom.key, srcElement);
            }
        }
        //清理dom map
        this.clearMap();
        //设置状态
        this.state = EModuleState.UNACTIVE;
        //处理子模块
        if (this.children) {
            //处理子模块
            for (let id of this.children) {
                let m = ModuleFactory.get(id);
                if (m) {
                    m.unactive();
                }
            }
        }
    }
    /**
     * 挂载到html dom
     */
    mount() {
        const el = this.getNode('1');
        if (!el) {
            return;
        }
        if (this.container) { //带容器(路由方法加载)
            this.container.appendChild(el);
        }
        else if (this.srcDom) {
            const pm = this.getParent();
            if (!pm) {
                return;
            }
            const srcElement = pm.getNode(this.srcDom.key);
            if (srcElement) {
                srcElement.parentElement.replaceChild(el, srcElement);
            }
            pm.saveNode(this.srcDom.key, el);
        }
        //执行挂载事件
        this.doModuleEvent('onMount');
    }
    /**
     * 解挂
     */
    unmount() {
        this.unactive();
        //执行解挂事件
        this.doModuleEvent('onUnmount');
        this.state = EModuleState.UNMOUNTED;
    }
    /**
     * 清除dom map
     * @param key   dom key，如果为空，则清空map
     */
    clearMap(key) {
        if (key) {
            this.keyElementMap.delete(key);
            this.keyNodeMap.delete(key);
            this.keyVDomMap.delete(key);
        }
        else {
            this.keyElementMap.clear();
            this.keyNodeMap.clear();
            this.keyVDomMap.clear();
        }
    }
    /**
     * 获取父模块
     * @returns     父模块
     */
    getParent() {
        if (!this.parentId) {
            return;
        }
        return ModuleFactory.get(this.parentId);
    }
    /**
     * 执行模块事件
     * @param eventName 	事件名
     * @returns             执行结果，各事件返回值如下：
     *                          onBeforeRender：如果为true，表示不进行渲染
     */
    doModuleEvent(eventName) {
        let foo = this[eventName];
        if (foo && typeof foo === 'function') {
            return foo.apply(this, [this.model]);
        }
    }
    /**
     * 获取模块方法
     * @param name  方法名
     * @returns     方法
     */
    getMethod(name) {
        return this[name];
    }
    /**
     * 设置渲染容器
     * @param el        容器
     */
    setContainer(el) {
        this.container = el;
    }
    /**
     * 调用方法
     * @param methodName    方法名
     */
    invokeMethod(methodName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        let m = this;
        let foo = m[methodName];
        if (!foo && this.compileMid) {
            m = ModuleFactory.get(this.compileMid);
            if (m) {
                foo = m[methodName];
            }
        }
        if (foo && typeof foo === 'function') {
            let args = [];
            for (let i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return foo.apply(m, args);
        }
    }
    /**
     * 设置props
     * @param props     属性值
     * @param dom       子模块对应节点
     */
    setProps(props, dom) {
        let dataObj = props.$data;
        delete props.$data;
        //props数据复制到模块model
        if (dataObj) {
            for (let d of Object.keys(dataObj)) {
                let o = dataObj[d];
                //如果为对象，需要绑定到模块
                if (typeof o === 'object' && this.model[d] !== o) {
                    ModelManager.bindToModule(o, this);
                }
                this.model[d] = o;
            }
        }
        this.srcDom = dom;
        if (this.state !== EModuleState.RENDERED) {
            this.active(1);
        }
        else { //计算template，如果导致模版改变，需要激活
            let change = false;
            if (!this.props) {
                change = true;
            }
            else {
                const keys = Object.getOwnPropertyNames(props);
                let len1 = keys.length;
                const keys1 = this.props ? Object.getOwnPropertyNames(this.props) : [];
                let len2 = keys1.length;
                if (len1 !== len2) {
                    change = true;
                }
                else {
                    for (let k of keys) {
                        // object 默认改变
                        if (props[k] !== this.props[k]) {
                            change = true;
                            break;
                        }
                    }
                }
            }
            if (change) { //props 发生改变，计算模版，如果模版改变，激活模块
                this.active(1);
            }
        }
        this.props = props;
    }
    /**
     * 编译
     */
    compile() {
        this.domKeyId = 0;
        //清空孩子节点
        this.children = [];
        //清理css url
        CssManager.clearModuleRules(this);
        //清理dom参数
        this.objectManager.clearAllDomParams();
        if (!this.oldTemplate) {
            return;
        }
        this.originTree = new Compiler(this).compile(this.oldTemplate);
        if (this.props) {
            this.mergeProps(this.originTree, this.props);
        }
        //源事件传递到子模块根dom
        let parentModule = this.getParent();
        if (parentModule) {
            const eobj = parentModule.eventFactory.getEvent(this.srcDom.key);
            if (eobj) {
                for (let evt of eobj) {
                    if (evt[1].own) { //子模块不支持代理事件
                        for (let ev of evt[1].own) {
                            this.originTree.addEvent(ev);
                        }
                    }
                }
            }
        }
        //增加编译后事件
        this.doModuleEvent('onCompile');
    }
    /**
    * 合并属性
    * @param dom       dom节点
    * @param props     属性集合
    * @returns         是否改变
    */
    mergeProps(dom, props) {
        let change = false;
        for (let k of Object.keys(props)) {
            //如果dom自己有k属性，则处理为数组
            if (dom.hasProp(k)) {
                let pv = dom.getProp(k);
                if (Array.isArray(pv)) { //是数组，表示已传值，此次进行修改
                    if (pv[1] !== props[k]) {
                        dom.setProp(k, [pv[0], props[k]]);
                        change = true;
                    }
                }
                else { //首次传值
                    dom.setProp(k, [pv, props[k]]);
                    change = true;
                }
            }
            else { //dom自己无此属性
                dom.setProp(k, props[k]);
                change = true;
            }
        }
        //修改staticNum
        if (change) {
            dom.staticNum = 1;
        }
        return change;
    }
    /**
     * 获取node
     * @param key   dom key
     * @returns     html node
     */
    getNode(key) {
        return this.keyNodeMap.get(key);
    }
    /**
     * save node
     * @param key   dom key
     * @param node  html node
     */
    saveNode(key, node) {
        this.keyNodeMap.set(key, node);
    }
    /**
     * 获取用户key定义的html
     * @param key   用户自定义key
     * @returns     html element
     */
    getElement(key) {
        return this.keyElementMap.get(key);
    }
    /**
     * 保存用户key对应的htmlelement
     * @param key   自定义key
     * @param node  htmlelement
     */
    saveElement(key, node) {
        this.keyElementMap.set(key, node);
    }
    /**
     * 获取key对应的virtual dom
     * @param key   vdom key
     * @returns     virtual dom
     */
    getVirtualDom(key) {
        return this.keyVDomMap.get(key);
    }
    /**
     * 保存key对应的virtual dom
     * @param dom   virtual dom
     * @param key   vdom key
     */
    saveVirtualDom(dom, key) {
        this.keyVDomMap.set(key || dom.key, dom);
    }
    /**
     * 释放node
     * 包括从dom树解挂，释放对应结点资源
     * @param dom       虚拟dom
     */
    freeNode(dom) {
        if (dom.subModuleId) { //子模块
            //从渲染队列移除
            Renderer.remove(dom.subModuleId);
            let m = ModuleFactory.get(dom.subModuleId);
            if (m) {
                m.unactive();
            }
        }
        else { //非子模块
            let el = this.getNode(dom.key);
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }
            //从map移除
            this.clearMap(dom.key);
            //解绑所有事件
            this.eventFactory.unbindAll(dom.key);
            if (dom.children) {
                for (let d of dom.children) {
                    this.freeNode(d);
                }
            }
        }
    }
    /**
     * 从origin tree 获取虚拟dom节点
     * @param key   dom key
     */
    getOrginDom(key) {
        if (!this.originTree) {
            return null;
        }
        return find(this.originTree);
        function find(dom) {
            if (dom.key === key) {
                return dom;
            }
            if (dom.children) {
                for (let d of dom.children) {
                    let d1 = find(d);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    }
    /**
     * 从渲染树中获取key对应的渲染节点
     * @param key   dom key
     */
    getRenderedDom(key) {
        if (!this.renderTree) {
            return;
        }
        const d = find(this.renderTree, key);
        return d;
        /**
         * 递归查找
         * @param dom   渲染dom
         * @param key   待查找key
         * @returns     key对应renderdom 或 undefined
         */
        function find(dom, key) {
            if (dom.key === key) {
                return dom;
            }
            if (dom.children) {
                for (let d of dom.children) {
                    let d1 = find(d, key);
                    if (d1) {
                        return d1;
                    }
                }
            }
        }
    }
    /**
     * 获取模块类名对应的第一个子模块(如果设置deep，则深度优先)
     * @param className     子模块类名
     * @param deep          是否深度获取
     */
    getModule(className, deep) {
        if (!this.children) {
            return;
        }
        for (let id of this.children) {
            let m = ModuleFactory.get(id);
            if (m && m.constructor) {
                if (m.constructor.name === className) {
                    return m;
                }
                if (deep) {
                    let r = m.getModule(className, true);
                    if (r) {
                        return r;
                    }
                }
            }
        }
    }
    /**
     * 获取模块类名对应的所有子模块
     * @param className     子模块类名
     * @param deep          深度查询
     */
    getModules(className, deep) {
        if (!this.children) {
            return;
        }
        let arr = [];
        find(this);
        return arr;
        /**
         * 查询
         * @param module
         */
        function find(module) {
            if (!module.children) {
                return;
            }
            for (let id of module.children) {
                let m = ModuleFactory.get(id);
                if (m && m.constructor) {
                    if (m.constructor.name === className) {
                        arr.push(m);
                    }
                    if (deep) {
                        find(m);
                    }
                }
            }
        }
    }
    /**
     * 获取dom key id
     * @returns     key id
     */
    getDomKeyId() {
        return ++this.domKeyId;
    }
}

/**
 * module 元素
 */
class MODULE extends DefineElement {
    constructor(node, module) {
        super(node);
        //类名
        let clazz = node.getProp('name');
        if (!clazz) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'MODULE', 'className');
        }
        node.delProp('name');
        node.addDirective(new Directive('module', clazz));
    }
}
/**
 * for 元素
 */
class FOR extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'FOR', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('repeat', cond));
    }
}
/**
 * 递归元素
 */
class RECUR extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        node.delProp('cond');
        node.addDirective(new Directive('recur', cond));
    }
}
/**
 * IF 元素
 */
class IF extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'IF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('if', cond));
    }
}
class ELSE extends DefineElement {
    constructor(node, module) {
        super(node);
        node.addDirective(new Directive('else', null));
    }
}
/**
 * ELSEIF 元素
 */
class ELSEIF extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('cond');
        if (!cond) {
            throw new NError('itemnotempty', NodomMessage.TipWords['element'], 'ELSEIF', 'cond');
        }
        node.delProp('cond');
        node.addDirective(new Directive('elseif', cond));
    }
}
/**
 * ENDIF 元素
 */
class ENDIF extends DefineElement {
    constructor(node, module) {
        super(node);
        node.addDirective(new Directive('endif', null));
    }
}
/**
 * 替代器
 */
class SLOT extends DefineElement {
    constructor(node, module) {
        super(node);
        //条件
        let cond = node.getProp('name') || 'default';
        node.delProp('name');
        node.addDirective(new Directive('slot', cond));
    }
}
DefineElementManager.add([MODULE, FOR, IF, RECUR, ELSE, ELSEIF, ENDIF, SLOT]);

((function () {
    /**
     * 指令类型初始化
     * 每个指令类型都有一个名字、处理函数和优先级，处理函数不能用箭头函数
     * 处理函数在渲染时执行，包含两个参数 module(模块)、dom(目标虚拟dom)、src(源虚拟dom)
     * 处理函数的this指向指令
     * 处理函数的返回值 true 表示继续，false 表示后续指令不再执行
     */
    /**
     * module 指令
     * 用于指定该元素为模块容器，表示子模块
     * 用法 x-module='模块类名'
     */
    createDirective('module', function (module, dom) {
        const src = dom.vdom;
        let m;
        //存在moduleId，表示已经渲染过，不渲染
        let mid = module.objectManager.getDomParam(dom.key, 'moduleId');
        let handle = true;
        if (mid) {
            m = ModuleFactory.get(mid);
            handle = !dom.props['renderOnce'];
        }
        else {
            m = ModuleFactory.get(this.value);
            if (!m) {
                return true;
            }
            //设置编译源id
            if (this.params && this.params.srcId) {
                m.compileMid = this.params.srcId;
            }
            mid = m.id;
            //保留modelId
            module.objectManager.setDomParam(dom.key, 'moduleId', mid);
            module.addChild(m);
            //共享当前dom的model给子模块
            if (src.hasProp('useDomModel')) {
                m.model = dom.model;
                //绑定model到子模块，共享update,watch方法
                ModelManager.bindToModule(m.model, m);
                delete dom.props['useDomModel'];
            }
        }
        //保存到dom上，提升渲染性能
        dom.subModuleId = mid;
        //变成文本节点，作为子模块占位符，子模块渲染后插入到占位符前面
        delete dom.tagName;
        if (handle) { //需要处理
            //设置props，如果改变了props，启动渲染
            let o = {};
            if (dom.props) {
                for (let p of Object.keys(dom.props)) {
                    let v = dom.props[p];
                    if (p[0] === '$') { //数据
                        if (!o.$data) {
                            o.$data = {};
                        }
                        o.$data[p.substring(1)] = v;
                        //删除属性
                        delete dom.props[p];
                    }
                    else {
                        o[p] = v;
                    }
                }
            }
            //传递给模块
            m.setProps(o, dom);
        }
        return true;
    }, 8);
    /**
     *  model指令
     */
    createDirective('model', function (module, dom) {
        let model = dom.model.$get(this.value);
        if (model) {
            dom.model = model;
        }
        return true;
    }, 1);
    /**
     * 指令名 repeat
     * 描述：重复指令
     */
    createDirective('repeat', function (module, dom) {
        let rows = this.value;
        // 无数据，不渲染
        if (!Util.isArray(rows) || rows.length === 0) {
            return false;
        }
        const src = dom.vdom;
        //索引名
        const idxName = src.getProp('$index');
        const parent = dom.parent;
        //禁用该指令
        this.disabled = true;
        //避免在渲染时对src设置了model，此处需要删除
        delete src.model;
        for (let i = 0; i < rows.length; i++) {
            if (idxName) {
                rows[i][idxName] = i;
            }
            //渲染一次-1，所以需要+1
            src.staticNum++;
            let d = Renderer.renderDom(module, src, rows[i], parent, rows[i].$key + '');
            //删除$index属性
            if (idxName) {
                delete d.props['$index'];
            }
        }
        //启用该指令
        this.disabled = false;
        return false;
    }, 2);
    /**
     * 递归指令
     * 作用：在dom内部递归，用于具有相同数据结构的节点递归生成
     * 递归指令不允许嵌套
     * name表示递归名字，必须与内部的recur标签的ref保持一致，名字默认为default
     * 典型模版
     * ```
     * <recur name='r1'>
     *      <div>...</div>
     *      <p>...</p>
     *      <recur ref='r1' />
     * </recur>
     * ```
     */
    createDirective('recur', function (module, dom) {
        const src = dom.vdom;
        //当前节点是递归节点存放容器
        if (dom.props.hasOwnProperty('ref')) {
            //如果出现在repeat中，src为单例，需要在使用前清空子节点，避免沿用上次的子节点
            src.children = [];
            //递归存储名
            const name = '$recurs.' + (dom.props['ref'] || 'default');
            let node = module.objectManager.get(name);
            if (!node) {
                return true;
            }
            let model = dom.model;
            let cond = node.getDirective('recur');
            let m = model[cond.value];
            //不存在子层数组，不再递归
            if (!m) {
                return true;
            }
            //克隆，后续可以继续用
            let node1 = node.clone();
            //recur子节点不为数组，依赖子层数据，否则以来repeat数据
            if (!Array.isArray(m)) {
                node1.model = m;
                Util.setNodeKey(node1, m.$key, true);
            }
            src.children = [node1];
            node1.parent = src;
        }
        else { //递归节点
            let data = dom.model[this.value];
            if (!data) {
                return true;
            }
            //递归名，默认default
            const name = '$recurs.' + (dom.props['name'] || 'default');
            if (!module.objectManager.get(name)) {
                module.objectManager.set(name, src);
            }
        }
        return true;
    }, 2);
    /**
     * 指令名 if
     * 描述：条件指令
     */
    createDirective('if', function (module, dom) {
        module.objectManager.setDomParam(dom.parent.key, '$if', this.value);
        return this.value;
    }, 5);
    /**
     * 指令名 else
     * 描述：else指令
     */
    createDirective('else', function (module, dom) {
        return !module.objectManager.getDomParam(dom.parent.key, '$if');
    }, 5);
    /**
     * elseif 指令
     */
    createDirective('elseif', function (module, dom) {
        let v = module.objectManager.getDomParam(dom.parent.key, '$if');
        if (v === true) {
            return false;
        }
        else {
            if (!this.value) {
                return false;
            }
            else {
                module.objectManager.setDomParam(dom.parent.key, '$if', true);
            }
        }
        return true;
    }, 5);
    /**
     * elseif 指令
     */
    createDirective('endif', function (module, dom) {
        module.objectManager.removeDomParam(dom.parent.key, '$if');
        //endif 不显示
        return false;
    }, 5);
    /**
     * 指令名 show
     * 描述：显示指令
     */
    createDirective('show', function (module, dom) {
        return this.value ? true : false;
    }, 5);
    /**
     * 指令名 field
     * 描述：字段指令
     */
    createDirective('field', function (module, dom) {
        const type = dom.props['type'] || 'text';
        const tgname = dom.tagName.toLowerCase();
        const model = dom.model;
        if (!model) {
            return true;
        }
        let dataValue = model.$get(this.value);
        if (type === 'radio') {
            let value = dom.props['value'];
            if (dataValue == value) {
                dom.props['checked'] = 'checked';
                Util.setDomAsset(dom, 'checked', true);
            }
            else {
                delete dom.props['checked'];
                Util.setDomAsset(dom, 'checked', false);
            }
        }
        else if (type === 'checkbox') {
            //设置状态和value
            let yv = dom.props['yes-value'];
            //当前值为yes-value
            if (dataValue == yv) {
                dom.props['value'] = yv;
                Util.setDomAsset(dom, 'checked', true);
            }
            else { //当前值为no-value
                dom.props['value'] = dom.props['no-value'];
                Util.setDomAsset(dom, 'checked', false);
            }
        }
        else if (tgname === 'select') { //下拉框
            dom.props['value'] = dataValue;
            Util.setDomAsset(dom, 'value', dataValue);
        }
        else {
            let v = (dataValue !== undefined && dataValue !== null) ? dataValue : '';
            dom.props['value'] = v;
            Util.setDomAsset(dom, 'value', v);
        }
        let event = GlobalCache.get('$fieldChangeEvent');
        if (!event) {
            event = new NEvent(null, 'change', function (model, dom) {
                let el = this.getNode(dom.key);
                if (!el) {
                    return;
                }
                let directive = dom.vdom.getDirective('field');
                let type = dom.props['type'];
                let field = directive.value;
                let v = el.value;
                //根据选中状态设置checkbox的value
                if (type === 'checkbox') {
                    if (dom.props['yes-value'] == v) {
                        v = dom.props['no-value'];
                    }
                    else {
                        v = dom.props['yes-value'];
                    }
                }
                else if (type === 'radio') {
                    if (!el.checked) {
                        v = undefined;
                    }
                }
                //修改字段值,需要处理.运算符
                let arr = field.split('.');
                if (arr.length === 1) {
                    model[field] = v;
                }
                else {
                    let temp = model;
                    field = arr.pop();
                    for (let i = 0; i < arr.length && temp; i++) {
                        temp = temp[arr[i]];
                    }
                    if (temp) {
                        temp[field] = v;
                    }
                }
            });
            GlobalCache.set('$fieldChangeEvent', event);
        }
        dom.vdom.addEvent(event);
        return true;
    }, 10);
    /**
     * route指令
     */
    createDirective('route', function (module, dom) {
        //a标签需要设置href
        if (dom.tagName.toLowerCase() === 'a') {
            dom.props['href'] = 'javascript:void(0)';
        }
        dom.props['path'] = this.value;
        //有激活属性
        if (dom.props['active']) {
            let acName = dom.props['active'];
            delete dom.props['active'];
            //active 转expression
            Router.addActiveField(module, this.value, dom.model, acName);
            if (this.value.startsWith(Router.currentPath) && dom.model[acName]) {
                Router.go(this.value);
            }
        }
        //添加click事件,避免重复创建事件对象，创建后缓存
        let event = GlobalCache.get('$routeClickEvent');
        if (!event) {
            event = new NEvent(null, 'click', function (model, dom, evObj, e) {
                let path = dom.props['path'];
                if (Util.isEmpty(path)) {
                    return;
                }
                Router.go(path);
            });
            GlobalCache.set('$routeClickEvent', event);
        }
        dom.vdom.addEvent(event);
        return true;
    });
    /**
     * 增加router指令
     */
    createDirective('router', function (module, dom) {
        Router.routerKeyMap.set(module.id, dom.key);
        return true;
    });
    /**
     * 插头指令
     * 用于模块中，可实现同名替换
     */
    createDirective('slot', function (module, dom) {
        this.value = this.value || 'default';
        let mid = dom.parent.subModuleId;
        const src = dom.vdom;
        //父dom有module指令，表示为替代节点，替换子模块中的对应的slot节点；否则为子模块定义slot节点
        if (mid) {
            let m = ModuleFactory.get(mid);
            if (m) {
                //缓存当前替换节点
                m.objectManager.set('$slots.' + this.value, { dom: src, model: dom.model });
            }
        }
        else { //源slot节点
            //获取替换节点进行替换，如果没有，则渲染子节点
            const cfg = module.objectManager.get('$slots.' + this.value);
            const children = cfg ? cfg.dom.children : src.children;
            if (children) {
                for (let d of children) {
                    let model;
                    if (src.hasProp('innerRender')) { //内部数据渲染
                        model = dom.model;
                    }
                    else if (cfg) { //外部数据渲染
                        model = cfg.model;
                        //对象绑定到当前模块
                        ModelManager.bindToModule(cfg.model, module);
                    }
                    //key以s结尾，避免重复，以dom key作为附加key
                    Renderer.renderDom(module, d, model, dom.parent, dom.key + 's');
                }
            }
        }
        return false;
    }, 5);
    /**
     * 指令名
     * 描述：动画指令
     */
    createDirective('animation', function (module, dom) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        const confObj = this.value;
        if (!Util.isObject(confObj)) {
            return new Error('未找到animation配置对象');
        }
        // 获得tigger
        const tigger = confObj.tigger == false ? false : true;
        // 用于判断是动画还是过渡
        const type = confObj.type || "transition";
        // 用于判断是否是 进入/离开动画 
        const isAppear = confObj.isAppear == false ? false : true;
        // 提取 动画/过渡 名
        const nameEnter = ((_a = confObj.name) === null || _a === void 0 ? void 0 : _a.enter) || confObj.name;
        const nameLeave = ((_b = confObj.name) === null || _b === void 0 ? void 0 : _b.leave) || confObj.name;
        // 提取 动画/过渡 持续时间
        const durationEnter = ((_c = confObj.duration) === null || _c === void 0 ? void 0 : _c.enter) || confObj.duration || '';
        const durationLeave = ((_d = confObj.duration) === null || _d === void 0 ? void 0 : _d.leavr) || confObj.duration || '';
        // 提取 动画/过渡 延迟时间
        const delayEnter = ((_e = confObj.delay) === null || _e === void 0 ? void 0 : _e.enter) || confObj.delay || '0s';
        const delayLeave = ((_f = confObj.delay) === null || _f === void 0 ? void 0 : _f.leave) || confObj.delay || '0s';
        // 提取 动画/过渡 时间函数
        const timingFunctionEnter = ((_g = confObj.timingFunction) === null || _g === void 0 ? void 0 : _g.enter) || confObj.timingFunction || 'ease';
        const timingFunctionLeave = ((_h = confObj.timingFunction) === null || _h === void 0 ? void 0 : _h.leave) || confObj.timingFunction || 'ease';
        // 提取动画/过渡 钩子函数
        const beforeEnter = ((_k = (_j = confObj.hooks) === null || _j === void 0 ? void 0 : _j.enter) === null || _k === void 0 ? void 0 : _k.before) ? confObj.hooks.enter.before : ((_l = confObj.hooks) === null || _l === void 0 ? void 0 : _l.before) || undefined;
        const afterEnter = ((_o = (_m = confObj.hooks) === null || _m === void 0 ? void 0 : _m.enter) === null || _o === void 0 ? void 0 : _o.after) ? confObj.hooks.enter.after : ((_p = confObj.hooks) === null || _p === void 0 ? void 0 : _p.after) || undefined;
        const beforeLeave = ((_r = (_q = confObj.hooks) === null || _q === void 0 ? void 0 : _q.leave) === null || _r === void 0 ? void 0 : _r.before) ? confObj.hooks.leave.before : ((_s = confObj.hooks) === null || _s === void 0 ? void 0 : _s.before) || undefined;
        const afterLeave = ((_u = (_t = confObj.hooks) === null || _t === void 0 ? void 0 : _t.leave) === null || _u === void 0 ? void 0 : _u.after) ? confObj.hooks.leave.after : ((_v = confObj.hooks) === null || _v === void 0 ? void 0 : _v.after) || undefined;
        // 定义动画或者过渡结束回调。
        let handler = () => {
            const el = module.getNode(dom.key);
            // 离开动画结束之后隐藏元素
            if (!tigger) {
                if (isAppear) {
                    // 离开动画结束之后 把元素隐藏
                    el.style.display = 'none';
                }
                if (afterLeave) {
                    afterLeave.apply(module.model, [module]);
                }
                // 这里如果style里面写了width和height 那么给他恢复成他写的，不然
                [el.style.width, el.style.height] = getOriginalWidthAndHeight(dom);
                // 结束之后删除掉离开动画相关的类
                el.classList.remove(nameLeave + '-leave-active');
                if (type == 'animation') {
                    el.classList.add(nameLeave + '-leave-to');
                }
            }
            else {
                if (afterEnter) {
                    afterEnter.apply(module.model, [module]);
                }
                // 进入动画结束之后删除掉相关的类
                el.classList.remove(nameEnter + '-enter-active');
                if (type == 'animation') {
                    el.classList.add(nameEnter + '-enter-to');
                }
            }
            // 清除事件监听
            el.removeEventListener('animationend', handler);
            el.removeEventListener('transitionend', handler);
        };
        // 获得真实dom
        let el = module.getNode(dom.key);
        if (!tigger) {
            // tigger为false 播放Leave动画
            if (el) {
                if (el.getAttribute('class').indexOf(`${nameLeave}-leave-to`) != -1) {
                    // 当前已经处于leave动画播放完成之后，若是进入离开动画，这时候需要他保持隐藏状态。
                    dom.props['class'] += ` ${nameLeave}-leave-to`;
                    if (isAppear) {
                        dom.props["style"]
                            ? (dom.props["style"] += ";display:none;")
                            : (dom.props["style"] = "display:none;");
                    }
                    return true;
                }
                // // 确保在触发动画之前还是隐藏状态
                // 调用函数触发 Leave动画/过渡
                changeStateFromShowToHide(el);
                return true;
            }
            else {
                // el不存在，第一次渲染
                if (isAppear) {
                    // 是进入离开动画，管理初次渲染的状态，让他隐藏
                    dom.props["style"]
                        ? (dom.props["style"] += ";display:none;")
                        : (dom.props["style"] = "display:none;");
                }
                // 下一帧
                setTimeout(() => {
                    // el已经渲染出来，取得el 根据动画/过渡的类型来做不同的事
                    let el = module.getNode(dom.key);
                    if (isAppear) {
                        // 动画/过渡 是进入离开动画/过渡，并且当前是需要让他隐藏所以我们不播放动画，直接隐藏。
                        el.classList.add(`${nameLeave}-leave-to`);
                        // 这里必须将这个属性加入到dom中,否则该模块其他数据变化触发增量渲染时,diff会将这个节点重新渲染,导致显示异常
                        // 这里添加添加属性是为了避免diff算法重新渲染该节点
                        dom.props['class'] += ` ${nameLeave}-leave-to`;
                        el.style.display = 'none';
                    }
                    else {
                        //  动画/过渡 是 **非进入离开动画/过渡** 我们不管理元素的隐藏，所以我们让他播放一次Leave动画。
                        changeStateFromShowToHide(el);
                    }
                }, 0);
            }
            // 通过虚拟dom将元素渲染出来
            return true;
        }
        else {
            // tigger为true 播放Enter动画
            if (el) {
                if (el.getAttribute('class').indexOf(`${nameEnter}-enter-to`) != -1) {
                    // 这里不需要像tigger=false时那样处理，这时候他已经处于进入动画播放完毕状态，
                    // 模块内其他数据变化引起该指令重新执行，这时候需要他保持现在显示的状态，直接返回true
                    dom.props['class'] += ` ${nameEnter}-enter-to`;
                    return true;
                }
                if (isAppear) {
                    // 如果是进入离开动画，在播放enter动画之前确保该元素是隐藏状态
                    // 确保就算diff更新了该dom还是有隐藏属性
                    dom.props["style"]
                        ? (dom.props["style"] += ";display:none;")
                        : (dom.props["style"] = "display:none;");
                }
                // 调用函数触发Enter动画/过渡
                changeStateFromHideToShow(el);
            }
            else {
                // el不存在，是初次渲染
                if (isAppear) {
                    // 管理初次渲染元素的隐藏显示状态
                    dom.props["style"]
                        ? (dom.props["style"] += ";display:none;")
                        : (dom.props["style"] = "display:none;");
                }
                // 下一帧
                setTimeout(() => {
                    // 等虚拟dom把元素更新上去了之后，取得元素
                    let el = module.getNode(dom.key);
                    if (isAppear) {
                        // 这里必须将这个属性加入到dom中,否则该模块其他数据变化触发增量渲染时,diff会将这个节点重新渲染,导致显示异常
                        // 这里添加添加属性是为了避免diff算法重新渲染该节点
                        dom.props['class'] += ` ${nameEnter}-enter-to`;
                        el.style.display = 'none';
                    }
                    // Enter动画与Leave动画不同，
                    // 不管动画是不是进入离开动画，在初次渲染的时候都要执行一遍动画
                    // Leave动画不一样，如果是开始离开动画，并且初次渲染的时候需要隐藏，那么我们没有必要播放一遍离开动画
                    changeStateFromHideToShow(el);
                }, 0);
            }
            // 通过虚拟dom将元素渲染出来
            return true;
        }
        /**
         * 播放Leave动画
         * @param el 真实dom
         */
        function changeStateFromShowToHide(el) {
            // 动画类型是transitiojn
            if (type == 'transition') {
                // 前面已经对transition的初始状态进行了设置，我们需要在下一帧设置结束状态才能触发过渡
                // 获得宽高的值 因为 宽高的auto 百分比 calc计算值都无法拿来触发动画或者过渡。
                let [width, height] = getElRealSzie(el);
                // setTimeout(() => {
                requestAnimationFrame(() => {
                    // 移除掉上一次过渡的最终状态
                    el.classList.remove(nameEnter + '-enter-to');
                    // 设置过渡的类名
                    el.classList.add(nameLeave + '-leave-active');
                    // 设置离开过渡的开始类
                    el.classList.add(nameLeave + '-leave-from');
                    // fold过渡的开始状态
                    if (nameLeave == 'fold-height') {
                        el.style.height = height;
                    }
                    else if (nameLeave == 'fold-width') {
                        el.style.width = width;
                    }
                    // 处理离开过渡的延时
                    el.style.transitionDelay = delayEnter;
                    // 处理过渡的持续时间
                    if (durationEnter != '') {
                        el.style.transitionDuration = durationEnter;
                    }
                    // 处理过渡的时间函数
                    if (timingFunctionEnter != 'ease') {
                        el.style.transitionTimingFunction = timingFunctionEnter;
                    }
                    // 在触发过渡之前执行hook
                    if (beforeLeave) {
                        beforeLeave.apply(module.model, [module]);
                    }
                    requestAnimationFrame(() => {
                        // 添加结束状态
                        el.classList.add(nameLeave + '-leave-to');
                        // 在动画或者过渡开始之前移除掉初始状态
                        el.classList.remove(nameLeave + '-leave-from');
                        if (nameLeave == 'fold-height') {
                            el.style.height = '0px';
                        }
                        else if (nameLeave == 'fold-width') {
                            el.style.width = '0px';
                        }
                        // 添加过渡结束事件监听
                        el.addEventListener('transitionend', handler);
                    });
                });
            }
            else {
                requestAnimationFrame(() => {
                    // 动画类型是aniamtion
                    el.classList.remove(nameEnter + '-enter-to');
                    // 动画延时时间
                    el.style.animationDelay = delayLeave;
                    // 动画持续时间
                    if (durationLeave != '') {
                        el.style.animationDuration = durationLeave;
                    }
                    if (timingFunctionLeave != 'ease') {
                        el.style.animationTimingFunction = timingFunctionLeave;
                    }
                    // 在触发动画之前执行hook
                    if (beforeLeave) {
                        beforeLeave.apply(module.model, [module]);
                    }
                    // 触发一次回流reflow
                    void el.offsetWidth;
                    // 添加动画类名
                    el.classList.add(nameLeave + '-leave-active');
                    //添加动画结束时间监听
                    el.addEventListener('animationend', handler);
                    // })
                });
            }
        }
        /**
         * 播放Enter动画
         * @param el 真实dom
         */
        function changeStateFromHideToShow(el) {
            // 动画类型是transition
            if (type == 'transition') {
                // 对于进入/离开动画
                // Enter过渡的延迟时间与Leave过渡的延迟时间处理不一样
                // 我们这里把延迟统一设置成0s，然后通过定时器来设置延时，
                // 这样可以避免先渲染一片空白区域占位，然后再延时一段时间执行过渡效果。
                el.style.transitionDelay = '0s';
                let delay = parseFloat(delayEnter) * 1000;
                setTimeout(() => {
                    let [width, height] = getElRealSzie(el);
                    // 在第一帧设置初始状态
                    // 移除掉上一次过渡的最终状态
                    el.classList.remove(nameLeave + '-leave-to');
                    // 添加过渡的类名
                    el.classList.add(nameEnter + '-enter-active');
                    // 给进入过渡设置开始类名
                    el.classList.add(nameEnter + '-enter-from');
                    // 获得元素的真实尺寸
                    if (nameEnter == 'fold-height') {
                        el.style.height = '0px';
                    }
                    else if (nameEnter == 'fold-width') {
                        el.style.width = '0px';
                    }
                    // 设置过渡持续时间
                    if (durationEnter != '') {
                        el.style.transitionDuration = durationEnter;
                    }
                    // 设置过渡时间函数
                    if (timingFunctionEnter != 'ease') {
                        el.style.transitionTimingFunction = timingFunctionEnter;
                    }
                    // 第二帧将带有初始状态的元素显示出来,如果不开这一帧那么fade的进入过渡在初次渲染的时候会被当作离开过渡触发。
                    requestAnimationFrame(() => {
                        // 下一帧请求过渡效果
                        // 过渡开始之前先将元素显示
                        if (isAppear) {
                            el.style.display = '';
                        }
                        // 第三帧触发过渡
                        requestAnimationFrame(() => {
                            if (beforeEnter) {
                                beforeEnter.apply(module.model, [module]);
                            }
                            // 增加 过渡 结束类名
                            el.classList.add(nameEnter + '-enter-to');
                            // 移除过渡的开始类名
                            el.classList.remove(nameEnter + '-enter-from');
                            if (nameEnter == 'fold-height') {
                                el.style.height = height;
                            }
                            else if (nameEnter == 'fold-width') {
                                el.style.width = width;
                            }
                            el.addEventListener('transitionend', handler);
                        });
                    });
                }, delay);
            }
            else {
                // 动画类型是aniamtion
                // 这里动画的延迟时间也与过渡类似的处理方式。
                el.style.animationDelay = "0s";
                let delay = parseFloat(delayEnter) * 1000;
                setTimeout(() => {
                    // 动画开始之前先将元素显示
                    requestAnimationFrame(() => {
                        el.classList.remove(nameLeave + '-leave-to');
                        // 设置动画的持续时间
                        if (durationEnter != '') {
                            el.style.animationDuration = durationEnter;
                        }
                        // 设置动画的时间函数
                        if (timingFunctionEnter != 'ease') {
                            el.style.animationTimingFunction = durationEnter;
                        }
                        if (isAppear) {
                            el.style.display = '';
                        }
                        // 在触发过渡之前执行hook 
                        if (beforeEnter) {
                            beforeEnter.apply(module.model, [module]);
                        }
                        // 触发一次回流reflow
                        void el.offsetWidth;
                        // 重新添加类名
                        el.classList.add(nameEnter + '-enter-active');
                        el.addEventListener('animationend', handler);
                    });
                }, delay);
            }
        }
        /**
         * 获取真实dom绘制出来之后的宽高
         * @param el 真实dom
         * @returns 真实dom绘制出来之后的宽高
         */
        function getElRealSzie(el) {
            if (el.style.display == 'none') {
                // 获取原先的
                const position = window.getComputedStyle(el).getPropertyValue("position");
                const vis = window.getComputedStyle(el).getPropertyValue("visibility");
                // 先脱流
                el.style.position = 'absolute';
                // 然后将元素变为
                el.style.visibility = 'hidden';
                el.style.display = '';
                let width = window.getComputedStyle(el).getPropertyValue("width");
                let height = window.getComputedStyle(el).getPropertyValue("height");
                // 还原样式
                el.style.position = position;
                el.style.visibility = vis;
                el.style.display = 'none';
                return [width, height];
            }
            else {
                let width = window.getComputedStyle(el).getPropertyValue("width");
                let height = window.getComputedStyle(el).getPropertyValue("height");
                return [width, height];
            }
        }
        /**
         * 如果dom上得style里面有width/height
         * @param dom 虚拟dom
         * @returns 获得模板上的width/height 如果没有则返回空字符串
         */
        function getOriginalWidthAndHeight(dom) {
            const oStyle = dom.vdom.getProp('style');
            let width;
            let height;
            if (oStyle) {
                let arr = oStyle.trim().split(/;\s*/);
                for (const a of arr) {
                    if (a.startsWith('width')) {
                        width = a.split(":")[1];
                    }
                    if (a.startsWith('height')) {
                        height = a.split(':')[1];
                    }
                }
            }
            width = width || '';
            height = height || '';
            return [width, height];
        }
    }, 9);
})());

/**
 * tap事件
 */
EventManager.regist('tap', {
    touchstart(dom, module, evtObj, e) {
        let tch = e.touches[0];
        evtObj.dependEvent.setParam(module, dom, 'pos', { sx: tch.pageX, sy: tch.pageY, t: Date.now() });
    },
    touchmove(dom, module, evtObj, e) {
        let pos = evtObj.dependEvent.getParam(module, dom, 'pos');
        if (!pos) {
            return;
        }
        let tch = e.touches[0];
        let dx = tch.pageX - pos.sx;
        let dy = tch.pageY - pos.sy;
        //判断是否移动
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            pos.move = true;
        }
    },
    touchend(dom, module, evtObj, e) {
        let pos = evtObj.dependEvent.getParam(module, dom, 'pos');
        if (!pos) {
            return;
        }
        evtObj.dependEvent.removeParam(module, dom, 'pos');
        let dt = Date.now() - pos.t;
        //点下时间不超过200ms,触发事件
        if (!pos.move && dt < 200) {
            let foo = evtObj.dependEvent.handler;
            if (typeof foo === 'string') {
                module.invokeMethod(evtObj.dependEvent.handler, dom.model, dom, evtObj.dependEvent, e);
            }
            else {
                foo.apply(module, [dom.model, dom, evtObj.dependEvent, e]);
            }
        }
    }
});
/**
 * swipe事件
 */
EventManager.regist('swipe', {
    touchstart(dom, module, evtObj, e) {
        let tch = e.touches[0];
        let t = Date.now();
        evtObj.dependEvent.setParam(module, dom, 'swipe', {
            oldTime: [t, t],
            speedLoc: [{ x: tch.pageX, y: tch.pageY }, { x: tch.pageX, y: tch.pageY }],
            oldLoc: { x: tch.pageX, y: tch.pageY }
        });
    },
    touchmove(dom, module, evtObj, e) {
        let nt = Date.now();
        let tch = e.touches[0];
        let mv = evtObj.dependEvent.getParam(module, dom, 'swipe');
        //50ms记录一次
        if (nt - mv.oldTime[1] > 50) {
            mv.speedLoc[0] = { x: mv.speedLoc[1].x, y: mv.speedLoc[1].y };
            mv.speedLoc[1] = { x: tch.pageX, y: tch.pageY };
            mv.oldTime[0] = mv.oldTime[1];
            mv.oldTime[1] = nt;
        }
        mv.oldLoc = { x: tch.pageX, y: tch.pageY };
    },
    touchend(dom, module, evtObj, e) {
        let mv = evtObj.dependEvent.getParam(module, dom, 'swipe');
        let nt = Date.now();
        //取值序号 0 或 1，默认1，如果释放时间与上次事件太短，则取0
        let ind = (nt - mv.oldTime[1] < 30) ? 0 : 1;
        let dx = mv.oldLoc.x - mv.speedLoc[ind].x;
        let dy = mv.oldLoc.y - mv.speedLoc[ind].y;
        let s = Math.sqrt(dx * dx + dy * dy);
        let dt = nt - mv.oldTime[ind];
        //超过300ms 不执行事件
        if (dt > 300 || s < 10) {
            return;
        }
        let v0 = s / dt;
        //速度>0.1,触发swipe事件
        if (v0 > 0.05) {
            let sname = '';
            if (dx < 0 && Math.abs(dy / dx) < 1) {
                e.v0 = v0; //添加附加参数到e
                sname = 'swipeleft';
            }
            if (dx > 0 && Math.abs(dy / dx) < 1) {
                e.v0 = v0;
                sname = 'swiperight';
            }
            if (dy > 0 && Math.abs(dx / dy) < 1) {
                e.v0 = v0;
                sname = 'swipedown';
            }
            if (dy < 0 && Math.abs(dx / dy) < 1) {
                e.v0 = v0;
                sname = 'swipeup';
            }
            //处理swipe
            if (evtObj.dependEvent.name === sname) {
                let foo = evtObj.dependEvent.handler;
                if (typeof foo === 'string') {
                    module.invokeMethod(foo, dom.model, dom, evtObj.dependEvent, e);
                }
                else if (typeof foo === 'function') {
                    foo.apply(module, [dom.model, dom, evtObj.dependEvent, e]);
                }
            }
        }
    }
});
//把swpie注册到4个方向
EventManager.regist('swipeleft', EventManager.get('swipe'));
EventManager.regist('swiperight', EventManager.get('swipe'));
EventManager.regist('swipeup', EventManager.get('swipe'));
EventManager.regist('swipedown', EventManager.get('swipe'));

//关闭右键菜单
document.oncontextmenu = function (e) {
    e.preventDefault();
};
/**
 * 工具类
 */
class UITool {
    /**
     * 去掉字符串的空格
     * @param src
     */
    static clearSpace(src) {
        if (src && typeof src === 'string') {
            return src.replace(/\s+/g, '');
        }
    }
    /**
     * 计算实际位置
     * @param el    待计算的element
     * @returns     [x坐标,y坐标]
     */
    static getRealPos(el) {
        let x = 0;
        let y = 0;
        while (el && el !== document.body) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
        return [x, y];
    }
    /**
     * 计算位置
     * @param relEl         相对element
     * @param relPos        相对位置：1下 2右
     * @param width         dom宽
     * @param height        dom高
     * @returns             [x,y]
     */
    static cacPosition(relEl, relPos, width, height) {
        //参考dom宽高
        const relW = relEl.offsetWidth;
        const relH = relEl.offsetHeight;
        const padding = 2;
        let x = 0;
        let y = 0;
        let gwidth = document.documentElement.clientWidth;
        let gheight = document.documentElement.clientHeight;
        let realXy = UITool.getRealPos(relEl);
        if (relPos === 1) {
            if (realXy[1] + height + relH > gheight && realXy[1] - height > 0) { //如果超出下边，则选择放在上边
                y = -height - padding * 2;
            }
            else {
                y = relH;
            }
            if (realXy[0] + width > gwidth) {
                x = -width + relW;
            }
        }
        else {
            if (realXy[0] + width + width > gwidth && realXy[0] - width > 0) { //如果超出右边，则选择放在左边
                x = -width - padding * 2;
            }
            else {
                x = relW;
            }
            if (realXy[1] + height > gheight) { //如果超出下边，则上移
                y = -height + relH;
            }
        }
        return [x, y];
    }
}

/**
 * 折叠插件
 * 属性配置
 * single: true/false 是否同时只展开一个
 */
class UIAccordion extends Module {
    template(props) {
        this.__single = props.hasOwnProperty('single');
        //子菜单 type=0表示在当前菜单项下侧，否则表示右侧
        return `
            <div class='ui-accordion'>
                <slot></slot>
            </div>
        `;
    }
}
/**
 * accordion item
 * 属性配置
 * opened: 是否展开
 */
class UIAccordionItem extends Module {
    template(props) {
        if (props.hasOwnProperty('opened')) {
            // this.model['__open'] = true;
            this.model['fold'].tigger = true;
        }
        // class='ui-accordion-content' x-animation={{fold}}
        // <!-- class='ui-accordion-content' class={{__open?'ui-accordion-content':'ui-accordion-content  ui-accordion-hide'}}> -->
        //fold.tigger ?'ui-expand-icon ui-expand-open':'ui-expand-icon'
        return `
            <div class='ui-accordion-item'>
                <div class='ui-accordion-title' e-click='__clickItem'>
                    ${props.title}
                    <b class={{fold.tigger ?'ui-expand-icon ui-expand-open':'ui-expand-icon'}} />
                </div>
                <div class='ui-accordion-content' x-animation={{fold}}>
                    <slot></slot>
                </div>
            </div>
        `;
    }
    data() {
        return {
            fold: {
                tigger: false,
                name: 'fold-height',
            },
        };
    }
    onCompile() {
        this.originTree.delProp(['title', 'opened']);
    }
    __clickItem(model, dom) {
        let module = this.getParent();
        if (module['__single']) {
            for (let mid of module.children) {
                let m = ModuleFactory.get(mid);
                if (mid !== this.id) {
                    // m.model['__open'] = false;
                    m.model['fold'].tigger = false;
                }
                else {
                    // m.model['__open'] = true;
                    m.model['fold'].tigger = true;
                }
            }
        }
        else {
            // model['__open'] = !model['__open'];
            model['fold'].tigger = !model['fold'].tigger;
        }
    }
}
registModule(UIAccordion, 'ui-accordion');
registModule(UIAccordionItem, 'ui-accordion-item');

/**
 * 按钮插件
 * 参数说明
 * title:       标题
 * icon:        图标
 * iconPos:     图标位置 left top right bottom,默认left
 * theme:       主题 default active error success warn，默认default
 * size:        按钮size tiny normal large，默认normal
 * nobg:        不需要背景 true false，默认false
 * circle:      圆形
 */
class UIButton extends Module {
    template(props) {
        let arr = ['ui-btn'];
        //字体
        arr.push('ui-btn-' + (props.size || 'normal'));
        //图标
        if (props.icon) {
            arr.push('ui-icon-' + props.icon);
            arr.push('ui-btn-' + (props.iconPos || 'left'));
        }
        //无背景
        if (props.hasOwnProperty('nobg')) {
            arr.push('ui-btn-nobg');
        }
        else {
            arr.push('ui-btn-' + (props.theme || 'default'));
        }
        //圆形
        if (props.hasOwnProperty('circle')) {
            arr.push('ui-btn-circle');
        }
        if (!props.title) {
            arr.push('ui-btn-notext');
        }
        return `
            <button class='${arr.join(" ")}'>
                ${props.title || ''}
            </button>
        `;
    }
    onCompile() {
        this.originTree.delProp(['theme', 'size', 'nobg', 'circle', 'icon', 'iconPos', 'title']);
    }
}
registModule(UIButton, 'ui-button');

class BaseInput extends Module {
    template(props) {
        this.__field = props.field;
        this.__onChangeName = props.onChange;
        return null;
    }
    onBeforeFirstRender(model) {
        const me = this;
        //增加监听
        if (this.__field) {
            this.srcDom.model.$watch(this.__field, (m, ov, nv) => {
                me.__change(nv);
            });
        }
    }
    /**
     * 更改值
     * 需要对父模块对应数据项进行更改
     * @param value     新值
     */
    __change(value, updSrc) {
        if (!this.__field) {
            return;
        }
        let v1 = this.model['__value'];
        if (value === v1) {
            return;
        }
        //调用change事件
        if (this.__onChangeName) {
            this.getParent().invokeMethod(this.__onChangeName, v1, value);
        }
        this.model['__value'] = value;
        //更改父模块对应数据项
        this.srcDom.model.$set(this.__field, value);
    }
    /**
     * 每次刷新前获取新值
     */
    onBeforeRender() {
        this.__initValue();
    }
    /**
     * 初始化value
     * @returns
     */
    __initValue() {
        if (!this.__field) {
            return;
        }
        const v = this.srcDom.model.$get(this.__field);
        const v1 = this.model['__value'];
        if (v1 === v) {
            return;
        }
        this.model['__value'] = v;
    }
    /**
     * 获取值
     * @returns     模块值
     */
    __getValue() {
        return this.model['__value'];
    }
}

/**
 * checkbox插件
 * 配置说明
 * field        绑定父模块的字段
 * onChange     change事件方法
 */
class UICheckbox extends BaseInput {
    template(props) {
        super.template(props);
        return `
            <span class='ui-checkbox'>
                <b class={{__value?'ui-checkbox-checked':'ui-checkbox-uncheck'}} e-click='__clickCheck'/>
                ${props.title}
            </span>
        `;
    }
    __clickCheck(model) {
        model['__value'] = !model['__value'];
        //设置值到父对象
        if (this.__field) {
            this.srcDom.model.$set(this.__field, model['__value']);
        }
    }
    __change(value, updSrc) {
    }
}
registModule(UICheckbox, 'ui-checkbox');

/**
 * 树形插件
 * 数据项
 * $data           树结构数据
 * 参数说明
 * field:           如果树作为输入模式，则需要设置
 * displayField：   数据项中用于显示的属性名
 * valueField：     数据项中用于取值的属性名，field存在时，不为空
 * icons：          树节点图标，依次为为非叶子节点关闭状态，打开状态，叶子节点，如果只有两个，则表示非叶子节点和叶子节点，如果1个，则表示非叶子节点
 * onItemClick：    节点点击事件
 */
class UITree extends BaseInput {
    /**
     * 模版函数
     * @param props     父模块传递的属性值
     * @returns         模版字符串
     */
    template(props) {
        super.template(props);
        this.__displayField = props.displayField;
        this.__valueField = props.valueField;
        this.__onItemClick = props.onItemClick;
        this.icons = props.icons ? props.icons.split(',').map(item => item.trim()) : undefined;
        let treeCls = 'ui-tree' + (props.class ? ' ' + props.class : '');
        let needCheck = this.__field ? true : false;
        return `
            <div class='${treeCls}' ${props.style ? 'style="' + props.style + '"' : ''} x-model='data'>
                <for cond={{children}} class='ui-tree-nodect'>
				    <div class='ui-tree-node'>
                        <b class={{__genArrowCls(!children||children.length===0,__opened)}} e-click='__expandClose'></b>
                        ${props.icons ? "<b class={{__genFolderCls(!children||children.length===0,__opened)}}></b>" : ""}
                        ${needCheck ? "<b class={{__genCheckCls(__checked)}} e-click='__checkItem'></b>" : ""}
                        <span e-click='__clickItem'>
                            <slot innerRender/>
                        </span>
                    </div>
                    <recur cond='children' class={{ 'ui-tree-subct' + (!__opened?' ui-tree-subct-hide':'')}}>
                        <for cond={{children}} class='ui-tree-nodect'>
                            <div class='ui-tree-node'>
                                <b class={{__genArrowCls(!children||children.length===0,__opened)}} e-click='__expandClose'></b>
                                ${props.icons ? "<b class={{__genFolderCls(!children||children.length===0,__opened)}}></b>" : ""}
                                ${needCheck ? "<b class={{__genCheckCls(__checked)}} e-click='__checkItem'></b>" : ""}
                                <span e-click='__clickItem'>
                                    <slot innerRender/>
                                </span>
                            </div>
                            <recur ref />
                        </for>                
                    </recur>
                </for>
            </div>
        `;
    }
    onCompile() {
        this.originTree.delProp(['icons', 'checkbox', 'onItemClick']);
    }
    /**
     * 创建选择框class
     * @param checked   选中标识 true:选中  false:未选中
     * @returns         选择框class
     */
    __genCheckCls(checked) {
        let arr = ['ui-tree-icon'];
        if (!checked) {
            arr.push('ui-tree-uncheck');
        }
        else if (checked === 1) {
            arr.push('ui-tree-checked');
        }
        else {
            arr.push('ui-tree-partchecked');
        }
        return arr.join(' ');
    }
    /**
     * 创建树左侧箭头class
     * @param isLeaf    是否未叶子节点
     * @param isOpen    是否展开
     * @returns         箭头(展开收拢)图标class
     */
    __genArrowCls(isLeaf, isOpen) {
        let arr = ['ui-tree-icon'];
        if (!isLeaf) {
            arr.push('ui-icon-arrow-right');
        }
        if (isOpen) {
            arr.push('ui-tree-node-open');
        }
        return arr.join(' ');
    }
    /**
     * 显示文件夹图标
     * @param isLeaf    是否叶子节点
     * @param isOpen    是否展开
     * @returns         文件夹图标class
     */
    __genFolderCls(isLeaf, isOpen) {
        if (!this.icons || this.icons.length === 0) {
            return;
        }
        const arr = this.icons;
        //icon cls arr
        let arr1 = ['ui-tree-icon'];
        if (arr.length === 1) {
            arr1.push(isLeaf ? '' : 'ui-icon-' + arr[0]);
        }
        else if (arr.length === 2) {
            arr1.push('ui-icon-' + (isLeaf ? arr[1] : arr[0]));
        }
        else if (arr.length === 3) {
            if (isOpen) {
                arr1.push('ui-icon-' + (isLeaf ? arr[2] : arr[1]));
            }
            else {
                arr1.push('ui-icon-' + (isLeaf ? arr[2] : arr[0]));
            }
        }
        return arr1.join(' ');
    }
    /**
     * 点击item事件
     * @param model     当前节点对应model
     * @param dom       virtual dom节点
     * @param eobj      NEvent对象
     * @param e         event对象
     */
    __clickItem(model, dom, eobj, e) {
        if (this.__onItemClick) {
            this.invokeMethod(this.__onItemClick, model, dom, eobj);
        }
    }
    /**
     * 展开关闭节点
     * @param model 当前节点对应model
     * @param dom       virtual dom节点
     * @param eobj      NEvent对象
     * @param e         event对象
     */
    __expandClose(model, dom, eobj, e) {
        model['__opened'] = !model['__opened'];
    }
    /**
     * checkbox 点击
     * @param model     当前节点对应model
     * @param dom       virtual dom节点
     * @param eobj      NEvent对象
     * @param e         event对象
     */
    __checkItem(model, dom, eobj, e) {
        let data = this.keyMap.get(dom.model.$key);
        if (!data) {
            return;
        }
        let state = data.state;
        state = state === 0 || state === 2 ? 1 : 0;
        this.__setState(data, state);
    }
    /**
     * 首次渲染事件
     * @param model     树对应model
     */
    __initValue() {
        super.__initValue();
        this.__initMap();
        if (this.__field && this.model['__value']) {
            this.__setValue(this.model['__value']);
        }
    }
    /**
     * 设置值
     * @param value
     */
    __setValue(value) {
        const me = this;
        if (!value || this.__valueField === '' || !this.model['data'] || !this.model['data'].children) {
            return;
        }
        for (let m of this.model['data'].children) {
            setNode(m);
        }
        /**
         * 查找并设置节点
         * @param m     model
         */
        function setNode(m) {
            if (value.indexOf(m[me.__valueField]) !== -1) {
                me.__setState(me.keyMap.get(m.$key), 1);
            }
            else if (m.children) { //处理子节点
                for (let m1 of m.children) {
                    setNode(m1);
                }
            }
        }
    }
    /**
     * 修改树的值
     * @param model     节点model
     * @returns
     */
    __changeValue(data) {
        if (!this.__field) {
            return;
        }
        const model = data.model;
        let state = model['__checked'];
        let value = this.model['__value'];
        if (!value) {
            value = [];
        }
        //当前model的value值
        let cv = model[this.__valueField];
        let ind = value.indexOf(cv);
        if (state === 1) { //选中，增加值
            if (ind === -1) {
                value.push(cv);
            }
        }
        else if (ind !== -1) { //未选中,移除
            value.splice(ind, 1);
        }
        super.__change(value, true);
    }
    /**
     * 设置state
     * @param data      data
     * @param state     状态值 0/1
     * @param notParent 是否处理祖先节点
     */
    __setState(data, state, notParent) {
        const me = this;
        data.state = state;
        data.model.__checked = state;
        this.__changeValue(data);
        setSubState(data);
        if (!notParent) {
            setParentState(data, state);
        }
        /**
         * 设置子孙节点状态
         */
        function setSubState(data) {
            if (!data.children) {
                return;
            }
            for (let k of data.children) {
                let d = me.keyMap.get(k);
                if (!d) {
                    continue;
                }
                //不处理祖先节点
                me.__setState(d, state, true);
            }
        }
        /**
         * 设置祖先节点状态
         */
        function setParentState(data, state) {
            if (!data.pkey) {
                return;
            }
            let d = me.keyMap.get(data.pkey);
            if (!d) {
                return;
            }
            const key = data.model.$key;
            let ind = d.selected.findIndex(item => item.key === key);
            switch (state) {
                case 0: //选中
                    if (ind !== -1) {
                        d.selected.splice(ind, 1);
                    }
                    break;
                case 1: //选中
                    if (ind === -1) {
                        d.selected.push({ key: key, state: 1 });
                    }
                    else {
                        d.selected[ind].state = 1;
                    }
                    break;
                case 2: //半选中
                    if (ind === -1) {
                        d.selected.push({ key: key, state: 2 });
                    }
                    else {
                        d.selected[ind].state = 2;
                    }
            }
            if (d.selected.length === 0) {
                d.state = 0;
            }
            else if (d.selected.length < d.num || d.selected.find(item => item.state === 2)) {
                d.state = 2;
            }
            else {
                d.state = 1;
            }
            d.model.__checked = d.state;
            me.__changeValue(d);
            setParentState(d, d.state);
        }
    }
    /**
     * 初始化key map
     * @param data
     */
    __initMap() {
        const me = this;
        let treeData = this.model['data'];
        if (!this.keyMap) {
            this.keyMap = new Map();
        }
        if (!treeData) {
            return;
        }
        genMap(treeData);
        /**
         * 生产map
         * @param data
         * @param pkey
         * @returns
         */
        function genMap(data, pkey) {
            if (!data) {
                return;
            }
            let o = { selected: [], state: 0, model: data };
            if (pkey) {
                o['pkey'] = pkey;
            }
            me.keyMap.set(data.$key, o);
            data.__checked = 0;
            if (data.children) {
                o['num'] = data.children.length;
                o['children'] = [];
                for (let d of data.children) {
                    genMap(d, data.$key);
                    o['children'].push(d.$key);
                }
            }
        }
    }
}
//注册模块
registModule(UITree, 'ui-tree');

/**
 * dialog插件
 * 参数说明
 * title:       标题
 * openField:   用于控制dialog打开和关闭的字段名
 * showClose:   是否显示close按钮
 */
class UIDialog extends Module {
    /**
     * 模版函数
     * @param props     父模块传递的属性值
     * @returns         模版字符串
     */
    template(props) {
        let closeStr = '';
        this.__openField = props.openField;
        this.model['open'] = this.srcDom.model[props.openField];
        if (props.hasOwnProperty('showClose')) {
            closeStr = `<div class='ui-panel-header-bar'>
                            <ui-button icon='cross' nobg='true' e-click='__close'/>
                        </div>`;
        }
        return `
            <div class={{open?'ui-dialog':'ui-dialog-hide'}}>
                <div class='ui-dialog-cover' />
                <div class='ui-dialog-body' style='width:${props.width};height:${props.height}'>
                    <div class='ui-panel'>
                        <div class='ui-panel-header'>
                            <span class='ui-panel-title'>${props.title}</span>
                            ${closeStr}
                        </div>
                        <div class='ui-panel-bodyct'>
                            <slot />
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * 关闭dialog
     * @param model
     * @param dom
     */
    __close(model) {
        this.model['open'] = false;
        this.srcDom.model[this.__openField] = false;
    }
    onCompile() {
        this.originTree.delProp('title');
    }
}
registModule(UIDialog, 'ui-dialog');

/**
 * file上传插件
 * valueField	值数据项名，对应上传后返回的valueField
 * displayField	显示数据项名，对应上传后返回的displayField
 * multiple	    是否支持多个文件，设置则表示上传多个文件
 * uploadUrl	上传url
 * deleteUrl	删除url
 * maxCount	    最大上传数量，multiple设置时有效
 * fileType	    上传资源类型，如果为image，上传成功后显示缩略图，否则显示文件名，对应数据项为displayField。
 */
class UIFile extends BaseInput {
    template(props) {
        this.__uploadName = props.uploadName;
        this.__valueField = props.valueField;
        this.__displayField = props.displayField;
        this.__multiple = props.multiple;
        this.__uploadUrl = props.uploadUrl;
        this.__deleteUrl = props.deleteUrl;
        this.__maxCount = props.maxCount ? parseInt(props.maxCount) : 0;
        this.__fileType = props.fileType;
        this.__urlField = props.urlField;
        this.__width = props.width || '100%';
        this.__height = props.height || '100%';
        //根据不同类型显示不同结果串
        const showStr = props.fileType === 'image' ? `<img src={{${props.urlField}}} />` : `<span>{{${props.displayField}}}</span>`;
        const singleStr = !this.__multiple ? 'ui-file-single' : '';
        return `
            <div class="ui-file ${singleStr}">
                <div class="ui-file-showct" x-show={{data.length>0}} >
                    <for cond={{data}} style='width:${this.__width};height:${this.__height}'>
                        <a class="ui-file-content" target="blank" href={{${props.displayField}}} >
                            ${showStr}
                        </a>
                        <b class="ui-file-del" e-click='__delete'/>
                    </for>
                </div>
                <!--显示upload-->
                <div class="ui-file-uploadct"  
                    x-show={{data.length===0 || this.__multiple && (this.__maxCount === 0 || this.__maxCount>data.length)}}
                    style='width:${this.__width};height:${this.__height}'>
                    <if cond={{uploading}}>
                        <span class='ui-file-uploading'>上传中...</span>
                    </if>
                    <else>
                        <div class="ui-file-toupload">
                            <span class="ui-file-add" />
                        </div>
                        <input type="file" class="ui-file-input" ${this.__multiple ? 'multiple' : ''} e-change='__changeFile'/>
                    </else>
                </div>
            </div>
        `;
    }
    data() {
        return {
            uploading: false,
            uploadingText: '上传中...',
            data: []
        };
    }
    onCompile() {
        this.originTree.delProp(['multiple', 'valueField', 'displayField', 'uploadUrl', 'deleteUrl', 'fileType', 'maxCount', 'width', 'height', 'urlField', 'uploadName']);
    }
    /**
     * 文件修改
     * @param model
     * @param dom
     */
    __changeFile(model, dom, evObj, e) {
        const el = this.getNode(dom.key);
        if (!el.files) {
            return;
        }
        model.uploading = true;
        let form = new FormData();
        for (let i = 0; i < el.files.length; i++) {
            form.append(this.__uploadName, el.files[i]);
        }
        //提交请求
        request({
            url: this.__uploadUrl,
            method: 'POST',
            params: form,
            header: {
                'Content-Type': 'multipart/form-data'
            },
            type: 'json'
        }).then((r) => {
            //上传显示
            model.uploading = false;
            model.data.push(r);
        });
    }
    /**
     * 删除上传文件
     * @param model
     */
    __delete(model) {
        if (!this.__deleteUrl || !this.__valueField) {
            return;
        }
        let param = {};
        param[this.__valueField] = model[this.__valueField];
        request({
            url: this.__deleteUrl,
            method: 'GET',
            params: param,
            header: {
                'Content-Type': 'multipart/form-data'
            },
            type: 'json'
        });
        //移除
        let ind = this.model['data'].find(item => item[this.__valueField] === model[this.__valueField]);
        if (ind !== -1) {
            this.model['data'].splice(ind, 1);
        }
    }
}
registModule(UIFile, 'ui-file');

/**
 * grid 插件
 * 配置参数
 *  $data           表格数据
 *  rowAlt          行颜色交替标志，不用设置值
 *  gridLine        网格线类型，包括cols(列) rows(行) both(行列)，默认无
 *  fixHead         是否固定表头，默认false
 *  checkable       是否显示复选框，默认false
 *  singleSelect    支持单选
 *  onSelectChange  选中更改时触发事件，只针对单行选中有效，传入参数为当前行model，对于头部check框选中无效
 */
class UIGrid extends Module {
    constructor() {
        super(...arguments);
        /**
         * 表格宽度
         */
        this.__width = 0;
        /**
         * 表头选中状态 0未选中 1选中 2部分选中
         */
        this.__headCheck = 0;
        /**
         * 模版生成次数
         */
        this.__templateTimes = 0;
    }
    template(props) {
        this.__rowAlt = props.hasOwnProperty('rowAlt');
        this.__fixHead = props.hasOwnProperty('fixHead');
        this.__gridLine = props.gridLine;
        this.__singleSelect = props.hasOwnProperty('singleSelect');
        this.__onSelectChange = props.onSelectChange;
        let expandStr = '';
        let expandHeadStr = '';
        let checkStr = '';
        let checkHeadStr = '';
        this.__templateTimes++;
        if (props.__expandDom) {
            this.__expandDom = props.__expandDom;
        }
        if (props.__columnDoms) {
            this.__columnDoms = props.__columnDoms;
        }
        //行展开容器字符串
        let expandCtStr = '';
        if (this.__expandDom) {
            expandStr = `<div class='ui-grid-row-item ui-grid-icon'>
                            <b class={{__expanded?'ui-expand-icon ui-expand-open':'ui-expand-icon'}} e-click='__clickExpand'/>
                        </div>`;
            expandHeadStr = `<div class='ui-grid-row-item ui-grid-icon'></div>`;
            expandCtStr = `<div class={{__expanded?'ui-grid-expand':'ui-grid-expand ui-grid-expand-hide'}} />`;
            //增加grid宽度
            if (this.__templateTimes === 1) {
                this.__width += 25;
            }
        }
        if (props.hasOwnProperty('checkable')) {
            checkStr = `<div class='ui-grid-row-item ui-grid-icon'>
                            <b class={{__genCheckCls(__checked)}} e-click='__clickCheck'/>
                        </div>`;
            checkHeadStr = `<div class='ui-grid-row-item ui-grid-icon'>
                        <b class={{__genCheckCls(this.__headCheck)}} e-click='__clickHeadCheck'/>
                    </div>`;
            //增加grid宽度，只在首次
            if (this.__templateTimes === 1) {
                this.__width += 25;
            }
        }
        //列标题串
        let colHeadStr = '';
        if (this.__columnDoms) {
            for (let col of this.__columnDoms) {
                let w = col.width;
                const style = w ? 'width:' + w + 'px' : 'flex:1';
                let sortStr = '';
                if (col.sortable && col.field) {
                    sortStr = `<div class='ui-grid-sort' field='${col.field}'>
                        <b class='ui-grid-sort-raise' e-click='__raiseSort' />
                        <b class='ui-grid-sort-down' e-click='__downSort'/>
                    </div>`;
                }
                colHeadStr += `
                    <div class='ui-grid-row-item' style='${style}'>
                        ${col.title}
                        ${sortStr}
                    </div>
                `;
                if (this.__templateTimes === 1) {
                    if (w) {
                        if (this.__width >= 0) {
                            this.__width += w;
                        }
                    }
                    else {
                        //flex 不计算宽度
                        this.__width = -1;
                    }
                }
            }
        }
        return `
            <div class={{__genGridCls()}}>
                <div class={{__genHeadCls()}} style={{__genWidthStyle()}}>
                    <div class='ui-grid-row'>
                        ${expandHeadStr}
                        ${checkHeadStr}
                        ${colHeadStr}
                    </div>
                </div>
                <div class='ui-grid-bodyct' e-scroll='__scrollBody'>
                    <div class={{__genBodyCls()}} style={{__genWidthStyle()}}>
                        <for cond={{data}} class='ui-grid-rowct'>
                            <div class='ui-grid-row'>
                                ${expandStr}
                                ${checkStr}
                            </div>
                            ${expandCtStr}
                        </for>
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * 编译后事件，动态添加列到body
     */
    onCompile() {
        //处理列节点
        let ct = this.originTree.children[1].children[0].children[0].children[0];
        for (let col of this.__columnDoms) {
            ct.add(col.node);
            Util.setNodeKey(col.node, Util.genId() + '', true);
        }
        //处理展开节点
        if (this.__expandDom) {
            ct = this.originTree.children[1].children[0].children[0].children[1];
            if (ct) {
                ct.add(this.__expandDom);
                Util.setNodeKey(this.props.__expandDom, Util.genId() + '', true);
            }
        }
        this.originTree.delProp(['__expandDom', '__columnDoms', 'gridLine', 'checkable', 'rowAlt', 'fixHead', 'onSelectChange']);
    }
    /**
     * 生产grid class
     * @returns     grid class
     */
    __genGridCls() {
        let arr = ['ui-grid'];
        if (this.__fixHead) {
            arr.push("ui-grid-fixhead");
        }
        if (this.__gridLine === 'rows') {
            arr.push('ui-grid-row-line');
        }
        else if (this.__gridLine === 'cols') {
            arr.push('ui-grid-col-line');
        }
        else if (this.__gridLine === 'both') {
            arr.push('ui-grid-all-line');
        }
        if (this.props.class) {
            arr.push(this.props.class);
        }
        return arr.join(' ');
    }
    /**
     * 产生grid width style，用于body和head
     * @returns style样式
     */
    __genWidthStyle() {
        return this.__width > 0 ? 'width:' + this.__width + 'px' : '';
    }
    /**
     * 产生head css
     * @returns css串
     */
    __genHeadCls() {
        let arr = ['ui-grid-head'];
        return arr.join(' ');
    }
    /**
     * 产生body css
     * @returns css串
     */
    __genBodyCls() {
        let arr = ['ui-grid-body'];
        if (this.__rowAlt) {
            arr.push("ui-grid-rowalt");
        }
        return arr.join(' ');
    }
    /**
     * 生成checkbox class
     * @param  st   状态 0未选中 1全选中 2部分选中
     * @returns     checkbox 的class
     */
    __genCheckCls(st) {
        if (!st) {
            return 'ui-icon-checkbox';
        }
        else if (st === 1) {
            return 'ui-icon-checked';
        }
        else {
            return 'ui-icon-partchecked';
        }
    }
    /**
     * 点击expand
     * @param model
     */
    __clickExpand(model) {
        model['__expanded'] = !model['__expanded'];
    }
    /**
     * 点击头部checkbox
     */
    __clickHeadCheck() {
        if (this.__singleSelect) {
            return;
        }
        let st = this.__headCheck === 1 ? 0 : 1;
        this.__headCheck = st;
        if (!this.model['data'] || this.model['data'].length === 0) {
            return;
        }
        //更新行checkbox状态
        for (let m of this.model['data']) {
            m['__checked'] = st;
        }
    }
    /**
     * 点击行 checkbox
     * @param model
     */
    __clickCheck(model, dom, evobj, e) {
        //单选，需要清理之前选中项
        if (this.__singleSelect) {
            if (this.__selectedModel) {
                this.__selectedModel.__checked = false;
            }
            model['__checked'] = 1;
            this.__headCheck = 2;
            this.__selectedModel = model;
        }
        else {
            model['__checked'] = model['__checked'] ? 0 : 1;
            //修改表头checkbox选中状态
            const rows = this.model['data'];
            const arr = rows.filter(item => item.__checked === 1);
            if (arr.length === rows.length) {
                this.__headCheck = 1;
            }
            else if (arr.length === 0) {
                this.__headCheck = 0;
            }
            else {
                this.__headCheck = 2;
            }
        }
        if (this.__onSelectChange) {
            this.invokeMethod(this.__onSelectChange, model, dom, evobj, e);
        }
    }
    /**
     * 升序排序
     * @param model 对应model
     * @param dom   虚拟dom节点
     */
    __raiseSort(model, dom, p) {
        const field = dom.parent.props['field'];
        this.model['data'].sort((a, b) => {
            return a[field] > b[field] ? 1 : -1;
        });
    }
    /**
     * 降序
     * @param model 绑定model
     * @param dom   虚拟dom节点
     */
    __downSort(model, dom) {
        const field = dom.parent.props['field'];
        this.model['data'].sort((a, b) => {
            return a[field] < b[field] ? 1 : -1;
        });
    }
    /**
     * 滚动表格body
     * @param model
     * @param dom
     * @param evObj
     * @param e
     */
    __scrollBody(model, dom, evObj, e) {
        if (!this.__fixHead) {
            return;
        }
        let el = e.currentTarget;
        let left = el.scrollLeft;
        this.getNode(this.originTree.children[0].key).style.transform = 'translateX(-' + left + 'px)';
    }
}
/**
 * grid colunn
 * 配置参数
 *  title       列标题
 *  width       宽度，不带单位，默认为px，如 widt='100'，如果不设置，则默认flex:1，如果自动铺满，最后一列不设置宽度
 *  sortable    是否排序，默认false
 *  field       如果sortable，则需要设置，以该字段排序
 */
class UIGridCol extends DefineElement {
    constructor(node) {
        super(node);
        if (!node.parent) {
            return;
        }
        //隐藏节点不添加
        if (node.hasProp('hidden')) {
            node.parent.remove(node);
            return;
        }
        let cols = node.parent.getProp('__columnDoms');
        if (!cols) {
            node.parent.setProp('__columnDoms', []);
            cols = node.parent.getProp('__columnDoms');
        }
        //不重复添加
        if (cols.find(item => item.title === node.getProp('title'))) {
            return;
        }
        //设置宽度和class
        let w = node.getProp('width');
        if (w !== undefined) {
            w = parseInt(w);
        }
        node.setProp('class', 'ui-grid-row-item');
        node.setProp('style', w ? 'width:' + w + 'px' : 'flex:1');
        cols.push({
            title: node.getProp('title'),
            width: w,
            field: node.getProp('field'),
            sortable: node.hasProp('sortable'),
            node: node
        });
        node.delProp(['title', 'width', 'field']);
    }
}
/**
 * 行展开内容
 */
class UIGridExpand extends DefineElement {
    constructor(node) {
        super(node);
        if (node.parent) {
            node.parent.setProp('__expandDom', node);
        }
    }
}
//注册模块
registModule(UIGrid, 'ui-grid');
DefineElementManager.add(UIGridCol, 'ui-grid-col');
DefineElementManager.add(UIGridExpand, 'ui-grid-expand');

/**
 * list插件
 * 配置说明
 * $data：          列表数据数组
 * field:           绑定父模块的字段
 * valueField：     值字段
 * disableField：   禁用字段（表示记录项不可点击）
 * onItemClick：    点击事件
 */
class UIList extends BaseInput {
    constructor() {
        super(...arguments);
        /**
         * 选中model
         */
        this.__selectedModels = [];
    }
    template(props) {
        super.template(props);
        this.__multiple = props.hasOwnProperty('multiple');
        this.__valueField = props.valueField;
        this.__disableField = props.disableField;
        this.__onItemClick = props.onItemClick;
        let disableCtx = '';
        if (props.disableField) {
            disableCtx = "+ (" + props.disableField + "?' ui-list-item-disable':'')";
        }
        return `
            <div class="ui-list">
                <div x-repeat={{data}} class={{'ui-list-item' + (__selected?' ui-list-item-active':'')  ${disableCtx} }} e-click='__clickItem'>
                    <div class='ui-list-itemcontent'>
                        <slot innerRender/>
                    </div>
                    <b class="ui-list-icon"></b>
                </div>
            </div>
        `;
    }
    /**
     * 点击item
     * @param model
     * @param dom
     * @returns
     */
    __clickItem(model, dom, evobj, e) {
        if (!this.__field || this.__disableField && model[this.__disableField]) {
            return;
        }
        let value;
        if (this.__multiple) {
            model['__selected'] = !model['__selected'];
            value = this.model['__value'] || [];
            if (!Array.isArray(value)) {
                value = [value];
            }
            if (model['__selected']) {
                value.push(model[this.__valueField]);
            }
            else {
                let index = value.indexOf(model[this.__valueField]);
                if (index !== -1) {
                    value.splice(index, 1);
                }
            }
        }
        else {
            if (this.__selectedModels.length > 0) {
                this.__selectedModels[0]['__selected'] = false;
                this.__selectedModels.pop();
            }
            model['__selected'] = true;
            this.__selectedModels.push(model);
            value = model[this.__valueField];
        }
        //设置值
        super.__change(value, true);
        //触发itemclick事件
        if (this.__onItemClick) {
            this.getParent().invokeMethod(this.__onItemClick, model, dom, evobj, e);
        }
    }
    /**
     * 设置值
     * @param value
     * @returns
     */
    __initValue() {
        super.__initValue();
        let rows = this.model['data'];
        if (!this.__field || !Array.isArray(rows)) {
            return;
        }
        let value = this.model['__value'];
        this.__selectedModels = [];
        if (this.__multiple) {
            if (!Array.isArray(value)) {
                value = [value];
            }
            for (let m of rows) {
                if (value.indexOf(m[this.__valueField]) !== -1) {
                    this.__selectedModels.push(m);
                    m['__selected'] = true;
                }
            }
        }
        else {
            for (let m of rows) {
                if (value === m[this.__valueField]) {
                    this.__selectedModels.push(m);
                    m['__selected'] = true;
                    break;
                }
            }
        }
    }
    onCompile() {
        this.originTree.delProp(['multiple', 'valueField', 'displayField', 'disableField', 'onItemClick']);
    }
}
registModule(UIList, 'ui-list');

/**
 * list transfer 插件
 *
 */
class UIListTransfer extends BaseInput {
    template(props) {
        super.template(props);
        this.__valueField = props.valueField;
        this.__disableField = props.disableField;
        this.__value = props.value;
        if (props.template) ;
        else {
            '{{' + props.displayField + '}}';
        }
        let disableCtx = '';
        if (props.disableField) {
            disableCtx = "+ (" + props.disableField + "?' ui-list-item-disable':'')";
        }
        return `
            <div class="ui-listtransfer">
                <div class='ui-list'>
                    <div x-repeat={{__getLeftRows()}} class={{'ui-list-item' + (__selected?' ui-list-item-active':'')  ${disableCtx} }} 
                        e-click='__clickItem'>
                        <div class='ui-list-itemcontent'>
                            <slot innerRender/>
                        </div>
                        <b class="ui-list-icon"></b>
                    </div>
                </div>
                <div class='ui-listtransfer-btngrp'>
                    <ui-button icon='double-arrow-right' e-click='__rightClick1'/>
                    <ui-button icon='arrow-right' e-click='__rightClick'/>
                    <ui-button icon='arrow-left' e-click='__leftClick'/>
                    <ui-button icon='double-arrow-left' e-click='__leftClick1'/>
                </div>

                <div class='ui-list'>
                    <div x-repeat={{__getRightRows()}} class={{'ui-list-item' + (__selected?' ui-list-item-active':'')  ${disableCtx} }} 
                        e-click='__clickItem'>
                        <div class='ui-list-itemcontent'>
                            <slot innerRender/>
                        </div>
                        <b class="ui-list-icon"></b>
                    </div>
                </div>
            </div>
        `;
    }
    onBeforeRender() {
        if (this.__value) {
            this.__setValue(this.__value);
        }
    }
    /**
     * 获取左边列表数据
     * @returns
     */
    __getLeftRows() {
        if (!this.model['data']) {
            return;
        }
        return this.model['data'].filter(item => !item.__valued);
    }
    /**
     * 获取右边列表数据
     * @returns
     */
    __getRightRows() {
        if (!this.model['data']) {
            return;
        }
        return this.model['data'].filter(item => item.__valued);
    }
    /**
     * 点击item
     * @param model
     * @param dom
     * @returns
     */
    __clickItem(model, dom, evobj, e) {
        if (this.__disableField && model[this.__disableField]) {
            return;
        }
        model['__selected'] = !model['__selected'];
    }
    /**
     * 设置值
     * @param value
     * @returns
     */
    __setValue(value) {
        let rows = this.model['data'];
        if (!this.__field || !Array.isArray(rows)) {
            return;
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        for (let m of rows) {
            if (value.indexOf(m[this.__valueField]) !== -1) {
                m['__valued'] = true;
            }
            else {
                m['__valued'] = false;
            }
        }
        this.__value = value;
    }
    /**
     * 把选中节点传递到右边
     * @param model
     * @param dom
     */
    __rightClick(model, dom) {
        if (!this.model['data']) {
            return;
        }
        let rows = this.model['data'].filter(item => !item.__valued && item.__selected);
        if (rows) {
            for (let r of rows) {
                r.__valued = true;
            }
        }
        this.__updateValue();
    }
    /**
     * 把所有节点传递到右边
     * @param model
     * @param dom
     */
    __rightClick1(model, dom) {
        if (!this.model['data']) {
            return;
        }
        for (let r of this.model['data']) {
            if (!this.__disableField || !r[this.__disableField]) {
                r.__valued = true;
            }
        }
        this.__updateValue();
    }
    /**
     * 把选中节点传递到左边
     * @param model
     * @param dom
     * @returns
     */
    __leftClick(model, dom) {
        if (!this.model['data']) {
            return;
        }
        let rows = this.model['data'].filter(item => item.__valued && item.__selected);
        if (rows) {
            for (let r of rows) {
                r.__valued = false;
                r.__selected = false;
            }
        }
        this.__updateValue();
    }
    /**
     * 把所有节点传递到左边
     * @param model
     * @param dom
     * @returns
     */
    __leftClick1(model, dom) {
        if (!this.model['data']) {
            return;
        }
        for (let r of this.model['data']) {
            r.__valued = false;
        }
        this.__updateValue();
    }
    /**
     * 更新值
     * @returns
     */
    __updateValue() {
        if (!this.model['data'] || !this.__valueField || !this.__field) {
            return;
        }
        let v = [];
        for (let r of this.model['data']) {
            if (r.__valued) {
                v.push(r[this.__valueField]);
                r.__selected = false;
            }
        }
        //设置值
        this.srcDom.model.$set(this.__field, v);
    }
}
registModule(UIListTransfer, 'ui-listtransfer');

/**
 * 菜单插件
 * 数据项
 * data             菜单结构数据
 * 参数说明
 * type：           菜单类型: 0横向  1纵向
 * onItemClick：    菜单项点击事件
 */
class UIMenu extends Module {
    /**
     * 模版函数
     * @param props     父模块传递的属性值
     * @returns         模版字符串
     */
    template(props) {
        this.__type = props.type ? parseInt(props.type) : 0;
        this.__onItemClick = props.onItemClick;
        this.__width = props.width && props.width !== '' ? parseInt(props.width) : 150;
        this.__expandType = props.expandType === '1' && props.type === '1' ? 1 : 0;
        let iconStr = '';
        let firstMenuCls = '';
        if (this.__type === 0) {
            firstMenuCls = 'ui-menu-hori-first';
        }
        else if (this.__type === 1) {
            firstMenuCls = 'ui-menu-vert-first ui-menu-subct-expand';
            iconStr = "<b x-show={{children&&children.length>0}} class='ui-menu-subicon'></b>";
        }
        let styleArr1 = [];
        if (props.bgColor) {
            styleArr1.push('background-color:' + props.bgColor);
        }
        if (props.color) {
            styleArr1.push('color:' + props.color);
        }
        let menuStyle = styleArr1.join(';');
        let styleArr2 = [];
        if (props.activeBgColor) {
            styleArr2.push('background-color:' + props.activeBgColor);
        }
        if (props.activeColor) {
            styleArr2.push('color:' + props.activeColor);
        }
        let activeClass = '';
        let activeStyle;
        if (styleArr2.length > 0) {
            activeStyle = "(__active?'" + styleArr2.join(";") + "':'" + styleArr1.join(";") + "')";
        }
        else if (styleArr1.length > 0) {
            activeStyle = "(__active?'':'" + styleArr1.join(";") + "')";
        }
        else {
            //默认激活样式
            activeClass = "+ (__active?' ui-menu-active':'')";
        }
        //菜单style
        let style1 = "style={{" + (this.__type === 1 ? "'padding-left:' + __level * 20 + 'px;'" : '');
        if (activeStyle) {
            style1 += " + " + activeStyle;
        }
        style1 += "}}";
        //容器样式
        let subctStr = '';
        if (this.__expandType === 1) {
            subctStr = "class = {{'ui-menu-subct-expand' + (!__opened?' ui-menu-subct-expand-hide':'')}}";
        }
        else {
            subctStr = `class={{'ui-menu-subct-pop' + (!__opened?' ui-menu-subct-pop-hide':'')}} 
                style={{'width:${this.__width}px;height:' + children.length * 30 + 'px;left:' + __x + 'px;top:' + __y + 'px'}} `;
        }
        //弹出式相关属性
        const popStr = "e-mouseenter='__expandMenu' e-mouseleave='__closeMenu' e-click='__clickMenu:nopopo' type='2'";
        //展开式相关属性
        const expandStr = "e-click='__clickMenu:nopopo'";
        //第一级菜单
        let firstStr;
        if (this.__type === 0) { //横向
            firstStr = "e-mouseenter='__expandMenu' e-mouseleave='__closeMenu' type='1'";
        }
        else if (this.__expandType === 1) { //纵向展开
            firstStr = expandStr;
        }
        else {
            firstStr = popStr;
        }
        return `
            <div class='ui-menu' style='${menuStyle}'>
                <div class='${firstMenuCls}'>
                    <for cond={{data}} class='ui-menu-nodect ui-menu-first' ${firstStr}>
                        <div class={{'ui-menu-node' ${activeClass}}} 
                            ${style1}
                            e-click='__clickMenu:nopopo'>
                            <slot innerRender/>
                            ${iconStr}
                        </div>
                        <recur cond='children' ${subctStr} >
                            <div style='${menuStyle}'>
                                <for cond={{children}} class='ui-menu-nodect' ${this.__expandType === 1 ? expandStr : popStr} >
                                    <div class={{'ui-menu-node' ${activeClass}}} 
                                        ${style1}
                                        type='${this.__expandType === 1 ? 1 : 2}'>
                                        <slot innerRender/>
                                        <b x-show={{children&&children.length>0}} class='ui-menu-subicon'></b>
                                    </div>
                                    <recur ref />
                                </for>
                            </div>
                        </recur>
                    </for>
                </div>
            </div>
        `;
    }
    /**
     * 点击item事件
     * @param model     当前dom对应model
     * @param dom       virtual dom节点
     * @param eobj      NEvent对象
     * @param e         event对象
     */
    __clickMenu(model, dom, eobj, e) {
        //处理显示和隐藏
        if (model.children && this.__expandType === 1) {
            model['__opened'] = !model['__opened'];
        }
        this.__setActive(model);
        //click事件
        if (this.__onItemClick) {
            this.getParent().invokeMethod(this.__onItemClick, model, dom, eobj, e);
        }
    }
    /**
     * 叶子结点激活
     * @param model
     */
    __setActive(model) {
        if (!model.children) {
            if (this.__activeModel) {
                this.__activeModel['__active'] = false;
            }
            model['__active'] = true;
            this.__activeModel = model;
        }
    }
    /**
     * 展开关闭节点
     * @param model     当前dom对应model
     * @param dom       virtual dom节点
     * @param eobj      NEvent对象
     * @param e         event对象
     */
    __expandMenu(model, dom, eobj, e) {
        if (model['__opened'] || !model['children'] || model['children'].length === 0) {
            return;
        }
        model['__opened'] = true;
        if (!this.__expandType) {
            this.__cacLoc(model, dom, eobj, e);
        }
    }
    /**
     * 关闭子菜单
     * @param model     当前dom对应model
     */
    __closeMenu(model) {
        if (!model['__opened']) {
            return;
        }
        model['__opened'] = false;
    }
    /**
     * 计算位置
     * @param model     模型
     * @param dom       当前节点
     * @param ev        event object
     * @param e         html event
     */
    __cacLoc(model, dom, ev, e) {
        if (!model.children) {
            return;
        }
        let relPos = dom.props['type'] === '1' ? 1 : 2;
        let target = e.currentTarget;
        let pos = UITool.cacPosition(target, relPos, this.__width, model.children.length * 30);
        //增加边
        if (relPos === 2) {
            pos[0] += 8;
        }
        model.__x = pos[0];
        model.__y = pos[1];
    }
    onCompile() {
        this.originTree.delProp(['onItemClick', 'type', 'expandType', 'bgColor', 'color', 'activeBgColor', 'activeColor']);
    }
    onBeforeRender() {
        const me = this;
        //设置level
        if (this.__type === 0 || !this.model['data']) {
            return;
        }
        for (let d of this.model['data']) {
            if (!d.__level) {
                setLevel(d, 1);
            }
        }
        //设置active
        if (!this.__activeModel) {
            for (let d of this.model['data']) {
                if (setActive(d)) {
                    return;
                }
            }
        }
        /**
         * 设置level
         * @param data
         * @param level
         * @returns
         */
        function setLevel(data, level) {
            if (data.__level) {
                return;
            }
            data.__level = level;
            if (data.children) {
                for (let d of data.children) {
                    setLevel(d, level + 1);
                }
            }
        }
        /**
         * 设置激活对象
         * @param data
         * @returns
         */
        function setActive(data) {
            if (data.__active) {
                me.__setActive(data);
                return data;
            }
            if (data.children) {
                for (let d of data.children) {
                    setActive(d);
                }
            }
        }
    }
}
//注册模块
registModule(UIMenu, 'ui-menu');

/**
 * 分页插件
 * $total              total值
 * 参数说明
 * showPageSizeList:    显示pagesize选择列表
 * sizeArray：          页面大小，数组字符串，默认[10,20,30,50]
 * showTotal:           显示总记录数
 * showGo:              显示跳转
 * showNum:             显示页面号的数量，默认10
 * bigStep:             一大步移动页数
 * onChange:            页号或页面大小改变时执行方法名
 */
class UIPagination extends Module {
    /**
     * 模版函数
     * @param props     父模块传递的属性值
     * @returns         模版字符串
     */
    template(props) {
        this.__watch();
        this.__pageChangeHook = props.onChange;
        this.__bigStep = props.bigStep ? parseInt(props.bigStep) : 5;
        if (props.pageSize && !this.model['pageSize']) {
            this.model['pageSize'] = props.pageSize;
            this.__pageSize = parseInt(props.pageSize);
        }
        if (props.pageNo && !this.model['pageNo']) {
            this.model['pageNo'] = props.pageNo;
            this.__pageNo = parseInt(props.pageNo);
        }
        this.__showNum = props.showNum ? parseInt(props.showNum) : 10;
        //页面大小选择列表
        let pageArrStr = '';
        if (props.hasOwnProperty('showPageSizeList')) {
            if (!this.model['pageSizeArr']) {
                let sizeArr = [];
                let a = props.sizeArray ? JSON.parse(props.sizeArray) : [10, 20, 30, 50];
                for (let d of a) {
                    sizeArr.push({
                        size: d + ''
                    });
                }
                this.model['pageSizeArr'] = sizeArr;
            }
            pageArrStr = `
                <ui-select style='width:80px' field='pageSize' $data={{pageSizeArr}} valueField='size' displayField='size'/>
            `;
        }
        let totalStr = '';
        if (props.hasOwnProperty('showTotal')) {
            totalStr = `<div class='ui-pagination-totalct'>共<span class="ui-pagination-total">{{total}}</span>条</div>`;
        }
        let goStr = '';
        if (props.hasOwnProperty('showGo')) {
            goStr = `<div class="ui-pagination-go">
                    第&nbsp;<input type="number" value={{pageNo}} x-field='pageNo' min='1' max={{this.__pageCount}}>&nbsp;页
                </div>`;
        }
        let pageCls = 'ui-pagination' + (props.class ? ' ' + props.class : '');
        return `
            <div class='${pageCls}' ${props.style ? 'style="' + props.style + '"' : ''}>
                ${totalStr}
                    
                <if cond={{pages.length>0}} class='ui-pagination-data' tag='div'>
                    ${pageArrStr}
                
                    <div class="ui-pagination-pagect">
                        <b class={{'ui-pagination-leftarrow1' + (this.__pageNo===1?' ui-pagination-disable':'')}}  e-click='__reduceMore'/>
                        <b class={{'ui-pagination-leftarrow' + (this.__pageNo===1?' ui-pagination-disable':'')}}  e-click='__reduceOne'/>
                            <span x-repeat={{pages}}
                                class={{'ui-pagination-page' + (this.__pageNo===page?' ui-pagination-active':'')}}
                                e-click='__clickPage'>
                                {{page}}
                            </span>
                            <b class={{'ui-pagination-rightarrow' + (this.__pageNo===this.__pageCount?' ui-pagination-disable':'')}} e-click='__addOne'/>
                            <b class={{'ui-pagination-rightarrow1' + (this.__pageNo===this.__pageCount?' ui-pagination-disable':'')}}  e-click='__addMore'/>
                    </div>
                    ${goStr}
                </if>
                <else class tag='div'>
                    无数据
                </else>
                
            </div>
        `;
    }
    data() {
        return {
            pageNo: 0,
            pageSize: 0,
            total: 0,
            pages: []
        };
    }
    onCompile() {
        this.originTree.delProp(['onChange', 'showNum', 'showGo', 'sizeArray', 'bigStep', 'showPageSizeList']);
    }
    /**
     * 页号修改钩子
     */
    __changePage() {
        if (!this.__pageNo || !this.__pageSize) {
            return;
        }
        let pm = this.getParent();
        //事件回调
        if (this.__pageChangeHook && pm) {
            pm.invokeMethod(this.__pageChangeHook, this.__pageNo, this.__pageSize);
        }
    }
    /**
     * 首次渲染前事件
     * @param model
     */
    onBeforeFirstRender(model) {
        //初始化pagesize列表框
        for (let c of this.originTree.children) {
            if (c.tagName === 'select') {
                //延迟设置，因为option还没渲染出来
                setTimeout(() => {
                    let el = this.getNode(c.key);
                    el.value = model['pageSize'];
                }, 0);
                break;
            }
        }
        //初始化pageCount
        if (!this.__pageCount) {
            let count = model['total'];
            this.__pageCount = Math.ceil(count / this.__pageSize);
        }
    }
    /**
     * 添加监听
     */
    __watch() {
        if (this.__watched) {
            return;
        }
        //增加监听事件
        this.model.$watch('pageNo', (model, ov, nv) => {
            this.__pageNo = parseInt(nv);
            this.__changePage();
            this.__cacPages();
        });
        this.model.$watch('pageSize', (model, ov, nv) => {
            this.__pageSize = parseInt(nv);
            this.__pageCount = Math.ceil(model['total'] / this.__pageSize);
            this.__changePage();
            this.__cacPages();
        });
        this.model.$watch('total', (m, ov, nv) => {
            this.__pageCount = Math.ceil(nv / this.__pageSize);
            this.__cacPages();
        });
        this.__watched = true;
    }
    /**
     * 设置页面
     * @param page  页面号
     */
    __setPage(page) {
        if (!page) {
            page = this.__pageNo;
        }
        let count = this.__pageCount;
        if (page > count) {
            page = count;
        }
        else if (page < 1) {
            page = 1;
        }
        this.model['pageNo'] = page + '';
        this.__pageNo = page;
    }
    /**
     * 点击页
     * @param model
     */
    __clickPage(model) {
        this.__setPage(model.page);
    }
    /**
     * 页号减1
     */
    __reduceOne() {
        if (this.__pageNo === 1) {
            return;
        }
        this.__setPage(this.__pageNo - 1);
    }
    /**
     * 页号加1
     */
    __addOne() {
        if (this.__pageNo === this.__pageCount) {
            return;
        }
        this.__setPage(this.__pageNo + 1);
    }
    /**
     * 页号减bigStep
     */
    __reduceMore() {
        if (this.__pageNo === 1) {
            return;
        }
        this.__setPage(this.__pageNo - this.__bigStep);
    }
    /**
     * 页号加bigStep
     */
    __addMore() {
        if (this.__pageNo === this.__pageCount) {
            return;
        }
        this.__setPage(this.__pageNo + this.__bigStep);
    }
    /**
     * 计算最大最小页号
     */
    __cacPages() {
        let step = this.__showNum / 2 | 0;
        let minPage;
        let maxPage;
        const count = this.__pageCount;
        if (count === 0) {
            minPage = 0;
            maxPage = 0;
            this.model['pages'] = [];
            return;
        }
        else if (count <= this.__showNum) {
            minPage = 1;
            maxPage = count;
        }
        else { //页面数大于显示数
            minPage = this.__pageNo - step;
            maxPage = this.__pageNo + step;
            if (maxPage - minPage === this.__showNum) {
                maxPage--;
            }
            //处理page范畴
            if (minPage > count) {
                minPage = count - this.__showNum + 1;
                maxPage = count;
            }
            else if (minPage < 1) {
                maxPage += 1 - minPage;
                minPage = 1;
            }
            if (maxPage < 1) {
                minPage = 1;
                maxPage = this.__showNum;
            }
            else if (maxPage > count) {
                minPage = count - this.__showNum + 1;
                maxPage = count;
            }
        }
        //重新计算pages
        let pages = this.model['pages'];
        if (pages.length === 0 || pages[0].page !== minPage || pages[pages.length - 1].page !== maxPage) {
            let finded = false;
            pages = [];
            for (let i = minPage; i <= maxPage; i++) {
                pages.push({ page: i });
                if (this.__pageNo === i) {
                    finded = true;
                }
            }
            this.model['pages'] = pages;
            if (!finded) {
                //pageNo不在max min内，需要重新设置
                let pno = this.__pageNo;
                if (pno < minPage) {
                    pno = minPage;
                }
                else if (pno > maxPage) {
                    pno = maxPage;
                }
                this.model['pageNo'] = pno + '';
            }
        }
    }
}
//注册模块
registModule(UIPagination, 'ui-pagination');

/**
 * panel插件
 * 参数说明
 * title:   标题
 * buttons: 按钮，以','分割，按钮事件以'|'分割,如：minus|clickMinus,close|clickClose
 */
class UIPanel extends Module {
    constructor() {
        super(...arguments);
        /**
         * 事件对象，{按钮名:事件名}
         */
        this.events = {};
    }
    /**
     * 模版函数
     * @param props     父模块传递的属性值
     * @returns         模版字符串
     */
    template(props) {
        let iconStr = '';
        let style = '';
        if (props.bgColor) {
            style += 'background-color:' + props.bgColor + ';';
        }
        if (props.color) {
            style += 'color:' + props.color;
        }
        if (props.buttons) {
            iconStr = "<div class='ui-panel-header-bar'>";
            let arr = props.buttons.split(',');
            for (let icon of arr) {
                let a = icon.split('|');
                if (a.length === 1) {
                    iconStr += `<ui-button icon='${a[0]}' nobg/>`;
                }
                else if (a.length === 2) {
                    iconStr += `<ui-button icon='${a[0]}' nobg e-click='clickButton'/>`;
                    this.events[a[0]] = a[1];
                }
            }
            iconStr += "</div>";
        }
        return `
            <div class='ui-panel'>
                <div class='ui-panel-header' style='${style}'>
                    <span class='ui-panel-title'>${props.title}</span>
                    ${iconStr}
                </div>
                <div class='ui-panel-bodyct'>
                    <slot />
                </div>
            </div>
        `;
    }
    clickButton(model, dom) {
        for (let p in this.events) {
            if (dom.props['class'].indexOf('ui-icon-' + p) !== -1) {
                let pm = this.getParent();
                pm.invokeMethod(this.events[p], pm.model);
                break;
            }
        }
    }
    onCompile() {
        this.originTree.delProp(['title', 'buttons']);
    }
}
/**
 * panel body
 */
class UIPanelBody extends Module {
    template(props) {
        'ui-panel-body' + (props.class ? ' ' + props.class : '');
        return `
            <div class='ui-panel-body'>
                <slot />
            </div>
        `;
    }
}
/**
 * toolbar
 */
class UIToolbar extends Module {
    constructor() {
        super(...arguments);
        this.modules = [UIButton];
    }
    template(props) {
        return `
            <div class='ui-toolbar'>
                <slot />
            </div>
        `;
    }
}
/**
 * button group
 */
class UIButtonGroup extends Module {
    constructor() {
        super(...arguments);
        this.modules = [UIButton];
    }
    template(props) {
        return `
            <div class='ui-button-group'>
                <slot/>
            </div>
        `;
    }
}
//注册模块
registModule(UIPanel, 'ui-panel');
registModule(UIPanelBody, 'ui-panel-body');
registModule(UIToolbar, 'ui-toolbar');
registModule(UIButtonGroup, 'ui-button-group');

/**
 * radio group插件
 */
class UIRadioGroup extends BaseInput {
    constructor() {
        super(...arguments);
        /**
         * 子model数组
         */
        this.__models = [];
    }
    template(props) {
        super.template(props);
        return `
            <div class='ui-radiogroup'>
                <slot />
            </div>
        `;
    }
    /**
     * 设置当前子model
     * @param model
     */
    __setCurrentModel(model) {
        if (this.__currentModel) {
            this.__currentModel.checked = false;
        }
        model.checked = true;
        this.__currentModel = model;
        super.__change(model.value, true);
    }
    /**
     * 添加子model
     * @param model     子model
     * @returns
     */
    __addModel(model) {
        if (this.__models.includes(model)) {
            return;
        }
        this.__models.push(model);
        if (model.value == this.model['__value']) {
            this.__setCurrentModel(model);
        }
        else {
            model.checked = false;
        }
    }
    /**
     * 更改值
     * @param value     新值
     */
    __change(value) {
        super.__change(value);
        for (let m of this.__models) {
            if (m['value'] == value) {
                this.__setCurrentModel(m);
                break;
            }
        }
    }
}
/**
 * radio插件
 * 配置说明
 * field:           绑定父模块的字段
 */
class UIRadio extends Module {
    template(props) {
        this.model['value'] = props.value;
        return `
            <span class={{'ui-radio ' + (checked?'ui-radio-active':'ui-radio-unactive')}} e-click='__clickCheck'>
                <b/>
                <span>${props.title}</span>
            </span>    
        `;
    }
    onBeforeFirstRender(model) {
        const pm = this.getParent();
        pm.__addModel(model);
    }
    __clickCheck(model) {
        this.getParent().__setCurrentModel(model);
    }
}
registModule(UIRadioGroup, 'ui-radiogroup');
registModule(UIRadio, 'ui-radio');

/**
 * 关系图插件
 * 参数说明
 * $data:           rows和cols定义
 * $value:          对应的数据数组
 * displayField:    用于显示的字段，rows和cols保持已知
 * valueField:      值字段，rows和cols保持已知
 */
class UIRelationMap extends BaseInput {
    /**
     * 模版函数
     * @param props     父模块传递的属性值
     * @returns         模版字符串
     */
    template(props) {
        super.template(props);
        this.__valueField = props.valueField;
        this.__displayField = props.displayField;
        return `
            <table class='ui-relationmap' x-model='data'>
                <tr class="ui-relationmap-head">
                    <td></td> 
                    <td x-repeat={{cols}}>{{${this.__displayField}}}</td>
                </tr>
                <tr class='ui-relationmap-row' x-repeat={{rows}}>
                    <td>{{${this.__displayField}}}</td>
                    <td x-repeat={{__values}} e-click='__clickItem'>
                        <b class={{__checked?'ui-icon-select':''}}/>
                    </td>
                </tr>
            </table>
        `;
    }
    /**
     * 初始化值
     */
    __initValue() {
        super.__initValue();
        let model = this.model;
        if (!model.data) {
            return;
        }
        if (!model.__value) {
            model.__value = [];
        }
        for (let row of model.data.rows) {
            row.__values = [];
            for (let col of model.data.cols) {
                let find = false;
                for (let v of model.__value) {
                    if (v && row[this.__valueField] === v[0] && col[this.__valueField] === v[1]) {
                        find = true;
                        break;
                    }
                }
                row.__values.push({ __checked: find, row: row[this.__valueField], col: col[this.__valueField] });
            }
        }
    }
    /**
     * 点击dom
     * @param model     dom对应model
     */
    __clickItem(model) {
        let index = this.model['__value'].findIndex(item => item[0] === model.row && item[1] === model.col);
        if (model.__checked) {
            if (index !== -1) {
                this.model['__value'].splice(index, 1);
            }
        }
        else if (index === -1) {
            this.model['__value'].push([model.row, model.col]);
        }
        //TODO 数据没触发渲染，强制渲染一下
        Renderer.add(this);
    }
}
//注册模块
registModule(UIRelationMap, 'ui-relationmap');

/**
 * select插件
 * 配置说明
 * $data：          列表数据数组
 * field:           绑定父模块的字段
 * valueField：     值字段
 * displayField：   显示字段
 * disableField：   禁用字段（表示记录项不可点击）
 */
class UISelect extends BaseInput {
    constructor() {
        super(...arguments);
        /**
         * 选中model
         */
        this.selectedModels = [];
    }
    template(props) {
        super.template(props);
        this.__multiple = props.hasOwnProperty('multiple');
        this.__valueField = props.valueField;
        this.__displayField = props.displayField;
        this.__disableField = props.disableField;
        let listCtx;
        if (props.template) {
            listCtx = props.template;
        }
        else {
            listCtx = '{{' + props.displayField + '}}';
        }
        let disableCtx = '';
        if (props.disableField) {
            disableCtx = "+ (" + props.disableField + "?' ui-select-item-disable':'')";
        }
        return `
            <div class="ui-select" e-mouseleave='__closeBox'>
                <div class="ui-select-inputct" e-click='__toggleBox'>
                    <input class="ui-select-show" readonly="true" value={{__showValue}}>
                    <b />
                </div>
                <div class={{'ui-select-list' + (!__open?' ui-select-list-hide':'')}} 
                    style={{'left:' + __x + 'px;top:' + __y + 'px'}}>
                    <div>
                        <div class={{'ui-select-item' + (__selected?' ui-select-item-active':'')  ${disableCtx} }}
                             x-repeat={{data}} e-click='__clickItem'>
                            <div class="ui-select-itemcontent">${listCtx}</div>
                            <b class="ui-select-icon" />
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    data() {
        return {
            __open: false,
            __showValue: ''
        };
    }
    /**
     * 交替 list box
     */
    __toggleBox(model, dom, ev, e) {
        if (this.model['__open']) {
            this.__closeBox();
        }
        else {
            this.__openBox(model, dom, ev, e);
        }
    }
    /**
     * 打开list box
     */
    __openBox(model, dom, ev, e) {
        this.__cacLoc(model, dom, ev, e);
        this.model['__open'] = true;
    }
    /**
     * 关闭list box
     */
    __closeBox() {
        this.model['__open'] = false;
    }
    /**
     * 点击item
     * @param model
     * @param dom
     * @returns
     */
    __clickItem(model, dom, evobj, e) {
        if (!this.__field || this.__disableField && model[this.__disableField]) {
            return;
        }
        let value;
        if (this.__multiple) {
            model['__selected'] = !model['__selected'];
            value = this.model['__value'] || [];
            if (!Array.isArray(value)) {
                value = [value];
            }
            if (model['__selected']) {
                value.push(model[this.__valueField]);
            }
            else {
                let index = value.indexOf(model[this.__valueField]);
                if (index !== -1) {
                    value.splice(index, 1);
                }
            }
        }
        else {
            if (this.selectedModels.length > 0) {
                this.selectedModels[0]['__selected'] = false;
                this.selectedModels.pop();
            }
            model['__selected'] = true;
            this.__closeBox();
            value = model[this.__valueField];
        }
        this.selectedModels.push(model);
        let showArr = [];
        for (let m of this.selectedModels) {
            showArr.push(m[this.__displayField]);
        }
        this.model['__showValue'] = showArr.join(',');
        //设置值
        this.__change(value, true);
    }
    /**
     * 设置值
     * @returns
     */
    __initValue() {
        super.__initValue();
        let rows = this.model['data'];
        if (!this.__field || !Array.isArray(rows)) {
            return;
        }
        let value = this.model['__value'];
        this.selectedModels = [];
        let showArr = [];
        if (this.__multiple) {
            if (!Array.isArray(value)) {
                value = [value];
            }
            for (let m of rows) {
                if (value.indexOf(m[this.__valueField]) !== -1) {
                    this.selectedModels.push(m);
                    m['__selected'] = true;
                    showArr.push(m[this.__displayField]);
                }
            }
        }
        else {
            for (let m of rows) {
                if (value === m[this.__valueField]) {
                    this.selectedModels.push(m);
                    m['__selected'] = true;
                    showArr.push(m[this.__displayField]);
                    break;
                }
            }
        }
        this.model['__showValue'] = showArr.join(',');
    }
    /**
     * 计算位置
     * @param model     模型
     * @param dom       当前节点
     * @param ev        event object
     * @param e         html event
     */
    __cacLoc(model, dom, ev, e) {
        let target = e.currentTarget;
        let pos = UITool.cacPosition(target, 1, target.offsetWidth, model.data.length * 30);
        model.__x = pos[0];
        model.__y = pos[1];
    }
}
registModule(UISelect, 'ui-select');

/**
 * select插件
 * 配置说明
 * $data：          列表数据数组
 * field:           绑定父模块的字段
 * valueField：     值字段
 * displayField：   显示字段
 * disableField：   禁用字段（表示记录项不可点击）
 */
class UIDate extends BaseInput {
    template(props) {
        super.template(props);
        return `
            <div class='ui-datetime' e-mouseleave='__closeBox'>
                <div class='ui-datetime-field' e-click='__toggleBox'>
                    <input value={{__value}} />
                    <b class='ui-datetime-date' />
                </div>
                <div class={{'ui-datetime-picker ' + (__open?'ui-datetime-picker-open':'ui-datetime-picker-hide')}} >
                    <div>
                        <div class='ui-datetime-tbl'>
                            <div class='ui-datetime-datetbl'>
                                <div class='ui-datetime-ymct'>
                                    <b class='ui-datetime-leftarrow1' e-click='__subYear' />
                                    <b class='ui-datetime-leftarrow' e-click='__subMonth' />
                                    <span class='ui-datetime-ym'>{{ year + '/' + month }}</span>
                                    <b class='ui-datetime-rightarrow' e-click='__addMonth' />
                                    <b class='ui-datetime-rightarrow1' e-click='__addYear' />
                                </div>
                                <div class='ui-datetime-weekdays'>
                                    <span>日</span>
                                    <span>一</span>
                                    <span>二</span>
                                    <span>三</span>
                                    <span>四</span>
                                    <span>五</span>
                                    <span>六</span>
                                </div>
                                <div class='ui-datetime-dates'>
                                    <span x-repeat={{dates}} class={{(selected?'ui-datetime-selected':'') + (disable?'ui-datetime-disable':'')}}
                                        e-click='__clickDate'
                                    >{{date}}</span>
                                </div>
                            </div>
                        </div>
                        <div class='ui-datetime-btnct'>
                            <ui-button title='今天' e-click='__today'/>
                            <ui-button theme='active' title='确定' e-click='__okClick'/>
                        </div>
                    </div>
                </div>
             </div>
        `;
    }
    data() {
        return {
            __open: false,
            dates: []
        };
    }
    /**
     * 交替 list box
     */
    __toggleBox(model, dom, ev, e) {
        if (this.model['__open']) {
            this.__closeBox();
        }
        else {
            this.__openBox(model, dom, ev, e);
        }
    }
    /**
     * 打开list box
     */
    __openBox(model, dom, ev, e) {
        this.__setDate(this.model['__value']);
        this.__cacLoc(model, dom, ev, e);
        this.model['__open'] = true;
    }
    /**
     * 关闭list box
     */
    __closeBox() {
        this.model['__open'] = false;
    }
    /**
     * 点击item
     * @param model
     * @param dom
     * @returns
     */
    __clickDate(model, dom, evobj, e) {
        if (!this.__field) {
            return;
        }
        this.model['date'] = model.date;
        this.__setDate(this.model['year'] + '-' + this.model['month'] + '-' + this.model['date']);
    }
    /**
     * 设置今天
     */
    __today() {
        const nda = new Date();
        this.__setDate(nda.getFullYear() + '-' + (nda.getMonth() + 1) + '-' + nda.getDate());
    }
    /**
     * 确定按钮
     */
    __okClick() {
        const dStr = this.model['year'] + '-' + this.model['month'] + '-' + this.model['date'];
        this.__setDate(dStr);
        this.__change(dStr, true);
        this.__closeBox();
    }
    /**
     * 设置日期或时间
     * @param module    模块
     * @param str       待设置值
     */
    __setDate(str) {
        if (str && str !== '') {
            str = str.trim();
            if (str === '') {
                return;
            }
            let date = new Date(str);
            if (date.toTimeString() !== 'Invalid Date') {
                this.model['date'] = date.getDate();
                this.__genDates(date.getFullYear(), date.getMonth() + 1);
            }
            else { //日期格式不对，则直接设置插件当前日期时间值
                this.__today();
            }
        }
    }
    /**
     * 计算位置
     * @param model     模型
     * @param dom       当前节点
     * @param ev        event object
     * @param e         html event
     */
    __cacLoc(model, dom, ev, e) {
        let target = e.currentTarget;
        const height = Math.ceil(this.model['dates'].length / 7) * 30 + 166;
        let pos = UITool.cacPosition(target, 1, 306, height);
        model.__x = pos[0];
        model.__y = pos[1];
    }
    /**
     * 产生日期数组
     * @param module    模块
     * @param year      年
     * @param month     月
     */
    __genDates(year, month) {
        this.model['year'] = year;
        this.model['month'] = month;
        //获取当日
        let cda = new Date();
        let cy = cda.getFullYear();
        let cm = cda.getMonth() + 1;
        let cd = cda.getDate();
        let days = this.__cacMonthDays(year, month);
        let dayArr = [];
        let date = new Date(year + '-' + month + '-1');
        //周几
        let wd = date.getDay();
        let lastMonthDays = this.__cacMonthDays(year, month, -1);
        //补充1号对应周前几天日期
        for (let d = lastMonthDays, i = 0; i < wd; i++, d--) {
            dayArr.unshift({
                disable: true,
                selected: false,
                date: d
            });
        }
        //当月日期
        for (let i = 1; i <= days; i++) {
            dayArr.push({
                date: i,
                selected: this.model['year'] === year && this.model['month'] === month && this.model['date'] === i,
                today: cy === year && cm === month && cd === i
            });
        }
        //下月日期
        date = new Date(year + '-' + month + '-' + days);
        //周几
        wd = date.getDay();
        for (let i = wd + 1; i <= 6; i++) {
            dayArr.push({
                disable: true,
                selected: false,
                date: i - wd
            });
        }
        this.model['dates'] = dayArr;
        this.model['days'] = dayArr;
    }
    /**
     * 计算一个月的天数
     * @param year      年
     * @param month     月
     * @param disMonth  相差月数
     */
    __cacMonthDays(year, month, disMonth) {
        if (disMonth) {
            month += disMonth;
        }
        if (month <= 0) {
            year--;
            month += 12;
        }
        else if (month > 12) {
            year++;
            month -= 12;
        }
        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
            return 31;
        }
        else if (month !== 2) {
            return 30;
        }
        else if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
            return 29;
        }
        else {
            return 28;
        }
    }
    /**
     * 修改月份
     * @param module
     * @param distance
     */
    __changeMonth(distance) {
        let year = this.model['year'];
        let month = this.model['month'];
        month += distance;
        if (month <= 0) {
            year--;
            month += 12;
        }
        else if (month > 12) {
            year++;
            month -= 12;
        }
        if (month <= 0) {
            year--;
            month += 12;
        }
        else if (month > 12) {
            year++;
            month -= 12;
        }
        this.__genDates(year, month);
    }
    /**
     * 年-1
     */
    __subYear() {
        this.__changeMonth(-12);
    }
    /**
     * 年+1
     */
    __addYear() {
        this.__changeMonth(12);
    }
    /**
     * 月-1
     */
    __subMonth() {
        this.__changeMonth(-1);
    }
    /**
     * 月+1
     */
    __addMonth() {
        this.__changeMonth(1);
    }
}
registModule(UIDate, 'ui-date');

/**
 * tab插件
 * bgColor          默认t背景色
 * color            默认前景色
 * activeBgColor    激活背景色
 * activeColor      激活前景色
 */
class UITab extends Module {
    constructor() {
        super(...arguments);
        /**
         * 拖动参数
         */
        this.__dragParam = { dx: 0 };
    }
    template(props) {
        this.__onTabClose = props.onTabClose;
        this.__onChange = props.onChange;
        let tabStyle = '';
        let activeStyle = '';
        if (props.activeBgColor) {
            activeStyle += 'background-color:' + props.activeBgColor;
        }
        //激活前景色，如果没设置，但是设置了默认前景色，则使用默认前景色
        let ac = props.activeColor || props.color;
        if (ac) {
            if (activeStyle !== '') {
                activeStyle += ';';
            }
            activeStyle += 'color:' + ac;
        }
        let defaultStyle = '';
        if (props.bgColor) {
            defaultStyle += 'background-color:' + props.bgColor;
        }
        if (props.color) {
            if (defaultStyle !== '') {
                defaultStyle += ';';
            }
            defaultStyle += 'color:' + props.color;
        }
        if (activeStyle) {
            tabStyle = `style={{active?'${activeStyle}':'${defaultStyle}'}}`;
        }
        else if (defaultStyle) {
            tabStyle = `style={{!active?'${props.defaultStyle}':''}}`;
        }
        let headBg = props.bgColor ? "style='background-color:" + props.bgColor + "'" : '';
        return `
            <div class='ui-tab'>
                <div class='ui-tab-headct' ${headBg} >
                    <div class='ui-tab-head' e-drag='__dragHead' e-mousedown='__dragStart' e-mousemove='__drag' e-mouseup='__dragEnd' e-mouseleave='__dragEnd'>
                        <for cond={{tabs}} class={{'ui-tab-item' + (active?' ui-tab-item-active':'')}} e-click='__clickTab' ${tabStyle}>
                            {{title}}
                            <b class="ui-tab-close" x-show={{closable}} e-click='__closeTab:nopopo'/>
                        </for>
                    </div>
                </div>
                <div class='ui-tab-body'>
                    <slot />
                </div>
            </div>
        `;
    }
    data() {
        return {
            tabs: []
        };
    }
    onCompile() {
        this.originTree.delProp(['activeBgColor', 'activeColor', 'bgColor', 'color', 'onChange', 'onTabClose']);
    }
    /**
     * 添加tab
     * @param cfg tab配置项
     */
    __addTab(cfg) {
        if (this.model['tabs'].find(item => item.tab === cfg.tab)) {
            return;
        }
        this.model['tabs'].push(cfg);
        if (cfg.active || this.model['tabs'].length === 1) {
            this.__activeTab(cfg);
        }
    }
    /**
     * 点击tab
     * @param model
     */
    __clickTab(model) {
        this.__activeTab(model);
    }
    /**
     * 激活新tab
     * @param item tab config对象 或 title 或index
     */
    __activeTab(item) {
        if (typeof item !== 'object') {
            item = this.__getTab(item);
        }
        if (!item || this.__currentTab && this.__currentTab.tab === item.tab) {
            return;
        }
        //之前的active设置为false
        if (this.__currentTab) {
            this.__currentTab.active = false;
            this.__currentTab.tab.__hide();
        }
        item.active = true;
        item.tab.__show();
        //执行change事件
        if (this.__onChange) {
            this.getParent().invokeMethod(this.__onChange, this.__currentTab, item);
        }
        this.__currentTab = item;
    }
    /**
     * 关闭页签
     * @param model     title或对应model或索引号
     * @returns
     */
    __closeTab(model) {
        //最后一个不删除
        if (!model || this.model['tabs'].length === 1) {
            return;
        }
        let index;
        let tp = typeof model;
        if (tp === 'number') {
            index = model;
        }
        else if (tp === 'string') {
            index = this.model['tabs'].findIndex(item => item.title === model);
        }
        else if (tp === 'object') {
            index = this.model['tabs'].findIndex(item => item.tab === model.tab);
        }
        if (index >= 0 || index < this.model['tabs'].length) {
            model = this.model['tabs'][index];
            //执行tabclose事件
            if (this.__onTabClose) {
                this.getParent().invokeMethod(this.__onTabClose, model);
            }
            //移除
            this.model['tabs'].splice(index, 1);
            //被删除为当前tab，需要切换当前tab
            if (model.tab === this.__currentTab.tab) {
                if (index === this.model['tabs'].length) { //最后一个
                    this.__activeTab(this.model['tabs'][index - 1]);
                }
                else { //取后面一个
                    this.__activeTab(this.model['tabs'][index]);
                }
            }
        }
    }
    /**
     * 根据title或索引号获取tab
     * @param item  title或index
     * @returns     tab item model
     */
    __getTab(item) {
        if (typeof item === 'string') {
            return this.model['tabs'].find(t => t.title === item);
        }
        return this.model['tabs'][item];
    }
    /**
     * 头部拖动开始
     * @param model
     * @param dom
     * @param ev
     * @param e
     */
    __dragStart(model, dom, ev, e) {
        let el = e.currentTarget;
        let pel = el.parentElement;
        //设置宽度
        let w = 0;
        for (let d of el.children) {
            w += d.offsetWidth;
        }
        el.style.width = (w + 1) + 'px';
        //不比父宽，不处理
        if (el.offsetWidth < pel.offsetWidth) {
            return;
        }
        this.__dragParam.x = e.pageX;
    }
    /**
     * 拖动
     * @param model
     * @param dom
     * @param ev
     * @param e
     * @returns
     */
    __drag(model, dom, ev, e) {
        if (!this.__dragParam.x) {
            return;
        }
        this.__move(e);
    }
    /**
     * 拖动停止
     * @param model
     * @param dom
     * @param ev
     * @param e
     */
    __dragEnd(model, dom, ev, e) {
        this.__move(e);
        delete this.__dragParam.x;
    }
    /**
     * 移动
     * @param e
     * @returns
     */
    __move(e) {
        if (!this.__dragParam.x) {
            return;
        }
        let dx = e.pageX - this.__dragParam.x;
        if (Math.abs(dx) < 2) {
            return;
        }
        this.__dragParam.dx += dx;
        if (this.__dragParam.dx > 0) {
            this.__dragParam.dx = 0;
        }
        else {
            let el = e.currentTarget;
            let pel = el.parentElement;
            if (el.offsetWidth + this.__dragParam.dx < pel.offsetWidth) {
                this.__dragParam.dx = pel.offsetWidth - el.offsetWidth;
            }
        }
        this.__dragParam.x = e.pageX;
        e.currentTarget.style.transform = 'translateX(' + this.__dragParam.dx + 'px)';
    }
}
/**
 * tab item插件
 * 配置说明
 * title    tab标题
 * closable 是否可关闭
 * active   是否处于active
 */
class UITabItem extends Module {
    template(props) {
        this.__active = (props.active === 'true' || props.active === true);
        this.__closable = (props.closable === 'true' || props.closable === true);
        this.__title = props.title;
        return `
            <div x-show={{show}}>
                <slot/>
            </div>
        `;
    }
    data() {
        return {
            show: false
        };
    }
    onCompile() {
        this.originTree.delProp(['title', 'active', 'closable']);
    }
    onBeforeFirstRender() {
        //添加到父
        let pm = this.getParent();
        if (pm.constructor !== UITab) {
            return;
        }
        //追加到ui tab插件
        pm.__addTab({
            title: this.__title,
            active: this.__active,
            closable: this.__closable,
            tab: this
        });
    }
    /**
     * 隐藏
     */
    __hide() {
        this.model['show'] = false;
    }
    /**
     * 显示
     */
    __show() {
        this.model['show'] = true;
    }
}
registModule(UITab, 'ui-tab');
registModule(UITabItem, 'ui-tab-item');

/**
 * radio group插件
 */
class UITip extends Module {
    template(props) {
        super.template(props);
        //四个位置
        const arr = ['top', 'right', 'bottom', 'left'];
        //位置item串
        let str = '';
        for (let d of arr) {
            str += `
                <div class='ui-tip ui-tip-${d}'>
                    <for cond={{${d}Data}} class={{'ui-tip-item' + (theme?(' ui-box-' + theme):'')}}>
                        <b x-show={{showIcon}} class={{icon?('ui-icon-' + icon):''}} />
                        <span class='ui-tip-content'>{{text}}</span>
                        <b class='ui-tip-close' e-click='__close' x-show={{closable}}/>
                    </for>
                </div>
            `;
        }
        return `
            <div class='ui-tip'>
                ${str}
            </div>
        `;
    }
    data() {
        return {
            topData: [],
            rightData: [],
            bottomData: [],
            leftData: []
        };
    }
    /**
     * 关闭
     * @param model
     */
    __close(model) {
        //从数据集移除
        let dataArr = ['topData', 'rightData', 'bottomData', 'leftData'];
        for (let d of dataArr) {
            let ind = this.model[d].indexOf(model);
            if (ind !== -1) {
                this.model[d].splice(ind, 1);
                break;
            }
        }
    }
}
registModule(UITip, 'ui-tip');
/**
 * tip 管理器
 */
class UITipManager {
    /**
     * 添加tip
     * @param cfg
     */
    static addTip(cfg) {
        cfg.position || (cfg.position = 'top');
        cfg.theme || (cfg.theme = 'default');
        cfg.id = this.id++;
        const mdl = this.getUITip();
        let rows = mdl.model[cfg.position + 'Data'];
        //排他
        if (cfg.exclusive) {
            rows.splice(0, rows.length);
        }
        cfg.showIcon = cfg.hasOwnProperty('icon');
        //不显示关闭按钮，则设置自动关闭时间
        if (!cfg.closable) {
            //设置关闭时间
            const t = new Date().getTime();
            cfg.closeTime = t + (cfg.timeout || 2000);
            //添加到待关闭队列
            this.tobeClosed.push(cfg);
            //排序
            this.tobeClosed.sort((a, b) => { return a.closeTime < b.closeTime ? -1 : 1; });
            //设置延迟清理
            setTimeout(() => { UITipManager.removeTip(); }, (this.tobeClosed[0].closeTime - t));
        }
        rows.push(cfg);
    }
    /**
     * 移除tip
     */
    static removeTip() {
        let mdl = this.getUITip();
        if (!mdl) {
            return;
        }
        if (this.tobeClosed.length === 0) {
            return;
        }
        let t = new Date().getTime();
        //第一个时间不超时，则后续不超时
        if (this.tobeClosed[0].closeTime > t) {
            return;
        }
        for (let i = 0; i < this.tobeClosed.length; i++) {
            let d = this.tobeClosed[i];
            //从待关闭队列移除
            this.tobeClosed.splice(i--, 1);
            let rows = mdl.model[d.position + 'Data'];
            //从uitip数据移除
            let ind = rows.findIndex(item => item.id === d.id);
            if (ind !== -1) {
                rows.splice(ind, 1);
            }
        }
        if (this.tobeClosed.length > 0) {
            //设置延迟清理
            setTimeout(() => { UITipManager.removeTip(); }, (this.tobeClosed[0].closeTime - t));
        }
    }
    /**
     * 获取uitip插件
     * @returns     uitip插件
     */
    static getUITip() {
        let root = ModuleFactory.getMain();
        for (let mid of root.children) {
            let m = ModuleFactory.get(mid);
            if (m instanceof UITip) {
                return m;
            }
        }
        return null;
    }
}
/**
 * 待关闭tip数组
 */
UITipManager.tobeClosed = [];
/**
 * tip id
 */
UITipManager.id = 0;
/**
 * 暴露tip函数
 * @param cfg   tip 配置
 */
function nuitip(cfg) {
    UITipManager.addTip(cfg);
}

/**
 * 消息框
 */
class UIMessageBox extends Module {
    template(props) {
        let iconStr = this.model['icon'] ? `<b class='ui-messagebox-icon ui-icon-${this.model["icon"]}' />` : '';
        let btnStr = '';
        let index = 0;
        if (this.__buttons) {
            for (let b of this.__buttons) {
                let methodName = b.callback;
                if (typeof b.callback === 'function') {
                    //设定方法名和回调函数
                    methodName = '__genmethod__' + index++;
                    this[methodName] = (model, dom, ev, e) => {
                        b.callback(model, dom, ev, e);
                        this.__close();
                    };
                }
                btnStr += `<ui-button title='${b.text}' theme='${b.theme || "default"}' useDomModel e-click='${methodName}' />`;
            }
        }
        return `
            <div x-show={{show}}>
                <div class='ui-dialog ui-messagebox' >
                    <div class='ui-dialog-cover' />
                    <div class='ui-messagebox-body'>
                        <div class='ui-messagebox-content'>
                            ${iconStr}
                            <span class='ui-messagebox-text'>{{text}}</span>
                        </div>
                        <div class='ui-messagebox-btnct'>
                            ${btnStr}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    data() {
        return {
            show: false
        };
    }
    /**
     * 关闭窗口
     */
    __close() {
        this.model['show'] = false;
    }
}
registModule(UIMessageBox, 'ui-messagebox');
class UIMessageBoxManager {
    /**
     * confirm 对话框
     * @param cfg   confirm 配置
     * @returns
     */
    static confirm(cfg) {
        const mdl = ModuleFactory.getMain().getModule('UIMessageBox');
        if (!mdl) {
            return;
        }
        mdl.model['text'] = cfg.text;
        mdl.model['icon'] = cfg.icon;
        mdl.model['show'] = true;
        mdl.__buttons = [{ text: '取消', theme: 'default', callback: '__close' }];
        if (Array.isArray(cfg.buttons)) {
            mdl.__buttons = mdl.__buttons.concat(cfg.buttons);
        }
    }
    static alert(cfg) {
        const mdl = ModuleFactory.getMain().getModule('UIMessageBox');
        if (!mdl) {
            return;
        }
        mdl.model['text'] = cfg.text;
        mdl.model['icon'] = cfg.icon;
        mdl.model['show'] = true;
        mdl.__buttons = [{ text: '确定', theme: 'active', callback: '__close' }];
    }
}
/**
 * confirm创建函数
 * @param cfg {text:消息内容,icon:消息图标,buttons:[{text:按钮标题,callback:回调函数},...]}
 */
function nuiconfirm(cfg) {
    UIMessageBoxManager.confirm(cfg);
}
/**
 * alert 创建函数
 * @param cfg {text:消息内容,icon:消息图标}
 */
function nuialert(cfg) {
    UIMessageBoxManager.alert(cfg);
}

export { Compiler, CssManager, DefineElement, DefineElementManager, DiffTool, Directive, DirectiveManager, DirectiveType, EModuleState, EventFactory, EventManager, Expression, GlobalCache, Model, ModelManager, Module, ModuleFactory, NCache, NError, NEvent, NFactory, NodomMessage, NodomMessage_en, NodomMessage_zh, Renderer, Route, Router, Scheduler, UIAccordion, UIAccordionItem, UIButton, UIButtonGroup, UICheckbox, UIDate, UIDialog, UIFile, UIGrid, UIGridCol, UIGridExpand, UIList, UIListTransfer, UIMenu, UIMessageBox, UIMessageBoxManager, UIPagination, UIPanel, UIPanelBody, UIRadio, UIRadioGroup, UIRelationMap, UISelect, UITab, UITabItem, UITip, UITipManager, UITool, UIToolbar, UITree, Util, VirtualDom, createDirective, createRoute, nodom, nuialert, nuiconfirm, nuitip, registModule, request };
//# sourceMappingURL=nodomui.js.map
