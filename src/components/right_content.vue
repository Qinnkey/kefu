<template>
	<div class="right_content" @click.self="close_page">
		<!--tab切换头部-->
		<div class="right_tab_header">
			<div class="customer_infor" @click="switch_info" :class="header_value == 1 ? 'active_line' : ''">资料</div>
			<div class="customer_order" @click="switch_order" :class="header_value == 2 ? 'active_line' : ''">订单</div>
		</div>
		<!--客户资料部分-->
		<div class="customer_infor_content" v-if="header_value == 1">
			<!--遮罩-->
			<div class="mask" v-if="isShowmask" @click="close_mask"></div>
			<div style="padding: 15px 0; border-bottom: 1px solid #dcdcdc;">
				<!--客户类型-->
				<div class="customer_type customer_infor_content_childer">
					<span class="first_span" style="display:inline-block;height: 100%;vertical-align: middle;">客户类型：</span>
					<span class="two_span" style="display:inline-block;height: 100%;vertical-align: middle;">微信</span>
				</div>
				<!--客户类型-->
				<div class="customer_nickname customer_infor_content_childer">
					<span class="first_span">昵称：</span>
					<span class="two_span">{{customer_data.nickname}}</span>
				</div>
				<!--客户类型-->
				<div class="customer_memo_name customer_infor_content_childer">
					<span class="first_span">备注名：</span>
					<span class="two_span" :title="customer_data.memo_name" style="cursor: pointer;">{{customer_data.truename}}</span>
					<!--<span class="three_span" @click.stop="modify">修改</span>-->
					<!--点击修改后弹出来的输入框-->
					<div v-if="isShowInput">
						<div class="remark_input">
							<div>
								<input type="text" v-model="input_name"/>
							</div>
							<div class="actions">
								<button type="button" class="determine_btn" @click="comfirm_btn">确定</button>
								<button type="button" class="cancel_btn" @click="cancel_btn">取消</button>
							</div>
						</div>
						<i class="zent-pop-arrow"></i>
					</div>
				</div>
				<!--客户类型-->
				<div class="customer_region customer_infor_content_childer">
					<span class="first_span">所在地区：</span>
					<span class="two_span">{{customer_data.province}}{{customer_data.city}}{{customer_data.country}}</span>
				</div>
				<!--客户类型-->
				<div class="customer_attention_time customer_infor_content_childer">
					<span class="first_span">关注时间：</span>
					<span class="two_span">{{customer_data.createdat}}</span>
				</div>
				<!--客户类型-->
				<!--<div class="customer_end_time customer_infor_content_childer">
					<span class="first_span">最后对话：</span>
					<span class="two_span">{{customer_data.end_time}}</span>
				</div>-->
			</div>
		</div>
		<!--客户订单部分-->
		<div class="customer_order_content" v-if="header_value == 2">
			<div class="empty" v-if="customer_order_data.length == 0"><span>该客户还没购买过任何宝贝</span></div>
			<div class="all_order" v-else>
				<div class="order_info" v-for="item in customer_order_data" >
					<!--产品信息-->
					<a class="product_info" href="javascript:;" target="_blank " @click="goodsDetail(item)">
						<span>
							<img :src="item.orderImg" alt="" />
						</span>
						<span>
							{{item.orderName}}
						</span>
					</a>
					<div class="order_numbers order_childer">
						<span>订单号：</span>
						<br />
						<a href="javascript:;" target="_blank" class="order_href" @click="goodsDetail(item)">
							<span>{{item.orderNumber}}</span>
						</a>
					</div>
					<div class="pay_time order_childer">
						<span>付款时间：</span>
						<span>{{item.payTime}}</span>
					</div>
					<div class="p_order_time order_childer">
						<span>下单时间：</span>
						<span>{{item.orderTime}}</span>
					</div>
					<div class="pay_price order_childer">
						<span>实付价格：</span>
						<span>￥{{item.price}}</span>
					</div>
					<div class="pay_type order_childer">
						<span>付款方式：</span>
						<span>{{item.payType}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {imUrl,interUrl} from '../config/env'
	export default({
		name : "right_content",
		data(){
			return{
				header_value : "1",    //客户资料 和 客户订单切换  1 => 客户资料  2 => 客户订单
				customer_data:{
					type_name : "微信粉丝" ,
					nickname : "" , 
					truename : "" ,
					province:'',
					city:'',
					country:'',
					attention_time : "2017-12-15 19:00:27" ,
					end_time : "2017-12-15 22:00:55"
				},						 //客户资料数据
				customer_order_data:[
//					{
//						img:"http://img.yzcdn.cn/upload_files/2017/10/16/FoiPgzg1ksEbY5AEOvlQU3TkCF0i.png!100x100.jpg",
//						product_name    : "电饭锅" ,
//						order_number    : "E20171130175350063100007" ,
//						send_goods_time : "2017-11-30 18:54:14" ,
//						pay_time        : "2017-11-30 18:54:14" ,
//						place_order_time     : "2017-11-30 17:53:50" ,
//						price		    : "10.00"     ,
//						pay_type        : "支付宝"
//					},
				],						 //客户订单数据
				input_name : "" ,        //绑定备注输入框
				isShowInput : false ,    //是否展示修改备注的输入框
				isShowmask : false ,
			}
		},
		beforeDestroy(){
		    this.$root.Bus.$off('select_service_user');
		},
		created(){
			this.getUserInfo();	
			this.$root.Bus.$on("select_service_user", value=>{
				this.getUserInfo();		
		   });
 

		},
		methods:{
			//获取用户订单详情
			getUserOrders(){
				console.log("获取用户订单详情---------------------------");
				this.$http.get('/list/order/getUserOrders',{
					params:{
						userId: localStorage.weiuserId,
						shopId: localStorage.shopId,
//						userId: 17633,
//						shopId: 167,
						crm_token: localStorage.crm_token
					}}, {emulateJSON:true}
	  			).then(function(res){
					console.log("获取用户订单详情-----",res);
					if (res.body.code =='100' && res.body.data != null){
						this.customer_order_data=res.body.data;
					}else{
						console.log("获取用户订单详情---" + res.body.code + "-" + res.body.msg);
					}
				})
			},
			//获取用户缓存信息
			getUserInfo(){
				console.log('seruserid-----------------',localStorage.serUserId);
				this.$http.get('/list/customer/getUserInfo',{
					params:{
						userId:localStorage.serUserId
					}}, {emulateJSON:true}
	  			).then(function(res){
					console.log("获取当前会话用户信息-----",res);
					if (res.body.code =='100' && res.body.data != null){
						this.customer_data=res.body.data;
					}else{
						console.log("获取当前会话用户信息---" + res.body.code + "-" + res.body.msg);
					}
				})
	  			this.getUserOrders();
			},
			//订单详情
			goodsDetail(item){
				//线上地址
				var url = interUrl+"/merchants/order/orderDetail/" + item.orderId;
//				var url = "https://hsshop.huisou.cn/merchants/order/orderDetail/" + item.orderId;
				console.log("订单url: ", url);	
				window.open(url);
			},
			//点击客户资料切换
			switch_info(){
				this.header_value = 1
			},
			//点击客户订单切换
			switch_order(){
				this.header_value = 2
				this.cancel_btn();
			},
			//点击修改
			modify(){
				this.isShowInput = true
				this.isShowmask = true
			},
			//点击取消
			cancel_btn(){
				this.isShowInput = false
				this.isShowmask = false
				this.input_name = this.customer_data.memo_name 
			},
			//点击其他部分弹框消失
			close_page(){
				this.isShowInput = false
				this.isShowmask = false
				this.input_name = this.customer_data.memo_name 
			},
			//点击遮罩弹框消失
			close_mask(){
				this.isShowmask = false
				this.isShowInput = false
				this.input_name = this.customer_data.memo_name 
			},
			//点击确定
			comfirm_btn(){
				if(this.customer_data.memo_name == this.input_name){
					 this.$message.error('请修改备注名在保存')
				}else if(this.input_name == ""){
					this.$message.error('请填写备注名在保存')
				}else{
					this.$message({
			          message: '修改备注名成功',
			          type: 'success'
			        });
			        this.customer_data.memo_name = this.input_name ;
			        this.isShowInput = false ;
			        this.isShowmask = false
				}
			},
		}
	})
</script>

<style scoped="scoped">
	.right_content{
		position: fixed;
		right: 0;
		top: 0;
		z-index: 10;
		width: 260px;
		height: 100%;
		border-left: 1px solid #e5e5e5;
    	background-color: #fff;
	}
	/*tab切换头部样式*/
	.right_tab_header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 15px;
		width: calc(100% - 30px);
		height: 50px;
		background: #F8F8F8;
	}
	.right_tab_header div{
		margin: 0 10px;
		width: calc(50% - 20px);
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 14px;
		border-bottom: 2px solid rgba(255,255,255,0);
		cursor: pointer;
	}
	.right_tab_header .active_line{
		color: #5599FF;
		border-color: #5599ff;
	}
	/*客户类型样式*/
	.customer_infor_content{
		text-align: left;
		padding: 0px 10px;
		font-size: 12px;
	}
	.customer_infor_content .customer_infor_content_childer {
		padding: 5px 0;
	}
	.customer_infor_content span{
		display: inline-block;
	}
	.customer_infor_content .first_span{
		color: #999;
		width: 80px;
		text-align: right;
		vertical-align: middle;
	}
	.customer_infor_content .two_span{
		width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: middle;
		color: #333;
		width: 120px;
	}
	.customer_infor_content .three_span{
		color: #3F8FFF;
		cursor: pointer;
		width: 32px;
		text-align: center;
	}
	/*输入弹框样式*/
	.customer_memo_name{
		position: relative;
	}
	.remark_input{
		font-size: 0;
	}
	.remark_input{
		position: absolute;
		left:-20px;
		top:30px;
		z-index: 2000;
		background: #fff;
		width: 265px;
		padding: 10px 15px;
		margin: 0 -40px;
		box-shadow: 0px 2px 5px #888888
	}
	.remark_input div{
		display: inline-block;
		vertical-align:middle;
	}
	.remark_input .actions{
		margin-left: 10px;
	}
	.remark_input input{
		border: none;
		border: 1px solid #ccc;
		line-height: 20px;
	    padding: 4px 6px;
	    color: #555;
	    border-radius: 2px;
	    width: 138px;
	    font-size: 12px;
	}
	.remark_input .determine_btn{
		color: #fff;
    	background: #38f;
    	border-color: #38f;
	}
	.remark_input .cancel_btn{
		margin-left: 10px;
	}
	.remark_input button{
		display: inline-block;
	    height: 30px;
	    line-height: 30px;
	    padding: 0 10px;
	    border-radius: 2px;
	    font-size: 12px;
	    font-family: inherit;
	    color: #333;
	    background: #fff;
	    border: 1px solid #bbb;
	    text-align: center;
	    vertical-align: middle;
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    cursor: pointer;
	    -webkit-transition: all .3s;
	    -moz-transition: all .3s;
	    transition: all .3s;
	    outline: none;
	}
	.remark_input button:hover{
		border-color: #38f;
	}
	.remark_input .cancel_btn:hover{
		color: #38f;
	}
	.zent-pop-arrow {
	    position: absolute;
	    z-index: 10;
	    width: 10px;
	    height:10px;
	    background: #fff;
	    -webkit-box-shadow: 0 1px 4px rgba(0,0,0,.2);
	    box-shadow: 0 1px 4px rgba(0,0,0,.2);
	    transform: translateY(-50%) rotate(45deg);
    	right: 18px;
    	top: 30px;
	}
	.mask{
		position: fixed;
		top: 50px;
		right: 0;
		width: 260px;
		height: 187px;
		z-index: 100;
		background-color: #fff;
		opacity: 0;
	}
	/*客户订单样式*/
	.customer_order_content{
		text-align: left;
		padding: 0 10px;
		font-size: 12px;
		height: calc(100% - 70px);
		overflow: auto;
	}
	.all_order .product_info{
		display: block;
	}
	.all_order .product_info span:nth-child(1){
		display: inline-block;
		width: 60px;
		height: 60px;
		border: 1px solid #d9d9d9;
	}
	.all_order .product_info span:nth-child(1) img{
		height: 100%;
		width: 100%;
	}
	.all_order .product_info span:nth-child(2){
		display: inline-block;
		height: 100%;
		vertical-align:top;
		width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.order_childer{
		margin: 8px 0;
	}
	.order_childer span:nth-child(1){
		display: inline-block;
		width: 65px;
		text-align: right;
		color: #999;
	}
	.order_childer span:nth-child(2){
		color: #333;
	}
	.order_href{
		display: inline-block;
		margin: 5px 0 0;
	}
	.order_numbers a span:hover{
		color: #333;
	}
	.product_info span:nth-child(2){
		color: #999;
	}
	.product_info span:nth-child(2):hover{
		color: #333;
	}
	.order_info{
		padding: 20px 0 15px 0;
		border-bottom: 1px solid #dcdcdc;
	}
	/*没有购物记录样式*/
	.empty {
	    height: 120px;
	    line-height: 120px;
	    width: 100%;
	    background: url('../../static/images/package.png') 50% no-repeat;
	    background-image: -webkit-image-set(url('../../static/images/package.png') 1x,url('../../static/images/package.png') 2x);
	    text-align: center;
	    font-size: 12px;
	    font-weight: 200;
	    color: #999;
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    -webkit-transform: translate(-50%,-50%);
	    -moz-transform: translate(-50%,-50%);
	    -ms-transform: translate(-50%,-50%);
	    transform: translate(-50%,-50%);
	}
	.empty span {
    	vertical-align: text-top;
	}
</style>