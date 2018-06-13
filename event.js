var eventEmitter = function ()  {
    var events = {},
    onceEvents = {},
    curType;
    this.getEvents = function () {
        return events;
    }
    this.getOnceEvents = function () {
        return onceEvents;
    }
    this.getCurType = function () {
        return curType;
    }
    this.setCurType = function (type) {
        if (type && type !== eventEmitter.NULL) {
            curType = type;
        }
    }
},
slice = Array.prototype.slice;

eventEmitter.CLEAR = 'CLEAR';  //清除指定类型的事件的所有回调函数
eventEmitter.GLOBAL_REMOVE = 'GLOBAL_REMOVE';  //清除指定事件类型中，所有在调用removeEvent方法时传入的指定函数相等的事件回调函数。
eventEmitter.REMOVE = 'REMOVE';  //清除指定事件类型中，所有在调用removeEvent方法时传入的指定函数相等的事件回调函数。
eventEmitter.NULL = '_NULL';

eventEmitter.prototype.hasEventType = function (type/*, fn*/) {
    var success = arguments[1],
    fail = arguments[2],
    target,
    self = this,
    errors = function (func, msg) {
        try{
            throw new Error(msg);
        }catch(e){
            console.error(e.message);
            var result;
            if (typeof func == 'function') {
                result = func.apply(self, [ self.getCurType() ]);
                // isNaN(_target) && _target = undefined;
            }
            return  result !== undefined ? result : self;
        }

    };
    if (type == undefined) {
        return errors(fail, 'Event type is undefined');
    }
    if (typeof type == 'function' && fail !== true && arguments[3] !== true) {
        fail = success;
        success = type;
        type = eventEmitter.NULL;
    }

    if (typeof type !== 'string') {
        return errors(fail, 'Event type is not a string');
    }
    if (typeof success !== 'function') {
        return this;
    }
    this.setCurType(type);
    target = success.apply(this, [ this.getCurType() ]);
    if (target instanceof eventEmitter) {
        return this;
    }
    return target;
}

eventEmitter.prototype.on = function (/*type, typefn*/) {
    var args = arguments,
    fns = slice.call(args, 1),
    events = this.getEvents();
    this.hasEventType(arguments[0], function (type) {
        events[type] = events[type] || new Array();
        for (var i = 0, arr = events[type]; i < fns.length; i++) {
            if (typeof fns[i] == 'function') {
                arr.push(fns[i]);
            } else if (Array.isArray(fns[i])) {
                fns[i].unshift(type);
                this.on.apply(this, fns[i]);
            } else {
                console.warn('Warns : This is not a way out');
            }
        }
    });
    return this;

}

eventEmitter.prototype.once = function (/*type, typefn*/) {
    var onceEvents = this.getOnceEvents();
    this.on.apply(this, arguments)
    .hasEventType(function(type){
        onceEvents[type] = true;
    });
    return this;
}

eventEmitter.prototype.removeEvent = function (/*type, typefn*/) {
    var args = arguments,
    fns = slice.call(args, 1),
    events = this.getEvents(),
    onceEvents = this.getOnceEvents();
    this.hasEventType(arguments[0], function (type) {
        events[type] = events[type] || new Array();
        var rType = typeof fns[0] == 'string' && fns.shift();
        if (rType === eventEmitter.CLEAR) {
            delete events[type];
            delete onceEvents[type];
            return ;
        }
        for (var i = 0, arr = events[type]; i < fns.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (Array.isArray(fns[i])) {
                    if (rType === eventEmitter.GLOBAL_REMOVE) {
                        fns[i] = [type, rType].concat(fns[i]);
                    } else {
                        fns[i].unshift(type);
                    }
                    this.removeEvent.apply(this, fns[i]);
                    break;
                }
                if (fns[i] == arr[j]) {
                    arr.splice(j, 1);
                    if (!arr.length) {
                      delete events[type];
                      delete onceEvents[type];
                    }
                    if (rType !== eventEmitter.GLOBAL_REMOVE) {
                        break;
                    } else {
                        j--;
                    }

                }
                if (rType !== eventEmitter.GLOBAL_REMOVE && typeof fns[i] !== 'function') {
                    console.warn('Warns : This is not a way out');
                    break;
                }
            }
        }

    });
    return this;
}

eventEmitter.prototype.emit = function (type, data) {
    var events = this.getEvents(),
    onceEvents = this.getOnceEvents(),
    data = typeof data == 'function' ? {} : data;
    this.hasEventType(type, function () {
        events[type] = events[type] || new Array();
        for (let i in events[type]) {
            events[type][i].apply(this, [data]);
        }
        if (onceEvents[type]) {
            delete events[type];
            delete onceEvents[type];
        }

    });
}

eventEmitter.prototype.getListenerCount = function (type) {
    var events = this.getEvents();
    return this.hasEventType(type, function () {
        return (events[type] || 0) && events[type].length;
    }, function () {
        return 0;
    }, true);

}

export default eventEmitter;