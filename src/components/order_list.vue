<template>
	<div class="order_list">
		<!--顶部栏-->
		<p class="topFun flex_between_v">
			<span>新订单提醒</span>
			<span>
				<el-button type="text" @click="moreOrder">查看更多订单</el-button>
				<el-button type="text" @click="cleanReminder">清空订单提醒</el-button>
			</span>
		</p>
		<!--有订单列表-->
		<div class="hasList" v-if="orderList != null && orderList.length>0">
			<div class="list_div">
				<ul>
					<li v-for="item in orderList">
						<div class="orderNum">订单号：{{item.orderNumber}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.orderTime}}</div>
						<div class="orderDetail flex_between_v" @click="goodsDetail(item)">
							<!--订单物品信息-->
							<div class="orderInfo flex_start">
								<img :src="item.orderImg" width="60" height="60"/>
								<div class="orderTitle">
									<p>{{item.orderName}}</p>
									<p>共{{item.buyNum}}件商品</p>
								</div>
							</div>
							<!--订单价格-->
							<div class="orderPrice">实收：￥{{item.price}}</div>
						</div>
					</li>
				</ul>
			</div>
			<!--分页-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
	      		:page-size="30"
	      		layout="prev, pager, next, jumper"
	      		:total="totalCount">
	    	</el-pagination>
		</div>
		<!--无订单显示-->
		<div v-else class="noList">
			<div id="emptyImg">
				<img src="../../static/images/order_empty@1x.png" width="45"/>
			</div>
			<p>您还没有新的订单哦！</p>
			<el-button type="text" @click="moreOrder">查看更多订单</el-button>
		</div>
	</div>
</template>

<script>
	import testPic from '../../static/images/picture_1.jpg'
	import {imUrl,interUrl} from '../config/env'
	export default({
		name: "order_list",
		data(){
			return{
				//定义列表总数
        		totalCount: 0,
        		currentPage: 1,		//默认页码
        		//定义每页条数
        		pageSize: 30,
				orderList:[
//					{orderNum:'E2017156868965586786860101', time: "2017-12-19 14:22:31", img: testPic, goodTitle: "小日本", buyNum: 1, price: '0.01'},
				],
			}
		},
		created(){
			this.getAllOrders();
		},
		methods:{
			//获取商户下所有订单
			getAllOrders(){
				console.log("获取商户所有订单---------------------------");
				this.$http.get('/list/order/getAllUserOrders',{
					params:{
						shopId: localStorage.shopId,
						pageNum: this.currentPage,
						pageSize: this.pageSize,
						crm_token: localStorage.crm_token
					}}, {emulateJSON:true}
	  			).then(function(res){
					console.log("获取商户所有订单-----",res);
					if (res.body.code =='100' && res.body.data != null){
						this.orderList=res.body.data.list;
						this.totalCount = res.body.data.total;
		          		this.currentPage = res.body.data.pages;
					}else{
						console.log("获取商户所有订单---" + res.body.code + "-" + res.body.msg);
					}
				})
			},
			//更多订单
			moreOrder(){
//				window.open("https://hsshop.huisou.cn/merchants/order");
				//线上地址
				window.open(interUrl+"/merchants/order");
			},
			//清空提醒
			cleanReminder() {
				this.$confirm('确定清空订单提醒?', '提示', {
					type: 'warning'
				}).then(() => {
					this.$http.get('/list/order/clearOrderNotification',{
					params:{
						shopId: localStorage.shopId,
						crm_token: localStorage.crm_token
					}}, {emulateJSON:true}
	  		).then(function(res){
					if (res.body.code =='100'){
						this.$message({
							type: 'success',
							message: '成功!'
							});
						}
					})
				}).catch(() => {})
			},
			//订单详情
			goodsDetail(item){
				//线上地址
				var url = interUrl+"/merchants/order/orderDetail/" + item.orderId;
//				var url = "https://hsshop.huisou.cn/merchants/order/orderDetail/" + item.orderId;
				console.log("订单url: ", url);	
				window.open(url);
			},
			//改变页码值
			handleSizeChange(val) {
				this.pageSize = val;
        		console.log('每页 条' + val);
		   },
		    handleCurrentChange(val) {
		    	console.log('当前页: ' + val);
        		this.currentPage = val;
//      		if(this.orderList.length>0){
//      			this.getAllOrders();
//      		}
		    }
		}
	})
</script>

<style scoped="scoped" lang="less">
	.order_list{
		padding: 10px 20px;
		height: calc(~"100% - 20px");
		.hasList{
			height: calc(~"100% - 40px");
			.list_div{
				margin-top: 10px;
				margin-bottom:30px;
				height: calc(~"100% - 120px");
				overflow: auto;	
				border:10px solid white;
				box-shadow: 0 0 5px #ccc;
				ul{
					font-size: 14px;
					color: #888888;
					li{
						margin: 10px 0;
						border: 1px solid #e5e5e5;
						&:hover{cursor: pointer;}
						.orderNum{
							padding: 10px;
							background: #f5f5f5;
							border-bottom: 1px solid #e5e5e5;
						}
						.orderDetail{
							height: 80px;
							&:hover{background: #F5F5F5;}
							.orderInfo{
								padding: 10px;
								width: calc(~"100% - 236px");
								height:100%;
								overflow:hidden;
								img{
									margin-right: 10px;
								}
								.orderTitle{
									width: calc(~"100% - 200px");
									padding:10px;
									p{
										overflow: hidden;
										text-overflow: ellipsis;
										white-space: nowrap;
										&:nth-child(1){
											margin-bottom: 20px;
										}
									}
								}
							}
							.orderPrice{
								padding: 0 10px;
								height: 100%;
								line-height: 80px;
								border-left: 1px solid #e5e5e5;
							}
						}
					}
				}
			}
			.el-pagination{
				margin-left: calc(~"100% - 540px");
			}
		}
		.noList{
			height: 300px;
			text-align: center;
			#emptyImg{
				width: 120px;
				height: 120px;
				text-align: center;
				line-height: 158px;
				margin-left: calc(~"50% - 60px");
				margin-top: 200px;
				border-radius: 50%;
				background: #f8f8f8 ;
			}
			p{
				margin: 20px 0;
			}
		}
	}
</style>