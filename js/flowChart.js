/**
 * @author HY
 * @create 2017.5.12
 */
(function (root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.flowChart = factory());
        });
    } else {
        root.flowChart = factory();
    }
})(this, function () {
    var FlowChart = function (config) {
        this.init(config);
    };
    // 已处理，待处理，处理中
    FlowChart.prototype = {
        config: {
            mainWrap: '',    //装在canvas容器,
            nodeList: [],
            // canvasName: '',  //canvas类名
            // logoUrl: '',
            // initTxt: '刮奖区',
            // percent: 0.3,    //刮百分之多少自动显示
            // ready: '',
            // startFn: '',
            // endFn: '',       //刮奖后方法
            // canEve: true,    //是否可以刮奖
        },
        init: function (config) {
            var o;
            for (o in config) {
                this.config[o] = config[o];
            }
            this.createElement();
        },
        //create element
        createElement: function () {
            document.querySelector(this.config.mainWrap).innerHTML = '';
            this.ele = document.createElement('canvas');
            this.ele.className = this.config.canvasName;
            this.resizeCanvas();
            this.config.ready && this.config.ready();
        },
        adjustRatio: function(ctx) {
            var backingStore = ctx.backingStorePixelRatio ||
                ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            pixelRatio = (window.devicePixelRatio || 1) / backingStore;
            ctx.canvas.width = this.size.w * pixelRatio;
            ctx.canvas.height = this.size.h * pixelRatio;
            ctx.canvas.style.width = this.size.w + 'px';
            ctx.canvas.style.height = this.size.h + 'px';
            ctx.scale(pixelRatio, pixelRatio);
        },
        //resize canvas
        resizeCanvas: function () {
            this.size = {
                w: document.querySelector(this.config.mainWrap).clientWidth,
                h: document.querySelector(this.config.mainWrap).clientHeight
            };
            document.querySelector(this.config.mainWrap).appendChild(this.ele);
            this.ctx = this.ele.getContext('2d');
            this.ctx.save();
            this.adjustRatio(this.ctx);
            this.ctx.restore();
            this.drawBoxes();
        },
        drawBoxes: function () {
            var self = this,
                len = self.config.nodeList.length;
            var col = (this.size.w - 40) / 160;  // 每行最多显示多少
            for (var i = 0; i < len; i++) {
                var lineNum = Math.floor(i / col),   // 当前节点在第几行
                    coY = 50 + lineNum * 110;     // Y坐标
                // if (lineNum % 2  === 1) {   
                //     var coX = 50 + (col - 1 - i % col) * 160   // X坐标
                // } else {
                //     var coX = 50 + (i % col) * 160   // X坐标
                // }
                // 偶数行时节点倒序，lineNum现为行数减1
                var coX = (lineNum % 2  === 1) ? (50 + (col - 1 - i % col) * 160) : (50 + (i % col) * 160);   // X坐标
                var nodeText = (self.config.nodeList[i].STATUS == 'done') ? self.config.nodeList[i].NODE_USR : self.config.nodeList[i].NODE_NAME;
                self.ctx.beginPath();
                self.ctx.fillStyle = '#fff';  // 背景色
                self.ctx.fillRect(coX, coY, 100, 50);
                self.ctx.lineJoin = "round";  // 圆角
                self.ctx.strokeStyle = "#3e9cfc";  // 边框
                self.ctx.shadowBlur = 10;  // 阴影
                self.ctx.shadowColor = "#e1e1e1";
                self.ctx.strokeRect(coX, coY, 100, 50);
                self.ctx.font="14px Microsoft YaHei";   // 文本字号字体
                self.ctx.textAlign="center";   // 文本对齐方式
                self.ctx.textBaseline="middle";
                self.ctx.fillStyle = '#3e9cfc';
                self.ctx.fillText(nodeText, coX + 50, coY + 25);
                self.ctx.closePath();
            }
        }


        //init canvas
        // setCanvasBg: function () {
        //     this.ctx.beginPath();
        //     this.ctx.fillStyle = '#aaa';
        //     this.ctx.fillRect(0,0,this.size.w,this.size.h);
        //     this.ctx.closePath();
        //     if(this.config.logoUrl && this.config.initTxt) {
        //         this.setLogo();
        //         return;
        //     }
        //     this.setLogo();
        //     this.setText();

        // },
        // setLogo: function () {
        //     var _self = this;
        //     if(_self.config.logoUrl) {
        //         _self.preImage(_self.config.logoUrl, function () {
        //             _self.ctx.globalCompositeOperation='source-over';
        //             _self.ctx.drawImage(this,0,0,_self.size.w,_self.size.h);
        //             _self.setText();
        //         });
        //     }
        // },
        // setText: function () {
        //     if(this.config.initTxt) {
        //         this.ctx.globalCompositeOperation='lighter';
        //         this.ctx.font="18px Microsoft YaHei";
        //         var text = this.config.initTxt;
        //         this.ctx.fillText(text,(this.size.w-this.ctx.measureText(text).width)/2,(this.size.h)/2);
        //     }
        // },
        // bindEvent: function () {
        //     var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
        //     var clickEvtName = device ? 'touchstart' : 'mousedown';
        //     var moveEvtName = device? 'touchmove' : 'mousemove';
        //     var endEvtName = device? 'touchend' : 'mouseup';
        //     if (!device) {
        //         var isMouseDown = false;
        //         document.addEventListener('mouseup', function(e) {
        //             isMouseDown = false;
        //         }, false);
        //     }
        //     //touchstart function
        //     this.ele.addEventListener(clickEvtName, function (e) {
        //         e.preventDefault();
        //         isMouseDown = true;
        //         if(typeof this.config.startFn === 'function') this.config.startFn();
        //         this.ctx.strokeStyle = "#f00";
        //         this.ctx.lineCap = "round";
        //         this.ctx.lineJoin="round";
        //         this.ctx.lineWidth = 20;
        //         this.ctx.beginPath();
        //         var x = (device ? e.targetTouches[0].clientX : e.clientX) + document.body.scrollLeft - document.querySelector(this.config.mainWrap).getBoundingClientRect().left;
        //         var y = (device ? e.targetTouches[0].clientY : e.clientY) + document.body.scrollTop - document.querySelector(this.config.mainWrap).getBoundingClientRect().top;
        //         this.ctx.moveTo(x, y);
        //     }.bind(this),false);

        //     this.ele.addEventListener(moveEvtName, function (e) {
        //         e.preventDefault();
        //         if (!device && !isMouseDown) {
        //             return false;
        //         }
        //         this.ctx.globalCompositeOperation='destination-out';
        //         var x = (device ? e.targetTouches[0].clientX : e.clientX) + document.body.scrollLeft - document.querySelector(this.config.mainWrap).getBoundingClientRect().left;
        //         var y = (device ? e.targetTouches[0].clientY : e.clientY) + document.body.scrollTop - document.querySelector(this.config.mainWrap).getBoundingClientRect().top;
        //         this.ctx.lineTo(x, y);
        //         this.ctx.stroke();
        //     }.bind(this),false);
        //     //计算刮除的百分比
        //     this.ele.addEventListener(endEvtName, function (e) {
        //         e.preventDefault();
        //         var num = 0;
        //         var datas = this.ctx.getImageData(0,0,this.size.w,this.size.h);
        //         for(var i = 0; i < datas.data.length; i++) {
        //             if(datas.data[i] == 0) {
        //                 num++;
        //             }
        //         };
        //         if(num >= datas.data.length*this.config.percent) {
        //             n = 10;
        //             var time = setInterval(function(){
        //                 if(n > 0){ 
        //                     n-=1; 
        //                     this.ele.style.opacity = '0.'+n;
        //                 }else{ 
        //                     clearTimeout(time); 
        //                     this.ctx.clearRect(0,0,this.size.w,this.size.h);
        //                     document.querySelector(this.config.mainWrap).removeChild(this.ele);
        //                     if(typeof this.config.endFn === 'function') this.config.endFn();
        //                 }
        //             }.bind(this),30);
        //         }
        //     }.bind(this),false);
        // },
        // //preload image
        // preImage: function (url,callback) {  
        //     var img = new Image(); //创建一个Image对象，实现图片的预下载  
        //     img.src = url;  

        //     if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
        //         callback.call(img);  
        //         return; // 直接返回，不用再处理onload事件  
        //     };

        //     img.onload = function () { //图片下载完毕时异步调用callback函数。  
        //         callback.call(img);//将回调函数的this替换为Image对象  
        //     };  
        // },
        
    }
    return FlowChart;
});