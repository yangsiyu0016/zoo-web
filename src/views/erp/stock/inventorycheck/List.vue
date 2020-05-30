<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddCheckView">
                        添加盘点单
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="inventorychecks"  size="mini" style="width:100%" @row-dblclick="dblclick">
                    <el-table-column type="index" width="30px"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column  label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-if="scope.row.status=='ZGSH'"  color="#7b1fa2" size="mini" effect="dark">仓库主管人员审核</el-tag>
                            <el-tag v-if="scope.row.status=='CW'" type="warning" size="mini" effect="dark">财务记账</el-tag>
                            <el-tag v-if="scope.row.status=='REJECT'" type="primary" size="mini" effect="dark">订单调整</el-tag>
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
                            <el-button v-show="scope.row.status=='WTJ'"  type="primary" @click="showEditCheckView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="77%">
            <inventory-check-form :isEdit="isEdit" :oldCheck="oldCheck" @close="closeDialog" @callback="callback"></inventory-check-form>
        </el-dialog>
        <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
            <inventory-check-details :currentCheck="currentCheck" @close="closeDetailsDialog" @callback="callbackDatails" :isReception="isReception"></inventory-check-details>
        </el-dialog>
    </div>
</template>

<script>
    import InventoryCheckForm from "@/views/erp/stock/inventorycheck/InventoryCheckForm";
    import InventoryCheckDetails from "@/views/erp/stock/inventorycheck/InventoryCheckDetails";
    export default {
        name: "List",
        components: {InventoryCheckDetails, InventoryCheckForm},
        mounted(){
            this.initData();
        },
        methods:{

            callbackDatails(){
                this.closeDetailsDialog();
                this.initData();
            },

            startFlow(row){
                this.$confirm("确定要启动审批流程吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.postRequest('/inventoryCheck/startFlow?id='+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("启动成功");
                            this.initData();

                        }else{
                            this.$message.error("启动失败");
                        }
                    })
                })
            },
            closeDetailsDialog(){
                this.detailsDialogVisible = false;
            },
            callback(){
                this.closeDialog();
                this.initData();
            },
            closeDialog(){
                this.dialogVisible = false;
            },
            showDetails(row){
                this.dblclick(row);
            },
            dblclick(row){
                this.getRequest('/inventoryCheck/getIcById?id='+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.detailsDialogTitle="订单查看";
                        this.detailsDialogVisible = true;
                        this.currentCheck = resp.data;
                        if (resp.data.isClaimed !== 'Y' && (resp.data.status !== 'WTJ' || resp.data.status === 'DESTORY')) {
                            this.isReception = true;
                        }else {
                            this.isReception = false;
                        }
                    }else{
                        this.$message.error("获取订单失败");
                    }
                });

            },
            initData(){
                this.getRequest('/inventoryCheck/page?page='+this.currentPage+'&size=10').then((resp)=>{
                    if(resp&&resp.data){
                        this.inventorychecks = resp.data.ics;
                        this.totalCount = resp.data.count;
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })

            },
            showEditCheckView(row){
                this.isEdit = true;
                this.getRequest('/inventoryCheck/getIcById?id='+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.dialogTitle="编辑盘点单";
                        this.dialogVisible = true;
                        this.oldCheck = resp.data;
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })

            },
            showAddCheckView(){
                this.isEdit = false;
                this.oldCheck = {
                    code:'',
                    codeGeneratorType:'AUTO',
                    initData:'',
                    warehouse:{
                        name:''
                    },
                    details:[]
                };
                this.dialogTitle="添加盘点单";
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                currentPage:1,
                totalCount:-1,
                inventorychecks:[],
                dialogTitle:'',
                dialogVisible:false,
                oldCheck:{},
                isEdit:false,
                detailsDialogTitle:'',
                detailsDialogVisible : false,
                currentCheck:{},
                isReception: false
            }
        }
    }
</script>

<style scoped>

</style>