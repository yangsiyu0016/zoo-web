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
                <el-table size="mini" :data="boms">
                    <el-table-column prop="product.imageUrl" label="图片">
                        <template slot-scope="scope">
                            <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品编号" prop="product.code" ></el-table-column>
                    <el-table-column label="产品名称" prop="product.name" ></el-table-column>
                    <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                    <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                    <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
                    <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                    <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                    <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                    <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                    <el-table-column prop="product.description" align="left" label="备注" :show-overflow-tooltip='true'></el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="77%">
            <material-structure-form @close="closeDetailDialog"></material-structure-form>
        </el-dialog>
    </div>
</template>

<script>
    import MaterialStructureForm from "@/views/erp/product/bom/MaterialStructureForm";
    export default {
        name: "List",
        components: {MaterialStructureForm},
        data(){
            return{
                boms:[],
                dialogVisible:false,
                dialogTitle:''
            }
        },
        methods:{
            closeDetailDialog(){
              this.dialogVisible = false;
            },
            showAddBomView(){
                this.dialogVisible = true;
                this.dialogTitle="新增产品结构"
            }
        }
    }
</script>

<style scoped>

</style>