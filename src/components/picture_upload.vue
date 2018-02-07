<template>
	<div class="picture_upload">
		<el-dialog title="选择图片" :visible.sync="isshow_mask" @close="closeDialog">
			<!--手机用户-->
			<div v-if="isuser_wx_phone == 2">
				<div class="flex_start">
					<span class="local_picture_span">本地图片：</span>
					<el-upload
					  v-loading="loading"
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :on-progress="progress"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="imageUrl" :src="imageUrl.url" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>
				<div class="tip_words">仅支持gif、jpeg、png 3种格式, 大小不超过5.0 MB</div>
				<!--按钮-->
				<div slot="footer" class="dialog-footer" style="text-align: center;margin: 100px 0 0 0;">
					<el-button size="middle" disabled v-if="isShowButton" class="btn1">确 定</el-button>
				    <el-button size="middle" type="primary" v-else @click="uploadImg">确 定</el-button>
				</div>
			</div>
			<!--微信用户-->
			<div class="isuser_phone" v-if="isuser_wx_phone == 1">
				<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
				    <el-tab-pane label="我的图片" name="first">
				    	<!--<el-select v-model="value" size="small" placeholder="选择分组">
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>-->
						<div class="imgs_data">
							<ul class="flex_start">
								<li v-for="(item,index) in imgData" @click="selectImg(index)">
									<img :src="item.url" alt="" />
									<div class="img_size">{{item.size}}</div>
									<div class="img_info">
										<p>{{item.title}}</p>
									</div>
									<!--被选中的框-->
									<div class="attachment-selected" v-if="index == selectIndex">
										<i class="zenticon zenticon-check"></i>
									</div>
								</li>
							</ul>
						</div>
						<div class="block">
						    <el-pagination
						      @size-change="handleSizeChange"
						      @current-change="handleCurrentChange"
						      :current-page="currentPage4"
						      :page-sizes="[18,32,40]"
						      :page-size="16"
						      layout="total, sizes, prev, pager, next, jumper"
						      :total="totalImageNum">
						    </el-pagination>
	  					</div>
	  					<!--按钮-->
						<div class="default_btn">
							<el-button size="middle" disabled v-if="!isSelectBtn" @click="selectedImg" class="btn1">确 定</el-button>
							<el-button size="middle" type="primary" v-else>确 定</el-button>
						</div>
				    </el-tab-pane>
				    <el-tab-pane label="本地上传" name="second">
				    	<!--<el-form ref="form" :model="form" :inline="true" label-width="100px">
	  						<el-form-item label="网络图片：">
						    	<el-row>
						    		<el-col :span="14">
						    			<el-input placeholder="请添加网络图片地址" v-model="form.img_website"></el-input>
						    		</el-col>
						    		<el-col :span="1" :offset="2">
						    			<el-button @click="extract_img">提取</el-button>
						    		</el-col>
						    	</el-row>
				    		</el-form-item>
				    	</el-form>-->
						<div class="flex_start">
							<span class="local_picture_span">本地图片：</span>
							<el-upload
							  v-loading="loading"
							  class="avatar-uploader"
							  action="/list/file/uploadImage"
							  :show-file-list="false"
							  :data="uploadData"
							  :on-success="handleAvatarSuccess"
							  :on-progress="progress"
							  :before-upload="beforeAvatarUpload">
							  <img v-if="imageUrl" :src="imageUrl.url" class="avatar">
							  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</div>
						<div class="tip_words">仅支持gif、jpeg、png、jpg 这4种格式, 大小不超过10.0 MB</div>
						<!--按钮-->
						<div class="agree_btn">
							<el-button size="middle" disabled v-if="isShowButton" class="btn1">确 定</el-button>
						    <el-button size="middle" type="primary" v-else @click="uploadImg">确 定</el-button>
						</div>
				    </el-tab-pane>
				</el-tabs>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default({
		name : "picture_upload" ,
		props:["isshow_mask"],
		data(){
			return{
//      		dialogTableVisible: true,
				uploadData:{
					shopId:"",
					custId:"",
					userId:'',
					joinway:localStorage.joinWay,
					crm_token:localStorage.crm_token
				},
        		imageUrl: {
        			url:"",
        			mediaId:""
        		},
        		custId:'',
        		shopId:'',
        		pageSize:18,
        		totalImageNum:0,
        		loading: false,
        		isShowButton : true ,  //是否展示被禁用的按钮
        		isuser_wx_phone : 1, //   1=>微信用户   2=> 手机用户
        		activeName2: 'first',
        		options: [{
		          value: '1',
		          label: '第一组'
		        }, {
		          value: '2',
		          label: '第二组'
		        }, {
		          value: '3',
		          label: '第三组'
		        }, {
		          value: '4',
		          label: '第四组'
		        }, {
		          value: '5',
		          label: '第五组'
		        }],
		        value: '',
		        imgData:[
//		        	{
//		        		url:"https://img.yzcdn.cn//upload_files/2017/12/18/Fvtd8RvR0o83AcED_iRu7GaiGNr7.png?imageView2/2/w/240/h/240/q/75/format/png",
//		        		size:"668*999",
//		        		title:"1.png",
//		        		name : ""
//		        	}
		        ],
		        currentPage4: 1,
		        isSelectBtn : false,   //是否是禁止的按钮  还是默认的按钮
		        selectIndex : "-1" ,   //控制图片是否被选中
		        form: {
		        	img_website : ""    //图片网址
		        }
		        
			}
		},
		methods:{
	
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
	        progress(){
	        	this.loading = true 
        		this.isShowButton = true
	        },
	        handleAvatarSuccess(res, file) {
	        	if (res.code == '100'){
	        		console.log(res,"对象中的内容")
	        		this.imageUrl =res.data;
	        	}else{
	        		this.$message({
			          message: '图片上传失败',
			          type: 'warning'
			        });
	        	}
        		this.loading = false 
        		if(file.size){
        			this.isShowButton = false
        		}
        		
      		},
      		loadImageData(pageNum){
				if (pageNum == '' || pageNum == null){
					pageNum=1;
				}
				
				if (this.custId =='' || this.shopId == ''){
					this.$message.error('请打开cookie');
				}else{
					//用来加载对应的图片信息
					this.$axios.get("list/file/getImages",{params:{
						shopId: this.shopId,
						custId: this.custId,
						pageSize:this.pageSize,
						pageNum:pageNum,
						"crm_token":localStorage.crm_token
					}}).then((res)=>{
						if (res.data.code == '100'){
							this.imgData= res.data.data.content;
							this.totalImageNum=parseInt(res.data.data.totalElements);
						}
						
					})
				}
      		},
      		//点击确定上传图片
      		uploadImg(){
      			this.$emit('imgUploadUrl', this.imageUrl);
      			this.$emit('changeMask', false)
      		},
      		//tab切换
      		handleClick(tab, event) {
		        console.log(tab,"--")
		    },
		    handleSizeChange(val) {
        		this.pageSize = val;
     		},
     		//页数变化重新加载图片的数据
      		handleCurrentChange(val) {
        		this.loadImageData(val);
      		},
      		//关闭dialog
      		closeDialog(){
      			this.imageUrl={};
      			this.activeName2="first";
      			this.$emit('changeMask', false)
      		},
      		//选择图片
      		selectImg(index){
      			//控制图片是否被选中
      			if(this.selectIndex == index){
      				this.selectIndex = -1
      				return;
      			}
      			//告诉选中的图片
      			this.selectIndex = index
      		},
      		//选中图片
      		selectedImg(){
        		//如果选中图片，发送给客户，然后在页面中显示,如果当前用户是小程序的时候，选中后将图片
    			this.imageUrl.url=this.imgData[this.selectIndex].url;
    			this.imageUrl.mediaId = this.imgData[this.selectIndex].weixin_Media_id;
    			console.log("东方饭店1")
    			//如果是小程序，但是mediaId为空的时候，这个时候将对应的图片的消息放上传到微信的小程序，最后传送到前台中去
    			if (localStorage.joinWay == 'small' && !this.imageUrl.mediaId  ){
    				this.$axios.get("list/file/imageToWeiXin",{params:{
						crm_token:localStorage.crm_token,
						shopId:localStorage.shopId,
						imageUrl:this.imageUrl.url,
						userId:localStorage.serUserId
					}}).then((res)=>{
						console.log(res,"东方饭店2")
						if (res.data.code == "100"){
							this.imageUrl.mediaId = res.data.data;
							this.$emit('imgData', this.imageUrl);
						}
					})
    			}else{
    				console.log("东方饭店3")
    				this.$emit('imgData', this.imageUrl);
    			}
    			
    			//关闭窗口
	      			this.closeDialog();
    			
      		},
      		//点击提取
      		extract_img(){
      			console.log(this.form.img_website)
      			if(!this.form.img_website){
      				this.$message.error('请输入提取图片的地址');
      			}else{
      			
      			}
      		}
		},
//		created(){
//				//用来加载数据库的图片,提升速度
//					this.custId= this.getCookie("kefu_custId");
//					this.shopId= this.getCookie("kefu_shopId");
//					if (this.custId =='' || this.shopId == ''){
//						this.$message.error('请打开cookie');
//					}else{
//						//用来加载对应的图片信息
//						this.$axios.get("list/file/getImages",{params:{
//							shopId: this.shopId,
//							custId: this.custId
//						}}).then((res)=>{
//							console.log(res,"-----image的内容")
//							if (res.data.code == '100'){
//								this.imgData= res.data.data;
//							}
//							
//						})
//					}
//		},
		watch:{
			//监听是否打开，打开的话就加载对应的事件
			isshow_mask(n,o){
				if (n){
						//用来加载数据库的图片
					this.custId= localStorage.custId;
					this.shopId= localStorage.shopId;
					this.uploadData.custId=this.custId;
					this.uploadData.shopId=this.shopId;
					this.uploadData.userId=localStorage.serUserId;
					console.log(this.custId,this.shopId,"jsldfjsl")
					this.loadImageData(1);
				}
			},
			//控制按钮是否被禁止
			selectIndex(n,o){
				if(n == -1){
					this.isSelectBtn = false 
				}else{
					this.isSelectBtn = true
				}
			}
		}
	})
</script>
<style>
	.picture_upload .el-dialog{
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		margin: 0!important;
	}
	.picture_upload .el-dialog__title{
		font-size: 14px;
	}
	.picture_upload .el-dialog__header{
		border-bottom: 1px solid #e5e5e5;
		margin: 0 10px;
		padding: 15px 2px 10px;
	}
	.picture_upload .el-dialog__body{
		padding: 30px 15px 0;
	}
	.picture_upload #pane-first{
		text-align: right;
	}
	
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	}
	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	}
	.picture_upload .el-form--inline .el-form-item{
		width: 100%;
	}
	.picture_upload .el-form--inline .el-form-item__content{
		width: 70%;
	}
	.picture_upload .el-dialog{
		width: 740px;
		min-height: 654px;
		max-height: 760px;
		overflow: auto;
	}
</style>
<style scoped="scoped">
	/*上传图片样式*/
	.avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	}
	.local_picture_span{
		display: inline-block;
		height:148px;
		vertical-align: text-top;
		width: 90px;
	}
	.local_picture{
		padding: 30px 0;
	}
	.tip_words{
		padding: 30px 0px 0px 90px;
		font-size: 12px;
	}
	.imgs_data {
		padding: 15px 15px 0;
		height: 350px;
		overflow: auto;
	}
	.imgs_data ul{
		text-align: left;
		padding: 0!important;
		flex-wrap: wrap;
	}
	.imgs_data ul li{
		display: inline-block;
		position: relative;
		margin:5px;
		height: 130px;
		width: 100px;
		font-size: 0;
		font-size: 14px;
		cursor: pointer;
	}
	.imgs_data ul li img{
		width: 100px;
		height: 100px;
	}
	.imgs_data .img_size{
	    position: absolute;
	    width: 100px;
	    height: 25px;
	    line-height: 25px;
	    color: #fff;
	    text-align: center;
	    background: rgba(0,0,0,.2);
	    top: 75px;
	}
	.imgs_data .img_info{
		display: flex;
		font-size: 0;
		line-height: 15px;
	}
	.imgs_data .img_info p{
		margin-top: 5px;
    	font-size: 12px;
    	padding-bottom: 1px;
    	height:100%;
	}
	.imgs_data .img_info p:nth-child(1){
		white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	.default_btn{
		width: 100%;
		text-align: center;
		margin: 30px 0 20px 0;
	}
	.btn1{
		background: #f8f8f8;
		border-color: #e5e5e5;
	}
	
	/*手机用户本地上传图片样式*/
	.isuser_phone .local_picture_span{
		width: 110px;
		text-align: center;
	}
	.isuser_phone #pane-second{
		height: 460px;
	}
	.isuser_phone .tip_words{
		padding: 30px 0px 0px 105px;
	}
	.agree_btn{
		text-align: center;
		margin: 100px 0 0 0;
	}
	/*本地图片被选中的样式*/
	.attachment-selected {
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 100px;
	    height: 100px;
	    border: 2px solid #07d;
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	}
	.attachment-selected i {
	    position: absolute;
	    right: 1px;
	    bottom: 1px;
	    z-index: 2;
	}
	.zenticon-check {
	    font-size: 12px;
	    color: #fff;
	}
	.zenticon {
	    display: inline-block;
	    speak: none;
	    font-style: normal;
	    vertical-align: baseline;
	    text-align: center;
	    text-transform: none;
	    font-variant: normal;
	    text-rendering: auto;
	    text-decoration: inherit;
	    line-height: 1;
	    text-rendering: optimizeLegibility;
	    -webkit-font-smoothing: antialiased;
	    -moz-osx-font-smoothing: grayscale;
	}
	.zenticon:before {
		content: "\2713";
	}
	.zenticon:before {
		
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    display: block;
	    font-family: zenticon!important;
	}
	.attachment-selected:after {
	    position: absolute;
	    display: block;
	    content: " ";
	    right: 0;
	    bottom: 0;
	    border: 14px solid #07d;
	    border-left-color: transparent;
	    border-top-color: transparent;
	    z-index: 1;
	}
</style>