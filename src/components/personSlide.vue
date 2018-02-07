<template>
  <section class="aside">
    <div class="channelswitch-wrap">
      <div class="panel inservice-panel ">
          <div>
              <!--<div class="tool-bar">
                  <div class="super-searchbox">
                      <span class="search-icon"></span>
                      <input type="search" v-model="keyWord" class="search-input" placeholder="请输入客户名称" @keyup.enter="goSearch()" v-model="searchTitle">
                  </div>
              </div>-->
              <div class="search-result" v-if="showSearch">
                  <div class="no-result" v-if="!searchList.length">无搜索结果</div>
                  <div class="search-overview" v-if="searchList.length" @click.stop="">
                      <h4>
                          <strong>微信客户</strong>
                      </h4>
                      <ul class="channel-list fans-list">
                          <li class="fans-item " v-for="item in searchList">
                              <figure class="bg-pic circle-bg-pic border-bg-pic">
                                  <div class="bg-pic-content" :style="'background-image: url('+ item.avatar+ ');'"></div>
                              </figure>
                              <h3>{{item.nick}}</h3>
                              <p>{{item.desc}}</p>
                          </li>
                      </ul>
                  </div>
              </div>

              <div v-show="pagePositon == 'talk'" class="waiting-switch" @click="showWait()">{{waitQueueNum}}人正在排队
                  <span class="caret icon"></span>
              </div>
              <section v-show="pagePositon == 'history'" class="aside-title">历史客户</section>
          </div>
          <div class="im-app-sessionlist-wrap">
              <ul class="im-app-sessionlist">
              		<!--作者：offline 时间：2017-12-26 描述：订单管理-->
                  <li class="item view" @click="chooseOrders()" :class="orderOrChatItemActive =='order' ? 'active': ''" v-if ="pagePosition != 1">
					  <span class="circle-count unread-message-count" v-if="orderCount > 0">
                      <i class="count">{{this.orderCount}}</i>
                      </span>
                      <figure class="session-pic">
                          <img src="https://img.yzcdn.cn//im_zero/image/ring_bk@2x.png" alt="">
                      </figure>
                      <h3 class="desc nick">订单消息</h3>
                      <pre class="desc">订单列表</pre>
                  </li>
                  <!--作者：offline 时间：2017-12-26 描述：接入用户管理-->
                  <li class="item view" v-for="(item,key) in memberList" @click="chooseNews(item)" :class="item.active ? (orderOrChatItemActive =='chat'?'active':''): ''" @mouseover="hoverPersonList(item)" @mouseout="outPersonList(item)">
                      <span class="circle-count unread-message-count" v-if="item.msgcount > 0">
                        <i class="count">{{item.msgcount}}</i>
                      </span>
                      <figure class="session-pic">
                          <img :src="item.headimgurl" alt="">
                      </figure>
										
                      <h3 class="desc nick">{{item.nickname}}</h3>

                      <span class="square-close"  v-if="pagePosition=='0'" title="退出接待" @click.stop="quitNews(item.userId)" v-show="item.closeShow">×</span>

                      <time class="time">{{item.time}}</time>
                      <pre class="desc" v-html="emoji(item.message)"></pre>
                      	  <span class="postfix" :class="item.joinway =='phone' ? 'postfix--mobile':'postfix--weixin'">{{item.joinway !="phone"?   (item.joinway=="small"?'小程序':'微信'):"手机"}}</span>
                  </li>
                  
                  <!--
                  	作者：991405143@qq.com
                  	时间：2017-12-22
                  	描述：历史聊天用户的最后一条历史聊天记录
                  -->
                  <!--<li class="item  view" v-for="(item,key) in shopLastMessage">
                      <figure class="session-pic">
                          <img src="https://img.yzcdn.cn/upload_files/avatar.png" alt="">
                      </figure>
                      <span class="postfix postfix--mobile">{{item.joinway=="1"?"微信":"手机"}}</span>
                      <h3 class="desc nick">{{item.username==null?"null":item.username}}</h3>
                      <span class="square-close" title="关闭" @click=" quitLastMessage(key)" >×</span>
                      <time class="time">{{item.createtime}}</time>
                      <pre class="desc">{{item.message}}</pre>
                  </li>-->
              </ul>
          </div>
          
          <div class="autojoin-setting-wrap" v-if="this.pagePositon=='talk'">
              <div class="inservice-count">接待中{{waitPerson}}人</div>
              <div class="zent-popover-wrapper zent-pop-wrapper" style="display: inline-block;" @click="showPersonLimit()">
                  <div class="autojoin-setting">
                      自动分配
                      <span class="autojoin-count">上限{{personNum}}人</span>
                      <span class="caret"></span>
                  </div>
              </div>
          </div>
      </div>
      <!-- show -->
      <div class="panel waiting-panel" :class="waitShow ? 'show':''">
          <div class="tool-bar">
              <span>
                  待接待
              </span>
              <span class="back" @click="hideWait()">
                  <i class="fa fa-chevron-left icon back-icon" aria-hidden="true"></i>
                  返回
              </span>
          </div>
          <div class="im-app-sessionlist-wrap">
              <ul class="im-app-sessionlist"></ul>
          </div>
          
          <!--排队等待接入-->
          <div class="im-app-sessionlist-wrap">
              <ul class="im-app-sessionlist">
                  <li class="item  view" v-for="(item,key) in quequUserList">
                      <figure class="session-pic">
                          <img :src="item.headimgurl" alt="">
                      </figure>
					  				 <span class="postfix" :class="item.joinway =='phone' ? 'postfix--mobile':'postfix--weixin'">{{item.joinway !="phone"?   (item.joinway=="small"?'小程序':'微信'):"手机"}}</span>

                      <h3 class="desc nick">{{item.nickname}}</h3>
                      <!--<h3 class="desc nick">{{item.nickName}}</h3>-->
                      <h3 class="desc nick">{{item.message}}</h3>
                      <time class="time">{{item.time}}</time>
                      <!--<span class="square-close" title="退出排队" @click="quitQueue(key)" >×</span>-->
                  </li>
              </ul>
          </div>
      </div>
     <!--  <div class="panel waiting-panel  withpagenav">
          <div class="tool-bar">
              <span>
                  待接待（2）
              </span>
              <span class="back">
                  <i class="fa fa-chevron-left icon back-icon" aria-hidden="true"></i>
                  返回
              </span>
          </div>
          <div class="im-app-sessionlist-wrap">
              <ul class="im-app-sessionlist">
                  <li class="item  view">
                      <figure class="session-pic">
                          <img src="https://img.yzcdn.cn/upload_files/avatar.png" alt=""></figure>
                      <span class="postfix postfix--mobile">手机</span>
                      <h3 class="desc nick">土豆藕一生啊</h3>
                      <time class="time">10:36</time>
                      <span class="square-close" title="删除">×</span>
                      <pre class="desc">[商品]</pre>
                  </li>
                  <li class="item  view">
                      <figure class="session-pic">
                          <img src="https://wx.qlogo.cn/mmopen/PiajxSqBRaEK4e3nUtrTD3gXho6yc1OH8FkKHnkicia6zaL9ZAUBSXTFfWTopGUkABF0ibBIqoibHbxZf5xczqHwRNw/0" alt=""></figure>
                      <span class="postfix postfix--weixin">微信</span>
                      <h3 class="desc nick">飞阿飞🐘💨</h3>
                      <time class="time">10:25</time>
                      <span class="square-close" title="删除">×</span>
                      <pre class="desc">冷冷冷</pre>
                  </li>
              </ul>
          </div>
          <div class="waiting-page-nav">
              共1页
          </div>
      </div> -->
    </div>
    <div class="zent-portal zent-pop autojoin-options zent-popover zent-popover-internal-id-67 zent-popover-position-top-center" style="position: absolute; left: 135px; bottom: 50px;" v-show="limitShow">
      <div data-reactroot="" class="zent-popover-content">
          <div class="zent-pop-inner">
            <ul>
                <li class="option " @click="showPersonLimit()">
                    <input type="button" value="关闭">
                </li>
                <li class="option" v-for="item in personLimit" :class="item.active ? 'active':''" @click="choosePesonNum(item)">
                    <input type="button" @click="changeCustMaxusernum(item.num)" :value="item.num + '人'">
                </li>
            </ul>
          </div>
          <i class="zent-pop-arrow"></i>
        </div>
    </div>
    <el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="30%" :show-close="false" :close-on-click-modal="false"
		   >
		  <span>您已经在其他地方登录了(倒计时关闭{{timeCount}})</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="confirmAndClose">确 定</el-button>
		  </span>
		</el-dialog>
  </section>

  
</template>

<script>
export default {
  name: 'personSlide',
  data () {	
    return {
    dialogVisible:false,
    orderCount:0, //订单消息数量
    shopLastMessage:[], //商户的历史用户的最后一条聊天记录
    quequUserList:[],  //获取等待用户信息
    queueNum:'',       //获取等待人数
    access_token:'',
    //用于初始化获取客服的信息
    customerFrom:{
    		custId:'',
    		shopId:'',
    	}
     , memberList:[
// '     {
//        'username':'',
//        'avatar':'https://img.yzcdn.cn//im_zero/image/ring_bk@2x.png',
//        'lastMsg':'',
//        'sendWay':'',
//        'lastTime':'',
//        'active':true,
//        'closeShow':false,
//        'count':1, //未读消息个数
//        'type': 'order'
//      },'
        
      ],
      personLimit:[
        {num:5,active:true},
        {num:10,active:false},
        {num:15,active:false}
      ],
      personNum:'', //限制人数数量
      waitShow:false,//接待弹窗
      limitShow:false,//选择限制人数弹窗
      waitPerson:0,
      orderOrChatItemActive:'',
      waitQueueNum:0,
      showSearch:false,//搜索结果弹窗
      searchTitle:'', //要搜索内容
      pagePosition:0,//判断如果是历史就不显示订单消息
      searchList:[
        {
          'nick':'2332434',
          'avatar':'https://img.yzcdn.cn//im_zero/image/ring_bk@2x.png',
          'desc':'暂无新订单',
        }
      ],
      pagePositon:'talk', //判断页面当前位置
      timeID :"",
      timeCount  : 10,
      hasNews:false
    }
  },
  sockets:{
//  connect: function(res){
//  	console.log('connect-----',res);
//  	console.log({shopId:localStorage.shopId,custId:localStorage.custId,custStatus:localStorage.kefuStatus});
//  	if (res != "temp"){
//  		console.log('connect成功，坐席custJoin--------------');
//  		this.$socket.emit('custJoin', {shopId:localStorage.shopId,custId:localStorage.custId,custStatus:localStorage.kefuStatus});
//  	}
//  },
    
    currentDialog: function(res){

    	console.log("currentDialog----",res);
//  	
    	
    	if (this.pagePosition == '0'){
    				var obj = eval('(' + res + ')');
		     	//判断memberList是否有盖userid 
					if (null!=obj.data&&obj.data.length > 0){
						this.memberList = obj.data;
					    this.waitPerson = obj.data.length;
					}else{
						this.memberList = [];
						this.waitPerson = 0;
					}
    	}
      
    },
    //排队人数
    waitQueue: function(res){
      //var obj = eval('(' + res + ')');
			console.log('waitQueue',res);
			if(null!=res){
				this.quequUserList = res;
    		this.waitQueueNum = res.length;
			}else{
				this.quequUserList = '';
    		this.waitQueueNum = 0;
			}
    },
    message:function(res){
    	if (res != null && res != ''){
    			var RegUrl = new RegExp(); 
						RegUrl.compile('<a style');//jihua.cnblogs.com 
					  var that = this;
    				this.memberList.forEach(function(user,key){
              // console.log(user);
							if (user.userId == res.userid){
							//	user.time= res.createtime;
								if (res.msgtype =='image'){
									 user.message = '[图片]';
								}else if (res.msgtype=='goods'){
										user.message="[商品]";
								}else	if (RegUrl.test(res.message)) {
									  user.message="[链接]";
								}else if (res.msgtype=='miniprogrampage'){
										user.message="[小程序卡片]"
								}else {
									user.message = res.message;
								}
							
								if ( res.userid != localStorage.serUserId){
										user.msgcount = res.msgcount;
                    if(user.msgcount){
                      that.hasNews = true;
                      console.log('------------111111111111111111');
                    }else{
                      that.hasNews = false;
                      console.log('-------------222222222222222'); 
                    }
								}
							}
				})
    	}
    	//判断状态，如果为1的话，那么就是从其他浏览器登录了，这个时候给出提示，然后自动下线。
		
    },
    //用来监听客服的转接
    userTranfer:function(res){
    	if (this.memberList.length > 0){
    			var a =this.memberList.shift();
					
					this.memberList.unshift(a);
					this.memberList.unshift(res);
    	}else{
    		this.memberList.push(res)
    	}
			this.waitPerson= this.memberList.length;
    },
    //连接的时候，参数异常关闭连接，并提示
    errPara:function(res){
    	if (res == '102'){
    			window.location.href="https://www.huisou.cn/auth/login";
    	}
    },
    //根据判断，判断是否下线。
    status:function(res){
    	let that = this;
				if (res == '1'){
						that.dialogVisible= true;
					  clearInterval(that.timeID);
						that.timeID = setInterval(function(){
							that.timeCount --;
						}, 1000)
				}
		}
    		
  },
  beforeDestroy(){
    this.$root.Bus.$off('choose_position');
    this.$root.Bus.$off('tranferTo_other');
  },

  //当页面创建的是初始化对应的信息，
  created(){
    //刷新页面的时候初始化
    if(localStorage.getItem('currentPage') == 'index'){
      this.pagePositon = 'talk';
      this.pagePosition=0;
      this.memberList=[];
      this.loadData();
    }else if(localStorage.getItem('currentPage') == 'history'){
      this.pagePositon = 'history';
      this.pagePosition=1;
      this.memberList=[];
      this.loadData();
    }
    
	 // this.$watch('memberList',function(newVal,oldVal){
  //    console.log(newVal,oldVal);
  //  })
	//用来抑制监听对应的转移事件
	this.$root.Bus.$on("tranferTo_other", value=>{
    	if (value.userId != null && value.userId !='') {
    			//删除队伍中的值。
    			var a=null;
    			this.memberList.forEach(function(user,index){
    					if (user.userId == value.userId){
    							a =index;
    					}
    			});
  			if (a != null){
    				 this.$root.Bus.$emit("customer_list_choose", '');
    				this.memberList.splice(a,1);
    				this.waitPerson = this.memberList.length
    			}
    			
    	}
	})
  	
	

  	//每次登陆成功自后，将对应的信息存放到本地的cookie中去，
	localStorage.serUserId = '';
    //接收左侧栏点击注册事件，显示排队历史客户
    this.$root.Bus.$on('choose_position',data=>{

        if(data != 'plugins'){
          this.pagePositon = data;
          this.memberList=[];
          this.loadData();
        }
    })
    
  },
  methods:{
  	//从本地的cookie中获取本地的用户的详细的信息
  	//用来加载对应的页面的数据
  	loadData: function(){
  		if (this.pagePositon == "history"){
	  				this.pagePosition=1;
		  			this.$http.get('/list/customer/userHistoryList',{
							params:{
								"shopId":localStorage.shopId,
								"custId":localStorage.custId,
								"crm_token":localStorage.crm_token
							}}, {emulateJSON:true}
		  			).then(function(res){
							if (res.body.code =='100' && res.body.data.length > 0){
								this.memberList=res.body.data;
                this.memberList.forEach((val,key)=>{
                  if(val.msgcount){
                    this.hasNews = true;
                  }
                })
	//							console.log(this.memberList)
		//							this.waitPerson = res.body.data.userHistory.length;
							}else{
								console.log("历史记录异常" + res.body.code + "-" + res.body.msg);
							}
					})
  		} else {

					this.pagePosition= 0;
			  		this.$http.get('/list/customer/init',{
						params:{
								"shopId":localStorage.shopId,
								"custId":localStorage.custId,
								"status":localStorage.kefuStatus,
								"crm_token":localStorage.crm_token
							}}, {emulateJSON:true}
					).then(function(res){
							if (res.body.code =='100' && res.body.data.userInfoVos.length > 0){
									console.log('init--',res);
									this.memberList=res.body.data.userInfoVos;
                  this.memberList.forEach((val,key)=>{
                    if(val.msgcount){
                      this.hasNews = true;
                    }
                  })
									this.$root.Bus.$emit("customer_state", res.body.data.custserverstatus);
									//this.waitPerson = res.body.data.userInfoVos.length -1;
									this.waitPerson = res.body.data.joinusernum;
									//自动分配上限
									this.personNum = res.data.data.maxusernum;
							}else{
								console.log("异常" + res.body.code + "-" + res.body.msg);
							}
		
					}),
					this.getQueueSize();
					this.getQuequUser();
					this.getShopCustPo();
					this.getOrderCount();
			 		//this.getShopLastMessage();
				}
  	},
  	chooseOrders: function(){
  		this.$http.get('/list/order/clearOrderNotification',{
    		  params:{
    		 "crm_token": localStorage.crm_token,
			 	 "shopId":localStorage.shopId
    		  }
    	},{emulateJSON:true}
    ).then(function(res){
    	})
  		this.orderCount = 0;
  		this.orderOrChatItemActive='order';
  		var item={"type":'order'};
  			this.$root.Bus.$emit("select_service_page", 1);
  		 this.$root.Bus.$emit("customer_list_choose", item);
  	},
  	//确定的时候关闭页面
  	confirmAndClose(){
				this.closeWindow();
  	},
  	
  	//获取客服信息
  	getShopCustPo(){
  		this.$http.get('/list/customer/getShopCustPo',{
    		  params:{
    		 "crm_token": localStorage.crm_token,
			 	 "shopId":localStorage.shopId,
			 	 "custId":localStorage.custId
    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		 if(res.body.code == '100'){
    		 		this.personNum = res.body.data.maxusernum;
    		 		if(this.personNum==5){
    		 				this.personLimit=[{num:5,active:true},{num:10,active:false},{num:15,active:false}];
    		 		}if(this.personNum==10){
    		 				this.personLimit=[{num:5,active:false},{num:10,active:true},{num:15,active:false}];
    		 		}if(this.personNum==15){
    		 				this.personLimit=[{num:5,active:false},{num:10,active:false},{num:15,active:true}];
    		 		}
    		 
    		 }else{
    		 		console.log("异常2" + res.body.code + "-" + res.body.msg);
    		 }
    	})
  	},
  	
    //获取该商户的历史聊天用户的最后一条消息
    getShopLastMessage(){
    	this.$http.get('/list/message/getShopLastMessage',{
    		  params:{
    		 "crm_token": localStorage.crm_token,
			 "shopId":localStorage.shopId

    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		 if(res.body.code == '100'){
    		 		this.shopLastMessage = res.body.data;
    		 }else{
    		 		console.log("异常2" + res.body.code + "-" + res.body.msg);
    		 }
    	})
    },
    
    //获取该商户排队人数
    getQueueSize(){
    	this.$http.get('/list/queueController/getQueueSize',{
    		  params:{
    		  	"crm_token": localStorage.crm_token,
						"shopId":localStorage.shopId
    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		
    		 if(res.body.code == '100'){
    		 		this.waitQueueNum = res.body.data;
    		 }else{
    		 		console.log("异常3" + res.body.code + "-" + res.body.msg);
    		 }
    	})
    },
    
    //获取该商户排队的人的信息
    getQuequUser(){
    	this.$http.get('/list/queueController/getQuequUserList',{
    		  params:{
	    		  crm_token: localStorage.crm_token,
						shopId:localStorage.shopId,
						custId:localStorage.custId
    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		 if(res.body.code == '100'){
    		 		var json = res.body.data;
    		 		this.quequUserList = json;
    		 }else{
    		 		console.log("异常4" + res.body.code + "-" + res.body.msg);
    		 }
    	})
    },

    //获取订单消息数量
    getOrderCount(){
    	this.$http.get('/list/order/getNewOrderCount',{
    		  params:{
    		  	crm_token: localStorage.crm_token,
						shopId:localStorage.shopId
							}
			    	},{emulateJSON:true}
			    	).then(function(res){
			    		 if(res.body.code == '100'){
			    		 		this.orderCount = res.body.data;
			    		 }else{
			    		 		console.log("异常4" + res.body.code + "-" + res.body.msg);
			    		 }
			    	})
			},
    
   //改变客服的最大接入人数
    changeCustMaxusernum(num){
    		this.$http.get('/list/customer/changeCustMaxusernum',{
    		  params:{
    		  crm_token: localStorage.crm_token,
					shopId:localStorage.shopId,
					custId:localStorage.custId,
					maxusernum:num
    		  }
    	},{emulateJSON:true}
    	).then(function(res){
    		 if(res.body.code == '100'){
    		 }else{
    		 		console.log("异常4" + res.body.code + "-" + res.body.msg);
    		 }
    	})
    },
    //当点击的时候，去后台发送信息，并加载对应的消息和赌赢的数据
    chooseNews(item){
    	//同时将消息的目录变为0
      var that = this;
    	item.msgcount = 0;
			this.$axios.get("list/customer/selectedUser",{params:{

				userId: item.userId,
				shopId: localStorage.shopId,
				custId: localStorage.custId,
				crm_token:localStorage.crm_token

			}}).then((res)=>{
				localStorage.serUserId = item.userId;
				localStorage.joinWay = item.joinway;
				localStorage.openid = item.openid;
				//不发送任何信息只是为了触发时间
				this.$root.Bus.$emit("select_service_user", "");
			    this.$root.Bus.$emit("customer_list_choose", item);
			})
			
			this.$root.Bus.$emit("select_service_page", 1);
      this.memberList.forEach(function(item){
        item.active = false;
      })
      this.orderOrChatItemActive='chat';
      item.active = true;
      this.memberList.forEach(function(val,key){
        if(val.msgcount){
          that.hasNews = true;
        }else{
          that.hasNews = false;
        }
      })
   }, 
    // 显示等待人数弹窗
    showWait(){
      this.waitShow = true;
    },
    // 隐藏等待人数弹窗
    hideWait(){
      this.waitShow = false;
    },
    showPersonLimit(){
      this.limitShow = !this.limitShow;
    },
    //选择限制人数点击
    choosePesonNum(item){
      this.personLimit.forEach(function(itm){
        itm.active = false;
      })
      this.limitShow = false;
      item.active = true;
      this.personNum = item.num;
    },
    //鼠标移到人员列表
    hoverPersonList(item){
      item.closeShow = true;
    },
    outPersonList(item){
      item.closeShow = false;
    },
    //退出接待
    quitNews(userid){
   
      this.$axios.get("list/customer/closeDialog",{params:{
				crm_token:localStorage.crm_token,
				userIds: userid,
				shopId: localStorage.shopId,
				custId: localStorage.custId
			}}).then((res)=>{
				//如果推出的是当前会话用户，则关闭会话面板页
				if(userid==localStorage.serUserId){
					localStorage.serUserId="";
					this.$root.Bus.$emit("customer_list_choose", '');
				}
			});
			
	   this.memberList.splice(userid,1);
    },
    //退出排队
    quitQueue(key){
      this.quequUserList.splice(key,1);
    },
    //关闭商户的历史聊天客户的展示
     quitLastMessage(key){
      this.shopLastMessage.splice(key,1);
    },
    // 人员搜索
    goSearch(){
    	//对用户的历史进行搜索
    	
      this.showSearch = true;
    },
    closeWindow(){
    		if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {  
		        window.location.href="about:blank";  
		        window.close();  
		    } else {  
		        window.opener = null;  
		        window.open("", "_self");  
		        window.close();  
		    }
    }
  },
  watch:{
  	timeCount(n,o){
  		if(n==0){
  			clearInterval(this.timeID);
				this.closeWindow();
  		}
  	},
    hasNews:{
      handler:function(n,o){  
          if(n){
            text = '您有未读【新消息】'
            flag = true;
            newtext();
            document.getElementById("play1").play();
            // console.log('有新消息')
          }else{
            // console.log('没有新消息')
            document.title = localStorage.getItem('shop_name');
            flag = false;
          }
      },  
      deep:true
    },
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aside {
    width: 280px;
    height: 100%;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    position: relative;
    border-right: 1px solid #e5e5e5;
}
.aside-title {
    line-height: 34px;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
}
.channelswitch-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.channelswitch-wrap .panel {
    height: 100%;
    background: #fcfcfd;
}
.channelswitch-wrap .inservice-panel .tool-bar {
    height: 50px;
    background-color: #fff;
    position: relative;
}
.super-searchbox {
    border-radius: 16px;
    display: inline-block;
    background-color: #f2f2f2;
    padding: 0 8px;
    left: 10px;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    line-height: 0;
}
.super-searchbox .search-icon {
    display: inline-block;
    width: 13px;
    height: 24px;
    background: url(/im_zero/image/ico_search_v2.png) 50% no-repeat;
    background-image: -webkit-image-set(url(/im_zero/image/ico_search_v2.png) 1x,url(/im_zero/image/ico_search_v2@2x.png) 2x);
}
button, input {
    overflow: visible;
}
button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
}
[type=search] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
}
button, input[type=email], input[type=number], input[type=password], input[type=search], input[type=text], select, textarea {
    font-family: inherit;
    font-size: 100%;
    margin: 0;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    -moz-appearance: none;
}
.super-searchbox .search-input {
    margin-left: 5px;
    font-size: 12px;
    width: 225px;
    line-height: 18px;
    border: 0;
    padding: 3px 0;
    vertical-align: top;
    background-color: initial;
}
.super-searchbox .search-input, .super-searchbox .search-input:focus {
    outline: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
}
.search-result {
    position: absolute;
    top: 50px;
    left: 0;
    width: 280px;
    max-height: 500px;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-box-shadow: 0 1px 4px rgba(0,0,0,.4);
    box-shadow: 0 1px 4px rgba(0,0,0,.4);
    z-index: 300;
    font-size: 12px;
    line-height: 18px;
}
.search-result .no-result {
    font-size: 12px;
    min-height: 0;
    padding: 30px 10px;
    color: #777;
    text-align: center;
}
.search-result h4 {
    background-color: #dcdcdc;
    padding: 5px 10px;
}
.search-result h4 strong {
    font-weight: 700;
}
.fans-item {
    position: relative;
    -webkit-transition: background-color .2s linear;
    -moz-transition: background-color .2s linear;
    transition: background-color .2s linear;
    cursor: pointer;
    min-height: 36px;
    padding: 17px 12px 17px 60px;
}
.search-result .channel-list>li:last-of-type {
    border-bottom: none;
}
.bg-pic {
    display: inline-block;
    width: 45px;
    height: 45px;
    overflow: hidden;
}
.bg-pic.border-bg-pic {
    border: 1px solid #d9d9d9;
}
.bg-pic.circle-bg-pic, .bg-pic.circle-bg-pic .bg-pic-content {
    border-radius: 50%;
}
.bg-pic .bg-pic-content {
    background-size: cover;
    width: 100%;
    height: 100%;
    background-position: 50%;
}
.fans-item .bg-pic {
    position: absolute;
    top: 17px;
    left: 12px;
    width: 36px;
    height: 36px;
    margin:0;
}
.fans-item h3 {
    font-size: 13px;
    font-weight: 700;
    line-height: 20px;
    margin:0;
}
.fans-item p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 14px;
    color: #ccc;
    margin:0;
}
.waiting-switch{
	text-align: center;
}
.channelswitch-wrap .inservice-panel .waiting-switch {
    line-height: 34px;
    padding: 0 10px;
    color: #333;
    font-size: 14px;
    background-color: #f2f2f2;
    cursor: pointer;
}
.caret {
    width: 13px;
    height: 10px;
    background: url(../../static/images/caret@1x.png) 50% no-repeat;
    background-image: -webkit-image-set(url(../../static/images/caret@1x.png) 1x,url(../../static/images/caret@2x.png) 2x);
    -webkit-transition: -webkit-transform .1s ease-in;
    transition: -webkit-transform .1s ease-in;
    -moz-transition: transform .1s ease-in,-moz-transform .1s ease-in;
    transition: transform .1s ease-in;
    transition: transform .1s ease-in,-webkit-transform .1s ease-in,-moz-transform .1s ease-in;
}
.channelswitch-wrap .inservice-panel .waiting-switch .icon {
    float: right;
    height: 34px;
    display: inline-block;
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    transform: rotate(-90deg);
}
/*订单列表*/
.im-app-sessionlist-wrap {
    position: absolute;
    width: 100%;
    top: 50px;
    left: 0;
    bottom: 0;
    overflow-x: visible;
    overflow-y: auto;
}
.im-app-sessionlist{padding:0;}
.channelswitch-wrap .inservice-panel .im-app-sessionlist-wrap {
    top: 42px;
    bottom: 51px;
}
ol, ul {
    list-style: none;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item {
    min-height: 36px;
    padding: 17px 12px 17px 60px;
    position: relative;
    -webkit-transition: background-color .2s linear;
    -moz-transition: background-color .2s linear;
    transition: background-color .2s linear;
    cursor: pointer;
    font-size: 12px;
}
.circle-count {
    display: inline-block;
    min-width: 12px;
    min-height: 12px;
    font-size: 12px;
    line-height: 12px;
    border-radius: 10px;
    padding: 2px;
    background-color: #f60;
    text-align: center;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .unread-message-count {
    left: 8px;
    z-index: 2;
    min-width: 12px;
    min-height: 12px;
    line-height: 12px;
    border-radius: 8px;
    position: absolute;
    top: 12px;
    color: #fff;
}
.circle-count .count {
    color: #fff;
    display: inline-block;
    -webkit-transform: scale(.83);
    -moz-transform: scale(.83);
    -ms-transform: scale(.83);
    transform: scale(.83);
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
    font: inherit;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item.active {
    background-color: #e5e5e5;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .postfix {
    position: absolute;
    right: 10px;
    bottom: 18px;
    border: 1px solid #999;
    border-radius: 2px;
    padding: 2px 3px;
    height: 14px;
    line-height: 14px;
    color: #999;
}

.im-app-sessionlist-wrap .im-app-sessionlist .item .postfix--weixin {
    border-color: #3ebd01;
    color: #3ebd01;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .postfix--mobile {
    border-color: #409eff;
    color: #409eff;
}


.im-app-sessionlist-wrap .im-app-sessionlist .item .session-pic {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 16px;
    left: 12px;
    border-radius: 50%;
    overflow: hidden;
    display: inline-block;
    margin:0;
    padding:0;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .session-pic img {
    width: 40px;
    height: 40px;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .desc {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 150px;
    color: #999;
    line-height: 18px;
    margin:0;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .nick {
    font-size: 14px;
    line-height: 20px;
    color: #333;
    margin:0;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .square-close {
    color: #fff;
    background-color: #d2d2d5;
    width: 14px;
    height: 14px;
    line-height: 12px;
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
}
.im-app-sessionlist-wrap .im-app-sessionlist .item .time {
    position: absolute;
    top: 16px;
    right: 12px;
    font-weight: 400;
    color: #b1b1b1;
    margin:0;
}

/*待接待弹窗*/
.channelswitch-wrap .waiting-panel {
    position: absolute;
    left: 280px;
    width: 280px;
    top: 0;
    opacity: 0;
    right: 0;
    -webkit-transition: left .2s,opacity .5s;
    -moz-transition: .2s left,.5s opacity;
    transition: left .2s,opacity .5s;
    z-index: -1;
}
.channelswitch-wrap .waiting-panel.show {
    opacity: 1;
    left: 0;
    z-index: 3;
}
.channelswitch-wrap .waiting-panel .tool-bar {
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    color: #333;
}
.channelswitch-wrap .waiting-panel .tool-bar .back {
    color: #666;
    position: absolute;
    left: 0;
    top: auto;
    cursor: pointer;
}
.fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.channelswitch-wrap .waiting-panel .back-icon {
    color: #999;
}
.channelswitch-wrap .waiting-panel .tool-bar .back .icon {
    margin: 0 5px;
}
.fa-chevron-left:before {
    content: "\F053";
}

/*接待人数统计*/
.autojoin-setting-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 50px;
    border-top: 1px solid #e5e5e5;
    text-align: center;
    font-size: 14px;
    background-color: #fff;
}
.autojoin-setting-wrap .inservice-count {
    display: inline-block;
    line-height: 20px;
    padding-right: 15px;
    margin: 15px 0;
    border-right: 1px solid #e5e5e5;
}
.autojoin-setting-wrap .autojoin-setting {
    height: 100%;
    padding-left: 15px;
    cursor: pointer;
}
.autojoin-setting-wrap .autojoin-setting .autojoin-count {
    margin: 0 5px;
}
.caret, .ico-action {
    display: inline-block;
}

/*底部限制人数弹窗*/
.zent-pop {
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 6px rgba(0,0,0,.2);
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    background-color: #fff;
    z-index: 2000;
    font-size: 12px;
}
.autojoin-options {
    width: 100px;
    text-align: center;
    color: #333;
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
.autojoin-options .zent-pop-inner {
    padding: 0;
}
.autojoin-options .zent-pop-inner ul{padding:0;}
.autojoin-options .option {
    -webkit-transition: background-color .5s,color .5s;
    -moz-transition: .5s background-color,.5s color;
    transition: background-color .5s,color .5s;
    padding: 3px 0;
    position: relative;
}
button, input, optgroup, select, textarea {
    margin: 0;
}
button, input {
    overflow: visible;
}
button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
}
[type=reset], [type=submit], button, html [type=button] {
    -webkit-appearance: button;
}
.autojoin-options .option input {
    border: 0;
    width: 100%;
    line-height: 20px;
    background-color: initial;
    cursor: pointer;
}
.autojoin-options .active:before {
    content: "\F00C";
    display: inline-block;
    position: absolute;
    top: 8px;
    left: 8px;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
.zent-pop.zent-popover-position-top-center .zent-pop-arrow, .zent-pop.zent-popover-position-top-left .zent-pop-arrow, .zent-pop.zent-popover-position-top-right .zent-pop-arrow {
    bottom: 0;
}
.zent-pop.zent-popover-position-top-center .zent-pop-arrow {
    -webkit-transform: translate(-50%,50%) rotate(45deg);
    -moz-transform: translate(-50%,50%) rotate(45deg);
    -ms-transform: translate(-50%,50%) rotate(45deg);
    transform: translate(-50%,50%) rotate(45deg);
    left: 50%;
}
</style>
