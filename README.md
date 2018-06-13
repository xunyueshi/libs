# libs
 前端开发中常见工具库
# 开发环境
 不依赖于任何前端构建工具。
# 1.1 libs/events
### 实现了自定义事件机制的原生javascript库
主要用途：
  * 实现发布-订阅模式
  * 构建自定义事件
<br/>
绑定自定义事件（绑定单个处理）：

  ```javascript
  var event = new eventEmitter(); 
  //绑定自定义事件 
  event.on('custom'， function () { 
    //do thing 
  }); 
  ```
发射/触发自定义事件：

  ```javascript
  //通过emit方法触发
  event.emit('custom');
  ```
删除自定义事件（删除单个处理）：

  ```javascript
  var event = new eventEmitter(); 
  function fn () {
    //do thing 
  }
  //绑定自定义事件 
  event.on('custom'， fn); 
  //通过emit方法触发
  event.removeEvent('custom', fn);
  ```
对同一事件绑定多个处理：
  
  ```javascript
  var event = new eventEmitter(); 
  //绑定自定义事件 
  function fun1 () {
    //do thing 1
  }
  function fun2 () {
    //do thing 2
  }
  
  //方法1
  event.on('some'， fun1); 
  event.on('some'， fun2); 
  //方法2
  event.on('some'， fun1, fun2); 
  //方法3
  event.on('some'， [fun1, fun2]); 
  
  //也可以采用混合的方式
  //方法4
  function fun3 () {
    //do thing 3
  }
  event.on('some'， [fun1, fun2], fun3);
  event.on('some'， [fun1], fun2, fun3);
  event.on('some'， [fun1], [fun2, fun3]);
  event.on('some'， [fun1], [fun2], fun3);
  //或者分步绑定
  event.on('some'， [fun1], [fun2]);
  event.on('some', fun3);
  
  //以上这些方式只要保持绑定的顺序一致，那效果都是等价的
  ```
获取自定义事件下绑定的处理个数：
  
  ```javascript
  var event = new eventEmitter(); 
  //绑定自定义事件 
  function fun1 () {
    //do thing 1
  }
  function fun2 () {
    //do thing 2
  }
  event.on('some'， fun1, fun2); 
  //获得some事件下绑定处理函数的个数
  var count = event.getListenerCount('some');
  
  console.log(count);
  
  //结果为2
  ```
删除自定义事件的多个处理：
  
  ```javascript
  var event = new eventEmitter(); 
  //绑定自定义事件 
  event.on('custom'， function () { 
    //do thing 
  }); 
  //通过emit方法触发
  event.emit('custom');
  ```
例子:
  
  ```javascript
  var event = new eventEmitter(); 
  //绑定自定义事件 
  event.on('custom'， function () { 
    //do thing 
  }); 
  //通过emit方法触发
  event.emit('custom');
  ```

  
