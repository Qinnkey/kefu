<template>
  <div class="slide" @click.stop="hideModel">
      <aside class="imapp-aside-left">
        <div class="app-sidebar flexcolumn">
            <div class="top-side">
                <div class="service-info">
                    <div class="service-info-pic">
                        <img alt="头像" :src="headurl">
                    </div>
                    <div class="service-info-state-wrap" @click.stop="showOline">
                        <div class="zent-popover-wrapper zent-pop-wrapper" style="display: block;">
                            <div class="service-info-state-inner online" v-if="stateType == 'online'">
                                <span class="state-light"></span>
                                <span>在线</span>
                            </div>
                        </div>
                        <div  style="display: block;">
                            <div class="service-info-state-inner busy" v-if="stateType == 'busy'">
                                <span class="state-light"></span>
                                <span>忙碌</span>
                            </div>
                        </div>
                        <div  style="display: block;">
                          <div class="service-info-state-inner offline" v-if="stateType == 'offline'">
                                <span class="state-light"></span>
                                <span>离线</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="center-side">
                <el-tooltip class="zent-popover-wrapper zent-pop-wrapper" style="display: block;" effect="dark" content="会话" placement="right">
                    <a class="bar-item" :class="isActive=='talk' ? 'active' : ''" :href="isOffline=='1' ? 'javacript:void(0);':'#/index'" @click="choose('talk')">
                        <div class="link-icon talk"></div>
                    </a>
                </el-tooltip>
           <!--     点击李四用户进行pages/history.vue页面中-->
                <el-tooltip class="zent-popover-wrapper zent-pop-wrapper" style="display: block;" effect="dark" content="历史客户" placement="right">
                    <a class="bar-item" :href="isOffline=='1' ? 'javacript:void(0);':'#/history'" :class="isActive=='history' ? 'active' : ''" @click="choose('history')">
                        <div class="link-icon customer"></div>
                    </a>
                </el-tooltip>
             <!--     点击李四用户进行pages/plugins.vue页面中-->
                <el-tooltip class="zent-popover-wrapper zent-pop-wrapper" style="display: block;" effect="dark" content="应用" placement="right">
                    <a class="bar-item" :href="isOffline=='1' ?'javacript:void(0);':'#/plugins'" :class="isActive=='plugins' ? 'active' : ''" @click="choose('plugins')">
                        <div class="link-icon plugins"></div>
                    </a>
                </el-tooltip>
            </div>
            <div class="bottom-side">
                <!--<div class="zent-popover-wrapper zent-pop-wrapper" style="display: block;">
                    <a class="bar-item" href="#/setting">
                        <div class="link-icon setting"></div>
                    </a>
                </div>-->
                <div class="zent-popover-wrapper zent-pop-wrapper" style="display: block;" @click.stop="showNewAction">
                    <div class="bar-item">
                        <div class="link-icon more"></div>
                    </div>
                </div>
            </div>
        </div>
      </aside>
      <div class="zent-portal zent-pop nav-more-wrap zent-popover zent-popover-internal-id-6 zent-popover-position-right-bottom" style="position: absolute; left: 80px; bottom: 11px;" v-if="newShow">
            <div data-reactroot="" class="zent-popover-content">
                <div class="zent-pop-inner">
                    <ul class="side-bar-more">
                        <!--<li class="item">提交反馈</li>
                        <li class="item">批量结束会话</li>
                        <li class="item">所有客户</li>-->
                        <li class="item">
                     <!--交给会搜云帮助中心-->
                        <a href="https://www.huisou.cn/home/index/help" target="_blank">帮助中心</a></li>
                        <li class="item" @click="flushPage">重新加载</li>
                     <!--   <li class="item">切换店铺</li>-->
                        <li class="item"  @click="loginout">退出登录</li>
                    </ul>
                </div>
                <i class="zent-pop-arrow"></i>
            </div>
        </div>
        <div class="zent-portal zent-pop servant-status-pop zent-popover zent-popover-internal-id-1 zent-popover-position-right-top" style="position: absolute; left: 70px; top: 60px;">
            <div data-reactroot="" class="zent-popover-content" v-if="onlineShow" >
                <div class="zent-pop-inner">
                    <ul class="status-pop-list online" >
                        <li class="switch-item online" @click.stop="changeState('online')">
                            <i class="fa fa-check check" aria-hidden="true" :class="stateType=='online'? 'online-check':''"></i>
                            <div class="content" >
                                <span class="flag online"></span>
                                <span>在线</span>
                            </div>
                        </li>
                        <li class="switch-item busy"  @click.stop="changeState('busy')">
                            <i class="fa fa-check check" :class="stateType=='busy'? 'online-check':''"  aria-hidden="true"></i>
                            <div class="content">
                                <i class="fa fa-minus-circle busy-flag" aria-hidden="true"></i>
                                <span>忙碌</span>
                            </div>
                        </li>
                        <li class="switch-item offline"  @click.stop="changeState('offline')">
                            <i class="fa fa-check check"  :class="stateType=='offline' ? 'online-check':''"  aria-hidden="true"></i>
                            <div class="content">
                                <span class="flag offline"></span>
                                <span>离线</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <i class="zent-pop-arrow"></i>
            </div>
        </div>
  </div>
</template>
<script>
export default {
    name: 'slide',
    props: ['hide_model','status'],
    data(){
        return {
            stateType:"online",
            isActive:'talk',
            newShow:false,
            onlineShow:false,
            headurl:localStorage.headurl,
            isOffline:'0'
        }
    },
    methods: {
        flushPage(){
            location.reload();
        },
        //退出
        loginout(){
        		this.$http.get('/list/authority/loginOut',{
			    		  params:{
			    		  	"crm_token": localStorage.crm_token,
									"shopId":localStorage.shopId,
									"custId":localStorage.custId
			    		  }
			    	},{emulateJSON:true}
			    	).then(function(res){
			    		
			    		 if(res.body.code == '100'){
			    		 		this.waitQueueNum = res.body.data;
			    		 }else{
			    		 		console.log("异常3" + res.body.code + "-" + res.body.msg);
			    		 }
			    	});
			    	
            //退出的话删除本地，然后跳转
            localStorage.custId = '';
            localStorage.custname = '';
            localStorage.headurl = '';
            localStorage.shopId = '';
            localStorage.isheader = '';
            localStorage.crm_token ='';
            window.location.href="https://www.huisou.cn/auth/login";
        },
        //
        changeState(val){
            if(val == 'offline'){
                this.$root.Bus.$emit('kefuStatus','offline');
                localStorage.setItem('kefuStatus', 'offline');
                this.$emit('kefuStatus','offline');
                this.isOffline = "1";
            }else if(val == 'online'){
                this.$root.Bus.$emit('kefuStatus','online');
                localStorage.setItem('kefuStatus', 'online');
                this.$emit('kefuStatus','online');
                this.isOffline = "0";
            }else if(val == 'busy'){
                this.$root.Bus.$emit('kefuStatus','busy');
                localStorage.setItem('kefuStatus', 'busy');
                this.$emit('kefuStatus','busy');
                this.isOffline = "0";
            }
            this.stateType = val;
            this.onlineShow = !this.onlineShow;
        //修改对象的对应的状态
            this.$axios.get("list/customer/updateCustStatus",{params:{
                shopId: localStorage.shopId,
                custId: localStorage.custId,
                custServerStatus: this.stateType,
                crm_token:localStorage.crm_token
            }}).then((res)=>{
                console.log(res)
                if (res.data.code =='100'){
                    //this.custJoinNum = res.data.data;
                }else{
                    console.log("异常")
                }
            })
        },
        //计算分数
        choose(position){
            var a=  localStorage.getItem('kefuStatus');
            // console.log(a,"客服的状态",this.isOffline)
            if (a != 'offline'){
                this.isOffline='0';
                this.isActive = position;
                // 注册点击位置事件
                this.$root.Bus.$emit('choose_position',position);
            }else{
                this.isOffline='1'
            }
        },
        //底部new操作点击
        showNewAction(){
            this.newShow = !this.newShow;
        },
        //在线状态点击
        showOline(val){
          this.onlineShow = !this.onlineShow;
        },
        hideModel(){
            this.newShow = false;
            this.onlineShow = false;
        }
    },
    sockets:{
    onCustJoin: function(res){
    	console.log('连接事件监听connect-----',res);
//  	if (res != "temp"){
//  		console.log('connect成功，坐席custJoin--------------');
    		this.$socket.emit('custJoin', {shopId:localStorage.shopId,custId:localStorage.custId,custStatus:localStorage.kefuStatus});
//  	}
    },
},
    //初始化的时候加载对应的状态，查询用户当前的状态和变化
    created(){

        var a=localStorage.getItem("kefuStatus");
        console.log('a=======created',a);
        if (a){
            if (a == 'offline'){
                this.isOffline="1"
            }
            this.stateType=a;
            this.$root.Bus.$emit('kefuStatus',a);
            this.$emit('kefuStatus',a);

        }
        this.$root.Bus.$on('customer_state',data=>{
            if (data){
                if (data == 'offline'){
                    this.isOffline="1"
                }
                localStorage.setItem('kefuStatus', data);
                this.stateType=a
                this.stateType = localStorage.getItem('kefuStatus');
                if(this.stateType == 'offline'){
                    this.$root.Bus.$emit('kefuStatus','offline');
                    this.$emit('kefuStatus','offline');
                }
            }
        })
        var url=window.location.href
        if (url.indexOf("history") > 0){
            this.isActive = 'history';
        }else if (url.indexOf('plugins') > 0){
            this.isActive = 'plugins';
        }else if (url.indexOf('index') > 0){
            this.isActive = 'talk';
        }   
    },
    mounted(){
       // this.$root.Bus.$emit('choose_position','talk');
    },
    watch:{
        hide_model(n,o){
            this.newShow = false;
        this.onlineShow = false;
        }
    }
}
</script>

<style>
body, html {
    height: 100%;
    margin:0;
}
article, aside, figcaption, figure, footer, header, main, nav, section {
    display: block;
}
body {
    color: #333;
    background-color: #eee;
    -webkit-backface-visibility: hidden;
}
body {
    font-family: Helvetica,STHeiti,Microsoft YaHei,Verdana,Arial,Tahoma,sans-serif;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
}
/*!
 *  Font Awesome 4.6.3 by @davegandy - http://fontawesome.io - @fontawesome
 *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
 */
@font-face {
    font-family: FontAwesome;
    src: url("../../static/fonts/fontawesome-webfont.eot?v=4.6.3");
    src: url("../../static/fonts/fontawesome-webfont.eot?#iefix&v=4.6.3") format("embedded-opentype"),url("../../static/fonts/fontawesome-webfont.woff2?v=4.6.3") format("woff2"),url("../../static/fonts/fontawesome-webfont.woff?v=4.6.3") format("woff"),url("../../static/fonts/fontawesome-webfont.ttf?v=4.6.3") format("truetype");
    font-weight: 400;
    font-style: normal
}
#app, .imapp {
    height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}
.slide{height:100%;}
.imapp-aside-left {
    width: 70px;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    position: relative;
    height:100%;
    z-index:11111;
}
.flex, .flexcolumn {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
}
.flexcolumn {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
}
.app-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #343f4b;
}
.app-sidebar .top-side {
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
}
.app-sidebar .top-side .service-info {
    padding: 23px 10px;
    text-align: center;
}
.app-sidebar .top-side .service-info-pic {
    overflow: hidden;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    margin: auto;
}
.app-sidebar .top-side .service-info-pic img {
    width: 38px;
    height: 38px;
}
.service-info-state-wrap {
    position: relative;
    padding-top: 10px;
}
.service-info-state-inner {
    color: #fff;
    font-size: 12px;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-left: 10px;
}
.service-info-state-inner .state-light {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    left: 5px;
}
.service-info-state-inner.online .state-light {
    background-color: #3ebd00;
}
.service-info-state-inner.busy .state-light {
    background-color: #f44;
}
.service-info-state-inner.offline .state-light {
    background-color: #d0d0d0;
}
.app-sidebar .center-side {
    padding: 20px 0;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.app-sidebar .bar-item {
    text-align: center;
    cursor: pointer;
    display: block;
    height: 56px;
    position: relative;
}
.app-sidebar .bar-item.active {
    background-color: #2a3641;
}
.app-sidebar .bar-item .link-icon {
    background: url(../../static/images/link_icon_2@1x.png) no-repeat;
    background-image: -webkit-image-set(url(../../static/images/link_icon_2@1x.png) 1x,url(../../static/images/link_icon@2x.png) 2x);
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    display: inline-block;
    position: relative;
}
.app-sidebar .bar-item .link-icon.talk {
    width: 22px;
    height: 24px;
    background-position: 0 0;
}
.app-sidebar .bar-item.active .link-icon {
    background-image: url(../../static/images/link_icon_2_active@1x.png);
    background-repeat: no-repeat;
    background-image: -webkit-image-set(url(../../static/images/link_icon_2_active@1x.png) 1x,url(../../static/images/link_icon_active@2x.png) 2x);
}
.app-sidebar .bar-item .link-icon.customer {
    height: 24px;
    width: 24px;
    background-position: -22px 0;
}
.app-sidebar .bar-item .link-icon.plugins {
    height: 24px;
    width: 24px;
    background-position: -46px 0;
}

.app-sidebar .bottom-side {
    padding-bottom: 10px;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
}
.app-sidebar .bottom-side .bar-item {
    height: 40px;
}
.app-sidebar .bar-item .link-icon.setting {
    height: 18px;
    width: 18px;
    background-position: -18px -24px;
}
.app-sidebar .bar-item .link-icon.more {
    height: 18px;
    width: 18px;
    background-position: 0 -24px;
}
.zent-pop {
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 6px rgba(0,0,0,.2);
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    background-color: #fff;
    z-index: 2000;
    font-size: 12px;
}
.zent-pop .zent-pop-header, .zent-pop .zent-pop-inner {
    position: relative;
    background: #fff;
    border-radius: 2px;
    padding: 10px 20px;
    z-index: 2;
    color: #333;
}
.nav-more-wrap .zent-pop-inner {
    padding: 0;
}
ol, ul {
    list-style: none;
}
.side-bar-more {
    width: 100px;
    text-align: center;
    color: #333;
    font-size: 12px;
    padding:0;
}
.side-bar-more .item {
    line-height: 30px;
    -webkit-transition: background-color .5s;
    -moz-transition: .5s background-color;
    transition: background-color .5s;
    cursor: pointer;
}
.zent-pop .zent-pop-arrow {
    position: absolute;
    z-index: 1;
    width: 6px;
    height: 6px;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0,0,0,.2);
    box-shadow: 0 1px 4px rgba(0,0,0,.2);
    overflow: hidden;
}
.zent-pop.zent-popover-position-right-bottom .zent-pop-arrow, .zent-pop.zent-popover-position-right-center .zent-pop-arrow, .zent-pop.zent-popover-position-right-top .zent-pop-arrow {
    left: 0;
}
.zent-pop.zent-popover-position-right-bottom .zent-pop-arrow {
    -webkit-transform: translateX(-50%) rotate(45deg);
    -moz-transform: translateX(-50%) rotate(45deg);
    -ms-transform: translateX(-50%) rotate(45deg);
    transform: translateX(-50%) rotate(45deg);
    bottom: 14px;
}
a {
    color: #333;
    background: transparent;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}
.servant-status-pop {
    z-index: 10001;
}
.servant-status-pop .zent-pop-inner {
    padding: 0;
}
.status-pop-list {
    color: #333;
    width: 110px;
    padding:0;
}
.status-pop-list .switch-item {
    padding: 10px;
    cursor: pointer;
    border: 0;
    background: inherit;
    font-size: 12px;
    margin: 0;
    -webkit-transition: background-color .5s;
    -moz-transition: .5s background-color;
    transition: background-color .5s;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    -moz-box-orient: horizontal;
    -moz-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.status-pop-list .check {
    color: #666;
    float: left;
    visibility: hidden;
}
.status-pop-list.busy .busy-check, .status-pop-list.offline .offline-check, .status-pop-list.online .online-check {
    visibility: visible;
}
.fa-check:before {
    content: "\F00C";
}
.status-pop-list .switch-item .flag {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    vertical-align: bottom;
    margin: 0 5px;
}
.status-pop-list .switch-item .flag.online {
    background-color: #3ebd00;
}
.status-pop-list .switch-item .busy-flag {
    color: #f44;
    font-size: 14px;
    margin: 0 5px;
    line-height: 12px;
}
.fa-minus-circle:before {
    content: "\F056";
}
.status-pop-list .switch-item .flag.offline {
    background-color: #d0d0d0;
}
.zent-pop.zent-popover-position-right-top .zent-pop-arrow {
    -webkit-transform: translateX(-50%) rotate(45deg);
    -moz-transform: translateX(-50%) rotate(45deg);
    -ms-transform: translateX(-50%) rotate(45deg);
    transform: translateX(-50%) rotate(45deg);
    top: 14px;
}
</style>
