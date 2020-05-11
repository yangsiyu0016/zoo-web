<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddPurchaseView">
                        添加订单
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="purchases" @row-dblclick="rowDblclick">
                    <el-table-column type="index" width="30px"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column prop="supplier.supplierName" label="供应商"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-if="scope.row.status=='CGJLSH'" type="danger" size="mini" effect="dark">采购经理审核</el-tag>
                            <el-tag v-if="scope.row.status=='CWSH'" type="warning" size="mini" effect="dark">财务审核</el-tag>
                            <el-tag v-if="scope.row.status=='IN'"  color="#7b1fa2" size="mini" effect="dark">入库中...</el-tag>
                            <el-tag v-if="scope.row.status=='DESTROY'"  type="info" size="mini" effect="dark">已作废</el-tag>
                            <el-tag v-if="scope.row.status=='FINISHED'"  type="success" size="mini" effect="dark">订单完成</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cuser.realName" label="创建人"></el-table-column>
                    <el-table-column prop="ctime" label="创建时间"></el-table-column>
                    <el-table-column prop="etime" label="完成时间"></el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" @click="startFlow(scope.row)" size="mini" type="success" style="padding: 3px 4px 3px 4px;margin: 2px">启动流程</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" type="primary" @click="showEditPurchaseView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" @click="deletePurchase" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        background
                        :page-size="10"
                        :current-page="currentPage"
                        layout="prev,pager,next"
                        :total="totalCount">
                </el-pagination>
            </el-main>

        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="77%">
            <purchase-form :isEdit="isEdit" :oldPurchase="oldPurchase" @close="closeWin" @callback="callback"></purchase-form>
        </el-dialog>
        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" width="77%">
            <purchase-details @close="closeDetailDialog" :purchase="currentPurchase"></purchase-details>
        </el-dialog>
    </div>
</template>

<script>
    import PurchaseForm from "@/views/erp/purchase/PurchaseForm";
    import PurchaseDetails from "@/views/erp/purchase/PurchaseDetails";
    export default {
        name: "List",
        components: {PurchaseDetails, PurchaseForm},
        mounted(){
            this.loadPurchases();
        },
        methods:{
            //关闭查看界面
            closeDetailDialog(){
                this.detailDialogVisible = false;
            },
            //查看订单
            showDetails(row){
                this.getRequest('/erp/purchase/'+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.currentPurchase = resp.data;
                        this.detailDialogVisible = true;
                        this.detailDialogTitle="订单查看";
                    }else{
                        this.$message.error("获取订单信息失败");
                    }
                })

            },
            rowDblclick(row){
                this.showDetails(row);
            },
            //启动流程
            startFlow(row){
                this.$confirm("确定要启动审批流程吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.postRequest('/erp/purchase/startFlow?id='+row.id).then((resp)=>{
                        console.log(resp);
                        if(resp&&resp.data.status==200){
                            this.$message.success("启动成功");
                            //this.loadData();

                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            deletePurchase(){
                this.$message.info("暂时未实现");
            },
            callback(){
                this.dialogVisible = false;
                this.loadPurchases();
            },
            closeWin(){
                this.dialogVisible = false;
            },
            showEditPurchaseView(row){
                this.isEdit = true;
                this.getRequest('/erp/purchase/'+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.oldPurchase = resp.data;
                        this.dialogTitle = "编辑订单";
                        this.dialogVisible = true;
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })
            },
            showAddPurchaseView(){
                this.isEdit = false;
                this.oldPurchase={
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    supplier:{
                        supplierName:''
                    },
                    supplierAccount:{

                    },
                    details:[]
                },
                this.dialogTitle = "添加订单";
                this.dialogVisible = true;
            },
            loadPurchases(){
                this.getRequest('/erp/purchase/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.purchases = resp.data.purchases;
                    this.totalCount = resp.data.count;
                })
            }
        },
        data(){
            return{
                purchases:[],
                currentPage:1,
                totalCount:-1,
                dialogVisible:false,
                dialogTitle:'',
                oldPurchase:{},
                isEdit:false,
                detailDialogVisible:false,
                detailDialogTitle:'',
                currentPurchase:{}
            }
        }
    }
</script>

<style scoped>

</style>