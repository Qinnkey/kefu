<template>
    <div class="container ">
        <div class="js-app-container app-container">
            <div class="wap-im-talk">
                <div id="js-navbar-container" class="navbar">
                    <div class="navbar-inner">
                        <h3 class="shop-info">
                            <a target="_top" :href="shopUrl" class="homepage-link">
                                <figure class="bg-pic border-bg-pic circle-bg-pic">
                                    <div class="bg-pic-content" :style="'backgroundImage: url(' + shopLogo + ');'"></div>
                                </figure>
                                <span>{{this.shopName}}</span>
                                <i class="ico-right-arrow"></i>
                            </a>
                        </h3>
                        <div class="right-opt">
                            <!-- <a href="#history" class="js-history-talk ico-history"></a> -->
                        </div>
                    </div>
                </div>
                <div id="js-notice-rc" class="notice-rc"></div>
                <div id="js-notice-phonesetting" class="notice-phone"></div>
                <div class="js-list-viewport im-list-viewport dialogue" ref="js_list" :class=" emojiShow ? 'open-emoticon':'dialogue' " @click="hideEmoji">
                    <div class="dialogue-inner">
                        <div class="js-message-list message-list">
                            <div class="list-finished" v-if = "noMessage">已经没有更多消息了</div>
                            <div class="js-list b-list" v-for="item in msg_items" :id="'kefu_chat_record' + item.messageid">
                                <div class="message-item image" :class="item.sendway == 'userway' ? 'out' : 'in'"   v-if="item.msgtype == 'image' ">
                                    <div class="message-time">
                                        <span>{{item.createtime}}</span>
                                    </div>
                                    <div class="message-meta">
                                        <span class="nickname">{{item.username}}</span>
                                    </div>
                                    <div class="avatar">
                                        <figure class="bg-pic circle-bg-pic">
                                            <div class="bg-pic-content" :style="{backgroundImage: 'url('+item.headurl+')'}"></div>
                                        </figure>
                                    </div>
                                    <div class="message-body">
                                        <div class="send-state send-state-1"></div>
                                        <div class="message-content">
                                            <div class="image-wrapper" @click="prevewImage($event)">
                                                <img :src="item.message" alt="" :id="'ceshi' + item.messageid"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="message-item text" :class="item.sendway == 'userway' ? 'out' : 'in'"  v-if="item.msgtype == 'text' && item.sendway != 'promptway'">
                                    <div class="message-time">
                                        <span>{{item.createtime}}</span>
                                    </div>
                                    <div class="message-meta">
                                        <span class="nickname" v-if="item.sendway =='userway'">{{item.username}}</span>
                                        <span class="nickname" v-else>{{item.custname}}</span>
                                    </div>
                                    <div class="avatar">
                                        <figure class="bg-pic circle-bg-pic">
                                            <div class="bg-pic-content" :style="{backgroundImage: 'url('+item.headurl+')'}"></div>
                                        </figure>
                                    </div>
                                    <div class="message-body">
                                        <div class="send-state send-state-1"></div>
                                        <div class="message-content">
                                            <pre v-html="emoji(item.message)"></pre>
                                        </div>
                                    </div>
                                </div>
                                

                                <div class="message-item card" :class="item.sendway == 'userway' ? 'out' : 'in'" v-if="item.msgtype=='goods'">
                                    <div class="message-time">
                                        <span>{{item.createtime}}</span>
                                    </div>
                                    <div class="message-meta">
                                        <span class="nickname">{{item.username}}</span>
                                    </div>
                                    <div class="avatar">
                                        <figure class="bg-pic circle-bg-pic">
                                            <div class="bg-pic-content":style="{backgroundImage: 'url('+item.headurl+')'}"></div>
                                        </figure>
                                    </div>
                                    <div class="message-body">
                                        <div class="send-state send-state-1"></div>
                                        <div class="message-content">
                                            <a target="_top" :href="item.message" class="block-link card-info">
                                                <h4 class="card-title">{{item.product_name}}</h4>
                                                <div class="card-info-cont">
                                                    <figure class="bg-pic square-bg-pic">
                                                        <div class="bg-pic-content" :style="{backgroundImage: 'url('+item.product_imgurl+')'}"></div>
                                                    </figure>
                                                    <p class="card-desc">¥{{item.product_price}}</p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            
                                <div class="goods-card-container" v-if="item.msgtype == 'link'">
                                    <div class="block-link goods-card">
                                        <figure class="bg-pic square-bg-pic">
                                            <div class="bg-pic-content" :style="{backgroundImage: 'url('+item.product_imgurl+')'}"></div>
                                        </figure>
                                        <h4 class="goods-title">{{item.product_name}}</h4>
                                        <p class="goods-price">¥{{item.product_price}}</p>
                                        <button class="js-send-card btn-green btn btn-xxsmall" @click="sendGood">发送链接</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="js-inputer-container" class="inputer" :class=" emojiShow ? 'emoticon-actived':'' ">
                    <div class="inputer-inner">
                        <div class="inputer-action">
                            <button class="js-open-emoticon inputer-emoticon inputer-icon" @click="showEmoji">表情</button>
                            <el-upload class="js-inputer-image inputer-image inputer-icon"  :before-upload="beforeAvatarUpload" :data="uploadData" :action="imgAction" :on-success="handleAvatarSuccess"> 
                            </el-upload>
                            <textarea maxlength="500" class="js-inputer-txta inputer-txt" cols="30" rows="1" placeholder="" v-model="inputWords" @focus="hideEmoji" @click="clickInput"></textarea>
                            <button @click="submitNews" class="js-inputer-ok btn btn-green inputer-btn" type="button">发送</button>
                        </div>
                        <div class="js-emoticon-container emoticon-container" v-show="emojiShow">
                            <ul class="emoticon-list clearfix" v-for="(emojiGroup, index) in emojis" :key="index" v-if="index === activeIndex">
                                <li data-item-key="[笑脸]" data-item-val="😄" v-for="(emoji, index) in emojiGroup" :key="index" @click="selectItem(emoji)">
                                    <img :src="'../../static/emoji/' + ceshi(emoji) + '.png'">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- big preview -->
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="pswp__bg"></div>
            <div class="pswp__scroll-wrap">
                <div class="pswp__container">
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <div class="pswp__ui pswp__ui--hidden">
                    <div class="pswp__top-bar">
                        <div class="pswp__counter"></div>
                        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>
                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .el-upload{width:100%;height:100%;}
    .el-upload__input{width:100%;height:100%;}
</style>
<script>
import data from '../data/emoji-data.js'
import {imUrl,interUrl} from '../config/env'
// console.log($)
import photoswipe from 'photoswipe'
export default {
  name: 'kefu',
  data () {
    return {
      //线上地址
      imgAction:imUrl+'/list/file/uploadImage',
      noMessage:false,//如果没有消息的话，那么就显示
      userId:'',
      weiuserId:'',
      headurl:'',
      username:'',
      shopId:'',
      shopName:'',
      shopLogo:'',
      pageNum:'',
      shopUrl:'',
      sign:'',
      id:"",
      msgType:'text',
      emojiShow:false,
      emojiData: data,
      pannels: ['表情'],
      activeIndex: 0,
      inputWords:'',//输入框内容
      msg_items:[],//消息数据
      messageProduct:{
      	product_name:'',
	    product_price:'',
	    product_imgurl:'',
	    product_action:'',
	    msgtype:'link',
      },
      //上传图片信息
      uploadData:{
      		shopId:'',
      		userId:''
      },
      flag:true
    }
  },
  computed: {
    emojis () {
      return this.pannels.map(item => {
        // console.log(Object.keys(this.emojiData[item]).splice(0,21))
        
        // var list = Object.keys(this.emojiData[item]).splice(0,21);
        return Object.keys(this.emojiData[item]).splice(0,21)
      })
    }
  },


  
//sockets:{
//  connect: function(res){
//  	console.log("user send connect");
//  	if (res =='connected'){
//  		console.log("user connect shopId=",this.shopId,';userid=',this.userId);
//  		this.$socket.emit('userJoin', {shopId:this.shopId,userId:this.userId});
//  	}
//  },
//  message:function(res){
//  	console.log(res,"接受到的消息")
//  	if (res != '' || res != null || res.createtime != '' || res.createtime != null){
//			var a= new Date(res.createtime);
//          var hour = a.getHours() > 9 ? a.getHours() : '0' + a.getHours();
//          var minutes = a.getMinutes() > 9 ? a.getMinutes() : '0' + a.getMinutes();
//          var seconds = a.getSeconds() > 9 ? a.getSeconds() : '0' + a.getSeconds();
//			res.createtime = hour + ":" + minutes + ":" + seconds;
//			this.msg_items.push(res);
//		}
//  },
//  //参数传输错误，或者远程服务器没有对应的用户，
//  errPara:function(res){
//  	console.log("参数错误",res);
//  }
//  
//},
  


  methods:{
    //显示表情弹窗
    showEmoji(){
        this.emojiShow = !this.emojiShow;
        //设置滚动条位置滚到到底部
        this.$nextTick(()=>{
            document.getElementsByClassName('im-list-viewport')[0].scrollTop = document.getElementsByClassName('im-list-viewport')[0].scrollHeight;
        })
    },
    setScrollTop(scroll_top,dom) {  
        dom.scrollTop = scroll_top;  
        dom.pageYOffset = scroll_top;  
        document.body.scrollTop = scroll_top;  
    },  
    ceshi(item){
        item = item.substr(1,item.length - 2);
        return item
    },
    //隐藏表情弹窗
    hideEmoji(){
        this.emojiShow = false;
    },
    clickInput(){
        setTimeout(function() {
            document.getElementsByTagName('body')[0].scrollTop = document.getElementsByTagName('body')[0].scrollHeight;
        }, 1000);
    },
    getPureName (name) {
      return name.replace(/:/g, '')
    },
    selectItem (emoji) {
      // console.log(emoji);
      // this.$emit('select', emoji)
      this.inputWords = this.inputWords + emoji;
    },
    //发送消息
    sendGood(){
    	this.msgType="goods";
    	this.inputWords = this.messageProduct.product_action;
    	this.submitNews();
    },
    //上传前对图片进行检查
    beforeAvatarUpload(file) {
		 var fileext = file.name.substring(file.name.lastIndexOf(".") +1, file.name.length);
		 var isIMG = false;
		if (fileext == 'jpeg'||fileext =='gif'||fileext =='png'|| fileext =='jpg'){
			isIMG = true
		}
        console.log(isIMG,fileext)
        if (!isIMG) {
          this.$message.error('上传图片格式仅支持gif、jpeg、png、jpg 4种格式');
        }
            const isLt5M = file.size / 1024 / 1024  < 10;
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过10MB!');
        }
        console.log(isIMG,isLt5M)
        return isIMG && isLt5M;
	},
	loadHistory(){
        if(!this.flag)return;
        this.flag = false;
        if (this.msg_items.length > 0){
            this.id = this.msg_items[0]['messageid'];
        }
        var that = this;
		this.$axios.get("list/message/dialogMessageList",{params:{
				userid:this.userId,
				shopid:this.shopId,
				messageid:this.id,
				pageNum: this.pageNum
			}}).then((res)=>{
				if (res.data.code =='100'){
					if (res.data.data.list != null && res.data.data.list != ''){
					//向上翻页，存取最小id                
                    this.msg_items = res.data.data.list.reverse().concat(this.msg_items);
                    // alert(3)
                    this.$nextTick(()=>{
                        if(this.id){
                            setTimeout(()=>{
                                var ele = document.getElementById('kefu_chat_record' + this.id);
                                    console.log(ele);
                                document.getElementsByClassName('js-list-viewport')[0].scrollTop = ele.offsetTop;
                                 this.flag = true;
                            },600)
                        }
                        if(!this.id){
                            this.flag = true;
                        }
                    })
					//用来加载商品的连接信息
					}else{
						this.noMessage = true;
					}
				}
		})
	},
	prevewImage($event){
        console.log($event.target);
        this.initPhotoSwipeFromDOM($event.target)
    },
    initPhotoSwipeFromDOM(gallerySelector){
        var parseThumbnailElements = function(el) {
                var thumbElements = el.childNodes,
                        numNodes = thumbElements.length,
                        items = [],
                        el,
                        childElements,
                        thumbnailEl,
                        size,
                        item;

                for(var i = 0; i < numNodes; i++) {
                    el = thumbElements[i];

                    // include only element nodes
                    if(el.nodeType !== 1) {
                        continue;
                    }

                    childElements = el.children;

                    size = el.getAttribute('data-size').split('x');

                    // create slide object
                    item = {
                        src: el.getAttribute('href'),
                        w: parseInt(size[0], 10),
                        h: parseInt(size[1], 10),
                        author: el.getAttribute('data-author')
                    };
                    item.el = el; // save link to element for getThumbBoundsFn

                    if(childElements.length > 0) {
                        item.msrc = childElements[0].getAttribute('src'); // thumbnail url
                        if(childElements.length > 1) {
                            item.title = childElements[1].innerHTML; // caption (contents of figure)
                        }
                    }


                    var mediumSrc = el.getAttribute('data-med');
                    if(mediumSrc) {
                        size = el.getAttribute('data-med-size').split('x');
                        // "medium-sized" image
                        item.m = {
                            src: mediumSrc,
                            w: parseInt(size[0], 10),
                            h: parseInt(size[1], 10)
                        };
                    }
                    // original image
                    item.o = {
                        src: item.src,
                        w: item.w,
                        h: item.h
                    };

                    items.push(item);
                }
                return items;
            };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            var clickedListItem = closest(eTarget, function(el) {
                return el.tagName === 'A';
            });

            if(!clickedListItem) {
                return;
            }

            var clickedGallery = clickedListItem.parentNode;

            var childNodes = clickedListItem.parentNode.childNodes,
                    numChildNodes = childNodes.length,
                    nodeIndex = 0,
                    index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) {
                    continue;
                }

                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }

            if(index >= 0) {
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                    params = {};

            if(hash.length < 5) { // pid=1
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if(pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                    gallery,
                    options,
                    items;

            items = [
                {src:gallerySelector.getAttribute('src'), w:1200, h:900}
            ];

            // define options (if needed)
            options = {

                // galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                // getThumbBoundsFn: function(index) {
                //     // See Options->getThumbBoundsFn section of docs for more info
                //     var thumbnail = items[index].el.children[0],
                //             pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                //             rect = thumbnail.getBoundingClientRect();

                //     return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                // },

                // addCaptionHTMLFn: function(item, captionEl, isFake) {
                //     if(!item.title) {
                //         captionEl.children[0].innerText = '';
                //         return false;
                //     }
                //     captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
                //     return true;
                // }

            };

            // options for control bar
            options.shareEl = false;
            options.fullscreenEl = true;

            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }



            // Pass data to PhotoSwipe and initialize it
            gallery = new photoswipe( pswpElement, '', items, options);

            // see: http://photoswipe.com/documentation/responsive-images.html
            var realViewportWidth,
                    useLargeImages = false,
                    firstResize = true,
                    imageSrcWillChange;

            gallery.listen('beforeResize', function() {

                var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
                dpiRatio = Math.min(dpiRatio, 2.5);
                realViewportWidth = gallery.viewportSize.x * dpiRatio;
                if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
                    if(!useLargeImages) {
                        useLargeImages = true;
                        imageSrcWillChange = true;
                    }

                } else {
                    if(useLargeImages) {
                        useLargeImages = false;
                        imageSrcWillChange = true;
                    }
                }

                if(imageSrcWillChange && !firstResize) {
                    gallery.invalidateCurrItems();
                }

                if(firstResize) {
                    firstResize = false;
                }

                imageSrcWillChange = false;

            });
            gallery.init();
        };

        // select all gallery elements
        // var galleryElements = document.querySelectorAll( gallerySelector );
        console.log(gallerySelector.getAttribute('src'))

        for(var i = 0, l = gallerySelector.length; i < l; i++) {
            gallerySelector[i].setAttribute('data-pswp-uid', i+1);
            gallerySelector[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        console.log(hashData)
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe(0,  gallerySelector[0], true, true );
        }
        openPhotoSwipe(0,  gallerySelector[0], true, true );
    },
    /**
     发布消息
     wdd
    **/
    submitNews(){
        if (!this.wordReplace(this.inputWords)=="") {
        	 var time = new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
        	 var msg={
        	 		shopid:this.shopId,
        	 		userid:this.userId,
        	 	   username:this.username,
        	 	   sendway:'userway',
        	 	   headurl:this.headurl,
        	 	   message:this.inputWords,
        	 	   msgtype:this.msgType,
        	 	   product_name:'',
        	 	   product_imgurl:'',
        	 	   product_price:''
        	 };
        	if (this.msgType == 'goods'){
        			msg.product_name=this.messageProduct.product_name;
					msg.product_imgurl=this.messageProduct.product_imgurl;
					msg.product_price=this.messageProduct.product_price;
         		  this.socket.emit('message',msg);
        	}
			if (this.msgType =='text' ){
				this.socket.emit('message',msg);
				    //对网页进行判断
	            var RegUrl = new RegExp(); 
	            RegUrl.compile('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');//jihua.cnblogs.com 
	            if (RegUrl.test(this.inputWords)) {
	                this.inputWords = "<a style='color:blue' target= _blank href=" + this.inputWords + ">"+this.inputWords+"</a>";
	            }
			}
			msg.message=this.inputWords;
			msg.createtime=time;
            msg.messageid = this.GenNonDuplicateID() 
            this.msg_items.push(msg);
            this.$nextTick(()=>{
                document.getElementsByClassName('js-list-viewport')[0].scrollTop = 10000;
            })
            this.inputWords = "";
            this.msgType="text";
            // this.quickReplyShow = false;        //隐藏快速回复
        }else{
            this.$message({
                message:'发送消息不可空',
                type: 'error'
            });
            this.inputWords = "";
            return false;
        }
    },
    /**
     替换空格、去除换行
     wdd
    **/
    wordReplace(words) { 
        let newWords;
        
        if (words ){
    	   	newWords = words.replace(/<\/?.+?>/g,""); 
	        newWords = words.replace(/[\r\n]/g, ""); 
	        newWords = words.replace(/\s+/g, "");
	        
        }
      return newWords;
       
    },
    /**
     *生成唯一随机数  
     *  wdd
    **/
    GenNonDuplicateID(){
      return Math.random().toString(16)
    },
    /**
   	 *  图片上传成功，上传成功需要将对应的保存对应的消息，并且添加图片
     * 	wdd
    **/
    handleAvatarSuccess(res, file) {
    	if (res != '' && res.code == '100'){
      		//发送消息
    		  this.socket.emit('message', {
                   userid: this.userId,
                   shopid:this.shopId,
                   message:res.data,
                   username:this.username,
                   sendway:"userway",
                   msgtype:'image',
                   headurl:this.headurl
	               });
      	      
      	      
      	      this.inputWords=res.data;
      	      this.msgType = 'image'
      	      this.inputWords = res.data;
      	      this.submitNews();
    	}
    	
    	
		console.log(res,"---file----");
    }
  },
  //从页面获取对应的参数，开始的时候，我们需要加载用户对应的所有的消息，已经将对应的添加对应的url的页面
  created(){
		this.messageProduct.product_name=this.$route.query.productName;
	  	this.messageProduct.product_imgurl=this.$route.query.productImg;
	  	this.messageProduct.product_price=this.$route.query.productPrice;
	  	this.messageProduct.product_action=this.$route.query.productLink;
	  	//console.log(this.messageProduct.product_name,'--',this.messageProduct.product_name==undefined);
	  	//console.log(this.messageProduct.product_imgurl,'--',this.messageProduct.product_imgurl==undefined);
	  	if(this.messageProduct.product_name==undefined||this.messageProduct.product_imgurl==undefined){
	  		this.messageProduct.msgtype = '';
	  	}
	  	this.weiuserId =this.$route.query.userId;
	  	this.shopId = this.$route.query.shopId;
	  	this.shopName = this.$route.query.shopName;
	  	this.shopLogo = this.$route.query.shopLog;
	  	this.username =this.$route.query.username;
	  	this.headurl=this.$route.query.headurl;

	  	this.sign = this.$route.query.sign;

		// setTimeout(()=>{
  //           this.setScrollTop(10000,document.getElementsByClassName('js-list-viewport')[0])
  //       },5000)
    
//	  	this.messageProduct.product_name="杂粮先生美味水果燕麦片600g 营养儿童麦片早餐 冲饮即食代餐粥"
//	  	this.messageProduct.product_imgurl='http://pics.sc.chinaz.com/files/pic/pic9/201712/zzpic8996.jpg';
//	  	this.messageProduct.product_price="0.01";
//	  	this.messageProduct.product_action="http://www.baidu.com";
//	  	this.shopUrl = "https://www.huisou.cn/shop/index/" + this.shopId;

//	  	this.username ='杰克逊';
//	  	this.headurl='https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=e9449e382d9759ee4a5067cd8ac0242b/94cad1c8a786c9179e80a80cc23d70cf3bc75700.jpg';
	  	//加载房间的人
		
        this.socket.on('connect',(res)=>{
            console.log("user send connect---------");
            if (res =='connected'){
                console.log("user connect shopId=",this.weiuserId,';userid=',this.userId);
                this.socket.emit('userJoin', {shopId:this.shopId,userId:this.weiuserId,joinWay:'weixin'});
            }
        }),
        //替换用户的id
        this.socket.on('changeId',(res)=>{
        	if (res){
        		this.userId = res;
			    this.loadHistory();
				this.msg_items.push(this.messageProduct)
			       	//线上地址
			  	this.shopUrl = interUrl+"/shop/index/" + this.shopId;
				//this.shopUrl = "https://hsshop.huisou.cn/shop/index/" + this.shopId;
				this.uploadData.shopId = this.shopId;
				this.uploadData.userId = this.userId;      
        	}
        }),

        this.socket.on('message',(res)=>{
            if (res != '' || res != null || res.createtime != '' || res.createtime != null){
                var a= new Date(res.createtime);
                var hour = a.getHours() > 9 ? a.getHours() : '0' + a.getHours();
                var minutes = a.getMinutes() > 9 ? a.getMinutes() : '0' + a.getMinutes();
                var seconds = a.getSeconds() > 9 ? a.getSeconds() : '0' + a.getSeconds();
                res.createtime = hour + ":" + minutes + ":" + seconds;
                this.msg_items.push(res);
                this.$nextTick(()=>{
                    var node = document.getElementsByClassName('im-list-viewport')[0];
                    if(node.clientHeight + node.scrollTop >= node.scrollHeight - 299){
                        node.scrollTop = node.scrollHeight;
                    }
                })
            }
        })

        this.socket.on('errPara',(res)=>{
            if (res == '102'){
                alert("非合法接入！");
            }
        })
       
                

        
        
   


  },
  mounted(){
  	let that = this;
    this.$nextTick(()=>{
        document.getElementsByTagName('title')[0].innerHTML ="在线客服";
        document.getElementsByClassName('js-list-viewport')[0].onscroll = function(){
            if(document.getElementsByClassName('js-list-viewport')[0].scrollTop <= 0){
               console.log("加载数据")
               that.loadHistory();
            }
        }
        setTimeout(function(){
            document.getElementsByClassName('js-list-viewport')[0].scrollTop = 10000;
        },500)
        // console.log(document.getElementsByClassName('dialogue-inner')[0].scrollTop)
        // console.log(document.getElementsByClassName('dialogue-inner')[0])
        // document.scrollTop = 10000;
        // document.documentElement.onscroll = function(){
        // }
    });
    
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import '../assets/scss/emoji-sprite.less';
    /*! PhotoSwipe main CSS by Dmitry Semenov | photoswipe.com | MIT license */
/*
    Styles for basic PhotoSwipe functionality (sliding area, open/close transitions)
*/
    /* pswp = photoswipe */
    .pswp {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      overflow: hidden;
      -ms-touch-action: none;
      touch-action: none;
      z-index: 1500;
      -webkit-text-size-adjust: 100%;
      /* create separate layer, to avoid paint on window.onscroll in webkit/blink */
      -webkit-backface-visibility: hidden;
      outline: none; }
      .pswp * {
        -webkit-box-sizing: border-box;
                box-sizing: border-box; }
      .pswp img {
        max-width: none; }

    /* style is added when JS option showHideOpacity is set to true */
    .pswp--animate_opacity {
      /* 0.001, because opacity:0 doesn't trigger Paint action, which causes lag at start of transition */
      opacity: 0.001;
      will-change: opacity;
      /* for open/close transition */
      -webkit-transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);
              transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1); }

    .pswp--open {
      display: block; }

    .pswp--zoom-allowed .pswp__img {
      /* autoprefixer: off */
      cursor: -webkit-zoom-in;
      cursor: -moz-zoom-in;
      cursor: zoom-in; }

    .pswp--zoomed-in .pswp__img {
      /* autoprefixer: off */
      cursor: -webkit-grab;
      cursor: -moz-grab;
      cursor: grab; }

    .pswp--dragging .pswp__img {
      /* autoprefixer: off */
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
      cursor: grabbing; }

    /*
        Background is added as a separate element.
        As animating opacity is much faster than animating rgba() background-color.
    */
    .pswp__bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0;
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      -webkit-backface-visibility: hidden;
      will-change: opacity; }

    .pswp__scroll-wrap {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden; }

    .pswp__container,
    .pswp__zoom-wrap {
      -ms-touch-action: none;
      touch-action: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0; }

    /* Prevent selection and tap highlights */
    .pswp__container,
    .pswp__img {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none; }

    .pswp__zoom-wrap {
      position: absolute;
      width: 100%;
      -webkit-transform-origin: left top;
      -ms-transform-origin: left top;
      transform-origin: left top;
      /* for open/close transition */
      -webkit-transition: -webkit-transform 333ms cubic-bezier(0.4, 0, 0.22, 1);
              transition: transform 333ms cubic-bezier(0.4, 0, 0.22, 1); }

    .pswp__bg {
      will-change: opacity;
      /* for open/close transition */
      -webkit-transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);
              transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1); }

    .pswp--animated-in .pswp__bg,
    .pswp--animated-in .pswp__zoom-wrap {
      -webkit-transition: none;
      transition: none; }

    .pswp__container,
    .pswp__zoom-wrap {
      -webkit-backface-visibility: hidden; }

    .pswp__item {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow: hidden; }

    .pswp__img {
      position: absolute;
      width: auto;
      height: auto;
      top: 0;
      left: 0; }

    /*
        stretched thumbnail or div placeholder element (see below)
        style is added to avoid flickering in webkit/blink when layers overlap
    */
    .pswp__img--placeholder {
      -webkit-backface-visibility: hidden; }

    /*
        div element that matches size of large image
        large image loads on top of it
    */
    .pswp__img--placeholder--blank {
      background: #222; }

    .pswp--ie .pswp__img {
      width: 100% !important;
      height: auto !important;
      left: 0;
      top: 0; }

    /*
        Error message appears when image is not loaded
        (JS option errorMsg controls markup)
    */
    .pswp__error-msg {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      text-align: center;
      font-size: 14px;
      line-height: 16px;
      margin-top: -8px;
      color: #CCC; }

    .pswp__error-msg a {
      color: #CCC;
      text-decoration: underline; }

    .el-upload{width:100%;height:100%;}
    .el-upload__input{width:100%;height:100%;}
    .btn, .fixed-icon, dd, div, dt, li, span {
        cursor: pointer;
    }
    .btn, .btn-block, .copyright, .footer, .fullscreen-guide {
        text-align: center;
    }
    .btn {
        display: inline-block;
        border-radius: 3px;
        padding: 5px 4px;
        margin: 0;
        font-size: 12px;
        line-height: 1.5;
        -webkit-appearance: none;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        color: #999;
    }
    .btn-green {
        color: #fff;
        background-color: #06bf04;
        border-color: #03b401;
    }
    .btn-xsmall, .btn-xxsmall {
        line-height: 14px;
        width: auto;
        font-size: 12px;
    }
    .goods-card .btn-xxsmall {
        position: absolute;
        right: 9px;
        bottom: 9px;
        padding: 2px 10px;
    }
    * {
    -webkit-tap-highlight-color:transparent
}
html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video {
    margin:0;
    padding:0;
    border:0;
    font:inherit;
    font-size:100%;
    vertical-align:baseline
}
html {
    line-height:1
}
ol,ul {
    list-style:none
}
table {
    border-collapse:collapse;
    border-spacing:0
}
caption,th,td {
    font-weight:normal;
    vertical-align:middle
}
q,blockquote {
    quotes:none
}
q:before,q:after,blockquote:before,blockquote:after {
    content:"";
    content:none
}
a img {
    border:none
}
article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section,summary {
    display:block
}
html {
    -ms-text-size-adjust:100%;
    -webkit-text-size-adjust:100%;
    font-family:Arial,Helvetica,"STHeiti STXihei","Microsoft YaHei",Tohoma
}
body {
    color:#333;
    background-color:#f8f8f8;
    -webkit-backface-visibility:hidden
}
body.body-fixed-bottom {
    padding-bottom:50px
}
.container {
    background-color:#f8f8f8
}
strong {
    font-weight:bold
}
a {
    color:#333;
    background:transparent;
    text-decoration:none
}
h1 {
    font-size:2em;
    margin:0.67em 0
}
h2 {
    font-size:18px;
    line-height:22px
}
h3 {
    font-size:15px;
    line-height:18px
}
button,[type='number'],[type='text'],[type='password'],[type='email'],[type='search'],select,textarea {
    font-family:inherit;
    font-size:100%;
    margin:0;
    -webkit-appearance:none;
    -moz-appearance:none
}
div,span,li,dt,dd {
    cursor:pointer
}
.js_react_root{height:100%;}
.imapp{height:100%;}
.bg-pic {
    display:inline-block;
    width:45px;
    height:45px;
    overflow:hidden
}
.bg-pic.border-bg-pic {
    border:1px solid #d9d9d9
}
.bg-pic.dashed-border-pic {
    border:2px dashed #d9d9d9;
    width:43px;
    height:43px
}
.bg-pic.circle-bg-pic {
    border-radius:50%
}
.bg-pic.circle-bg-pic .bg-pic-content {
    border-radius:50%
}
.bg-pic.square-bg-pic {
    border-radius:0
}
.bg-pic .bg-pic-content {
    background-size:cover;
    width:100%;
    height:100%;
    background-position:center center
}
.separator-line {
    display:inline-block;
    width:1px;
    height:24px;
    background-color:#dcdcdc
}
.circle-count {
    display:inline-block;
    min-width:14px;
    min-height:14px;
    font-size:12px;
    line-height:14px;
    border-radius:10px;
    padding:2px;
    background-color:#f60;
    text-align:center;
    font-family:"Arial" Sans-serif
}
.circle-count i {
    color:#fff;
    display:inline-block;
    -webkit-transform:scale(0.83);
    -moz-transform:scale(0.83);
    -ms-transform:scale(0.83);
    transform:scale(0.83)
}
.send-state {
    display:block;
    width:32px;
    height:32px
}
.send-state.send-state-0 {
    text-indent:-99999px;
    background:transparent  url("../../static/images/ico_loading@1x.gif") center center no-repeat
}
.send-state.send-state-1 {
    display:none
}
.send-state.send-state-2 {
    cursor:pointer;
    text-indent:-99999px;
    background:transparent  url("../../static/images/ico_resend@1x.png") center center no-repeat
}
@media only screen and (-webkit-min-device-pixel-ratio:1.5),only screen and (min--moz-device-pixel-ratio:1.5),only screen and (min-device-pixel-ratio:1.5) {
    .send-state.send-state-0 {
    background-image:url("../../static/images/ico_loading@2x.gif");
    background-size:16px 16px
}
.send-state.send-state-2 {
    background-image:url("../../static/images/ico_resend@2x.png");
    background-size:16px 16px
}
}.yoader,.yoader-inner {
    width:180px;
    height:110px
}
.yoader {
    padding-left:30px;
    margin:0 auto
}
.yoader-inner {
    position:relative
}
.yoader-inner>div {
    position:relative;
    -webkit-box-sizing:content-box;
    -moz-box-sizing:content-box;
    box-sizing:content-box;
    color:#666;
    background:#666;
    border-color:#666;
    border-style:solid;
    border-width:0
}
.yoader:after {
    display:table;
    clear:both;
    line-height:0;
    content:""
}
.yoader-inner>div:nth-child(1) {
    position:absolute;
    bottom:32%;
    left:18%;
    float:left;
    width:56px;
    height:56px;
    border-radius:100%;
    background:transparent  url("../../static/images/yoder@1x.png") center center no-repeat;
    background-image:-webkit-image-set( url("../../static/images/yoder@1x.png") 1x,url("../../static/images/yoder@2x.png") 2x);
    -webkit-transform-origin:center bottom;
    -ms-transform-origin:center bottom;
    -moz-transform-origin:center bottom;
    transform-origin:center bottom;
    -webkit-animation:ball-climbing-dot-jump .6s ease-in-out infinite;
    -moz-animation:ball-climbing-dot-jump .6s ease-in-out infinite;
    animation:ball-climbing-dot-jump .6s ease-in-out infinite
}
.yoader-inner>div:not(:nth-child(1)) {
    position:absolute;
    top:0;
    right:0;
    float:left;
    width:56px;
    height:8px;
    border-radius:0;
    -webkit-transform:translate(60%,0);
    -ms-transform:translate(60%,0);
    -moz-transform:translate(60%,0);
    transform:translate(60%,0);
    -webkit-animation:ball-climbing-dot-steps 1.8s linear infinite;
    -moz-animation:ball-climbing-dot-steps 1.8s linear infinite;
    animation:ball-climbing-dot-steps 1.8s linear infinite
}
.yoader-inner>div:not(:nth-child(1)):nth-child(2) {
    -webkit-animation-delay:0ms;
    -moz-animation-delay:0ms;
    animation-delay:0ms
}
.yoader-inner>div:not(:nth-child(1)):nth-child(3) {
    -webkit-animation-delay:-600ms;
    -moz-animation-delay:-600ms;
    animation-delay:-600ms
}
.yoader-inner>div:not(:nth-child(1)):nth-child(4) {
    -webkit-animation-delay:-1200ms;
    -moz-animation-delay:-1200ms;
    animation-delay:-1200ms
}
@-webkit-keyframes ball-climbing-dot-jump {
    0% {
    -webkit-transform:scale(1,0.7);
    transform:scale(1,0.7)
}
20% {
    -webkit-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
40% {
    -webkit-transform:scale(1,1);
    transform:scale(1,1)
}
50% {
    bottom:125%
}
46% {
    -webkit-transform:scale(1,1);
    transform:scale(1,1)
}
80% {
    -webkit-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
90% {
    -webkit-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
100% {
    -webkit-transform:scale(1,0.7);
    transform:scale(1,0.7)
}
}@-moz-keyframes ball-climbing-dot-jump {
    0% {
    -webkit-transform:scale(1,0.7);
    -moz-transform:scale(1,0.7);
    transform:scale(1,0.7)
}
20% {
    -webkit-transform:scale(0.7,1.2);
    -moz-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
40% {
    -webkit-transform:scale(1,1);
    -moz-transform:scale(1,1);
    transform:scale(1,1)
}
50% {
    bottom:125%
}
46% {
    -webkit-transform:scale(1,1);
    -moz-transform:scale(1,1);
    transform:scale(1,1)
}
80% {
    -webkit-transform:scale(0.7,1.2);
    -moz-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
90% {
    -webkit-transform:scale(0.7,1.2);
    -moz-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
100% {
    -webkit-transform:scale(1,0.7);
    -moz-transform:scale(1,0.7);
    transform:scale(1,0.7)
}
}@keyframes ball-climbing-dot-jump {
    0% {
    -webkit-transform:scale(1,0.7);
    -moz-transform:scale(1,0.7);
    transform:scale(1,0.7)
}
20% {
    -webkit-transform:scale(0.7,1.2);
    -moz-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
40% {
    -webkit-transform:scale(1,1);
    -moz-transform:scale(1,1);
    transform:scale(1,1)
}
50% {
    bottom:125%
}
46% {
    -webkit-transform:scale(1,1);
    -moz-transform:scale(1,1);
    transform:scale(1,1)
}
80% {
    -webkit-transform:scale(0.7,1.2);
    -moz-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
90% {
    -webkit-transform:scale(0.7,1.2);
    -moz-transform:scale(0.7,1.2);
    transform:scale(0.7,1.2)
}
100% {
    -webkit-transform:scale(1,0.7);
    -moz-transform:scale(1,0.7);
    transform:scale(1,0.7)
}
}@-webkit-keyframes ball-climbing-dot-steps {
    0% {
    top:0;
    right:0;
    opacity:0;
    filter:alpha(opacity=0)
}
50% {
    opacity:1;
    filter:alpha(opacity=100)
}
100% {
    top:100%;
    right:100%;
    opacity:0;
    filter:alpha(opacity=0)
}
}@-moz-keyframes ball-climbing-dot-steps {
    0% {
    top:0;
    right:0;
    opacity:0;
    filter:alpha(opacity=0)
}
50% {
    opacity:1;
    filter:alpha(opacity=100)
}
100% {
    top:100%;
    right:100%;
    opacity:0;
    filter:alpha(opacity=0)
}
}@keyframes ball-climbing-dot-steps {
    0% {
    top:0;
    right:0;
    opacity:0;
    filter:alpha(opacity=0)
}
50% {
    opacity:1;
    filter:alpha(opacity=100)
}
100% {
    top:100%;
    right:100%;
    opacity:0;
    filter:alpha(opacity=0)
}
}.loading-more {
    width:150px;
    text-align:center;
    margin:0 auto
}
.loading-more>span,.loading-more::before,.loading-more::after {
    content:' ';
    width:10px;
    height:10px;
    margin:0 2px;
    background-color:#06bf04;
    border-radius:100%;
    display:inline-block;
    -webkit-animation:bouncedelay 1s infinite ease-in-out;
    -moz-animation:bouncedelay 1s infinite ease-in-out;
    animation:bouncedelay 1s infinite ease-in-out;
    -webkit-animation-fill-mode:both;
    -moz-animation-fill-mode:both;
    animation-fill-mode:both
}
.loading-more::before {
    -webkit-animation-delay:-0.32s;
    -moz-animation-delay:-0.32s;
    animation-delay:-0.32s
}
.loading-more>span {
    -webkit-animation-delay:-0.16s;
    -moz-animation-delay:-0.16s;
    animation-delay:-0.16s
}
@-webkit-keyframes bouncedelay {
    0%,80%,100% {
    -webkit-transform:scale(0.4)
}
40% {
    -webkit-transform:scale(1)
}
}@-moz-keyframes bouncedelay {
    0%,80%,100% {
    -moz-transform:scale(0.4);
    transform:scale(0.4);
    -webkit-transform:scale(0.4)
}
40% {
    -moz-transform:scale(1);
    transform:scale(1);
    -webkit-transform:scale(1)
}
}@keyframes bouncedelay {
    0%,80%,100% {
    -moz-transform:scale(0.4);
    transform:scale(0.4);
    -webkit-transform:scale(0.4)
}
40% {
    -moz-transform:scale(1);
    transform:scale(1);
    -webkit-transform:scale(1)
}
}.tag {
    display:inline-block;
    background-color:transparent;
    border:1px solid #e5e5e5;
    border-radius:3px;
    text-align:center;
    margin:0;
    color:#999;
    font-size:12px;
    line-height:12px;
    padding:4px
}
.tag-big {
    font-size:14px;
    line-height:18px
}
.tag.tag-green {
    color:#06bf04;
    border-color:#0c3
}
.tag.tag-orange {
    color:#f60;
    border-color:#f60
}
.tag.tag-orangef60 {
    color:#f60;
    border-color:#f60
}
.tag.tag-white {
    color:#333;
    border-color:#bbb
}
.tag.tag-blue {
    color:#38f;
    border-color:#38f
}
.tag.tag-red {
    color:#ed5050;
    border-color:#ed5050
}
.tag.tag-pink {
    color:#ee614b;
    border-color:#ee614b
}
.tag.disabled {
    background-color:#ddd !important;
    background-image:none !important;
    border:1px solid transparent !important;
    color:#fff !important
}
.btn-1-1,.btn-2-1,.btn-3-1 {
    display:inline-block;
    padding:0 3px;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box
}
.btn-1-1 .tag,.btn-1-1 .btn,.btn-2-1 .tag,.btn-2-1 .btn,.btn-3-1 .tag,.btn-3-1 .btn {
    width:100%;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box
}
.btn-1-1 {
    width:100%;
    padding-left:0
}
.btn-1-1 .tag,.btn-1-1 .btn {
    width:50% !important
}
.btn-2-1 {
    width:49.5%
}
.btn-3-1 {
    width:33.3%
}
.action-container {
    padding:0 10px;
    text-align:center;
    margin-top:20px;
    margin-bottom:20px;
    font-size:0
}
.action-container>div {
    margin-bottom:0
}
.action-container>div:last-child {
    margin-bottom:0
}
.action-container>button,.action-container>.btn {
    margin-bottom:10px
}
.action-container>button:last-child,.action-container>.btn:last-child {
    margin-bottom:0
}
.wrapper-form .form-item {
    position:relative;
    margin-top:10px
}
.wrapper-form .form-item label {
    position:absolute;
    top:1px;
    left:10px;
    line-height:45px;
    z-index:1;
    color:#666
}
.wrapper-form .form-item textarea,.wrapper-form .form-item input {
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    width:100%;
    line-height:18px;
    padding:12px 10px 12px 68px;
    border:1px solid #ddd;
    border-radius:5px;
    font-size:14px;
    outline:none;
    opacity:1;
    -webkit-appearance:none
}
.wrapper-form .form-item input[disabled='disabled'] {
    background:#f8f8f8
}
.wrapper-form .form-item:first-child {
    margin-top:0
}
.btn-1-1,.btn-2-1,.btn-3-1 {
    display:inline-block;
    padding:0 3px;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box
}
.btn-1-1 .tag,.btn-1-1 .btn,.btn-2-1 .tag,.btn-2-1 .btn,.btn-3-1 .tag,.btn-3-1 .btn {
    width:100%;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box
}
.btn-1-1 {
    width:100%;
    padding-left:0
}
.btn-1-1 .tag,.btn-1-1 .btn {
    width:50% !important
}
.btn-2-1 {
    width:49.5%
}
.btn-3-1 {
    width:33.3%
}
.action-container {
    padding:0 10px;
    text-align:center;
    margin-top:20px;
    margin-bottom:20px;
    font-size:0
}
.action-container>div {
    margin-bottom:0
}
.action-container>div:last-child {
    margin-bottom:0
}
.action-container>button,.action-container>.btn {
    margin-bottom:10px
}
.action-container>button:last-child,.action-container>.btn:last-child {
    margin-bottom:0
}
.popout-box .header {
    position:relative;
    margin-bottom:10px;
    -webkit-border-image:url("../../static/images/border-line-2.png") 2 stretch;
    -moz-border-image:url("../../static/images/border-line-2.png") 2 stretch;
    border-image:url("../../static/images/border-line-2.png") 2 stretch;
    border-bottom:2px solid #e5e5e5
}
@media only screen and (-webkit-min-device-pixel-ratio:1.5),only screen and (min--moz-device-pixel-ratio:1.5),only screen and (min-device-pixel-ratio:1.5) {
    .popout-box .header {
    border-bottom-width:1px
}
}.popout-box .header h2 {
    margin-bottom:16px;
    line-height:16px;
    font-size:16px
}
.popout-box .action-container {
    margin:10px 0 0 0;
    padding:0
}
.popout-box .action-container .btn.btn-block {
    font-size:14px
}
.popout-login .wrapper-form {
    padding-top:10px
}
.popout-login .wrapper-form .verify-image {
    position:absolute;
    right:0px;
    top:7px;
    width:80px;
    height:30px
}
.popout-login .wrapper-form .btn-auth-code {
    position:absolute;
    right:0;
    top:0;
    width:80px;
    padding:15px 4px;
    border-radius:5px
}
.popout-login .wrapper-form .txt-cover {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    opacity:0
}
.popout-login .wrapper-form .txt-cover-half {
    right:90px
}
.popout-login .wrapper-form .error {
    margin-top:10px;
    word-break:break-word
}
.popout-login .bottom-tips {
    padding-top:16px;
    font-size:0
}
.popout-login .bottom-tips .inline-item {
    padding:0 10px;
    border-right:1px solid #e5e5e5;
    font-size:12px
}
.popout-login .bottom-tips .inline-item:last-child {
    padding-right:0px;
    border-right:0px none
}
.popout-quick-login {
    margin:5px;
    position:relative
}
.popout-quick-login .close-btn {
    position:absolute;
    top:-52px;
    right:-22px;
    display:inline-block;
    width:20px;
    height:33px;
    background-image:url("../../static/images/quick_login_clo_btn.png");
    background-repeat:no-repeat;
    background-position:center center;
    background-size:20px 33px
}
@media only screen and (-webkit-min-device-pixel-ratio:1.5),only screen and (min--moz-device-pixel-ratio:1.5),only screen and (min-device-pixel-ratio:1.5) {
    .popout-quick-login .close-btn {
    background-image:url("../../static/images/quick_login_clo_btn@2x.png")
}
}.popout-quick-login .wrapper-form {
    padding-top:15px
}
.popout-quick-login .wrapper-form .form-item input {
    border-radius:2px;
    padding-left:10px
}
.popout-quick-login .wrapper-form .form-item.verify-image-wrap {
    border:1px solid #ddd;
    border-radius:2px
}
.popout-quick-login .wrapper-form .form-item.verify-image-wrap input {
    border:0
}
.popout-quick-login .wrapper-form .verify-image {
    position:absolute;
    right:2px;
    top:2px;
    width:86px;
    height:38px
}
.popout-quick-login .wrapper-form .btn-auth-code {
    position:absolute;
    right:0;
    top:0;
    width:88px;
    padding:15px 4px;
    border-radius:2px
}
.popout-quick-login .wrapper-form .txt-cover {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    opacity:0
}
.popout-quick-login .wrapper-form .txt-cover-half {
    right:90px
}
.popout-quick-login .wrapper-form .error {
    margin-top:10px;
    word-break:break-word
}
.popout-quick-login .action-container button {
    border-radius:2px
}
.popout-quick-login .bottom-tips {
    padding-top:16px;
    font-size:0
}
.popout-quick-login .bottom-tips .inline-item {
    padding:0 10px;
    border-right:1px solid #e5e5e5;
    font-size:12px
}
.popout-quick-login .bottom-tips .inline-item:last-child {
    padding-right:0px;
    border-right:0px none
}
html,body {
    height:100%;
    font-family:"STHeiti STXihei","Microsoft JhengHei","Microsoft YaHei",Tohoma,Arial
}
body {
    width:100vw;
    background-color:#ebebeb
}
body.im-history {
    background-color:#fff
}
body.platform-unknown.im-for-fx {
    max-width:1024px;
    margin:0 auto;
    background:#222
}
body.platform-unknown.im-for-fx .container {
    background-color:#fff
}
img {
    width:auto;
    height:auto;
    max-width:100%;
    max-height:100%
}
img.emoji {
    width:20px;
    height:20px;
    vertical-align:middle
}
img.face-item {
    width:24px;
    height:24px;
    vertical-align:middle
}
.container {
    height:100%;
    width:100%;
    background-color:transparent
}
.app-container .yoader {
    position:absolute;
    top:50%;
    left:50%;
    margin-top:-35px;
    margin-left:-105px
}
.clearfix {
    zoom:1
}
.clearfix:after {
    content:'';
    display:table;
    clear:both
}
a.block-link {
    display:block
}
a.block-link.card-info {
    background-color:#fff;
    padding:10px;
    border-radius:6px
}
a.block-link.card-info .card-title {
    font-size:14px;
    line-height:16px;
    color:#000;
    margin-bottom:5px;
    max-height:32px;
    overflow:hidden
}
a.block-link.card-info .card-info-cont {
    position:relative;
    min-height:60px
}
a.block-link.card-info .bg-pic {
    position:absolute;
    width:60px;
    height:60px;
    top:0;
    left:0
}
a.block-link.card-info .card-desc {
    color:#707070;
    font-size:12px;
    padding-left:65px
}
.ico-history {
    display:inline-block;
    width:40px;
    height:40px;
    text-indent:-9999px;
    background:transparent  url("../../static/images/ico_history@1x.png") center center no-repeat
}
.ico-left-arrow {
    display:inline-block;
    width:40px;
    height:40px;
    text-indent:-9999px;
    background:transparent  url("../../static/images/ico_left_arrow@1x.png") center center no-repeat
}
.unread-dot {
    text-indent:-9999px;
    background:#f60;
    border-radius:50%;
    display:inline-block;
    width:8px;
    height:8px
}
.unread-dot:empty {
    display:none
}
.app-container,.wap-im-talk,.wap-im-history {
    position:relative;
    height:100%
}
.navbar {
    position:absolute;
    top:0;
    left:0;
    z-index:10;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    width:100%;
    height:41px;
    border-bottom:1px solid #dcdcdc;
    background-color:#fff
}
.navbar .navbar-inner {
    padding:7px 110px 7px 7px;
    position:relative
}
.navbar .shop-info figure,.navbar .shop-info span {
    vertical-align:middle
}
.navbar .shop-info figure {
    position:absolute;
    top:0;
    left:0;
    width:24px;
    height:24px
}
.navbar .shop-info span {
    display:inline-block;
    line-height:26px;
    max-width:90%;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden
}
.navbar .homepage-link {
    position:relative;
    display:block;
    color:#666;
    padding-left:32px;
    line-height:26px;
    height:26px
}
.navbar .ico-right-arrow {
    display:inline-block;
    background:transparent  url("../../static/images/ico_right_arrow@1x.png") center center no-repeat;
    width:16px;
    height:26px;
    position:absolute
}
.navbar .navbar-title {
    padding:10px 60px;
    text-align:center
}
.navbar .ico-history {
    position:relative
}
.navbar .ico-history .unread-dot {
    position:absolute;
    top:6px;
    left:22px
}
.navbar .ico-history+.close-im {
    margin-right:0
}
.navbar .left-opt {
    position:absolute;
    top:0;
    left:0
}
.navbar .right-opt {
    position:absolute;
    top:0;
    right:0;
    height:40px;
    font-size:14px;
    line-height:20px
}
.navbar .right-opt>a,.navbar .right-opt>span {
    display:inline-block;
    vertical-align:middle
}
.navbar .right-opt .separator-line {
    height:20px;
    margin:0 5px
}
.navbar .right-opt .close-im {
    width:40px;
    height:40px;
    color:#fff;
    text-indent:-9999px;
    background:#dcdcdc  url("../../static/images/ico_close@1x.png") center center no-repeat
}
.notice-phone,.notice-rc {
    display:none;
    font-size:12px;
    line-height:16px;
    background-color:#ffffcd;
    position:absolute;
    top:40px;
    z-index:10;
    width:100%
}
.notice-inner {
    padding:5px;
    color:#ee9c1f;
    border:1px solid #fdeeb2;
    position:relative
}
.notice-ani {
    display:block;
    visibility:hidden;
    -webkit-transition:opacity .5s,visibility .5s;
    -moz-transition:opacity .5s,visibility .5s;
    transition:opacity .5s,visibility .5s;
    opacity:0;
    height:0;
    padding:0
}
.notice-fadein {
    visibility:visible;
    opacity:1;
    height:auto
}
.notice-fadeout {
    visibility:hidden;
    opacity:0;
    height:auto
}
.im-list-viewport {
    display:block;
    min-width:300px;
    height:100%;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    overflow:auto;
    overflow-x:hidden;
    padding-top:41px;
    -webkit-overflow-scrolling:touch
}
.dialogue {
    padding-bottom:45px
}
.dialogue.open-emoticon {
    padding-bottom:175px
}
.dialogue .loading-more {
    margin-top:10px;
    margin-bottom:10px
}
.unlogin-notice {
    text-align:center;
    padding:10px 0;
    color:#222
}
.unlogin-notice>span {
    background-color:#cccdcf;
    border-radius:3px;
    display:inline-block;
    padding:5px 8px;
    font-size:14px
}
.unlogin-notice>span a {
    text-decoration:underline;
    color:#33a8f5
}
.goods-card {
    position:relative;
    border:1px solid #dcdcdc;
    background-color:#fff;
    border-radius:3px;
    margin:10px 10px 15px;
    padding:9px 9px 9px 80px;
    min-height:60px
}
.goods-card .bg-pic {
    position:absolute;
    top:10px;
    left:10px;
    width:60px;
    height:60px
}
.goods-card .goods-title {
    font-size:14px;
    line-height:18px;
    max-height:36px;
    overflow:hidden;
    margin-bottom:5px
}
.goods-card .goods-price {
    font-size:15px;
    line-height:20px;
    color:#f60
}
.goods-card .btn-xxsmall {
    position:absolute;
    right:9px;
    bottom:9px;
    padding:2px 10px
}
.list-finished {
    font-size:12px;
    text-align:center;
    color:#666;
    margin:15px 0
}
.message-list {
    padding:5px;
    min-width:290px
}
.message-list .message-item {
    zoom:1;
    margin-bottom:15px;
    -webkit-tap-highlight-color:transparent
}
.message-list .message-item:after {
    content:'';
    display:table;
    clear:both
}
.message-list .message-item.in .avatar {
    float:left
}
.message-list .message-item.in .message-meta {
    padding-left:60px
}
.message-list .message-item.in .message-meta .nickname {
    float:left
}
.message-list .message-item.in .message-body {
    float:left;
    margin-left:12px
}
.message-list .message-item.in .message-body::before {
    content:' ';
    position:absolute;
    top:12px;
    left:-8px;
    width:9px;
    height:15px;
    z-index:2;
    background:transparent  url("../../static/images/message_border_in@1x.png") center center no-repeat
}
.message-list .message-item.in .message-content {
    background-color:#fcfcfc;
    border-color:#dcdcdc
}
.message-list .message-item.out .send-state {
    position:absolute;
    top:0;
    left:-32px
}
.message-list .message-item.out .avatar {
    float:right
}
.message-list .message-item.out .message-meta {
    padding-right:60px;
    text-align:right
}
.message-list .message-item.out .message-meta .nickname {
    float:right
}
.message-list .message-item.out .message-body {
    float:right;
    margin-right:12px
}
.message-list .message-item.out .message-body::before {
    content:' ';
    position:absolute;
    top:12px;
    right:-8px;
    width:9px;
    height:15px;
    z-index:2;
    background:transparent  url("../../static/images/message_border_out@1x.png") center center no-repeat
}
.message-list .message-item.out .message-content {
    background-color:#a2e65b;
    border-color:#94ce5d
}
.message-list .message-item.image .message-content {
    padding:6px
}
.message-list .message-item.card {
    -webkit-tap-highlight-color:rgba(0,0,0,0.4)
}
.message-list .message-item.card .message-content {
    padding:2px;
    width:200px
}
.message-list .message-item.link .link-wrapper {
    word-wrap:break-word;
    font-size:14px
}
.message-list .message-item.link .link-wrapper>a {
    color:#06f
}
.message-list .message-meta {
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    font-size:14px;
    line-height:22px;
    zoom:1
}
.message-list .message-meta:after {
    content:'';
    display:table;
    clear:both
}
.message-list .message-meta .nickname {
    color:#666
}
.message-list .message-time {
    text-align:center;
    font-size:12px;
    line-height:14px;
    margin-bottom:5px;
    color:#999
}
.message-list .message-time>span {
    padding:3px 8px;
    background-color:#cccdcf;
    display:inline-block;
    border-radius:3px;
    min-width:60px;
    color:#fff
}
.message-list .message-time a {
    color:#00a0f8
}
.message-list .avatar .bg-pic {
    width:40px;
    height:40px;
    -webkit-box-shadow:0 0 1px rgba(0,0,0,0.1);
    box-shadow:0 0 1px rgba(0,0,0,0.1)
}
.message-list .message-body {
    position:relative;
    width:auto;
    min-width:50px;
    max-width:260px;
    margin-bottom:7px
}
.message-list .message-content {
    position:relative;
    color:#222;
    padding:11px;
    border:1px solid #dcdcdc;
    border-radius:8px;
    min-height:16px
}
.message-list pre {
    font-size:14px;
    line-height:1.2em;
    white-space:pre-wrap;
    word-break:normal;
    word-wrap:break-word
}
.multicard .message-body::before {
    content:none !important
}
.multicard .message-body .message-content {
    border-radius:5px !important
}
.multicard .card-title {
    margin-bottom:10px;
    font-size:14px;
    line-height:1.4
}
.multicard .card-info-cont {
    position:relative;
    margin-bottom:5px;
    font-size:0
}
.multicard .card-info-cont .bg-pic {
    width:100%;
    height:100px
}
.multicard .card-info-cont .bg-pic-content {
    display:block
}
.multicard .card-info-cont .desc {
    position:absolute;
    bottom:0;
    left:0;
    right:0;
    padding:0 5px;
    height:26px;
    line-height:26px;
    font-size:14px;
    color:#fff;
    background:#000;
    opacity:.75
}
.multicard .card-info-footer {
    margin:10px -10px 0;
    border-top:1px solid #ededed;
    padding:10px 10px 0
}
.multicard .card-info-footer .read-full {
    position:relative;
    display:block;
    font-size:14px
}
.multicard .card-info-footer .read-full em {
    position:absolute;
    right:0;
    color:#999
}
.inputer {
    position:absolute;
    bottom:0;
    left:0;
    z-index:10;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    width:100%;
    min-height:45px;
    border-top:1px solid #dcdcdc;
    background-color:#fff
}
.inputer.emoticon-actived .emoticon-container {
    display:block
}
.inputer input:focus,.inputer button:focus {
    outline:none
}
.inputer .inputer-action {
    position:relative;
    padding:7px 70px 7px 85px;
    font-size:0
}
.inputer .inputer-txt {
    width:100%;
    margin:0;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    border:1px solid #dcdcdc;
    border-radius:3px;
    padding:5px;
    height:30px;
    line-height:18px;
    font-size:14px;
    resize:none
}
.inputer .inputer-btn {
    position:absolute;
    top:7px;
    right:10px;
    border:0;
    padding:0;
    text-align:center;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    border-radius:4px;
    width:50px;
    height:30px;
    font-size:14px;
    line-height:20px;
    color:#fff;
    background-color:#06bf04;
    cursor:pointer
}
.inputer .inputer-icon {
    position:absolute;
    top:9px;
    width:26px;
    height:26px;
    padding:0;
    margin:0;
    border:0;
    cursor:pointer
}
.inputer .inputer-icon.inputer-emoticon {
    text-indent:-99999px;
    left:10px;
    background:transparent  url("../../static/images/ico_face@1x.png") center center no-repeat
}
.inputer .inputer-icon.inputer-image {
    left:45px;
    background:transparent  url("../../static/images/ico_image@1x.png") center center no-repeat
}
.inputer .emoticon-container {
    .
    border-top:1px solid #dcdcdc;
    padding:5px;
    -webkit-tap-highlight-color:transparent
}
.emoticon-list {
    height:120px;
    overflow:auto;
}
.emoticon-list>li {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    cursor:pointer;
    margin:5px 0;
    float:left;
    width:14.28%;
    height:30px;
    min-width:24px;
    padding:5px 0;
    text-align:center;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box
}
.inputer-image {
    overflow:hidden
}
.inputer-image .image-input {
    cursor:pointer;
    width:100%;
    height:100%;
    opacity:0
}
.image-wrapper {
    font-size:0;
    line-height:0;
    max-width:100px
}
.im-history-list {
    background-color:#fff
}
.im-history-list .loading-more {
    margin-top:10px
}
.im-history-list .talk-item {
    border-bottom:1px solid #d9d9d9
}
.im-history-list a.block-link {
    padding:10px 10px 10px 65px;
    position:relative;
    min-height:47px
}
.im-history-list .circle-count {
    position:absolute;
    top:5px;
    left:40px
}
.im-history-list .bg-pic {
    position:absolute;
    top:10px;
    left:10px
}
.im-history-list .last-time {
    position:absolute;
    top:10px;
    right:10px;
    font-size:12px;
    line-height:20px;
    color:#999
}
.im-history-list .shop-name {
    font-size:16px;
    line-height:20px;
    margin-bottom:5px;
    padding-right:50px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden
}
.im-history-list .last-message {
    color:#666;
    font-size:14px;
    line-height:22px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    word-break:break-all
}
.unlogin .unlogin-notice {
    margin:20px 0
}
.unlogin .btn-group {
    padding:0 10px
}
.unlogin .btn-group>.btn-block {
    margin-bottom:10px
}
.popout-kick p,.relogin-notice p {
    font-size:14px;
    line-height:1.5em;
    margin-bottom:20px;
    color:#999
}
.popout-kick p>span,.relogin-notice p>span {
    color:#333
}
.popout-kick .btn-group,.relogin-notice .btn-group {
    padding:0 10px
}
.popout-kick .btn-group .btn,.relogin-notice .btn-group .btn {
    margin:0 10px;
    padding:8px 15px
}
.relogin-notice p {
    font-size:16px
}
@media only screen and (-webkit-min-device-pixel-ratio:1.5),only screen and (min--moz-device-pixel-ratio:1.5),only screen and (min-device-pixel-ratio:1.5) {
    .message-list .message-item.out .message-body::before {
    background-image:url("../../static/images/message_border_out@2x.png");
    background-size:9px 15px
}
.message-list .message-item.in .message-body::before {
    background-image:url("../../static/images/message_border_in@2x.png");
    background-size:9px 15px
}
.inputer .inputer-icon.inputer-emoticon {
    background-image:url("../../static/images/ico_face@2x.png");
    background-size:25px 25px
}
.inputer .inputer-icon.inputer-image {
    background-image:url("../../static/images/ico_image@2x.png");
    background-size:25px 25px
}
.ico-history {
    background-image:url("../../static/images/ico_history@2x.png");
    background-size:32px 32px
}
.ico-left-arrow {
    background-image:url("../../static/images/ico_left_arrow@2x.png");
    background-size:20px 20px
}
.navbar .ico-right-arrow {
    background-image:url("../../static/images/ico_right_arrow@2x.png");
    background-size:7px 13px
}
.navbar .right-opt .close-im {
    background-image:url("../../static/images/ico_close@2x.png");
    background-size:12px 12px
}
}@media (max-width:320px) {
    .message-list .message-body {
    max-width:220px
}
}
.el-upload{
	height: 100%;
    width: 100%;
}
.el-upload__input {
    display: none;
    height: 100%;
    width: 100%;
}
</style>
