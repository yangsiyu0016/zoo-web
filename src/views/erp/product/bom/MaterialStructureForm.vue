<template>
    <div>
        <el-form size="mini" :model="materialStructure" label-width="120px" :rules="rules" ref="msForm">
            <el-card shadow="hover">
                <div slot="header">
                    <span style="float: left">父件资料</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品编码：" prop="product.id">
                            <el-input class="input-with-select" v-model="materialStructure.product.code"  disabled  style="float:left;width:400px">
                                <el-button slot="append" icon="el-icon-search" @click="selectProduct"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称:" >
                            <span style="float: left">{{materialStructure.product.name}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规格:">
                            <span style="float: left">{{materialStructure.product.spec}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位:">
                            <span style="float: left">{{materialStructure.product.unit.name}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="备注:" prop="description">
                        <el-input type="textarea" v-model="materialStructure.description"></el-input>
                    </el-form-item>
                </el-row>
            </el-card>
            <el-card shadow="hover">
                <div slot="header">
                    <span style="float: left">子件清单</span>
                </div>
                <el-container>
                    <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                        <div style="margin-left: 5px;margin-right: 20px;display: inline">
                            <el-button type="primary" size="mini" icon="el-icon-plus"
                                       @click="showAddDetailView">
                                新增
                            </el-button>
                        </div>
                    </el-header>
                    <el-main>
                        <el-table :data="materialStructure.details" >
                            <el-table-column prop="product.imageUrl" label="图片">
                                <template slot-scope="scope">
                                    <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="产品编号" prop="product.code" ></el-table-column>
                            <el-table-column label="产品名称" prop="product.name" ></el-table-column>
                            <el-table-column label="数量" prop="number"></el-table-column>
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
                            <el-table-column label="备注" prop="description"></el-table-column>
                        </el-table>
                    </el-main>
                </el-container>

            </el-card>
            <el-card shadow="hover">
                <el-form-item>
                    <el-button type="info" @click="cancel">取消</el-button>
                    <el-button type="primary" @click="save('msForm')">保存</el-button>
                </el-form-item>
            </el-card>
        </el-form>
        <product-dialog @closeWin="closeProductDialog" :visible="productDialogVisible" :title="productDialogTitle" @dblclick="dblclick"></product-dialog>
        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <material-structure-detail-form @close="closeDetailDialog" @callback="detailCallback"></material-structure-detail-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductDialog from "@/components/dialog/ProductDialog";
    import MaterialStructureDetailForm from "@/views/erp/product/bom/MaterialStructureDetailForm";
    export default {
        name: "MaterialStructureForm",
        components: {MaterialStructureDetailForm, ProductDialog},
        methods:{
            save(formName){
                this.$refs[formName].validate(valid=>{
                   if(valid){

                   }else{
                       return false;
                    }
                });
            },
            detailCallback(row){
                this.materialStructure.details.push(row);
                this.closeDetailDialog();
            },
            closeDetailDialog(){
                this.detailDialogVisible = false;
            },
            cancel(){
                this.$emit("close");
            },
            showAddDetailView(){
                this.detailDialogVisible = true;
                this.detailDialogTitle="添加子件清单";
            },
            dblclick(row) {
                this.closeProductDialog();
              this.materialStructure.product = row;
            },
            closeProductDialog(){
                this.productDialogVisible = false;
            },
            //选择产品
            selectProduct(){
                this.productDialogVisible = true;
                this.productDialogTitle="选择产品";
            },
        },
        data(){
            return{
                materialStructure:{
                    product:{
                        code:'',
                        spec:'',
                        unit:{
                            name:''
                        }
                    },
                    description:'',
                    details:[]
                },
                rules:{
                    'product.id':[{required:true,message:"请选择产品",trigger:'blur'}]
                },
                productDialogVisible:false,
                productDialogTitle:'',
                detailDialogVisible:false,
                detailDialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>