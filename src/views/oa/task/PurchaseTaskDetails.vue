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
                        <el-table-column prop="warehouse.name" label="入库仓库"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="未发货数量" prop="notOutNumber"></el-table-column>
                        <el-table-column label="未入库数量" prop="notInNumber"></el-table-column>
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
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table size="mini" :data="props.row.details">
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-table :data="props.row.cdgas">
                                                <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                                                <el-table-column label="数量" prop="number"></el-table-column>

                                            </el-table>
                                        </template>
                                    </el-table-column>
                                    <el-table-column type="index"></el-table-column>
                                    <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                                    <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                                    <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>
                                    <el-table-column label="数量" prop="number"></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" width="80px"></el-table-column>
                        <el-table-column label="物流名称" prop="express.name"></el-table-column>
                        <el-table-column label="单号" prop="logisticsNumber"></el-table-column>
                        <el-table-column label="运费" prop="money"></el-table-column>
                        <el-table-column label="联系方式" prop="express.phone"></el-table-column>
                        <el-table-column label="创建时间" prop="ctime"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button v-show="handleVisible&&task.taskKey==='purchaseinbound'&&!scope.row.finished"  type="primary" @click="inbound(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">收货</el-button>
                                <el-tag size="mini" type="success" v-show="scope.row.finished">收货完成</el-tag>
                                <el-button v-show="handleVisible&&task.taskKey==='purchasecgnq'&&!scope.row.finished"  type="primary" @click="showEditCostView(scope.row)"  style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button v-show="handleVisible&&task.taskKey==='purchasecgnq'&&!scope.row.finished" type="danger"  @click="deleteCost(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
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
                <el-button v-show="handleVisible && purchase.status !== 'REJECT'" @click="handle" type="primary" size="mini">通过</el-button>
                <el-button v-show="rejectVisible || rejectFlag" @click="reject" type="primary" size="mini">驳回</el-button>
                <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
                <el-button v-show="editVisible || canEdit" @click="edit" type="primary" size="mini">编辑</el-button>
                <el-button v-show="purchase.status=='REJECT'" type="primary" size="mini" @click="reSubmit">重新提交</el-button>
                <el-button v-show="purchase.status=='REJECT'" type="primary" size="mini" @click="destory">作废</el-button>
                <el-button @click="close" type="info" size="mini">关闭</el-button>
            </el-card>
        </el-form>
        <el-dialog :visible.sync="logisticsDialogVisible" :title="logisticsDialogTitle" :close-on-click-modal="false" :append-to-body="true" >
            <purchase-logistics-form :purchase="currentPurchase" @close="closeLogisticsDialog" @callback="callback"></purchase-logistics-form>
        </el-dialog>
        <el-dialog :visible.sync="inboundDialogVisible" :title="inboundDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <inbound-set @closeInbound="closeInbound" :oldCost="oldCost" @inboundCallback="inboundCallback"></inbound-set>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <purchase-form :isEdit="isEdit" :oldPurchase="purchase" @close="closeWin" @callback="editCallback"></purchase-form>
        </el-dialog>
    </div>
</template>

<script>
    import PurchaseLogisticsForm from "@/views/oa/task/PurchaseLogisticsForm";
    import InboundSet from "@/views/oa/task/InboundSet";
    import PurchaseForm from "@/views/erp/purchase/PurchaseForm";
    export default {
        name: "PurchaseTaskDetails",
        components: {InboundSet, PurchaseLogisticsForm, PurchaseForm},
        props:{
            task:{
                type:Object,
                default:()=>{}
            },

            rejectVisible:{
                type:Boolean,
                default: false
            },
            canEdit: {
                type: Boolean,
                default: false
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
            edit() {
                this.isEdit = true;
                this.getRequest('/erp/purchase/'+this.purchase.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.purchase = resp.data;
                        this.dialogTitle = "编辑订单";
                        this.dialogVisible = true;
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })
            },
            editCallback() {
                this.closeWin();
            },
             closeWin() {
                this.dialogVisible = false;
            },
            inboundCallback(){
                this.closeInbound();
                this.loadDetails();
                this.loadCost(this.purchase.id);

            },
            closeInbound(){
                this.inboundDialogVisible = false;
            },
            //收货
            inbound(row){
                this.oldCost = row;
                this.inboundDialogTitle="收货";
                this.inboundDialogVisible = true;
            },
            //删除物流信息
            deleteCost(row){

                this.$confirm("确定要删除吗?","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.deleteRequest("/erp/cost/deleteCostFromPurchase?id="+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.loadCost(this.purchase.id);
                            this.loadDetails();
                        }else{
                            this.$message.error("删除失败");
                        }

                    })
                })
            },
            //物流编辑完后调用
            callback(){
                this.logisticsDialogVisible = false;
                this.currentPurchase = {};
                this.loadCost(this.purchase.id);
                this.loadDetails();
            },
            //关闭编辑物流窗口
            closeLogisticsDialog(){

                this.logisticsDialogVisible = false;
                this.currentPurchase = {};
            },
            showEditCostView(row){
                this.$message.error("暂时不支持修改，请删除重新添加！！！")
                //this.logisticsDialogTitle="编辑物流信息";
                //this.logisticsDialogVisible =true;
            },
            //添加物流信息
            addLogistics(){
                this.currentPurchase = this.purchase;
                this.logisticsDialogTitle="添加物流信息";
                this.logisticsDialogVisible =true;
            },
            //加载产品信息
            loadDetails(){
              this.getRequest('/erp/purchase/detail/getDetailByPurchaseId?purchaseId='+this.purchase.id).then((resp)=>{
                  this.purchase.details = resp.data;
              })
            },
            //加载物流信息
            loadCost(purchaseId){
                this.getRequest('/erp/cost/getCostByForeignKey?foreignKey='+purchaseId).then((resp)=>{
                    this.costs = resp.data;

                })
            },
            //重新提交
            reSubmit(){
                this.handle();
            },
            //作废
            destory(){
                this.$confirm("确定要作废该任务嘛？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(()=> {
                    this.postRequest('/flow/task/destory?taskId='+this.task.id+"&comment="+this.comment + "&idea=AGREE&id=" + this.purchase.id + '&code=CG').then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$emit("close");
                            this.$emit("refresh");
                            this.$message.success(resp.data.msg);
                        }else{
                            this.$message.error(resp.data.msg);
                        }

                    })
                })
            },
            //驳回
            reject(){
                this.$confirm("确定要驳回任务嘛？将此任务返回至创建人！", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(()=> {
                    this.doReject();
                })
            },
            //驳回任务
            doReject(){

                this.postRequest('/flow/task/reject?taskId='+this.task.id+"&comment="+this.comment + "&idea=UNAGREE").then((resp)=>{
                    if(resp&&resp.data.status=="200"){
                        this.$emit("close");
                        this.$emit("refresh");
                        this.$message.success(resp.data.msg);
                    }else{
                        this.$message.error(resp.data.msg);
                    }

                })
            },
            //办理
            handle(){
                this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.task.taskKey==="purchasecgnq"){
                        let can = true;
                        this.purchase.details.forEach((item)=>{
                            if(item.notOutNumber>0){
                                can = false;
                            }
                        })
                        if(can){
                            this.doComponent();
                        }else{
                            this.$message.error("有产品未发货");
                        }
                    }else if(this.task.taskKey==="purchaseinbound"){
                        let can = true;
                        this.purchase.details.forEach((item)=>{
                            if(item.notInNumber>0){
                                can = false;
                            }
                        })
                        if(can){
                            this.doComponent();
                        }else{
                            this.$message.error("有产品未收货");
                        }
                    }else{
                        this.doComponent();
                    }


                })
            },
            //完成任务
            doComponent(){
                this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment + '&idea=AGREE').then((resp)=>{
                    this.$emit("close");
                    this.$emit("refresh");
                })
            },
            //签收
            claim() {
                this.$confirm("签收后只能由签收人处理该任务，确定要签收吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.postRequest('/flow/task/claim?taskId='+this.task.id + '&id=' + this.purchase.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;
                            if(this.purchase.status === 'CGJLSH' || this.purchase.status === 'CWSH') {
                                this.rejectFlag = true;
                            }
                            if(this.purchase.status === 'REJECT') {
                                this.editVisible = true;
                            }
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
                logisticsDialogTitle:'',
                currentPurchase:{},
                inboundDialogVisible:false,
                inboundDialogTitle:'',
                oldCost:{},
                editVisible: false,
                rejectFlag: false,
                dialogVisible: false,
                dialogTitle: '',
                isEdit: false
            }
        }
    }
</script>

<style scoped>

</style>