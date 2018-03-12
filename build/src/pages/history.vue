<template>
  <div class="history">
    <history_panel :userInfo="userInfo" v-if ="display==1" :className = "'chat_msg1'"></history_panel>
    <div class="history-content-empty" v-if="userChoosed">
        <div class="icon-bg">
            <div class="icon"></div>
        </div>
        <span>没有选中的客户哦</span>
    </div>
  </div>
</template>
<script>
import history_panel from "@/components/history_panel"
export default {
  name: 'history',
  components: {history_panel},
  data () {
    return {
    	userChoosed:true,
      userInfo:null,
      display:0
    }
  },
    created(){
  	this.$root.Bus.$on("customer_list_choose", value=>{
  		if (value){
  			this.display=1;
  			this.userInfo=value;
				this.userInfo.userTransfer=false;
  			this.userChoosed = false;
  		}
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .history{position:relative;width:100%;}
	.history-content-empty {
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
  .history-content-empty .icon-bg {
      width: 120px;
      height: 120px;
      margin: auto;
      border-radius: 50%;
      background-color: #f8f8f8;
      overflow: hidden;
  }
  .history-content-empty .icon-bg .icon {
    height: 54px;
    width: 52px;
    margin: 33px auto auto;
    background: url(../../static/images/bg_icon@1x.png) 0 0 no-repeat;
    background-image: -webkit-image-set(url(../../static/images/bg_icon@1x.png) 1x,url(../../static/images/bg_icon@2x.png) 2x);
  
  }
  .history-content-empty span {
    line-height: 40px;
  }
</style>
