(function(window, document, undefined){

    var defaultOptions = {
        onScroll: function () {},
        onScrollStart: function () {},
        isMouseWheel: false,
        speed: 12,
        initY: 0,
        barWidth: 7,
        isCorner: true,
        barBgColor: 'rgb(210, 210, 201)'
    };

    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||  
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime(),
            timeToCall = Math.max(0, 16.7 - (currTime - lastTime)),
            id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    var delay = (function () {
        var timeout;
        return function (fn) {
            var that = this;
            if (timeout == undefined) {
                timeout = requestAnimationFrame(function () {
                    cancelAnimationFrame(timeout);
                    timeout = null;
                    return fn.apply(that);
                });
            }
        }
    })();

    function preventMouseDefault (e) {
        // if(!/(textarea|input|select)/i.test(e.target.tagName)) {
        //     e.preventDefault();
        // }
    }

    function generateOption (options) {
        var gOptions = {};
        for (var prop in defaultOptions) {
            gOptions[prop] = options[prop] || defaultOptions[prop];
        }
        return gOptions;
    }

    function addClass (el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className = el.className + '' + className;
        }
    }

    function getOnlyStyleVal (el, property) {
        var onlyReadStyles = el.currentStyle ? el.currentStyle : window.getComputedStyle(el, null);
        return el.style[property] || onlyReadStyles[property];
    }

    function getWriteStyleVal (el, property) {
        return el.style[property];
    }

    function filterUnit (val) {
        return notNaN(parseFloat(val));
        
    }

    function notNaN (val) {
        return isNaN(val) ? 0 : val;
    }

    // function getNumberStyleVal (el, property) {
    //     return filterUnit(getOnlyStyleVal(el, property));
    // }

    function getNumberStyleVal (el, property) {
        return filterUnit(getOnlyStyleVal(el, property));
    }

    function getHeight (el) {
        return el.offsetHeight;
    }

    var Scroll = function (selector, options) {
        return new Scroll.fn.init(selector, options);
    }

    Scroll.MAXY = 'MAXY';
    Scroll.MINY = 'MINY';

    Scroll.fn = Scroll.prototype;

    Scroll.fn.init = function (selector, options) {
        this.el = selector instanceof Element ? selector : document.querySelector(selector); 
        if (!this.el.firstElementChild) {
            return this;
        }
        this.options = generateOption(options);
        this.calcRefreshedParams();
        if (this.ratio >= 1) {
            return this;
        }
        this._createBar();
        this._initStyle();
        this._syncRefresh(this.options.initY);
        this._addCoreEvents();
        this._addOptionalEvents();
    }

    Scroll.fn.init.prototype = Scroll.prototype;

    Scroll.fn._createBar = function () {
        var that = this;
        this.scrollBar = document.createElement('div');
        this.childBar = document.createElement('div');
        this.scrollBar.className = 'my-scroll-bar';
        this.childBar.className = 'my-child-bar';
        this.scrollBar.appendChild(this.childBar);
        this.scrollBar.style.width = this.options.barWidth + 'px';
        this.el.appendChild(this.scrollBar);
        this.refreshedParams.sHeight = getHeight(this.scrollBar);
        if (this.options.barBgColor) {
            this.childBar.style.backgroundColor = this.options.barBgColor;
        }
        if (this.options.isCorner) {
            this.childBar.style.borderRadius = this.options.barWidth / 2 + 'px'; 
        }
        this.childBar._events = {};
        this.childBar._events['mousedown'] = function (e) {
            that.isListening = true;
            that.isStart = true;
        };
        this.childBar.addEventListener('mousedown', this.childBar._events['mousedown'], false);
    }

    Scroll.fn._removeBar = function () {
        this.childBar.removeEventListener('mousedown', this.childBar._events['mousedown']);
        this.el.removeChild(this.scrollBar);
        this.scrollBar = null;
        this.childBar = null;
    }

    Scroll.fn._initStyle = function () {
        addClass(this.el, 'my-root-scroll');
        addClass(this.el.firstElementChild, 'my-scroll');
    }

    Scroll.fn._addCoreEvents = function () {
        var that = this;
        this.isListening = false;
        document.addEventListener('mousemove', function (e) {
            if (that.isListening) {
                delay(function () {
                    that._moveScrollByNativeDis(e.pageY - that.oldY);
                    that.oldY = e.pageY;
                });
            }
        }, false);

        document.addEventListener('selectstart', function (e) {
            if (that.isListening) {
                e.preventDefault();
            }
        }, false);

        document.addEventListener('dragstart', function (e) {
            if (that.isListening) {
                e.preventDefault();
            }
        }, false);

        document.addEventListener('mousedown', function (e) {
            if (that.isListening) {
                that.oldY = e.pageY;
            }
        }, false);

        document.addEventListener('mouseup', function (e) {
            that.isListening = false;
        }, false);
    }

    Scroll.fn._addOptionalEvents = function () {
        var that = this,
            options = this.options;
        if (options.isMouseWheel) {
            this.el.addEventListener('mousewheel', onMouseWheel, false);
            this.el.addEventListener('DOMMouseScroll', onMouseWheel, false); 
            function onMouseWheel (e) {
                if (that.childBar) {
                    var speed = options.speed,
                    dir = e.wheelDelta || -e.detail;
                    if(dir > 0){
                        speed = -speed;
                    }
                    delay(function () {
                        that._moveScrollByNativeDis(speed, true);
                    });
                    if(e.preventDefault){
                        e.preventDefault();
                    }
                }
            }
        }
    }

    Scroll.fn._moveScrollByNativeDis = function (dis, isWheel) {
        var disY = dis + getNumberStyleVal(this.childBar, 'top'),
            rDisY = -disY / this.ratio;
        if (this.isStart) {
            this.options.onScrollStart(rDisY, this.ratio, isWheel);
        }
        this.options.onScroll(rDisY, this.ratio, isWheel);
        this.positionTo(disY);
    }

    Scroll.fn.refresh = function (top) {
        var that = this;
        requestAnimationFrame(function () {
            that.calcRefreshedParams();
            that._syncRefresh(top);
        }, 0);
    }

    Scroll.fn.calcRefreshedParams = function () {
        var el = this.el,
            scroll = this.el.firstElementChild,
            scrollH = getHeight(scroll),
            rootH = getHeight(el);
        this.ratio = notNaN(rootH / scrollH);
        this.refreshedParams = {
            height: this.ratio * rootH,
            top: this.beforeScrollH == null ? 0 : (scrollH - this.beforeScrollH) * this.ratio,
        };
        if (this.scrollBar) {
            this.refreshedParams.sHeight = getHeight(this.scrollBar);
        }
        this.beforeScrollH = scrollH;
    }

    Scroll.fn._syncRefresh = function (top) {
        if (this.ratio < 1) {
            if (!this.scrollBar) {
                this._createBar();
            } 
            this.childBar.style.height = this.refreshedParams.height + 'px';
            this.positionTo(top || this.refreshedParams.top);
        } else if (this.scrollBar) {
            this.refreshedParams = {};
            this.positionTo(0);
            this._removeBar();
        }
    }

    Scroll.fn.positionTo = function (top) {
        if (this.childBar) {
            var scroll = this.el.firstElementChild,
                maxY = this.refreshedParams.sHeight - this.refreshedParams.height;
            if (top === Scroll.MINY || top < 0) {
                top = 0;
            }
            if (top === Scroll.MAXY || top > maxY) {
                top = maxY;
            }
            this.childBar.style.top = top + 'px';
            scroll.style.top = -top / this.ratio + 'px';
        }
    }

    window.Scroll = Scroll;
})(window, document);

