<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddOiView">
                        添加单据
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="ois" size="mini" @row-dblclick="dblclick">
                    <el-table-column type="selection" align="left" width="30"></el-table-column>
                    <el-table-column prop="code" align="left"  label="单号" ></el-table-column>
                    <el-table-column prop="initDate" align="left"  label="下单日期"  ></el-table-column>
                    <el-table-column prop="warehouse.name" align="left"  label="仓库" ></el-table-column>
                    <el-table-column  align="left"  label="状态" >
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-else-if="scope.row.status=='ZGSH'" type="warning" size="mini" effect="dark">仓库主管审核</el-tag>
                            <el-tag v-else-if="scope.row.status=='CWSH'" type="danger" size="mini" effect="dark">财务审核</el-tag>
                            <el-tag v-else-if="scope.row.status=='FINISHED'" type="success" size="mini" effect="dark">流程完成</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cuser.realName" align="left"  label="创建人" ></el-table-column>
                    <el-table-column prop="ctime" align="left"  label="创建日期" ></el-table-column>
                    <el-table-column prop="etime" align="left"  label="完成日期" ></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" @click="startFlow(scope.row)" size="mini" type="success" style="padding: 3px 4px 3px 4px;margin: 2px">启动流程</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" @click="showEditOiView(scope.row)" size="mini" type="primary" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="77%">
            <opening-inventory-form :isEdit="isEdit" :oldOi="oldOi" @close="closeWin" @callback="callback"></opening-inventory-form>
        </el-dialog>
        <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
            <opening-inventory-details @close="closeDetailsWin" :oi="currentOi"></opening-inventory-details>
        </el-dialog>
    </div>
</template>

<script>
    import OpeningInventoryForm from "@/views/erp/stock/oi/OpeningInventoryForm";
    import OpeningInventoryDetails from "@/views/erp/stock/oi/OpeningInventoryDetails";
    export default {
        name: "index",
        components: {OpeningInventoryDetails, OpeningInventoryForm},
        mounted(){
            this.loadData();
        },
        methods:{
            //关闭详情页
            closeDetailsWin(){
                this.detailsDialogVisible = false;
            },
            //列表双击事件
            dblclick(row){
                this.getRequest('/oi/getOiById?id='+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.currentOi = resp.data;
                        this.detailsDialogVisible = true;
                        this.detailsDialogTitle="订单查看";
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })

            },
            //显示订单详情
            showDetails(row){
                this.dblclick(row);
            },
            startFlow(row){
                this.$confirm("确定要启动审批流程吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.postRequest('/oi/startFlow?id='+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("启动成功");
                            this.loadData();

                        }else{
                            this.$message.error("启动失败");
                        }
                    })
                })
            },
            callback(){
                this.dialogVisible = false;
                this.loadData();
            },
            closeWin(){
                this.dialogVisible = false;
            },
            //翻译状态码
            statusFormat(row,column){
                if(row.status=="WTJ"){
                    return "未提交";
                }
            },
            loadData(){
                this.getRequest('/oi/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.ois = resp.data.ois;
                    this.totalCount = resp.data.count;
                })
            },
            //显示修改视图
            showEditOiView(row){
                this.getRequest("/oi/getOiById?id="+row.id).then((resp)=>{
                    this.isEdit = true;
                    this.oldOi=resp.data;
                    this.dialogTitle="编辑单据";
                    this.dialogVisible = true;
                })

            },
            //显示添加视图
            showAddOiView(){
                this.isEdit = false;
                this.oldOi = {
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    processInstanceId:'',
                    warehouse:{},
                    details:[]
                };
                this.dialogTitle="添加单据";
                this.dialogVisible = true;

            }
        },
        data(){
            return{
                currentPage:1,
                totalCount:-1,
                dialogVisible:false,
                dialogTitle:'',
                ois:[],
                oldOi:{},
                isEdit:false,
                detailsDialogTitle:'',
                detailsDialogVisible:false,
                currentOi:[]
            }
        }
    }
</script>

<style scoped>

</style>