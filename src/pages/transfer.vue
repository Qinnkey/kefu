<template>
	<div></div>
</template>

<script>
	
export default {
	
  name:'transfer',

  	//初始化的时候获取到对应的信息，写到localstorage中，然后跳转页面
   mounted(){
   	//发送消息验证
   	var that = this;
	this.$axios.get("list/authority/login",{params:{
			custId: this.$route.query.custId,
			shopId: this.$route.query.shopId,
			sign: this.$route.query.sign
		}}).then((res)=>{
			console.log('登录---',res);
			if (res.data.code =='100'){
				localStorage.custId = res.data.data.custId;
				localStorage.custname = res.data.data.custname;
				localStorage.headurl = res.data.data.headurl != "" ? res.data.data.headurl : 'https://upx.cdn.huisou.cn/wscphp/res/home/image/huisouyun_120.png';
				localStorage.shopId = res.data.data.shopId;
				localStorage.isheader = res.data.data.isheader;
				localStorage.crm_token = res.data.data.crm_token;
				localStorage.setItem('shop_name',"汇搜云客服-" + res.data.data.shopname);
				localStorage.setItem('shop_logo',res.data.data.logo);
				// console.log(data.data.shopData.shop_logo)
				document.getElementsByTagName('title')[0].innerHTML ="汇搜云客服-" + res.data.data.shopname;
				document.getElementsByTagName('link')[0].innerHTML = res.data.data.logo;
				
//				this.$axios.get('https://hsshop.huisou.cn/api/getChatData',{params:{
//					shopId:res.data.data.shopId
//				}}).then(function(data){
//					console.log('商户数据--',data);
//					console.log('商户名称--',data.data.data.shopData.shop_name);
//					localStorage.setItem('shop_name',"汇搜云客服-" + data.data.data.shopData.shop_name);
//					localStorage.setItem('shop_logo','http://d.hiphotos.baidu.com/image/h%3D300/sign=428337b7c9cec3fd943ea175e689d4b6/1f178a82b9014a900d928cc6a3773912b31bee1a.jpg');
//					// console.log(data.data.shopData.shop_logo)
//					document.getElementsByTagName('title')[0].innerHTML ="汇搜云客服-" + data.data.data.shopData.shop_name;
//					document.getElementsByTagName('link')[0].innerHTML = data.data.data.shopData.shop_logo;
//				})
				that.$router.push({ name: 'index'})
				console.log(localStorage.shopId +"---------" + localStorage.custId)
			}else{
				window.location.href="https://hsshop.huisou.cn/auth/login";
//				window.location.href="https://www.huisou.cn/auth/login";
			}
		})

  }
}
	
</script>
	
	
	
	
<style>
</style>