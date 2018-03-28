<template>
  <section class="imapp-content">
    <slide :hide_model="hide_model" v-on:kefuStatus="changeStatus"></slide>
    <div class="plugin-content-body" v-if="isOnline == '1'">
      <!-- 左侧开始 -->
      <section class="aside">
          <ul class="sub-nav">
              <li>
                  <a class="sub-nav-item active" href="#/plugins">
                      <div class="icon servant"></div>
                      <span>客服管理</span>
                  </a>
              </li>
          </ul>
      </section>
      <!-- 左侧结束 -->
      <!-- 右侧开始 -->
      <section class="content">
        <section class="servant-content-body">
            <!-- <span class="servant-refresh-btn">刷新</span> -->
            <div class="zent-tabs servant-manager-wrap">
                <div class="zent-tabs-nav zent-tabs-size-normal zent-tabs-type-normal zent-tabs-align-left">
                    <el-tabs type="card" @tab-click="handleClick" v-model="activeName2">
                        <el-tab-pane :label="'在线（'+online+'）'" name="online">在线（{{online}}）</el-tab-pane>
                        <el-tab-pane :label="'忙碌（'+busy+'）'" name="busy">忙碌（{{busy}}）</el-tab-pane>
                        <el-tab-pane :label="'离线（'+offline+'）'" name="offline">离线（{{offline}}）</el-tab-pane>
                    </el-tabs>
                </div>
                <div class="zent-tabs-panewrap">
                    <div role="tabpanel" id="zent-tabpanel-7-online" class="zent-tab-tabpanel ">
                        <div class="item admin-online" v-for="(item,key) in shopCustList">
                            <figure class="bg-pic circle-bg-pic servant-pic">
                                <div class="bg-pic-content" :style="{backgroundImage: 'url('+item.headurl+')'}"></div>
                                <i class="dot state-light" v-show="tab_index == 0"></i>
                                <i class="dot state-light state-busy" v-show="tab_index == 1"></i>
                                <i class="dot state-light state-offline" v-show="tab_index == 2"></i>
                            </figure>
                            <span class="admin-title">
                                <span>{{item.custname}}</span>
                            </span>
                           <!-- <p class="desc">
                                	今日截止目前接待人次：
                                <span>0</span>
                            </p>-->
                        </div>
                        <!--<div class="zent-pagination servant-pagination">
                            <el-pagination
                              background  https://img.yzcdn.cn/upload_files/2017/10/26/FlP772nDkJsN9wlKVlDUJf6aKw2f.jpg
                              layout="prev, pager, next"
                              :total="1000" :page-size="10" @current-change="changePage">
                            </el-pagination>
                        </div>-->
                    </div>
                    <!-- react-empty: 1266 -->
                    <!-- react-empty: 1267 -->
                </div>
            </div>
        </section>
      </section>
      <!-- 右侧结束 -->
    </div>
    <div class="app-offline-mask" v-if="isOnline == '0'">
        <div class="app-offline-icon">
            <div class="icon-bg">
                <div class="icon"></div>
            </div>
            <span>必须在线才能接客哦</span>
        </div>
    </div>
  </section>
</template>

<script>

import slide from '@/components/slide'
export default {
  name: 'plugins',
  components: {slide},
  data () {
    return {

      shopCustList:[],
      onlineList:[],
      busyList:[],
      offlineList:[],
      hide_model: false,
      activeName2: 'online',
      online:0,
      busy:0,
      offline:0,
      isOnline:"1",
      status:'online'
    }
  },

  methods:{
  	
  	loadData(){
  		this.getOnlineList();
  		this.getBusyList();
  		this.getOfflineList();
  	},
    changeStatus(value){
        if(value == 'online'){
            this.isOnline = "1";
            this.tab_index = 0;
        }else if(value == 'busy'){
            this.isOnline = "1";
            this.tab_index = 1;
        }else{
            this.isOnline = "0";
            this.tab_index = 2;
        }
    },
  	//获取客服在线人数
  	getOnlineList(){
  		this.$http.get('/list/customer/getOnlineList',{
    		  params:{
    		 "crm_token": localStorage.crm_token,
			 	 "shopId":localStorage.shopId
    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		 if(res.body.code == '100'){
    		
    		 		this.online = res.body.data.length;
 						this.onlineList=res.body.data;
 						this.shopCustList = this.onlineList;
    		 }else{
    		 		console.log("异常2" + res.body.code + "-" + res.body.msg);
    		 }
    	})
  	},
  		//获取客服忙碌人数集合
  	getBusyList(){
  		this.$http.get('/list/customer/getBusyList',{
    		  params:{
    		 "crm_token": localStorage.crm_token,
			 	 "shopId":localStorage.shopId
    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		 if(res.body.code == '100'){
    		 		this.busy = res.body.data.length;
    		 		this.busyList=res.body.data;
    		 }else{
    		 		console.log("异常2" + res.body.code + "-" + res.body.msg);
    		 }
    	})
  	},
  		//获取客服离线人数集合
  	getOfflineList(){
  		this.$http.get('/list/customer/getOfflineList',{
    		  params:{
    		 "crm_token": localStorage.crm_token,
			 	 "shopId":localStorage.shopId
    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		 if(res.body.code == '100'){
    		 		this.offline = res.body.data.length;
    		 		this.offlineList=res.body.data;
    		 }else{
    		 		console.log("异常2" + res.body.code + "-" + res.body.msg);
    		 }
    	})
  	},
  	
    changePage(val){
      console.log(val);
    },
    handleClick(tab, event) {
      if(tab.name=='online'){
       this.tab_index = 0;
       this.shopCustList = this.onlineList;
      }if(tab.name=='busy'){
        this.tab_index = 1;
        this.shopCustList = this.busyList;
      }if(tab.name=='offline'){
        this.tab_index = 2;
        this.shopCustList = this.offlineList;
      }
    }
  },
  created(){
  	//添加延时
  	setTimeout(this.loadData(),300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plugin-content-body {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.imapp-content {
    background-color: #fff;
    position: relative;
}
.imapp-content, .imapp-content .page-body {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
}
.plugin-content-body .aside {
    width: 280px;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    position: relative;
    border-right: 1px solid #e5e5e5;
    background-color: #fcfcfd;
    height:100%;
}
.plugin-content-body .aside .sub-nav {
    padding-top: 30px;
    color: #666;
    font-size: 14px;
}
ol, ul {
    list-style: none;
}
.plugin-content-body .aside .sub-nav .sub-nav-item {
    display: block;
    padding: 10px 0 10px 60px;
    line-height: 30px;
    -webkit-transition: background-color .3s;
    -moz-transition: .3s background-color;
    transition: background-color .3s;
    position: relative;
}
.plugin-content-body .aside .sub-nav .sub-nav-item.active {
    background-color: #f2f2f2;
    color: #333;
}
.plugin-content-body .aside .sub-nav .sub-nav-item .icon {
    display: inline-block;
    position: absolute;
    background: url(../../static/images/sprite_plugin@1x.png) no-repeat;
    background-image: -webkit-image-set(url(../../static/images/sprite_plugin@1x.png) 1x,url(../../static/images/sprite_plugin@2x.png) 2x);
}
.plugin-content-body .aside .sub-nav .sub-nav-item .icon.servant {
    top: 15px;
    left: 20px;
    width: 20px;
    height: 20px;
    background-position: 0 -43px;
}
.plugin-content-body .aside .sub-nav .sub-nav-item.active .icon {
    background-image: url(../../static/images/sprite_plugin_active@1x.png);
    background-repeat: no-repeat;
    background-image: -webkit-image-set(url(../../static/images/sprite_plugin_active@1x.png) 1x,url(../../static/images/sprite_plugin_active@2x.png) 2x);
}
/*右侧区域*/
.plugin-content-body .content {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
}
.servant-content-body {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    color: #333;
    font-size: 14px;
    position: relative;
}
.servant-content-body .servant-refresh-btn {
    position: absolute;
    top: 32px;
    right: 30px;
    z-index: 2;
    color: #38f;
    font-size: 12px;
    cursor: pointer;
}
.zent-tabs {
    font-size: 14px;
    line-height: 1.42857143;
}
.servant-content-body .servant-manager-wrap {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
}

.servant-content-body .servant-manager-wrap .zent-tabs-panewrap {
    position: absolute;
    top: 55px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
.servant-content-body .servant-manager-wrap .zent-tabs-panewrap .zent-tab-tabpanel {
    position: relative;
}
.servant-content-body .servant-manager-wrap .item {
    display: inline-block;
    height: 40px;
    padding: 17px 20px 17px 70px;
    width: 170px;
    border: 1px solid #e5e5e5;
    background-color: #fcfcfd;
    border-radius: 2px;
    margin: 0 30px 20px 0;
    position: relative;
}
.bg-pic {
    display: inline-block;
    width: 45px;
    height: 45px;
    overflow: hidden;
}
.bg-pic.circle-bg-pic, .bg-pic.circle-bg-pic .bg-pic-content {
    border-radius: 50%;
}
.servant-content-body .servant-manager-wrap .item .servant-pic {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 17px;
    left: 20px;
    overflow: visible;
}
.bg-pic .bg-pic-content {
    background-size: cover;
    width: 100%;
    height: 100%;
    background-position: 50%;
}
.bg-pic.circle-bg-pic, .bg-pic.circle-bg-pic .bg-pic-content {
    border-radius: 50%;
}
.dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background-color: #a5a5a5;
    text-indent: -99999px;
}
.servant-content-body .servant-manager-wrap .item .state-light {
    width: 8px;
    height: 8px;
}
.servant-content-body .servant-manager-wrap .item .servant-pic .state-light {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid #fff;
    bottom: 0;
    right: 2px;
}
.servant-content-body .servant-manager-wrap .item.admin-online .state-light {
    background-color: #3ebd00;
}
.servant-content-body .servant-manager-wrap .item.admin-online .state-busy {
    background-color: #f44;
}
.servant-content-body .servant-manager-wrap .item.admin-online .state-offline {
    background-color: #d0d0d0;
}
.servant-content-body .servant-manager-wrap .item .desc {
    font-size: 12px;
    color: #999;
    font-weight: 200;
    line-height: 20px;
}
.zent-pagination {
    font-size: 12px;
    line-height: 16px;
    text-align: right;
}
.zent-pagination__info {
    display: inline-block;
}
.zent-pagination .pagination-list {
    display: inline-block;
}
.zent-pagination .pagination-list .pager {
    position: relative;
    display: inline-block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0 0 0 5px;
    border: 1px solid #bbb;
    border-radius: 2px;
    padding: 6px 8px;
    min-width: 30px;
    text-align: center;
    background: #fff;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.zent-pagination .pagination-list .pager--disabled {
    border-color: #e5e5e5;
    cursor: not-allowed;
    color: #e5e5e5;
}
.zent-pagination .pagination-list .pager__suffix {
    padding: 7px 5px;
    background: #e5e5e5;
}
.servant-content-body .servant-manager-wrap .servant-pagination .pagination-list .pager__suffix {
    padding: 6px 5px;
}
/*右侧区域结束*/
.app-offline-mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    text-align: center;
    z-index: 10000;
    background-color: #fff;
}
.app-offline-mask .app-offline-icon {
    color: #999;
    text-align: center;
    height: 154px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    font-size: 14px;
}
.app-offline-mask .app-offline-icon .icon-bg {
    width: 120px;
    height: 120px;
    margin: auto;
    border-radius: 50%;
    background-color: #f8f8f8;
    overflow: hidden;
}
.app-offline-mask .app-offline-icon .icon-bg .icon {
    height: 52px;
    width: 56px;
    margin: 37px auto auto;
    background: url(../../static/images/computer.png) 50% no-repeat;
    background-image: -webkit-image-set(url(../../static/images/computer.png) 1x,url(../../static/images/computer@2x.png) 2x);
}
.app-offline-mask .app-offline-icon span {
    line-height: 40px;
}
</style>