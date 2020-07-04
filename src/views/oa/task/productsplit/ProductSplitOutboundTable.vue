<template>
    <div>
        <el-container>
            <el-header>
                <el-button @click="showAddView" size="mini" type="primary" icon="el-icon-plus">新增</el-button>
            </el-header>
            <el-main>
                <el-table size="mini" :data="details">
                    <el-table-column type="index" width="80"></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="deleteDetail(scope.row)" icon="el-icon-delete" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer style="text-align: center">
                <el-button icon="el-icon-close" type="info" size="mini" @click="close">取消</el-button>
                <el-button icon="el-icon-check" @click="saveOutbound" type="primary" size="mini">保存</el-button>
            </el-footer>
        </el-container>



        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :append-to-body="true" :close-on-click-modal="false" width="40%">
            <product-split-outbound-form :oldData="oldData" :not-out-number="maxNumber" :warehouse-id="warehouseId" @cancel="cancel" @callback="callback"></product-split-outbound-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductSplitOutboundForm from "@/views/oa/task/productsplit/ProductSplitOutboundForm";
    export default {
        name: "ProductSplitOutboundTable",
        components: {ProductSplitOutboundForm},
        props:{
            warehouseId:{
                type:String,
                default:''
            },
            oldDetails:{
                type:Array,
                default:[]
            },
            notOutNumber:{
                type:Number,
                default: 0
            },
            splitId:{
                type:String,
                default:''
            }
        },

        watch:{
            notOutNumber:{
                handler(val){
                    this.maxNumber = val;
                },
                deep:true,
                immediate: true
            },
            details: {
                handler(val){
                    this.maxNumber = this.notOutNumber;
                    this.details.forEach(detail=>{
                        this.maxNumber-=detail.number;
                    })
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            saveOutbound(){
                this.postNoEnCodeRequest('/erp/split/addOutbound',{
                    foreignKey:this.splitId,
                    details:this.details
                }).then(resp=>{
                    if(resp.data&&resp.data.status==200){
                        this.$message.success("保存成功");
                        this.$emit("callback",this.maxNumber)
                        this.details = [];
                    }else{
                        this.$message.error(resp.data.msg);
                    }
                })
            },
            deleteDetail(row){
                this.details.some((item,i)=>{
                    if(item==row){
                        this.details.splice(i,1);
                    }
                })
            },
            callback(data){
                this.details.push(data);
                this.cancel();
            },
            cancel(){
                this.dialogVisible = false;
            },
            close(){
                this.$emit("close");
                this.details = [];
            },
            showAddView(){
                this.oldData={
                    goodsAllocation:{},
                    number:0
                }
                this.dialogTitle="货位设置";
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                details:[],
                dialogTitle:'',
                dialogVisible:false,
                maxNumber:0,
                oldData:{

                }
            }
        }
    }
</script>

<style scoped>

</style>