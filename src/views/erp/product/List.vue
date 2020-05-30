<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
            <div style="margin-left: 5px;margin-right: 20px;display: inline">
                <el-button type="primary" size="mini" icon="el-icon-plus"
                           @click="showAddProductView">
                    添加产品
                </el-button>
            </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="products" size="mini">
                    <el-table-column type="selection" align="left" width="30">
                    </el-table-column>
                    <el-table-column prop="name" align="left"  label="名称"></el-table-column>
                    <el-table-column prop="typeName" align="left"  label="产品分类"></el-table-column>
                    <el-table-column prop="productBrand.name" align="left"  label="品牌"></el-table-column>
                    <el-table-column label="操作">
                        <template >
                            <el-button  type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
                    <el-pagination
                            background
                            :page-size="10"
                            :current-page="currentPage"
                            layout="total,prev,pager,next"
                            @current-change="currentChange"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <product-form></product-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductForm from "@/views/erp/product/ProductForm";
    export default {
        name: "List",
        components: {ProductForm},
        mounted(){
            this.loadProducts();
        },
        methods:{
            currentChange(page){
                this.currentPage = page;
                this.loadProducts();
            },
            showAddProductView(){
                this.dialogVisible = true;
                this.dialogTitle = "新增产品";
            },
            loadProducts(){
                this.getRequest('/product/page?page='+this.currentPage+"&size=10").then((resp)=> {
                    this.products = resp.data.products;
                    this.totalCount = resp.data.count;
                });
            }
        },
        data(){
            return{
                products:[],
                totalCount:-1,
                currentPage:1,
                dialogVisible:false,
                dialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>