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
  function fun1 () {
    //do thing 1
  }
  function fun2 () {
    //do thing 2
  }
  //eventEmitter提供了三种删除自定义事件场景的api,各自的功能不同
  
  //1.删除some事件的fun1处理（单个）
     event.on('some'， fun1, fun1);
     //连续绑定多个相同的处理，只想删除其中最早绑定的那一个时，使用
     event.removeEvent('some', eventEmitter.REMOVE, fun1);
     //以上方式和removeEvent默认使用方式等价
     event.removeEvent('some', fun1);
  //2.删除some事件的所有fun1处理
     event.on('some'， fun1, fun1);
     //参数第二项传入eventEmitter.GLOBAL_REMOVE，会删除some事件的所有fun1处理
     event.removeEvent('some', eventEmitter.GLOBAL_REMOVE, fun1);
  //3.删除some事件的所有处理
     event.on('some'， fun1, fun1);
     event.on('some1'， fun1, fun2）;
     //参数第二项传入eventEmitter.CLEAR时，会删除some事件的所有处理
     event.removeEvent('some', eventEmitter.CLEAR);
  
  
  //也可删除some事件的多种处理
    //例如：
    event.on('some'， fun1, fun1, fun2);
    event.removeEvent('some', fun1, fun2);
     或者
    event.removeEvent('some', [fun1, fun2]);
    //处理的传递与`同一事件绑定多个处理`的传递方式相同
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

  
