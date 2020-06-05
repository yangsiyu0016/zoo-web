<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddSellView">
                        添加订单
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="sells"  size="mini" style="width:100%" @row-dblclick="dblclick">
                    <el-table-column type="index" width="30px"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column prop="customer.name" label="客户"></el-table-column>
                    <el-table-column prop="freightType" label="运费类型">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.freightType=='YES'" type="success" size="mini" effect="dark">包邮</el-tag>
                            <el-tag v-if="scope.row.freightType=='NO'" type="warning" size="mini" effect="dark">不包邮</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="付款方式">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.receivableType=='FULLPAYMENT'" type="success" size="mini" effect="dark">全款发货</el-tag>
                            <el-tag v-if="scope.row.receivableType=='LOAN'" type="warning" size="mini" effect="dark">借款抵</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column  label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-if="scope.row.status=='CWSH'" type="warning" size="mini" effect="dark">财务审核</el-tag>
                            <el-tag v-if="scope.row.status=='OUT'"  color="#7b1fa2" size="mini" effect="dark">出库中...</el-tag>
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
                            <el-button v-show="scope.row.status=='WTJ'"  type="primary" @click="showEditSellView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false"  width="77%">
            <sell-form :isEdit="isEdit" :oldSell="oldSell" @close="closeWin" @callback="callback"></sell-form>
        </el-dialog>
        <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
            <sell-details @close="closeDetailDialog" :sell="currentSell" :isReception="isReception" @callback="callbackDetails"></sell-details>
        </el-dialog>
    </div>
</template>

<script>
    import SellForm from "@/views/erp/sell/SellForm";
    import SellDetails from "@/views/erp/sell/SellDetails";

    export default {
        name: "List",
        components: {SellDetails, SellForm},
        mounted(){
            this.loadSells();
        },
        methods:{
            startFlow(row){
                this.$confirm("确定要启动审批流程吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.postRequest('/erp/sell/startFlow?id='+row.id).then((resp)=>{
                        if(resp&&resp.data.status==200){
                            this.$message.success("启动成功");
                            this.loadSells();

                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            //列表双击事件
            dblclick(row){
                this.getRequest('/erp/sell/'+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.currentSell = resp.data;
                        this.detailsDialogVisible = true;
                        this.detailsDialogTitle="订单查看";
                        if(resp.data.isClaimed=='N'&&resp.data.status=='CWSH'){
                            this.isReception = true;
                        }else{
                            this.isReception = false;
                        }
                        /*if (resp.data.isClaimed !== 'Y' && (resp.data.status !== 'WTJ' || resp.data.status === 'DESTORY')) {
                            this.isReception = true;
                        }else {
                            this.isReception = false;
                        }*/
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })

            },
            closeDetailDialog(){
                this.detailsDialogVisible = false;
            },
            //显示订单详情
            showDetails(row){
                this.dblclick(row);
            },
            callback(){
                this.dialogVisible = false;
                this.loadSells();
            },
            callbackDetails() {
                this.detailsDialogVisible = false;
                this.loadSells();
            },
            //关闭编辑窗口
            closeWin(){
                this.dialogVisible = false;
            },
            //编辑订单
            showEditSellView(row){
                this.isEdit = true;
                this.getRequest('/erp/sell/'+row.id).then((resp)=>{
                    this.oldSell = resp.data;
                })
                this.dialogVisible = true;
                this.dialogTitle = "编辑订单";
            },
            //添加订单
            showAddSellView(){
                this.isEdit = false;
                this.oldSell = {
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    customer:{
                        name:''
                    },
                    receiving:{},
                    receivableType:'FULLPAYMENT',
                    freightType:'YES',
                    description:'',
                    details:[],
                    annexs:[]
                };
                this.dialogVisible = true;
                this.dialogTitle = "添加订单";
            },
            //加载 订单
            loadSells(){
                this.getRequest('/erp/sell/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.sells = resp.data.sells;
                    this.totalCount = resp.data.count;
                })
            }
        },
        data(){
            return{
                sells:[],
                currentPage:1,
                totalCount:-1,
                dialogTitle:'',
                dialogVisible:false,
                isEdit:false,
                oldSell:[],
                currentSell:[],
                detailsDialogVisible:false,
                detailsDialogTitle:'',
                isReception: false
            }
        }
    }
</script>

<style scoped>

</style>