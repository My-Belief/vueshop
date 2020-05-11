<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->

		<el-card>
			<!-- 添加角色按钮区 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表区 -->
			<!-- row-key="id" 是2019年3月提供的新特性，
			if there's nested data, rowKey is required.
			如果这是一个嵌套的数据，rowkey 是必须添加的属性 -->
			<el-table row-key="id"  :data="roleList" border stripe>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 渲染二级和三级权限 -->
							<el-col :span="19">
								<el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>

							</el-col>
						</el-row>
						<!-- <pre>
							{{scope.row}}
						</pre>	 -->
					</template>
				</el-table-column>
				<el-table-column label="#" type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope" width="300px">
						<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
						<el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 分配权限的对话框 -->
		<el-dialog
		  title="分配权限"
		  :visible.sync="SetRightDialogVisible"
		  width="50%" @close="setRightDialogClosed">
		  <!-- 树形控件 -->
		  <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
		  <!-- 底部区域 -->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="SetRightDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="allotRights" >确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 添加角色的对话框 -->
		<el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<!-- 内容主体区域 -->
			<el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="80px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="roleForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="roleForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRole">确 定</el-button>
			</span>
		</el-dialog>


		<!-- 修改角色界面 -->
		<el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @click="editDialogClosed">
			<!-- 内容主体区域 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="editForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="editForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>

			<!-- 页脚区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible=flase">取 消</el-button>
				<el-button type="primary" @click="editRoleInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//所有角色列表数据
				roleList: [],
				//查询到的角色信息对象
				editForm: {},
				//控制编辑角色对话框的显示与隐藏
				editDialogVisible: false,
				//控制添加角色对话框的显示与隐藏
				addDialogVisible: false,
				//添加角色的表单数据
				roleForm: {
					roleName: '',
					roleDesc: ''
				},
				//添加角色列表的的规则
				roleFormRules: {
					roleName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}]
				},
				//修改角色列表的的规则
				editFormRules: {
					roleName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}]
				},
				//控制分配权限对话框的显示与隐藏
				SetRightDialogVisible:false,
				// 所有权限的数据
				rightsList:[],
				// 树形控件的属性绑定对象
				treeProps:{
					label:'authName',
					children:'children'
				},
				//默认选中的节点id值数组
				defKeys:[],
				// 当前即将分配权限的id
				roleId:''
				
			}
		},
		created() {
			this.getRoleList()
		},
		methods: {
			//获取所有的角色的列表
			async getRoleList() {
				const {
					data: res
				} = await this.$http.get('roles')

				if (res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败')
				}

				this.roleList = res.data
			},
			//添加关闭重置
			addDialogClosed() {
				this.$refs.roleFormRef.resetFields()
			},
			//编辑角色信息重置
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			//添加角色
			addRole() {
				this.$refs.roleFormRef.validate(async valid => {
					if (!valid) return
					//可以发起添加用户的网络请求
					const {
						data: res
					} = await this.$http.post('roles', this.roleForm)
					if (res.meta.status !== 201) {
						return this.$message.error('添加角色失败！')
					}
					this.$message.success('添加角色成功！')
					//隐藏添加用户对话框
					this.addDialogVisible = false
					this.getRoleList()

				})
			},
			//提交编辑后的角色信息
			editRoleInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					//可以发起修改用户的网络请求
					const {
						data: res
					} = await this.$http.put('roles/' + this.editForm.roleId, {
						roleName: this.editForm.roleName,
						roleDesc: this.editForm.roleDesc
					})
					if (res.meta.status !== 200) {
						return this.$message.error('更新角色信息失败！')
					}
					//隐藏修改用户对话框
					this.editDialogVisible = false
					// 刷新列表列表				
					this.getRoleList()
					// 提示用户信息修改成功
					this.$message.success('更新角色信息成功！')

				})
			},
			// 根据id删除对应的角色信息
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$http.get('roles/' + id)
				if (res.meta.status !== 200)
					return this.$message.error('查询角色信息失败！')
				this.editForm = res.data
				this.editDialogVisible = true
				console.log(this.editForm)
			},
			async removeRoleById(id) {
				//弹框询问角色是否删除数据
				const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				//console.log(confirmRes)
				//如果角色确认删除，则返回值为字符串confirm

				//如果角色取消删除，则返回值为字符串cancel
				if (confirmRes !== 'confirm') {
					return this.$message.info('已取消了删除！')
				}

				const {
					data: res
				} = await this.$http.delete('roles/' + id)
				if (res.meta.status !== 200) {
					return this.$message.error('删除角色失败！')
				}
				// 刷新列表列表				
				this.getRoleList()
				// 提示用户信息修改成功
				this.$message.success('删除角色信息成功！')
			},
			//根据Id删除对应的权限
			async removeRightById(role,rightId){
				//弹框提示用户是否删除
				const confirmRes=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(err => err)
						if(confirmRes!=='confirm'){
							return this.$message.info('取消了删除！')
						}
						
						const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
						if(res.meta.status!==200){
							return this.$message.error('删除权限失败！')
						}
						
						role.children=res.data
						this.$message.success('删除权限成功！')
						
				
			},
			//分配权限的对话框
			async showSetRightDialog(role){
				this.roleId=role.id
				//获取所有权限的数据
				 const {data:res}=await this.$http.get('rights/tree')
				 if(res.meta.status!==200){
				 	return this.$message.error('获取权限数据失败！')
				 }
				 //把获取到的权限数据保存到rightsList中
				 this.rightsList=res.data
				 this.getLeafKeys(role,this.defKeys)
				this.SetRightDialogVisible=true
			},
			//通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
			getLeafKeys(node,arr){
				if(!node.children){
					return arr.push(node.id)
				}
				
				node.children.forEach(item=>this.getLeafKeys(item,arr))
			},
			//监听分配权限对话框的关闭事件
			setRightDialogClosed(){
				this.defKeys=[]
			},
			//点击为角色分配权限
			async allotRights(){
				const keys=[
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()
				]	
				//console.log(keys)
				const idStr=keys.join(',')
				const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
				if(res.meta.status!==200){
					return this.$message.error('分配权限失败！')
				}
				
				this.$message.success('分配权限成功！')
				
				this.getRoleList()
				this.SetRightDialogVisible=false
			}

		}
	}
</script>

<style lang="less" scoped>
	.el-tag {
		margin: 7px;
	}

	.bdtop {
		border-top: 1px solid #eee;
	}

	.bdbottom {
		border-bottom: 1px solid #eee;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
