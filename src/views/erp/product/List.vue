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
                    <el-table-column prop="imageUrl" label="图片">
                        <template slot-scope="scope">
                            <el-image v-show="scope.row.imageUrl" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" align="left"  label="编号"></el-table-column>
                    <el-table-column prop="name" align="left"  label="名称"></el-table-column>
                    <el-table-column prop="typeName" align="left"  label="产品分类"></el-table-column>
                    <el-table-column prop="productBrand.name" align="left"  label="品牌"></el-table-column>
                    <el-table-column prop="spec" align="left"  label="规格"></el-table-column>
                    <el-table-column prop="unit.name" align="left"  label="计量单位"></el-table-column>
                    <el-table-column prop="weight" align="left"  label="重量"></el-table-column>
                    <el-table-column prop="color" align="left"  label="颜色"></el-table-column>
                    <el-table-column prop="puse" align="left"  label="用途"></el-table-column>
                    <el-table-column prop="description" align="left" label="备注"  :show-overflow-tooltip='true' ></el-table-column>
                    <el-table-column prop="ctime" label="创建时间"></el-table-column>
                    <el-table-column prop="hasBom" label="BOM">
                        <template slot-scope="scope">
                            <el-tag v-if="!scope.row.hasBom" type="info">未做BOM</el-tag>
                            <el-tag v-if="scope.row.hasBom" type="danger">已 做BOM</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showUpdateProductView(scope.row)"  type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" size="mini" @click="deleteProduct(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
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
            <product-form :isEdit="isEdit" :oldProduct="oldProduct" @close="closeProductDialog" @callback="callback"></product-form>
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
            deleteProduct(row) {
                this.$confirm('确定要删除该条数据嘛？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(()=> {
                    this.deleteRequest('/product/' + row.id).then(resp => {
                        if (resp.data.status == '200') {
                            this.$message.success('删除成功');
                            this.products.some((item, i) => {
                                if (item == row) {
                                    this.products.splice(i, 1);
                                    return true;
                                }
                            })
                        }else {
                            this.$message.error("删除失败");
                        }
                    })
                })
            },
            callback(){
                this.closeProductDialog();
                this.loadProducts();
            },
            closeProductDialog() {
              this.dialogVisible = false;
            },
            currentChange(page){
                this.currentPage = page;
                this.loadProducts();
            },
            showUpdateProductView(row){
                this.getRequest('/product/getProductById?id='+row.id).then(resp=>{
                    if(resp&&resp.data){
                        this.isEdit=true;
                        this.oldProduct = resp.data;
                        this.dialogVisible = true;
                        this.dialogTitle = "编辑产品";
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })

            },
            showAddProductView(){
                this.isEdit = false;
                this.oldProduct = {
                    typeId:'',
                    productBrand:{},
                    unit:{},
                    name:'',
                    spec:'',
                    weight:'',
                    color:'',
                    puse:'',
                    description:'',
                    imageUrl:''
                },
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
                dialogTitle:'',
                isEdit:false,
                oldProduct:{}
            }
        }
    }
</script>

<style lang="css">
    .el-tooltip__popper{font-size: 15px; max-width:40%} /*设置显示隐藏部分内容，按40%显示*/
</style>