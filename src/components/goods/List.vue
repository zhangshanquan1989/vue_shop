<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 搜索框、添加按钮 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
						<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="goAddpage">添加商品</el-button>
				</el-col>
			</el-row>

			<!-- table表格区 -->
			<el-table :data="goodslist" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
				<el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
				<el-table-column label="创建时间" prop="add_time" width="170px">
					<template slot-scope="scope">
						<!-- |是过滤器用法 -->
						{{scope.row.add_time | dataFormat}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="130px">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 查询参数对象
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				// 商品列表
				goodslist: [],
				// 商品总条数
				total: 0
			}
		},
		created() {
			this.getGoodsList()
		},
		methods: {
			// 根据分页获取对应的商品列表
			async getGoodsList() {
				const {
					data: res
				} = await this.$http.get('goods', {
					params: this.queryInfo
				})
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品列表失败')
				}
				this.$message.success('获取商品列表成功')
				this.goodslist = res.data.goods
				this.total = res.data.total
			},

			// pagesize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getGoodsList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getGoodsList()
			},

			// 点击删除按钮
			async removeById(id) {
				const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if(confirmResult !== 'confirm'){
					return this.$message.info('已经取消删除')
				}
				const {data:res} = await this.$http.delete(`goods/${id}`)
				
				if(res.meta.status !== 200) {
					return this.$message.error('删除失败')
				}
				this.$message.success('删除成功！')
				this.getGoodsList()
			},
			
			// 点击添加商品按钮
			goAddpage(){
				this.$router.push('/good/add')
			}
		}
	}
</script>

<style lang="less" scoped>

</style>
