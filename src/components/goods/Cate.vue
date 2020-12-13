<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>

			<!-- 表格 -->
			<tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
			 show-index index-text="#" border>
				<!-- 是否有效模板 -->
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
					<i class="el-icon-error" style="color: red;" v-else></i>
				</template>
				<!-- 排序模板 -->
				<template slot="order" slot-scope="scope">
					<el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
					<el-tag size="mini" type="warning" v-else>三级</el-tag>
				</template>
				<!-- 操作模板 -->
				<template slot="opt" slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
				</template>
			</tree-table>

			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum"
			 :page-sizes="[1, 3, 5, 10]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>

		</el-card>

		<!-- 添加分类的对话框 -->
		<el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
			<!-- 添加分类的表单 -->
			<el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
				<el-form-item label="分类名称:" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类:">
					<!-- 级联选择框 -->
					<!-- options用来指定数据源 -->
					<!-- props用来指定配置对象 -->
					<el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parenCateChanged" clearable ></el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCate">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 查询条件
				querInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				// 商品分类的数据
				catelist: [],
				// 总数据条数
				total: 0,
				// 为table指定列的定义
				columns: [{
						label: '分类名称',
						prop: 'cat_name'
					},
					{
						label: '是否有效',
						// 表示，将当前列 定义为模板列
						type: 'template',
						// 表示，当前这一列使用的模板名称
						template: 'isok'
					},
					{
						label: '排序',
						// 表示，将当前列 定义为模板列
						type: 'template',
						// 表示，当前这一列使用的模板名称
						template: 'order'
					},
					{
						label: '操作',
						// 表示，将当前列 定义为模板列
						type: 'template',
						// 表示，当前这一列使用的模板名称
						template: 'opt'
					}
				],
				// 控制添加分类对话框的显示与隐藏
				addCateDialogVisible: false,
				// 添加分类的表单数据对象
				addCateForm: {
					// 将要添加的分类的名称
					cat_name: '',
					// 父级分类的ID
					cat_pid: 0,
					// 分类的等级，默认一级
					cat_level: 0
				},
				// 添加分类表单的验证规则对象
				addCateFormRules: {
					cat_name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}]
				},
				// 父级分类的列表
				parentCateList: [],
				// 指定级联选择器的配置对象
				cascaderProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children',
					expandTrigger: 'hover',
					// 允许选择任何一项
					checkStrictly:true
				},
				// 选中的父级分类的ID数组
				selectedKeys:[]
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			// 获取商品分类数据
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: this.querInfo
				})
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品分类失败')
				}
				// 如果获取成功，赋值
				this.catelist = res.data.result
				this.total = res.data.total
			},

			// 分页区域，监听pagesize改变
			handleSizeChange(newSize) {
				// 拿到新的页码条数数据，赋值
				this.querInfo.pagesize = newSize
				// 页码条数改变，重新获取数据
				this.getCateList()
			},

			// 监听pagenum的改变
			handleCurrentChange(newPage) {
				// 拿到新的页码数数据，赋值
				this.querInfo.pagenum = newPage
				// 页码数改变，重新获取数据
				this.getCateList()
			},

			// 点击按钮，展示添加分类的对话框
			showAddCateDialog() {
				// 先获取父级分类数据列表，再展示对话框
				this.getParentCateList()
				this.addCateDialogVisible = true
			},


			// 获取父级分类的数据列表
			async getParentCateList() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: {
						type: 2
					}
				})
				if (res.meta.status !== 200) {
					return this.$message.error('获取父级分类数据失败')
				}
				this.parentCateList = res.data
			},
			
			// 选择项发生变化触发这个函数
			parenCateChanged(){
				console.log(this.selectedKeys);
				// 如果selectedKeys数组中的length大于0 ，证明选中了父级分类
				// 反之，没有选中任何父级分类
				if(this.selectedKeys.length > 0){
					// 父级分类的ID
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
					// 为当前分类的等级赋值
					this.addCateForm.cat_level = this.selectedKeys.length
					return
				} else {
					// 父级分类的ID
					this.addCateForm.cat_pid = 0
					// 为当前分类的等级赋值
					this.addCateForm.cat_level = 0
				}
			},
			
			// 点击确定按钮，添加新的分类
			addCate(){
				this.$refs.addCateFormRef.validate(async valid => {
					if(!valid) return
					const {data:res} = await this.$http.post('categories',this.addCateForm)
					if(res.meta.status !== 201){
						return this.$message.error('添加分类失败!')
					}
					this.$message.success('添加分类成功！')
					this.getCateList()
					this.addCateDialogVisible = false
				})
			},
			
			// 监听对话框的关闭事件，重置表单数据
			addCateDialogClosed(){
				this.$refs.addCateFormRef.resetFields()
				// 父级分类的ID
				this.addCateForm.cat_pid = 0
				// 为当前分类的等级赋值
				this.addCateForm.cat_level = 0
				// 重置选中的父级分类的ID数组
				this.selectedKeys = []
			}
		}
	}
</script>

<style lang="less" scoped>
	.treeTable {
		margin-top: 15px;
	}
	.el-cascader{
		width: 100%;
	}
</style>
