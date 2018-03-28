<template>
	<div ref="all_char" class="chat_record">
		<el-dialog title="客户会话记录" :visible="isshow_record" @close="closeDialog">
			<div class="tip_content">
				该客户在以下渠道进行过咨询，点击下方查看聊天记录
			</div>
		  	<el-tabs v-model="activeName" @tab-click="handleClick">
		    	<el-tab-pane :label="windowType" name="first">
		    		<ul id="chat_record_history_news" ref="chat_record">
		    			<li v-for="item in chat_record_phone_data" :id="'chat_record' + item.messageid" class="chat_record_info_div">
							<div v-if="item.sendway=='userway'" class="flex_start">
								<div class="header_imgs">
									<img :src="item.headurl" alt="" />
								</div>
								<div class="chat_content">
									<span class="uName">{{item.username}}</span>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<span class="time">{{item.createtime}}</span>
									<div class="font_style"  v-if ="item.msgtype=='text'" v-html="emoji(item.message)">
									</div>
			    					<div v-if="item.msgtype == 'goods'" class="product_infor" @click="go_product_detail(item)">
			    						<div class="product_name">{{item.product_name}}</div>
			    						<div class="product_detail">
			    							<img :src="item.product_imgurl" alt="" />
			    							<span class="rmb">￥{{item.product_price}}</span>
			    						</div>
			    					</div>
			    					
			    					<div v-if="item.msgtype == 'image'" class="apply_img">
										<el-dialog
										    width="40%"
										    @close="close_img(item)"
										    :visible.sync="innerVisible"
										    append-to-body>
										    <img :src="item.message" alt="" class="view_imgs"/>
										</el-dialog>
			    						<img :src="item.message" alt="" @close="close_img(item)" @click="view_img(val)"/>
			    					</div>
			    					
			    					<div v-if="item.msgtype == 'miniprogrampage'" class="product_infor" @click="go_product_detail(item)">
			    						<!-- <p class = "title">小程序卡片</p> -->
			    						<div class="product_name">{{item.product_name}}</div>
			    						<div class="product_detail">
			    							<img :src="item.product_imgurl" alt="" />
			    							<span>{{item.product_price}}</span>
			    						</div>
			    						<p class ="footer">微信小程序，来自商品详情页</p>
			    					</div>
			    					
			    				</div>
		    				</div>
		    				
							<div v-else class="flex_start">
								<div class="header_imgs">
									<img :src="item.headurl" alt=""  width="50" height="50"/>
								</div>
								<div class="chat_content">
									<span class="uName">{{item.custname}}</span>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<span class="time">{{item.createtime}}</span>
									<div  v-if="item.msgtype=='text'" class="font_style" v-html="emoji(item.message)"></div>
									
									<div v-if="item.msgtype == 'goods'" class="product_infor" @click="go_product_detail(item)">
			    						<div class="product_name">{{item.product_name}}</div>
			    						<div class="product_detail">
			    							<img :src="item.product_url" alt="" />
			    							<span>{{item.product_price}}</span>
			    						</div>
			    					</div>
			    					
			    					<div v-if="item.msgtype == 'image'" class="apply_img">
			    						<img :src="item.message" alt=""     @click="view_img(item)"/>
			    					</div>
			    				</div>
							</div>
		    			</li>
		    		</ul>
		    	</el-tab-pane>
		    	
		    	<el-dialog
					    width="40%"
					       @close="close_img()"
					    :visible.sync="innerVisible"
					    append-to-body>
					    <img :src="imgUrl" alt="" class="view_imgs"/>
				</el-dialog>
		    	<!--<el-tab-pane label="微信公众号" name="second">
		    		<ul>
		    			<li v-for="item in chat_record_wx_data">
		    				<div class="chat_time">{{item.year_time}}</div>
		    				<div class="chat_record_info_div" v-for="items in item.chat_record_info">
			    				<div class="header_imgs">
				    				<img :src="items.header_img" alt=""/>
			    				</div>
			    				<div class="chat_content">
			    					<div>
			    						<span>{{items.header_title}}</span>
			    						<span>{{items.time}}</span>
			    					</div>
			    					<div v-if="items.chat_sign == 'words'">
			    						{{items.content}}
			    					</div>
			    					<div v-if="items.chat_sign == 'goods'" class="product_infor" @click="go_product_detail(items)">
			    						<div class="product_name">{{items.product_name}}</div>
			    						<div class="product_detail">
			    							<img :src="items.product_img" alt="" />
			    							<span>{{items.product_price}}</span>
			    						</div>
			    					</div>
			    					<div v-if="items.chat_sign == 'picture'" class="apply_img">
										<el-dialog
										    width="30%"
										    :visible.sync="innerVisible"
										    append-to-body>
										    <img :src="items.content" alt="" class="view_imgs"/>
										</el-dialog>
			    						<img :src="items.content" alt="" @click="view_img"/>
			    					</div>
			    					<div v-if="items.chat_sign == 'kefu_chat'" class="kefu_apply_content">
			    						<pre v-html="items.content"></pre>
			    					</div>
			    				</div>
		    				</div>
		    			</li>
		    		</ul>
		    	</el-tab-pane>-->
		  	</el-tabs>
		</el-dialog>
	</div>
</template>

<script>
	export default({
		name : "chat_record" ,
		props:["isshow_record","userDetail"],
		data(){
			return{
//				dialogTableVisible: true,
				windowType:'',
				imgUrl:'',
				custHeadUrl:"",
				activeName: 'first',
				chat_record_phone_data:[ ], //手机聊天数据
				chat_record_wx_data:[  //微信公众号聊天数据
					{
						year_time : "2017年12月30号" ,
						chat_record_info:[
							{chat_sign:"picture",header_img:"http://huisou-test.oss-cn-hangzhou.aliyuncs.com/68%C3%9768.png",header_title:"YOU家精选",time:"09:18:20",content:"https://img.yzcdn.cn/upload_files/avatar.png"},
							{chat_sign:"words",header_img:"http://huisou-test.oss-cn-hangzhou.aliyuncs.com/68%C3%9768.png",header_title:"YOU家精选",time:"09:18:20",content:"收到回复可视电话付款合肥多快好省"},
							{chat_sign:"goods",header_img:"http://huisou-test.oss-cn-hangzhou.aliyuncs.com/68%C3%9768.png",header_title:"YOU家精选",time:"09:18:20",product_name:"电饭锅",product_price:"￥50.00",product_img:"http://huisou-test.oss-cn-hangzhou.aliyuncs.com/0022432.jpg"},
							{chat_sign:"kefu_chat",header_img:"http://huisou-test.oss-cn-hangzhou.aliyuncs.com/68%C3%9768.png",header_title:"YOU家精选",time:"09:18:20",content:"减肥吧事件发生<br/>结果是否就是大家<br/>吉电股份技术的广泛"}
						]
					}
				],
				innerVisible:false,
				id:null,//当前选中服务用户，滚动一页最小消息id记录，用户向上翻页判断加载消息起点
				emojiData:emoji_data,
			}
		},
		mounted(){
//			console.log(this.$refs.all_char.children["0"].children["0"].children[1].children[1].children[1].children["0"].children["0"])
//			this.$refs.all_char.scrollTop = this.$refs.all_char.scrollHeight;
			
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
			handleClick(tab, event) {
        		console.log(tab, event);
      		},
      		//图片预览
      		view_img(val){
      			this.imgUrl=val.message;
      			this.innerVisible = true
      		},
      		
      		close_img(val){
				this.innerVisible=false;
			}
			,
      		//点击前往产品详情
      		go_product_detail(val){
      			window.open(val.message)
      		},
      		//关闭弹框
      		closeDialog(){
      			this.$emit('close_record_mask', false)
      		}	
		},
		watch:{
			isshow_record(n,o){
				if (n){
					var a= 1;
					//向上滚动添加滚动事件
					
					if (localStorage.joinWay){
						if (localStorage.joinWay == 'small'){
							this.windowType = '微信小程序'
						}else{
							this.windowType = "微信商城"
						}
					}
					
					this.$nextTick(()=>{
						setTimeout(()=>{
							this.$refs.chat_record.scrollTop = 10000
						},500)
						console.log(this.$refs.chat_record.scrollTop)
						document.getElementById('chat_record_history_news').onscroll = (e)=>{
							if(document.getElementById('chat_record_history_news').scrollTop <= 0){
								this.$axios.get("list/message/dialogMessageList",{params:{
									userid: this.userDetail.userId,
									shopid: this.userDetail.shopId,
									pageNum:a,
									"crm_token":localStorage.crm_token
								}}).then((res)=>{
									if (res.data.code == '100'){
										if(a > 1){
											if (res.data.data.list.length > 0){
												console.log("----ads")
												this.id = 'chat_record' + this.chat_record_phone_data[0]['messageid']
												this.chat_record_phone_data=res.data.data.list.reverse().concat(this.chat_record_phone_data)
												this.$nextTick(()=>{
													var ele = document.getElementById(this.id);
													this.$refs.chat_record.scrollTop = ele.offsetTop;
												})
											}
										}
										a +=1;
										
									}
								})
							}
						}
				    })
							//加载对应的消息
					this.$axios.get("list/message/dialogMessageList",{params:{
							userid: this.userDetail.userId,
							shopid: this.userDetail.shopId,
							pageNum:a,
							"crm_token":localStorage.crm_token
						}}).then((res)=>{
							if (res.data.code == '100'){
								a +=1;
								this.chat_record_phone_data = res.data.data.list.reverse();
							}
						})
				}
			}
		}
	})
</script>

<style>
	.chat_record .el-dialog{
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		margin: 0!important;
	}
	.chat_record .el-dialog__title{
		font-size: 14px;
	}
	.chat_record .el-dialog__header{
		border-bottom: 1px solid #e5e5e5;
		margin: 0 10px;
		padding: 15px 2px 10px;
	}
	.chat_record .el-tabs__header{
		background: #f5f5f5;
		padding-left: 20px;
	}
	.chat_record .el-tabs__nav-wrap::after{
		content: none;
	}
	.chat_record .el-dialog__body{
		padding: 10px 20px 30px;
	}
	.chat_record #pane-second,.chat_record #pane-first{
		padding-left: 20px;
	}
	.chat_record .el-tabs__content{
		
	}
	.chat_record .chat_time{
		font-size: 12px;
		padding: 10px 0;
	}
	.chat_record .el-dialog__body{
		line-height: 18px;
	}
</style>
<style scoped="scoped">
	.time{
		margin-bottom: 8px;
	}
	.tip_content{
		text-align: left;
		margin-bottom: 10px;
		font-size: 12px;
	}
	ul{
		height: 430px;
		overflow: auto;
	}
	ul li {
		padding: 10px 0;
	}
	ul li .chat_record_info_div{
		padding: 5px 0 10px;
	}
	ul li .header_imgs,ul li .chat_content{
		/*display: inline-block;*/
	}
	ul li .chat_record_info_div{
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: nowrap;
	}
	ul li .header_imgs{
		height: 100%;
		vertical-align: text-top;
		margin-right: 8px;
		width: 35px;
	}
	ul li .chat_content{
		width: 80%;
	}
	ul li .header_imgs img{
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}
	ul li .chat_content{
		font-size: 12px;
	}
	ul li .chat_content div:nth-child(1){
		color: #666;
	}
	ul li .chat_content div:nth-child(2){
		color: #000;
	}
	/*聊天详情内容样式*/
		/*图片区域*/
	.apply_img{
		overflow: hidden;
	    max-width: 250px;
	    min-height: 0;
	    line-height: 0;
	}
	.apply_img img{
		cursor: pointer;
		width: auto;
   		height: auto;
		max-width: 100%;
		max-height: 100%;
	}
	.view_imgs{
		width: 100%;
	}
	.font_style{
		color: #000000;
		font-size:medium;
		margin-top: 5px;
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
	}
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
</style>