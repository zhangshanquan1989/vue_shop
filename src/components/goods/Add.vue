<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片区域 -->
		<el-card>
			<!-- 提示区域 -->
			<el-alert title="添加商品信息" type="info" center show-icon :closable="false">
			</el-alert>
			<!-- 步骤条区域 -->
			<el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<!-- tab栏区域 -->
			<!-- 用form表单包裹tabs,用于统一提交 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
				<el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addForm.goods_number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: '0',
				// 添加商品的表单数据对象
				addForm: {
					goods_name: '',
					goods_price: 0,
					goods_weight: 0,
					goods_number: 0,
					// 商品所属的分类数组
					goods_cat:[]
				},
				// 表单校验规则
				addFormRules: {
					goods_name: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}, {
						min: 2,
						max: 20,
						message: '商品名称的长度在2~20个字符之间',
						trigger: 'blur'
					}],
					goods_price: [{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur'
					}],
					goods_weight: [{
						required: true,
						message: '请输入商品重量',
						trigger: 'blur'
					}],
					goods_number: [{
						required: true,
						message: '请输入商品数量',
						trigger: 'blur'
					}],
					goods_cat: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					}]
				},
				// 商品分类列表
				catelist: [],
				cateProps:{
					label:'cat_name',
					value:'cat_id',
					children:'children',
					expandTrigger: 'hover'
				},
				// 动态参数列表数据
				manyTableData:[]
			}
		},
		created() {
			// 获取所有商品分类数据
			this.getCateList()
		},
		computed:{
			cateId(){
				if(this.addForm.goods_cat.length === 3){
					return this.addForm.goods_cat[2]
				}
				return null
			}
		},
		
		methods: {
			// 获取所有商品分类数据
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories')
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品分类信息失败')
				}
				// this.$message.success('获取商品分类数据成功')
				this.catelist = res.data
			},
			
			// 级联选择器选中项变化，会触发这个函数
			handleChange(){
				console.log(this.addForm.goods_cat)
				if(this.addForm.goods_cat.length !== 3){
					this.addForm.goods_cat = []
				}
			},
			
			// 离开标签页的钩子函数
			beforeTabLeave(activeName,oldActiveName){
				if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
					this.$message.error('请先选择商品分类')
					return false
				}
			},
			
			// 标签页点击事件
			async tabClicked(){
				// console.log(this.activeIndex);
				if(this.activeIndex === '1'){
					// 等于1，证明访问的事动态参数面板
					// cateId为计算属性
					const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
					if(res.meta.status !== 200){
						return this.$message.error('获取动态参数列表失败')
					}
					// console.log(res.data);
					this.manyTableData = res.data
				}
			}
		}
	}
</script>

<style scoped>

</style>
