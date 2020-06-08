<template>
    <div>
        <el-table :data="products" size="mini" @row-dblclick="dblclick">
            <el-table-column type="index" width="30"></el-table-column>
            <!--<el-table-column prop="id" width="30" v-show="false"></el-table-column>-->
            <el-table-column prop="code" align="left"  label="产品编号"  ></el-table-column>
            <el-table-column prop="name" align="left"  label="产品名称"  ></el-table-column>
            <el-table-column prop="typeName" align="left"  label="分类"></el-table-column>
            <el-table-column prop="productBrand.name" align="left"  label="品牌" ></el-table-column>

            <el-table-column prop="productDetail.packageList" align="left" label="包装清单"></el-table-column>
            <el-table-column prop="productDetail.afterService" align="left" label="售后服务"></el-table-column>
            <el-table-column prop="productDetail.description" align="left"  label="描述"></el-table-column>
        </el-table>
        <el-pagination
                background
                :page-size="10"
                @current-change="currentChange"
                :current-page="currentPage"
                layout="prev,pager,next"
                :total="totalCount">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "SearchProductForm",
        data() {
            return {
                currentPage: 1,
                totalCount: -1,
                products: []
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            currentChange(page) {
                this.currentPage = page;
                this.initData();
            },
            initData() {
                this.getRequest('/product/page?page=' + this.currentPage + '&size=10').then(resp=> {
                    this.products = resp.data.products;
                    this.totalCount = resp.data.count;
                })
            },
            dblclick(row) {
                this.$emit('dblclick', row);
            }
        }
    }
</script>

<style scoped>

</style>