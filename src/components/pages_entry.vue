<template>
  <div class="pages_entry">
    <slide :hide_model="hide_model" v-on:kefuStatus="changeStatus"></slide>
      <section class="imapp-content">
          <section class="im-content-body" v-if="isOnline == '1'">
    	      <person-slide></person-slide>
            <router-view></router-view>
          </section>
          <div class="app-offline-mask" v-if="isOnline == '0'">
              <div class="app-offline-icon">
                  <div class="icon-bg">
                      <div class="icon"></div>
                  </div>
                  <span>必须在线才能接客哦</span>
              </div>
          </div>
      </section>
  </div>
</template>
<!--  <slide :hide_model="hide_model"></slide>
      <section class="imapp-content">
          <section class="im-content-body">
              <router-view/>
          </section>
      </section> -->
<script>
import slide from '@/components/slide'
import personSlide from '@/components/personSlide'
export default {
  name: 'pages_entry',
  data () {
    return {
      hide_model:false,
      customer:{
    		custid:'',
    		shopid:'',
    	},
      isOnline:true
    }
  },
  methods:{
    hideModel(){
      this.hide_model = !this.hide_model;
    },
    changeStatus(value){
        if(value == 'online'){
            this.isOnline = "1";
        }else if(value == 'busy'){
            this.isOnline = "1";
        }else{
            this.isOnline = "0";
        }
    },
    customer_list_choose(data){
    }
  },
  created(){
  	this.$root.Bus.$on("kefuStatus", value=>{
        if(value == 'online'){
            this.isOnline = true;
        }else if(value == 'busy'){
            this.isOnline = true;
        }else{
            this.isOnline = false;
        }
    })
  },
  beforeDestroy(){
     this.$root.Bus.$off('kefuStatus');
  },
  components: {slide,personSlide}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.pages_entry{
		width: 100%;
		display: flex;
		justify-content: flex-start;
	}
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
