<template>
    <div>
        <el-form label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">订单基本信息</span>
                </div>
                <div>
                    <el-row  :gutter="20" >
                        <el-col :span="8" >
                            <el-form-item label="订单日期:">
                                <span style="float: left">{{purchase.initDate}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号：">
                                <span style="float: left">{{purchase.code}}</span>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-form-item label="供应商:">
                            <span style="float: left">{{purchase.supplier.supplierName}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="20">
                        <el-form-item label="付款信息:">
                            <span style="float: left">{{purchase.accountContext}}</span>
                        </el-form-item>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-table :data="purchase.details" size="mini">
                        <el-table-column type="index" align="left" width="60"></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code"  ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数"  ></el-table-column>
                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left"   label="通用规格参数" ></el-table-column>

                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="价格" prop="price"  width="300"></el-table-column>
                        <el-table-column label="总额" prop="totalMoney" ></el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">物流信息</span>
                </div>
                <div>
                    <el-table :data="costs" size="mini">
                        <el-table-column type="index" width="80px"></el-table-column>
                        <el-table-column label="物流名称" prop="express.name"></el-table-column>
                        <el-table-column label="单号" prop="logisticsNumber"></el-table-column>
                        <el-table-column label="运费" prop="money"></el-table-column>
                        <el-table-column label="联系方式" prop="express.phone"></el-table-column>
                        <el-table-column label="创建时间" prop="ctime"></el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover" v-show="handleVisible">
                <div slot="header" class="clearfix">
                    <span style="float: left;">审批意见</span>
                </div>
                <el-input type="textarea" v-model="comment"></el-input>
            </el-card>
            <el-card shadow="hover">
                <el-button v-show="handleVisible&&task.taskKey==='purchasecgnq'" size="mini" @click="addLogistics" type="primary">添加物流信息</el-button>
                <el-button v-show="handleVisible" @click="handle" type="primary" size="mini">办理</el-button>
                <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
                <el-button @click="close" type="info" size="mini">关闭</el-button>
            </el-card>
        </el-form>
        <el-dialog :visible="logisticsDialogVisible" :title="logisticsDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <purchase-logistics-form @close="closeLogisticsDialog"></purchase-logistics-form>
        </el-dialog>
    </div>
</template>

<script>
    import PurchaseLogisticsForm from "@/views/oa/task/PurchaseLogisticsForm";
    export default {
        name: "PurchaseTaskDetails",
        components: {PurchaseLogisticsForm},
        props:{
            task:{
                type:Object,
                default:()=>{}
            }

        },
        watch:{
            task:{
                handler(val){
                    if(val.assignee){
                        this.handleVisible = true;
                        this.claimVisible = false;
                    }else{
                        this.handleVisible = false;
                        this.claimVisible = true;
                    }
                    this.getRequest('/erp/purchase/'+val.businessKey).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.purchase = resp.data;
                            this.loadCost(this.purchase.id);
                        }else{
                            this.$message.error("获取表单信息失败");
                        }
                    })
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            closeLogisticsDialog(){
                this.logisticsDialogVisible = false;
            },
            //添加物流信息
            addLogistics(){
                this.logisticsDialogTitle="添加物流信息";
                this.logisticsDialogVisible =true;
            },
            //加载物流信息
            loadCost(purchaseId){
                this.getRequest('/erp/cost/getCostByForeignKey?foreignKey='+purchaseId).then((resp)=>{
                    this.costs = resp.data;

                })
            },
            //办理
            handle(){
                this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{

                    this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment).then((resp)=>{
                        this.$emit("close");
                        this.$emit("refresh");
                    })
                })
            },
            //签收
            claim() {
                this.$confirm("签收后只能由签收人处理该任务，确定要签收吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.postRequest('/flow/task/claim?taskId='+this.task.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;
                            this.$emit("refresh");
                        }
                    })
                })
            },
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                purchase:{
                    supplier:{
                        supplierName:''
                    }
                },
                claimVisible:false,
                handleVisible:false,
                comment:'',
                costs:[],
                logisticsDialogVisible:false,
                logisticsDialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>