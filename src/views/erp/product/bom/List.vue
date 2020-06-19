<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddBomView">
                        新增
                    </el-button>
                </div>
            </el-header>
            <el-main>
                <div class="search-kg">
                    <el-form size="mini" :inline="true" :model="searchValue">
                        <el-form-item label="产品：">
                            <el-input class="input-with-select" v-model="searchValue.product.name"  disabled  style="float:left;width:400px">
                                <el-button slot="append" icon="el-icon-search" @click="selectProduct"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table size="mini" :data="boms">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div v-if="scope.row.details.length>0">
                                <material-structure-detail-table @editMethod="showEditBomView" :cdata="scope.row.details"></material-structure-detail-table>
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column label="产品编号" prop="product.code" ></el-table-column>
                    <el-table-column label="产品名称" prop="product.name" ></el-table-column>

                    <el-table-column prop="product.imageUrl" label="图片">
                        <template slot-scope="scope">
                            <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品参数">
                        <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                        <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                        <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
                        <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                        <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                        <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                        <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                        <el-table-column prop="product.description" align="left" label="备注" :show-overflow-tooltip='true'></el-table-column>
                    </el-table-column>
                    <el-table-column label="备注" prop="description" :show-tooltip-when-overflow="true"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showEditBomView(scope.row.product.id)" style="padding: 3px 4px 3px 4px;margin: 2px"  type="primary">编辑</el-button>
                            <el-button  @click="deleteMaterialStructure(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>

                        </template>
                    </el-table-column>
                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
                    <el-pagination
                            background
                            :page-size="10"
                            :current-page="currentPage"
                            layout="prev,pager,next"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="77%">
            <material-structure-form :isEdit="isEdit" :oldBom="oldBom" @close="closeDialog" @callback="callback"></material-structure-form>
        </el-dialog>
        <product-dialog @closeWin="closeProductDialog" :visible="productDialogVisible" :title="productDialogTitle" @dblclick="dblclick"></product-dialog>
    </div>
</template>

<script>
    import MaterialStructureForm from "@/views/erp/product/bom/MaterialStructureForm";
    import ProductDialog from "@/components/dialog/ProductDialog";
    import MaterialStructureDetailTable from "@/views/erp/product/bom/MaterialStructureDetailTable";
    export default {
        name: "List",
        components: {MaterialStructureDetailTable, ProductDialog, MaterialStructureForm},
        mounted(){
            //this.loadBoms();
        },
        methods:{
            deleteMaterialStructure(row){
                this.$confirm("确定要删除吗？删除后不可恢复！","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/product/ms/'+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.boms = [];
                        }else {
                            this.$message.error("删除失败");
                        }
                    })
                })
            },
            search(){
                if(this.searchValue.product.id){
                    this.getRequest('/product/ms/getMS?productId='+this.searchValue.product.id).then(resp=>{
                        if(resp&&resp.data){
                            this.boms=[resp.data];
                        }
                    })
                }
            },
            //选择产品
            selectProduct(){
                this.productDialogVisible = true;
                this.productDialogTitle="选择产品";
            },
            //产品填充
            dblclick(row){
                this.searchValue.product = row;
                this.closeProductDialog();
            },
            closeProductDialog(){
                this.productDialogVisible = false;
            },
            callback(row){
                this.boms = [row];
                this.closeDialog();
            },
            closeDialog(){
                this.dialogVisible = false;
            },
            showEditBomView(productId){
                this.getRequest('/product/ms/getMS?productId='+productId).then((resp)=>{
                    if(resp&&resp.data){
                        this.isEdit= true;

                        this.oldBom=resp.data;
                        this.dialogVisible = true;
                        this.dialogTitle="编辑产品结构"
                    }else {
                        this.$message.error(resp.data.msg);
                    }
                })

            },
            showAddBomView(){
                this.isEdit = false;
                this.oldBom={
                    product:{
                        code:'',
                        spec:'',
                        unit:{
                            name:''
                        }
                    },
                    description:'',
                    details:[]
                };
                this.dialogVisible = true;
                this.dialogTitle="新增产品结构"
            },
            /*loadBoms(){
                this.getRequest('/product/ms/page?page='+this.currentPage+"&size=10").then(resp=>{
                    this.boms = resp.data.boms;
                    this.totalCount=resp.data.count;
                })
            }*/
        },
        data(){
            return{
                boms:[],
                dialogVisible:false,
                dialogTitle:'',
                productDialogVisible:false,
                productDialogTitle:'',
                currentPage:1,
                totalCount:-1,
                searchValue:{
                    product:{
                        name:''
                    }
                },
                isEdit:false,
                oldBom:{}
            }
        }
    }
</script>

<style scoped>
    .search-kg{float:left;height:50px;padding:10px 0;}
</style>