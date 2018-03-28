<template>
	<div class="chat_panel">
		<div class="chat_show">
			<!--聊天面板顶部栏-->
			<div class="chat_top flex_between_v">
			<!--	<div class="chatter_name vertical_v" @click.stop="severPanel">-->
					<span class="name">历史消息</span>&nbsp;&nbsp;
					<!--<span class="pNum">{{custJoinNum}}人 
						<span class="el-icon-arrow-down"></span>
					</span>-->
			<!--	</div>-->
				<div class="chatter_fun" v-if="userInfo.userTransfer">
					<el-button type="text" icon="el-icon-upload2" @click="transfrom">转接</el-button>
					<el-button type="text" icon="el-icon-close" @click="stopChat">结束对话</el-button>
				</div>
				<!--聊天人数显示以及添加-->
				<ul v-if="show_severs" class="group_admin flex_start_v" >
					<li @click="add_server">
						<div class="add">+</div>
						<span>添加客服</span>
					</li>
					<li v-for="item in custInfos" >
						<img :src="item.headurl"/>
						<span>{{item.custname}}</span>
					</li>
				</ul>
				<!--添加客服人员弹框-->
				<el-dialog title="添加客服" :visible.sync="dialogVisible">
					<el-transfer filterable :filter-method="filterMethod" :titles="['客服列表', '已选中客服']" v-model="value2" :data="data2" filter-placeholder="搜索客服"> 
					</el-transfer>
					<div slot="footer" class="dialog-footer">
					    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
					    <el-button size="small" type="primary" @click="addSeverSure">确 定</el-button>
					</div>
				</el-dialog>
				<!--一人接待转接-->
				<el-dialog title="转接客服" :visible.sync="TranVisible" width="30%">
					<div class="tranList">
					<!--	<el-input prefix-icon="el-icon-search" size="small" v-model="tranSearch" @keyup.enter.native="search1" placeholder="搜索客服"></el-input>-->
						<ul>
							<li class="flex_between_v" v-for="(item,index) in tranList" @click="chooseTran(index)">
								<img class="headurl" :src="item.headurl" width="40" height="40"/>
								<span :class="item.custserverstatus != 'online' ? (item.custserverstatus == 'busy' ?  'state_light_2':'state_light_0'):'state_light_1'">
								</span>
								<div class="info">
									<p>{{item.custname}}</p>
									<p>当前接待人数：{{item.joinusernum}}</p>
								</div>
								<img :src="item.custid != custId  ? (((chooseObj.choosed) &(chooseObj.custId==item.custid)) ? hasSelect:noSelect) : defSelect" width="20"/>
							</li>
						</ul>
					</div>
					<span slot="footer" class="dialog-footer">
					    <el-button size="small" @click="TranVisible = false">取 消</el-button>
					    <el-button size="small" type="primary" @click="TranChangeSure">确 定</el-button>
					</span>
				</el-dialog>
			</div>
			<!--聊天消息面板-->
			<div class="chat_msg" ref="char_msg" :class="className" >
				<div v-for="item in msg_items" class="msg_item" :id="item.messageid">
					<p v-if="item.createtime && item.sendway !='promptway'" class="time">{{item.createtime}}</p>
					<div v-if="item.sendway=='userway'" class="msg_lf flex_start">
						<span class="uName">{{item.username}}</span>
						<img class="headurl" :src="item.headurl" width="40" height="40"/>
						<div class="msg_txt" v-if ="item.msgtype=='text'" v-html="emoji(item.message)"></div>
    					<div v-if="item.msgtype == 'goods'" class="product_infor" @click="go_product_detail(item)">
    						<div class="product_name">{{item.product_name}}</div>
    						<div class="product_detail">
    							<img :src="item.product_imgurl" alt="" />
    							<span>{{item.product_price}}</span>
    						</div>
    					</div>
	    				<div v-if="item.msgtype == 'image'" class="apply_img msg_txt">
				    		<img :src="item.message" alt="" @click="view_img(item)"/>
				    	</div>
				    		
				    	<div v-if="item.msgtype == 'miniprogrampage'" class="product_infor" @click="go_product_detail(item)">
    						<p class = "title">小程序卡片，来自商品详情页</p>
    						<div class="product_name">{{item.product_name}}</div>
    						<div class="product_detail">
    							<img :src="item.product_imgurl" alt="" />
    							<span>￥{{item.product_price}}</span>
    						</div>
    						<p class ="footer">微信小程序</p>
    					</div>

    				</div>
    				<div class="message-item in persistnotice" v-if="item.sendway=='promptway'">
					    <div class="message-body">
					        <div class="inner">
					            <pre class="event">{{item.message}}</pre></div>
					    </div>
					</div>
    				
					<div v-if="item.sendway=='custway'" class="msg_rt flex_start">
						<span class="uName">{{item.custname}}</span>
						<img class="headurl" :src="item.headurl" width="40" height="40"/>
						<div class="msg_txt vertical_v" v-if="item.msgtype=='text'" v-html="emoji(item.message)"></div>
						<div v-if="item.msgtype == 'goods'" class="product_infor" @click="go_product_detail(item)">
    						<div class="product_name">{{item.product_name}}</div>
    						<div class="product_detail">
    							<img :src="item.product_imgurl" alt="" />
    							<span>{{item.product_price}}</span>
    						</div>
    					</div>
    					
    					<div v-if="item.msgtype == 'image'" class="apply_img msg_txt">
    						<img :src="item.message" alt="" @click="view_img(item)"/>
    					</div>
    					
    					<div v-if="item.msgtype == 'miniprogrampage'" class="product_infor" @click="go_product_detail(item)">
    						<p class = "title">小程序卡片，来自商品详情页</p>
    						<div class="product_name">{{item.product_name}}</div>
    						<div class="product_detail">
    							<img :src="item.product_imgurl" alt="" />
    							<span>{{item.product_price}}</span>
    						</div>
    						<p class ="footer">微信小程序</p>
    					</div>
    					
					</div>
					
				</div>
	
				<el-dialog
					    width="40%"
					       @close="close_img()"
					    :visible.sync="innerVisible"
					    append-to-body>
					    <img :src="imgUrl" alt="" class="view_imgs" width="100%"/>
				</el-dialog>
			</div>
		
			<!--聊天输入模块-->
			<!--<div class="input_msg">
				<div class="newmessage" v-if = "newMessage">您有未读新消息</div>
				<div class="input_top flex_between_v">
					<div class="input_fun flex_start_v">
						<div v-for="item in inputFunPar" class="fun_icon" :style="{height: item.height, backgroundPositionY: item.bgPstY}" @click.stop="inpFunClick(item.name)">
						</div>
					</div>
					<div class="input_words">大约还可输入{{inpWordsNum}}字</div>
				</div>
				<textarea v-model="inputWords" ref="textarea" @input="msgInput" @keyup.enter="submitMsg"></textarea>-->
				<!--表情标签-->
				<!--<transition name="fade">
					<div class="emoji-box" v-if="showEmoji">
						<span class="btnClose el-icon-close" @click="showEmoji = false"></span>
						<vue-emoji @select="selectEmoji"></vue-emoji>
					</div>
				</transition>-->
				<!--快速回复-->
				<!--<ul v-if="quickReplyShow" class="quick_reply">
					<li class="flex_between_v" v-for="(item,index) in reply_words" 
						:style="{background: hoverIndex==index?'#eee':''}" 
						@mouseenter="hoverIndex=index" @mouseleave="hoverIndex=-1"
						@click.stop="chooseReply(item.message)">
						<span class="words" :title="item.message">{{item.message}}</span>
						<span class="rep_fun flex_start_v" :style="{background: hoverIndex==index?'#888':''}">
							<img src="../../static/images/ico_pencil@1x.png" height="15" @click.stop="quickReplyEdit(item)"/>&nbsp;
							<img src="../../static/images/ico_delete@1x.png" height="15" @click.stop="quickReplyDelet(item.messageid)"/>
						</span>
					</li>
					<li @click="addQuickReply">
						<el-button style="padding: 5px 0" type="text">+ 添加快捷回复</el-button>
					</li>
				</ul>-->
				<!--新建快捷短信-->
				<!--<el-dialog title="新建快捷短语" :visible.sync="addReplyVisible" width="30%">
					<el-input type="textarea" v-model="quickReplyWords" :maxlength="1000" :rows="7" resize="none" placeholder="请输入内容" @input="inputChange"></el-input>
					<div style="text-align: right; color: #ccc;">{{quickReplyNum}}/1000</div>
					<span slot="footer" class="dialog-footer">
					    <el-button size="small" @click="addReplyVisible = false">取 消</el-button>
					    <el-button size="small" type="primary" @click="addReplySure">确 定</el-button>
				  </span>
				</el-dialog>
			</div>-->
			<RightContent></RightContent>
			<!--图片上传组件-->
			<picture_upload :isshow_mask="showPicUpload" @imgData="addImgToChat"  @imgUploadUrl="addImgToChat" @changeMask="getPicShow"></picture_upload>
			<!--聊天记录-->
			<chat_record :isshow_record="showRecord" :userDetail="userInfo" @close_record_mask="getRecordShow"></chat_record>
		</div>
		<!--右侧栏-->
		<RightContent></RightContent>
	</div>
</template>

<script>
	// import vueEmoji from '@/components/emoji.vue'
	import RightContent from '@/components/right_content'
	import picture_upload from '@/components/picture_upload'
	import chat_record from '@/components/chat_record'
	import userIcon from "../../static/images/picture_1.jpg"
	import selectActive from "../../static/images/address_setDefault@2x.png"
	import selectNomal from "../../static/images/address_normal@2x.png"
	import selectNo from "../../static/images/car_circle_nomal@2x.png"
	
	export default({
		name: "history_panel",
		props: ['userInfo','className'],
		data(){
			return{
				newMessage:false,
				pageNum:1,
				imgUrl:'',
				innerVisible:false,
				tempData:[],
				custId:'',
				chooseObj:{
					choosed:0,
					custId:""
				},
				custJoinNum:0,//客服接入人数
				show_severs  : false,		//展示客服面板
				dialogVisible: false,		//添加客服对话框
				TranVisible  : false,		//一人接待转接对话框
				tranSearch   : "",			//转接客服搜索
				tranList     : [			//转接客服列表
//					{icon:userIcon, name:"小美", peopleNum: 5, choose: 0, state: 0},
//					{icon:userIcon, name:"小美", peopleNum: 5, choose: 0, state: 0},
//					{icon:userIcon, name:"小美", peopleNum: 5, choose: 1, state: 1},
//					{icon:userIcon, name:"小美", peopleNum: 5, choose: -1, state: 1},
//					{icon:userIcon, name:"小美", peopleNum: 5, choose: 0, state: 0},
//					{icon:userIcon, name:"小美", peopleNum: 5, choose: 0, state: 1},
//					{icon:userIcon, name:"小美", peopleNum: 5, choose: 0, state: 0},
				],
				defSelect    : selectNomal,	//默认选择
				hasSelect    : selectActive,//选案中
				noSelect     : selectNo,	//未选中
				
				custInfos:null,//房间中的客服
				data2 : [],	//穿梭框数据
				value2: [],					//添加客服传值
				filterMethod(query, item) {
					return item.name.indexOf(query) > -1;
				},
				id:null,//当前选中服务用户，滚动一页最小消息id记录，用户向上翻页判断加载消息起点
				msg_items: [
//					{
//						"userid": '',
//	                	"username": '',
//	                	"custname": '',
//	                	"msgcount": '',
//	                	"createtime": '',
//	                	"msgtype": '',
//	                	"sendway": '',
//	                	"message": '',
//	                	'user_icon': userIcon
//	                }
//					{user_icon: userIcon, sendway:'userway', username: "v字仇杀队-陶冶", custname:"dddddd", createtime: "2017-12-15", message: "我们被教导要记住思想，而不是人，因为人可能失败，他可能会被捕，他会被杀死，被遗忘，但400年后，思想仍可改变世界。我亲眼目睹了思想的力量，我见过人们以它为名杀戮，或是为了维护它献出生命，但你不能亲吻思想，也不能触摸它或抱着它，思想不会流血，不会感到痛苦，它们没有爱。"},
//					{user_icon: userIcon, sendway:'custway', username: "v字仇杀队-陶冶", custname:"dddddd", createtime: "2017-12-15", message: "人民不应该怕政府，政府应该怕人民！！！"},
//					{user_icon: userIcon, sendway:'userway', username: "v字仇杀队-陶冶", custname:"dddddd", createtime: "2017-12-15", message:"没有必然的事情，只有可能的事情。世上没有巧合，只有巧合的假像."},
//					{user_icon: userIcon, sendway:'custway', username: "v字仇杀队-陶冶", custname:"dddddd", createtime: "2017-12-15", message:"我们的尊严不值什么钱，可它是唯一我们真正拥有的东西，是我们最后一寸领土，但在那一寸领土里，我们是自由的。"},
				],
				inputFunPar:[
					{name: 'icon', 	  height: '20px', bgPstY: '-40px'},
					{name: 'image',	  height: '17px', bgPstY: '-60px'},
					{name: 'quick',	  height: '20px', bgPstY: '0'},
					{name: 'history', height: '20px', bgPstY: '-21px'},
				],
				inpWordsNum   : 500,	//输入字数提示
				inputWords    : "",		//输入文字
				msgType:"",//文字的类型
      			showEmoji     : false,	//表情板
      			showPicUpload : false,	//图片上传弹框
      			showRecord 	  : false,  //聊天记录弹框显示与否
      			quickReplyShow: false,	//快速回复显示
      			reply_words   : [],
      			hoverIndex    : -1,
      			addReplyVisible: false,	//新增快速回复弹框
      			quickReplyWords: "",	//快速回复内容
      			quickMesId:'',//编辑快捷回复id
      			quickReplyNum  : 1000,	//输入字数
      			emojiData:emoji_data,
      			
			}
		},
		components: { RightContent , picture_upload ,chat_record},
		beforeDestroy(){
		   this.$root.Bus.$off('select_service_page');
		},
		created(){
			//为了转接的时候，是该用户被选中
			this.custId= localStorage.custId;
			//等待选择用户完成后加载
			this.loadData();
			//切换用户，消息滚动到底部
			this.$root.Bus.$on("customer_list_choose", value=>{
				if (value){
					this.$nextTick(()=>{
					    if(typeof this.$refs.char_msg != 'undefined'){
					    	this.$refs.char_msg.scrollTop = this.$refs.char_msg.scrollHeight;
					    }
					})
		  		}
			});
				//等待选择用户完成后加载
			this.$root.Bus.$on("select_service_page", value=>{
				this.pageNum = value;
		   });
			
			

		},
		mounted(){
			this.$refs.char_msg.scrollTop = this.$refs.char_msg.scrollHeight;
			this.$nextTick(()=>{
				console.log(this.$refs.char_msg);
				// this.$refs.char_msg.scrollTop = 500;
				setTimeout(()=>{	
					this.$refs.char_msg.scrollTop = 10000;
				},800)
			})
			// 向上滚动事件
			let flag = true; //一次只能发一次请求
			this.$refs.char_msg.onscroll = (e)=>{
				// console.log('1============' + this.$refs.char_msg.offsetHeight);
				// console.log('2============' + this.$refs.char_msg.scrollHeight);
				// console.log('3============' + this.$refs.char_msg.scrollTop);
				if(this.$refs.char_msg.offsetHeight + this.$refs.char_msg.scrollTop + 30 > this.$refs.char_msg.scrollHeight){
					this.newMessage =false;
				}
				// console.log(this.$refs.char_msg.__proto__);
				if(this.$refs.char_msg.scrollTop <= 0){
					//加载房间的人
					if(!flag) return;
					this.$axios.get("list/message/dialogMessageList",{params:{
							userid: this.userInfo.userId,
							shopid: this.userInfo.shopId,
							messageid:this.id,
							pageNum: this.pageNum,
							crm_token:localStorage.crm_token
						}}).then((res)=>{
							if (res.data.code =='100'){
								if (res.data.data.list != null && res.data.data.list.length > 0){
									console.log(this.pageNum)
									//先倒叙，然后取第一条
									//向上翻页，存取最小id
									//向上翻页，存取最小id
									if (this.msg_items.length > 0) {
										var tempId = this.msg_items[0]['messageid'];
										this.msg_items = res.data.data.list.reverse().concat(this.msg_items);
										// console.log(this.msg_items);
										this.id = this.msg_items[0]['messageid'];
										this.$nextTick(()=>{
											var ele = document.getElementById(tempId);
											this.$refs.char_msg.scrollTop = ele.offsetTop;
										})
									}
								//结果为空，则不再加载数据
								}else{
									flag = false;
								}
								flag = true;
							}
					})
						
					
				}
			}
	  		this.globalClick(this.handleClickOut);
		},

		//socket发送的对应的消息
		sockets:{
			message:function(res){
				if (res != '' || res != null || res.createtime != '' || res.createtime != null){
					var a= new Date(res.createtime);
					res.createtime =a.getHours() + ":" + a.getMinutes() + ":" +a.getSeconds();
				}
				
				if (this.userInfo.userId == res.userid && localStorage.custId != res.custid){
						this.msg_items.push(res);
				}
				
				
				
				if(!(this.$refs.char_msg.offsetHeight + this.$refs.char_msg.scrollTop + 30 > this.$refs.char_msg.scrollHeight)){
					this.newMessage =true;
				}
				
				
			
			},
			//客服人数及客服列表
		    talkCustEvent: function(res){
		    	console.log('talkCustEvent------------',res);
		    	this.custInfos = res;
		    	this.custJoinNum = res.length
		    },
		},

	
		methods:{
			createIcon (item) {
				// console.log(item);
				// return;
		       // item = '[' + item + ']'
		      // console.log('----')
		      // const value = this.emojiData.indexOf(item) + '.gif';
		      // const path = '../static/images/emoji/';
		      // return '<img class="emoji" src="" width="20px" height="20px" />';
		        const value = this.emojiData.indexOf(item) + '.gif';
		        const path = '../static/images/emoji/'
		        return `<img class="emoji" src=${path}${value} width="20px" height="20px">`
		    },
		    emoji (value) {
		    	// console.log(value)
		      if (!value) return
		        // console.log(this.emojiData);
		       // console.log(11111111)
		      var that = this;
		      this.emojiData.forEach(item => {
		        // console.log(item)
		        // console.log(that.createIcon(item))
		        // item = item.substr(1,item.length - 2);
		        // console.log(item)
		        // console.log(new RegExp(item, 'g'))
		        // var _item = '[爱你]';
		        var smile = item.split("=="); 
		        var str = smile[0].substr(1,smile[0].length - 2);
		        if(smile[1]){
		        	var str1 = smile[1].substr(1,smile[1].length - 2);
		        }
		        // console.log(str1)
		        // console.log('-------------')
		        if(str1){
		        	var _regex = new RegExp("\\[("+ str1 + ")+?\\]", 'g');
		        	if(value.indexOf('['+ str1 +']') != -1){
		        		value = value.replace(_regex, this.createIcon(item));
		        	}
		        }
		        // var _regex = new RegExp("/"+ str +"/", 'g');
		        // var _regex = new RegExp('23233', 'g');、
		        // console.log(str)
		        var _r = escape(str);
		        var _s = escape(value);
		        var re = new RegExp(_r, 'g');
		        if(_s.indexOf(_r) != -1){
		        	value = unescape(_s.replace(re, this.createIcon(item)));
		        }
		        // value = value.replace(_regex, this.createIcon(item));
		      })
		      return value
		    },
			//用来加载对应的数据
			loadData(){
				//获取客服的头像
				//加载房间的具体消息	
				this.$axios.get("list/customer/listJoinCust",{params:{
					userId: localStorage.serUserId,
					shopId: localStorage.shopId,
					crm_token:localStorage.crm_token
				}}).then((res)=>{
					if (res.data.code =='100' && res.data.data ){
						this.custInfos = res.data.data;
						this.custJoinNum = res.data.data.length;
					}else{
						console.log("异常listJoinCust---------")
						console.log(res)
					}
				});
				console.log(this.userInfo,"对应的userInfo")
				
				//加载房间的人数	
				this.$axios.get("list/customer/countJoinCust",{params:{
				userId: this.userInfo.userId,
				shopId: localStorage.shopId,
				crm_token:localStorage.crm_token
				}}).then((res)=>{
					if (res.data.code =='100'){
						//this.custJoinNum = res.data.data;
					}else{
						console.log("异常")
					}
					
				})
			
					
				//加载该商户所有的Customer
				this.$axios.get("list/customer/shopAllCust",{params:{
						shopId:localStorage.shopId,
						crm_token:localStorage.crm_token
					}}).then((res)=>{
						if (res.data.code =='100'){
							this.data2=[];
							res.data.data.forEach((item, index) => {
								this.data2.push({
									label: item.custname,
									key  : item.custid,
									name : res.data.data[index].custname
								})
							})
						}else{
							console.log(res,"异常")
						}
					})
				//加载对应的消息
				this.$axios.get("list/message/dialogMessageList",{params:{
					userid: this.userInfo.userId,
					shopid: this.userInfo.shopId,
					crm_token:localStorage.crm_token
				}}).then((res)=>{
					if (res.data.code == '100'){
						//向上翻页，存取最小id
						this.msg_items = res.data.data.list.reverse();
						if (this.msg_items.length > 0){
							//先倒叙，然后取第一条
							this.id = this.msg_items[0]['messageid'];
						}
						
					}
					
				})
				
				//加载快捷回复
				this.quickMesList();
				
			},
			
			//加载快捷回复
			quickMesList(){
				//加载快捷回复
				this.$axios.get("list/message/quickMessageList",{params:{
					shopid: localStorage.shopId,
					crm_token:localStorage.crm_token
				}}).then((res)=>{
					console.log('快捷回复返回---',res);
					if (res.data.code == '100'){
						this.reply_words = res.data.data;
					}
					
				})
			},
			
			//结束对话
			stopChat(){
				this.$confirm('请确认是否结束本次会话?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.get("list/customer/closeDialog",{params:{
						userIds: localStorage.serUserId,
						shopId: localStorage.shopId,
						custId: localStorage.custId,
						crm_token:localStorage.crm_token
					}}).then((res)=>{
						console.log(res,'+++++++++++++++++++++++++++++');
						this.$root.Bus.$emit("customer_list_choose", '');
					});
					this.$message({
						type: 'success',
						message: '本次会话结束!'
					});
				}).catch(() => {});
			},
			//转接
			transfrom() {
				if(this.custJoinNum > 1){								//多人接待的时候
					this.$message({
						message: '该客户被多人接待，无法转接',
						type: 'warning'
					});
				}else{								//一人接待的时候
					this.TranVisible = true;
				}
			},
			
			//打开商品的详情页
			go_product_detail(val){
				window.open(val.message)
			},
			
			//将商品的图片放大
			view_img(item){
				this.imgUrl=item.message;
				this.innerVisible=true;
			},
			close_img(item){
				this.innerVisible=false;
			},
			
			//展示客服板
			severPanel(){
				
				this.show_severs = !this.show_severs;
			},
			//添加客服显示
			add_server() {
				this.dialogVisible = true;
			},
			//确定添加客服
			addSeverSure(){
				if (this.value2.length > 0){
					this.$axios.get("list/customer/custListJoinTalk",{params:{
					userId: localStorage.serUserId,
					shopId: localStorage.shopId,
					crm_token:localStorage.crm_token,
					custIds:this.value2
					}}).then((res)=>{
						if (res.data.code == '100'){
							//重新加载对应的数据
							console.log("调用2")
							this.loadData()
							this.dialogVisible=false;
						}else{
							this.dialogVisible=false;
							 this.$message({
						          showClose: true,
						          message: '添加失败',
						          type: 'warning'
						        });
						}
						
					})
				}else{
					 this.$message({
				          showClose: true,
				          message: '请选中需要添加的客户',
				          type: 'warning'
				        });
				}
				
				
			},
//			//转接客服搜索
//			search1(){
//				console.log(this.tranSearch,"---")
//				//访问后台的搜索功能
//				this.$axios.get("list/customer/searchCustomer",{params:{
//					keyWord: this.tranSearch,
//					shopId: this.userInfo.shopId,
//					crm_token:localStorage.crm_token
//					}}).then((res)=>{
//						if (res.data.code == '100'){
//							//显示搜索到的信息
//							console.log(res)
//						}
//					})
//			},
			//选择转接客服
			chooseTran(index){
				
				if(this.tranList[index].custserverstatus== 'offline') {
					this.$message({
			          	message: '当前客服不在线！',
			          	type: 'warning'
			        });
					return false;
				};
				//始终只能显示一个
				if(this.chooseObj.choosed==1){
					//如果选中的custid和存储的值相同说明只是取消，不同的话是切换
					if (this.tranList[index].custid != this.chooseObj.custId){
						this.chooseObj.custId = this.tranList[index].custid;
					}else{
						this.chooseObj.choosed = 0;
						this.chooseObj.custId = '';
					}
				
				}else if(this.chooseObj.choosed==0){
					this.chooseObj.choosed = 1;
					this.chooseObj.custId = this.tranList[index].custid;
				}
			},
			//转接客服确定
			TranChangeSure(){
				//进行客服的转接,删除前台的对应的数据
				this.$emit('tranferTo', this.userInfo);
				
				if (this.chooseObj.custId != "" ){
					//进行数据的添加和对应的修改操作
					this.$axios.get("list/customer/custTransfer",{params:{
					userId: this.userInfo.userId,
					shopId: this.userInfo.shopId,
					custId:this.chooseObj.custId,
					crm_token:localStorage.crm_token
					}}).then((res)=>{
						if (res.data.code == "100"){
							//删除成功后数量减一
							this.TranVisible = false
							this.$message({
					          	message: '转接成功！',
					          	type: 'success'
					        });
						}else{
							this.TranVisible = false
							this.$message({
					          	message: '转接失败！',
					          	type: 'warning'
					        });
						}
					})
				}
				
				
				
				
			},
			//点击快速回复语句
			chooseReply(words){
				console.log(words)
				let newWords = this.insertText('textarea',words)
				this.inputWords = newWords;
		      	this.msgInput()
			},
			//添加快速回复
			addQuickReply(){
				this.addReplyVisible = true;
			},
			//快速回复字数统计
			inputChange(val){
				this.quickReplyNum = 1000 - val.length;
			},
			//确定添加快速回复
			addReplySure(){
				console.log(this.quickReplyWords);
				var quickUrl = '';
				//新增快捷回复
				if(this.quickMesId==''){
					quickUrl = 'list/message/quickMessageSave';
				}else{
					//修改快捷回复
					quickUrl = 'list/message/quickMessageUpdate'
				}
			
				this.$axios.get(quickUrl,{params:{
					shopid: localStorage.shopId,
					custid: localStorage.custId,
					message:this.quickReplyWords,
					messageid:this.quickMesId,
					crm_token:localStorage.crm_token
				}}).then((res)=>{
					console.log(res,'新增或编辑快捷回复==========');
					//编辑快捷回复id置空
					this.quickMesId = '';
					this.quickReplyWords = '';
					this.quickMesList();
				})

				this.addReplyVisible = false;
			},
			//快速回复编辑
			quickReplyEdit(item){
				this.quickReplyShow = false;
				this.addReplyVisible = true;
				this.quickReplyWords = item.message;
				this.quickMesId = item.messageid;
			},
			//快速回复删除
			quickReplyDelet(messageid){
				this.$axios.get("list/message/quickMessageDelete",{params:{
					shopid: localStorage.shopId,
					messageid: messageid,
					crm_token:localStorage.crm_token
				}}).then((res)=>{
					console.log(res,'删除快捷回复==========');
					this.$message({
			          	message: '删除成功！',
			          	type: 'success'
			        });
					this.quickMesList();
				})
			},
			//输入功能
			inpFunClick(name){
				switch (name){
					case 'icon':
					this.showEmoji = true;
					this.quickReplyShow = false;
					this.showPicUpload = false;
					this.showRecord = false;
						break;
					case 'image':
					this.showPicUpload = true;
					this.showEmoji = false;
					this.quickReplyShow = false;
					this.showRecord = false;
						break;
					case 'quick':
					this.showPicUpload = false;
					this.showEmoji = false;
					this.quickReplyShow = true;
					this.showRecord = false;
						break;
					case 'history':
					this.showRecord = true;
					this.showPicUpload = false;
					this.showEmoji = false;
					this.quickReplyShow = false;
						break;
					default:
						break;
				}
			},
			//将图片添加到聊天框中去
			addImgToChat(val){
				this.msgType="image";
				this.inputWords =val.url;
				this.submitMsg();
				this.msgType="text";
				//将图片发送的消息给后台通过socket.js
			},
			//展示图片
			getPicShow(val){
				this.showPicUpload = val;
			},
			getRecordShow(val){
				this.showRecord = val;
			},
			//选择表情
			selectEmoji (code) {
		      	this.showEmoji = false;
		      	let newWords = this.insertText('textarea',code);
		      	this.inputWords = newWords;
		      	//自动聚焦
		      	this.msgInput()
		    },
			//字数输入
			msgInput(){
				this.inpWordsNum = 500 - this.inputWords.length;
				if (this.inpWordsNum  < 1 ){
					this.inputWords = this.inputWords.slice(0,499);
					this.inpWordsNum=0;
				}
				
				this.$refs.textarea.focus();
			},
			//发布消息
			submitMsg(){
				if (!this.wordReplace(this.inputWords)=="") {
					this.$socket.emit('message', {
							//userid: this.userInfo.userId,
							userid: localStorage.serUserId,
							//shopid:this.userInfo.shopId,
							shopid:localStorage.shopId,
							custid:localStorage.custId,
							message:this.inputWords,
							custname:localStorage.custname,
							username:this.userInfo.nickname,
							msgtype:this.msgType,
							headurl:localStorage.headurl
					});
				
//					let time = new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
//					let msg = {custname: this.custName,  createtime: time, msg_location:"1", message: this.inputWords}
//					this.msg_items.push(msg);
				
//					setTimeout(()=>{
//						this.$refs.char_msg.scrollTop = this.$refs.char_msg.scrollHeight;
//					}, 100)

					if (this.msgType != 'image'){
						//对网页进行判断
						var RegUrl = new RegExp(); 
						RegUrl.compile('(http|https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]+');//jihua.cnblogs.com 
						if (RegUrl.test(this.inputWords)) {
							this.inputWords = "<a style='color:blue' href=" + this.inputWords + ">" + this.inputWords + "</a>";
						} 
					}
					let time = new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
					let msg = {custname: localStorage.custname,sendway:'custway',headurl:localStorage.headurl,msgtype:this.msgType ==''? 'text':this.msgType ,  createtime: time, message:this.inputWords}
					this.msg_items.push(msg);
					setTimeout(()=>{
						this.$refs.char_msg.scrollTop = this.$refs.char_msg.scrollHeight;
					}, 100)

					//制空
					this.inpWordsNum = 500;
					this.inputWords = "";
					this.quickReplyShow = false;		//隐藏快速回复
				}else{
					this.$message({
						message:'发送消息不可空',
						type: 'error'
					});
					this.inputWords = "";
					return false;
				}
			},
			//替换空格、去除换行
			wordReplace(words) { 
				let newWords;
				newWords = words.replace(/<\/?.+?>/g,""); 
				newWords = words.replace(/[\r\n]/g, ""); 
				newWords = words.replace(/\s+/g, "");
				return newWords;
			},
			//插入文本
			insertText(inputEle, inTxt) {
				let obj = this.$refs[inputEle];
				let str = inTxt;
				if(document.selection) {
					obj.focus();
					let sel = document.selection.createRange();
					sel.text = str;
				} else if(typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
					let startPos = obj.selectionStart;
					let endPos = obj.selectionEnd;
					let tmpStr = obj.value;
					obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
				} else {
					obj.value += str;
				}
				return obj.value;
			},
			handleClickOut(){
				this.show_severs = false;
				this.quickReplyShow = false;
			},
		},
		watch:{
			//用来监听窗口是否打开，如果打开的话，就加载用户对应的信息
			TranVisible(now,orgin){
				if (now){
					console.log('shopAllCust---------转接客服---------');
					this.$axios.get("list/customer/shopAllCust",{params:{
						crm_token:localStorage.crm_token,
						shopId:localStorage.shopId
					}}).then((res)=>{
						if (res.data.code == "100"){
							this.tranList = res.data.data;
						}
					})
					
				}
			},
			
			
			userInfo(o,n){
				console.log("调用3")
				this.loadData();
			}
		}
	})
</script>

<style type="text/css">
	.chat_show .el-dialog{width: 540px;} 
	.chat_show .el-dialog .el-dialog__body{padding-bottom: 5px;}
</style>
<style scoped="scoped" lang="less">
	.clearfix {
		&:after {
			content: '';
			display: block;
			height: 0;
			clear: both;
			visibility: hidden;
		}
	}
	.chat_panel{
		height: 100%;
		.chat_show{
			height: 100%;
			width: calc(~"100% - 261px");
			.chat_top{
				position: relative;
			 	padding: 5px 15px;
			 	border-bottom: 1px solid #f5f5f5;
			 	.chatter_name{
			 		.name{
		 				display: inline-block;
		 				height: 22px;
		 				max-width: 120px;
		 				overflow: hidden;
		 				text-overflow: ellipsis;
		 				white-space: nowrap;
			 		}
			 		.pNum{
			 			cursor: pointer;
			 			&:hover{color: #409EFF;}
			 		}
			 	}
			}
			.group_admin{
				flex-wrap: wrap;
				position: absolute;
				top: 50px;
				padding: 10px;
				margin: 0;
				margin-left: -15px;
				width: calc(~"100% - 20px");
				border-top: 1px solid #f5f5f5;
				background: white;
				box-shadow: 0 3px 5px #ccc;
				z-index: 10;
				li{
					padding: 5px 0;
					width: 100px;
					text-align: center;
					font-size: 14px;
					&:nth-child(1){
						.add{
							margin-left: 32px;
							width: 36px;
							height: 36px;
							line-height: 36px;
							text-align: center;
							font-size: 28px;
							color: #CCCCCC;
							border: 1px solid #CCCCCC;
							border-radius: 50%;
						}
						&:hover{cursor: pointer;}
					}
					img{
						width: 36px;
						height: 36px;	
						border-radius: 50%;
					}
					span{
						display: block;
						margin-top: 5px;
						width: 100px;
					}
				}
			}
			.tranList{
				ul{
					margin-top:20px;
					height: 300px;
					overflow: auto;
					li{
						position: relative;
						margin: 10px 0;
						img{
							&:nth-child(1){
								border-radius: 50%;
							}
							&:nth-child(3){
								margin-right: 10px;
							}
						}
						.state_light{
							position: absolute;
							left: 30px;
							bottom: 5px;
							width: 8px;
							height: 8px;
							border: 1px solid #fff;
							border-radius: 50%;
						}
						.state_light_0{
							.state_light;
							background: #C0C4CC;
						}
						.state_light_1{
							.state_light;
							background: #3ebd00;
						}
						.state_light_2{
							.state_light;
							background: #f56c6c;
						}
						.info{
							width: calc(~"100% - 80px");
							p{
								height:25px;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap; 
								&:nth-child(2){
									color: #a7a7a7;
								}
							}
						}
					}
				}
			}
			/*用户名*/
			.userName{
				position: absolute;
				top: -25px;
				color: #b1b1b1;
				font-size: 14px;
			}
			/*聊天消息文字*/
			.message(@bgcolor:#f8f8f8){
				position: relative;
				padding: 10px;
				margin-left: 15px;
				line-height: 28px;
				max-width: 60%;
				flex-wrap: wrap;
				background: @bgcolor;
				border-radius: 5px;
			}
			/*伪元素箭头样式*/
			.rowStyle(@bgcolor:#f8f8f8, @rotateDeg:-45deg){
				position: absolute;
				top: 8px;
				content: "";
				height: 10px;
				width: 10px;
				transform:  rotate(@rotateDeg);
				background: @bgcolor;
			}
			.chat_msg{
				padding: 10px 20px;
				height: calc(~"100% - 260px");
				border-bottom: 1px solid #e5e5e5;
				overflow-y: auto;
				position:relative;
				.msg_item{
					margin-bottom: 40px;
					.time{
						margin-bottom: 20px;
						text-align: center; 
						font-size: 14px;
						color: #ccc;
					}
					img{border-radius: 50%;}
					.headurl{height:40px;width:40px;}
					.msg_lf{
						position: relative;
						.uName{
							.userName;
							left: 60px;
						}
						.msg_txt{
							.message;
							margin-left: 15px;
							word-wrap: break-word;
    						word-break: break-all;
    						
    						text-align: center;
							&::after{
								.rowStyle;
								left: -5px;
							}
							img{
								border-radius:0%;
								max-width: 300px;
								max-height: 200px;
								width:auto;
							}
						}
					}
					.msg_rt{
						position: relative;
						flex-direction:row-reverse;
						.uName{
							.userName;
							right: 60px;
						}
						.msg_txt{
							.message(#e5f6ff);
							margin-right: 15px;
							word-wrap: break-word;
    						word-break: break-all;
    						
    						text-align: center;
							&::after{
								.rowStyle(#e5f6ff, 45deg);
								right: -5px;
							}
							img{
								border-radius:0%;
								max-width: 300px;
								max-height: 200px;
								width:auto;
							}
						}
					}
				}
			}
			.chat_msg1{
				height: calc(~"100% - 60px");
			}
				/*聊天详情内容样式*/
		/*图片区域*/
			.apply_img{
				
			    max-width: 250px;
			    min-height: 0;
			    line-height: 0;
			}
			.apply_img img{
				cursor: pointer;
				width: 100%;
		   		height: auto;
				max-width: 100%;
				max-height: 100%;
			}
			.view_imgs{
				width: 100%;
			}
				/*商品链接区域*/
			.product_infor{
				margin: 5px 0;
				border: 1px solid #dcdcdc;
				max-width: 300px;
				min-width: 50px;
				padding: 15px;
				border-radius: 5px;
				cursor: pointer;
				margin:10px;			}
			.product_infor .product_name{
				margin: 8px 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #000!important;
			}
			.product_infor .product_detail{
				height: 60px;
				display: flex;
				justify-content: flex-start;
			}
			.product_infor .product_detail img{
				width: 60px;
				height: 60px;
				margin-right: 10px;
			}
			.product_infor .product_detail span{
				display: inline-block;
				height: 100%;
				vertical-align: text-top;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #666;
			}
			.product_infor .title{
			    color: #999;
			    font-size: 12px;
			    padding: 0;
			}
			/*用来显示小程序里面的内容*/
			.product_infor .footer{
			    color: #999;
			    font-size: 12px;
			    padding-left: 18px;
			    /*background: 
			    background-image: */
			}
			
				/*客服回复信息*/
			.kefu_apply_content{
				padding: 10px;
				max-width: 400px;
				min-width: 50px;
				margin: 5px 0;
				border: 1px solid #dcdcdc;
				border-radius: 5px;
			}
			.kefu_apply_content pre{
				font-size: 14px;
				white-space: pre-wrap;
			    word-break: normal;
			    word-wrap: break-word;
			    line-height:1.8;
			    margin: 5px 0;
			}
			
			.input_msg{
				position: relative;
				height: 188px;
				.input_top{
					padding: 10px;
					border-bottom: 1px solid #e5e5e5;
					.input_fun{
						.fun_icon{
							margin-right: 10px;
							width: 21px;
							background: url(../../static/images/ico-new-action@1x.png) no-repeat;
							background-size: 100%;
							&:hover{cursor: pointer;}
						}
					}
					.input_words{font-size: 14px; color: #898989;}
				}
				textarea{
					padding: 10px;
					width: calc(~"100% - 20px");
					height: calc(~"100% - 65px");
					font-size: 16px;
					resize: none;
					border: none;
				}
				.emoji-box {
					position: absolute;
					z-index: 10;
					left: -150px;
					top: -197px;
					box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
					background: white;
					.btnClose {
						position: absolute;
						border: none;
						color: #FF4949;
						right: 12px;
						top: 12px;
						z-index: 10;
						&:hover{
							cursor: pointer;
						}
					}
				}
				.quick_reply{
					position: absolute;
					padding: 10px;
					top: -160px;
					left: 20px;
					width: 320px;
					background: white;
					border-radius: 5px;
					box-shadow: 0 0 5px #CCCCCC;
					&:after{
						position: absolute;
						bottom: -6px;
						left: 58px;
						content: "";
						width: 10px;
						height: 10px;
						border-right: 1px solid #CCCCCC;
						border-bottom: 1px solid #CCCCCC;
						background: white;
						transform: rotate(45deg);
					}
					li{
						padding-left: 5px;
						font-size: 15px;
						&:hover{
							cursor: pointer;
						}
						.words{
							display: inline-block;
							width: calc(~"100% - 50px");
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.rep_fun{
							display: inline-block;
							padding: 5px;
							height: 100%;
						}
					}
				}
				.el-dialog{
					.el-dialog__body{
						padding-bottom: 15px;
					}
				}
			}
			
		}
	}
	.newmessage {
	    position: absolute;
	    right: 50px;
	    top: -50px;
	    padding: 10px;
	    background-color: #30333d;
	    border-radius: 3px;
	    color: #fff;
	    z-index: 2;
	}
	.newmessage:after {
	    content: "";
	    position: absolute;
	    width: 0;
	    height: 0;
	    border: 4px solid transparent;
	    border-top-color: #30333d;
	    bottom: -8px;
	    right: 10px;
	}
	.message-item.event, .message-item.persistnotice {
	    font-size: 12px;
	}
	.message-item {
	    padding: 5px 0 10px;
	    display: inline-block;
	    width: 100%;
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    font-size: 14px;
	    line-height: 18px;
	    position: relative;
	}
	.message-item:before {
	    content: " ";
	    display: table;
	}
	.message-body {
	    position: relative;
	    float: left;
	    min-width: 50px;
	    max-width: 400px;
	    margin-bottom: 7px;
	}
	.message-item.in .message-body {
	    float: left;
	    margin-left: 20px;
	    margin-right: 0;
	}
	.message-item.event .message-body, .message-item.persistnotice .message-body {
	    margin: 0 auto;
	    width: 100%;
	    max-width: none;
	}
	.message-body .inner {
	    position: relative;
	    background-color: #f8f8f8;
	    padding: 10px;
	    min-height: 14px;
	    border-radius: 4px;
	}
	.message-item.in .message-body .inner {
	    color: #222;
	    background-color: #f8f8f8;
	}
	.message-item.event .message-body .inner, .message-item.persistnotice .message-body .inner {
	    border: none;
	    min-height: inherit;
	    height: 12px;
	    line-height: 12px;
	    text-align: center;
	    background: transparent;
	}
	.message-body pre {
	    white-space: pre-wrap;
	    word-break: normal;
	    word-wrap: break-word;
	    line-height: 1.4;
	}
	.message-item.event .message-body .inner pre, .message-item.persistnotice .message-body .inner pre {
	    display: inline;
	    border-radius: 3px;
	    padding: 4px 10px;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    color: #fff;
	    background-color: #cccdcf;
	}
</style>