<template>
  <div id="app" class="js_react_root">
    <section class="imapp flex">
     <!--  <slide :hide_model="hide_model"></slide>
      <section class="imapp-content">
          <section class="im-content-body">
              <router-view/>
          </section>
      </section> -->
      <!-- 消息语音提醒 -->
      <audio id="play1">
          <source src="../static/videos/notice.wav"></source>
      </audio>
      <router-view/>
    </section>
  </div>
</template>

<script>
// import slide from '@/components/slide'
export default {
  name: 'app',
  data(){
  	return{
  		hide_model: false
  	}
  },
  methods:{
  },
  mounted(){
    if(localStorage.getItem('shop_name')){
      document.getElementsByTagName('title')[0].innerHTML = localStorage.getItem('shop_name');
      document.getElementsByTagName('link')[0].href = localStorage.getItem('shop_logo');
    }
  } 
}
</script>
<style type="text/css">
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
    .im-content-body {
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
    /*2017-12-14 tony*/
   	*{padding:0; margin: 0;}
    .flex_start{display: flex; justify-content: flex-start;}
		.flex_start_v{display: flex; justify-content: flex-start; align-items: center;}
		.flex_end{display: flex; justify-content: flex-end;}               
		.flex_end_v{display: flex; justify-content: flex-end; align-items: center;}  
		.flex_between{display: flex; justify-content: space-between;}
		.flex_between_v{display: flex; justify-content: space-between; align-items: center;}
		.flex_around{display: flex; justify-content: space-around;}
		.flex_around_v{display: flex; justify-content: space-around; align-items: center;}
		.vertical_v{display: flex; align-items: center;}
		.vertical_h{display: flex; justify-content: center;}
</style>

