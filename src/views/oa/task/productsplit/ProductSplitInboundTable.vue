<template>
    <div>
        <el-container>
            <el-header>
                <el-button @click="showAddView" size="mini" type="primary" icon="el-icon-plus">新增</el-button>
            </el-header>
            <el-main>
                <el-table size="mini" :data="inboundDetails">
                    <el-table-column type="index" width="80"></el-table-column>
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
                    <el-table-column prop="product.description" align="left" label="备注" :show-tooltip-when-overflow="true"></el-table-column>
                    <el-table-column prop="goodsAllocation.name" label="货位"></el-table-column>
                    <el-table-column prop="number" label="数量"></el-table-column>
                </el-table>
            </el-main>
            <el-footer style="text-align: center">
                <el-button icon="el-icon-close" type="info" size="mini" @click="close">取消</el-button>
                <el-button icon="el-icon-check" @click="saveInbound" type="primary" size="mini">保存</el-button>
            </el-footer>
        </el-container>



        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :append-to-body="true" :close-on-click-modal="false"  width="30%" >
            <product-split-inbound-form @callback="callback" @cancel="closeDialog" :oldDetail="oldDetail" :warehouse-id="warehouseId" :waitInProducts="tempWaitInProducts"></product-split-inbound-form>
        </el-dialog>

    </div>
</template>

<script>
    import ProductSplitInboundForm from "@/views/oa/task/productsplit/ProductSplitInboundForm";
    export default {
        name: "ProductSplitInboundTable",
        components: {ProductSplitInboundForm},
        props:{
            waitInProducts:{
                type:Array,
                default:()=>[]
            },
            warehouseId:{
                type:String,
                default:''
            }
        },
        watch:{
            waitInProducts:{
                handler(val){
                    this.tempWaitInProducts = JSON.parse(JSON.stringify(val));
                    this.inboundDetails = [];
                },
                deep:true,
                immediate: true
            }
        },
        methods:{
            callback(detail){
                this.inboundDetails.push(detail);
                this.closeDialog();
            },
            closeDialog(){
                this.dialogVisible = false;
            },
            showAddView(){
                let newWaitInProducts = JSON.parse(JSON.stringify(this.waitInProducts));
                let tempWaitInProducts = [];

                for(let i =0;i<newWaitInProducts.length;i++){
                    let tempWaitInProduct = newWaitInProducts[i];
                    for(let j=0;j<this.inboundDetails.length;j++){
                        if(tempWaitInProduct.product.id==this.inboundDetails[j].product.id){
                           tempWaitInProduct.notInNumber-=this.inboundDetails[j].number;
                        }
                    }
                    if(tempWaitInProduct.notInNumber!=0){
                        tempWaitInProducts.push(tempWaitInProduct);
                    }

                }
                this.tempWaitInProducts = tempWaitInProducts;
                this.oldDetail={
                    product:{},
                    goodsAllocation:{},
                    number:0
                },
                this.dialogTitle="货位设置";
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                oldDetail:{},
                tempWaitInProducts:[],
                inboundDetails:[],
                dialogVisible:false,
                dialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>