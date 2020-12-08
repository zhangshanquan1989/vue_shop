<template>
	<el-container class="home_container">
		<!-- 头部区域 -->
	  <el-header>
		  <div>
			  <img src="../assets/logo.png" alt="">
			  <span>后台管理系统</span>
		  </div>
		  <el-button type="info" @click="logout">退出</el-button>
	  </el-header>
	  <!-- 页面主体 -->
	  <el-container>
		  <!-- 侧边栏 -->
	    <el-aside :width="isClooapse ? '64px':'200px'">
			<div class="toggle-button" @click="toggleClooapse" >|||</div>
			<!-- 侧边栏菜单区域 -->
			 <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" 
			 :unique-opened="true" :collapse="isClooapse" :collapse-transition="false"
			 :router="true" :default-active="activePath">
				 <!-- 一级菜单 -->
				  <!-- index赋的值必须为字符串，item.id为数字，加一个空字符串可以转变为字符串 -->
			      <el-submenu  v-for="item in menulist" :index="item.id+'' " :key="item.id" > 
					  <!-- 一级菜单模板区 -->
			        <template slot="title">
						<!-- 图标 -->
			          <i :class="iconsObj[item.id]"></i>
					  <!-- 文本 -->
			          <span>{{item.authName}}</span>
			        </template>
					
					<!-- 二级菜单 -->
					<el-menu-item  v-for="subItem in item.children"  :index="'/'+subItem.path"  
					:key="subItem.id" @click="saveNavState('/'+subItem.path)" >
						<!-- 图标 -->
						<i class="el-icon-caret-right"></i>
						<!-- 文本 -->
						<span>{{subItem.authName}}</span>
					</el-menu-item>
			      </el-submenu>
			    </el-menu>
		</el-aside>
		<!-- 右侧内容主体 -->
	    <el-main>
			<!-- 路由占位符 -->
			<router-view></router-view>
		</el-main>
	  </el-container>
	</el-container>
</template>

<script>
	export default {
		data(){
			return{
				// 左侧菜单数据
				menulist: [],
				iconsObj:{
					'125':'el-icon-user-solid',
					'103':'el-icon-s-goods',
					'101':'el-icon-menu',
					'102':'el-icon-s-order',
					'145':'el-icon-s-marketing'
				},
				//是否折叠
				isClooapse:false,
				// 被激活的链接地址
				activePath:''
			}
		},
		created() {
			this.getMenuList()
			this.activePath = window.sessionStorage.getItem('activePath')
		},
		methods:{
			logout(){
				window.sessionStorage.clear()
				this.$router.push('/login')
			},
			//获取所有菜单
			async getMenuList(){
				const {data: res} = await this.$http.get('menus')
				if(res.meta.status !== 200) return this.$message.error('res.meta.msg')
				this.menulist = res.data
				console.log(res);
			},
			//点击按钮，切换菜单的折叠与展开
			toggleClooapse(){
				this.isClooapse = !this.isClooapse
			},
			// 保持链接的激活状态
			saveNavState(activePath){
				window.sessionStorage.setItem('activePath',activePath)
				this.activePath = activePath
			}
		}
	}
</script>

<style lang="less" scoped>
.home_container{
	height: 100%;
}
.el-header{
	background-color: #373d41 ;
	display: flex;
	justify-content: space-between;
	padding-left: 0;
	align-items: center;
	color: #FFFFFF;
	font-size: 20px;
	div{
		display: flex;
		align-items: center;
		img{
			width: 48px;
			height: 48px;
			border-radius: 50%;
		}
		span{
			margin-left: 15px;
		}
	}
}

.el-aside{
	background-color: #333744;
	// border-right: none;
}
.el-main{
	background-color: #eaedf1;
}
.toggle-button{
	background-color:#4a5064 ;
	font-size: 20px;
	line-height: 1.5rem;
	color: #FFFFFF;
	text-align: center;
	cursor: pointer;
}

</style>