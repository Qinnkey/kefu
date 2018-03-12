<template>
  <div class="index">
    <chat_panel :userInfo="userInfo" @tranferTo="tranferToOther" v-if="order_or_chat=='chat'" ref="input1"></chat_panel>
    <order_list v-else-if="order_or_chat=='order'" ref="input2"></order_list>
    <!-- 没有选中会话内容的时候 -->
    <div class="im-content-empty" v-if="order_or_chat=='empty'">
	      <div class="icon-bg">
	          <div class="icon"></div>
	      </div>
      <span>没有选中会话哦</span>
    </div>
   
  </div>
</template>

<script>

import chat_panel from "@/components/chat_panel"
import order_list from "@/components/order_list"
export default {
  name: 'index',
  components: {chat_panel, order_list},
  data () {
    return { 
      order_or_chat: "empty",
      userInfo:null,
    }
  },
//sockets:{
//  onCustJoin: function(res){
//  	console.log('连接事件监听connect-----',res);
////  	if (res != "temp"){
//  		console.log('connect成功，坐席custJoin--------------');
//  		this.$socket.emit('custJoin', {shopId:localStorage.shopId,custId:localStorage.custId,custStatus:localStorage.kefuStatus});
////  	}
//  },
//},
  created(){
  	this.$root.Bus.$on("customer_list_choose", value=>{
  		console.log(value,"加载的值")
  		if (value){
  			console.log('value order--------');
  			 	if (value.type && value.type=='order') {
		    		this.order_or_chat = 'order'
		    	}else if(value.type && value.type=='chat'){
		    		this.order_or_chat = "chat"
		    		this.userInfo=value;
		    	this.userInfo.userTransfer=true;
          		//  滚动条滚动到底部
             	this.$nextTick(()=>{
             			console.log(document.getElementsByClassName('chat_msg')[0],"消息");
             			if (document.getElementsByClassName('chat_msg')[0]){
                      setTimeout(function(){
                        document.getElementsByClassName('chat_msg')[0].scrollTop = document.getElementsByClassName('chat_msg')[0].scrollHeight;
                      },500)
                    if(this.$refs.input1){
                      this.$refs.input1.scrollTop = this.$refs.input1.scrollHeight;
                    }
             			}
             })
		    	}
  		}else{
  			console.log('value othersss--------');
  				this.order_or_chat = "empty"
  		}
    })
  },
  mounted(){
    this.$nextTick(()=>{
      console.log(this.$refs)
    })
  },
  methods:{
  	//到前段页面删除
  	tranferToOther(val){
  		console.log("转接执行删除")
 			this.$root.Bus.$emit("tranferTo_other", val);
  	},

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.index{
		width: 100%;
    position:relative
	}
.im-content-empty {
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
  .im-content-empty .icon-bg {
    width: 120px;
    height: 120px;
    margin: auto;
    border-radius: 50%;
    background-color: #f8f8f8;
    overflow: hidden;
}
.im-content-empty .icon-bg .icon {
    height: 46px;
    width: 56px;
    margin: 37px auto auto;
    background: url(../../static/images/bg_icon@1x.png) 0 -105px no-repeat;
    background-image: -webkit-image-set(url(../../static/images/bg_icon@1x.png) 1x,url(../../static/images/bg_icon@2x.png) 2x);
}
.im-content-empty span {
    line-height: 40px;
}
</style>