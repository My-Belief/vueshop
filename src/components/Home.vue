<template>
	<el-container class="home-container">
		<!-- 头部区域 -->
		<el-header>
			<div>
				<img src="../assets/heima.png" alt="" />
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<!-- 页面主体区域 -->
		<el-container>
			<!-- 侧边栏 -->
			<!-- 侧边栏的宽度根据折叠还是展开变换 -->
			<el-aside :width="isCollapse?'64px':'200px'">
				<div class="toggle-button" @click="toggleCollapse">|||</div>
				<!-- 侧边栏菜单区域 -->
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="isCollapse"
				 :collapse-transition="false" :router="true" :default-active="activePath">
					<!-- unique-opened:是否只保持一个子菜单的展开 -->
					<!-- :collapse-transition折叠动画 -->
					<!-- :router开启路由模式 -->
					<!-- :default-active:高亮的路径 -->
					<!-- 一级菜单 -->
					<el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
						<!-- 一级菜单的模板区域 -->
						<template slot="title">
							<!-- 图标 -->
							<i :class="iconsObj[item.id]"></i>
							<!-- 文本 -->
							<span>{{item.authName}}</span>
						</template>

						<!-- 二级菜单 -->
						<el-menu-item v-for="subItem in item.children" :index="'/'+subItem.path" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
							<template slot="title">
								<!-- 图标 -->
								<i class="el-icon-menu"></i>
								<!-- 文本 -->
								<span>{{subItem.authName}}</span>
							</template>
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
		data() {
			return {
				//左侧菜单数据
				menuList: [],
				iconsObj: {
					'125': 'iconfont icon-user',
					'103': 'iconfont icon-tijikongjian',
					'101': 'iconfont icon-shangpin',
					'102': 'iconfont icon-danju',
					'145': 'iconfont icon-baobiao'
				},
				// 是否折叠
				isCollapse: false,
				// 被激活的链接地址
				activePath: ''
			}
		},
		created() {
			this.getMenuList()
			this.activePath = window.sessionStorage.getItem('activePath')
		},
		methods: {
			logout() {
				window.sessionStorage.clear()
				this.$router.push('/login')
			},
			//获取所有的菜单
			async getMenuList() {
				const {
					data: res
				} = await this.$http.get('menus')
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.menuList = res.data
			},
			// 点击按钮切换菜案的折叠与展开
			toggleCollapse() {
				this.isCollapse = !this.isCollapse
			},
			//在saveNavState方法中将path保存到sessionStorage中
			saveNavState(activePath) {
				//点击二级菜单的时候保存被点击的二级菜单信息
				window.sessionStorage.setItem('activePath', activePath)
				this.activePath = activePath
			}

		}
	};
</script>

<style lang="less" scoped>
	.home-container {
		height: 100%;
	}

	.el-header {
		background-color: #373D41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #fff;
		font-size: 20px;

		>div {
			display: flex;
			align-items: center;

			span {
				margin-left: 15px;
			}
		}
	}

	.el-aside {
		background-color: #333744;

		.el-menu {
			//优化右侧边框线
			border-right: none;
		}
	}

	.el-main {
		// 修改背景颜色相同
		background-color: #eaedf1;
	}

	.iconfont {
		// 设置自定义的图片与文字的右间距
		margin-right: 10px;
	}

	.toggle-button {
		background-color: #4a5064;
		font-size: 10px;
		line-height: 20px;
		color: #fff;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>
