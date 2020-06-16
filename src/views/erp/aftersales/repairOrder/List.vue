<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddRepairOrderView">
                        添加订单
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="repairOrders" @row-dblclick="rowDblclick">
                    <el-table-column type="index" width="30px"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column prop="customer.name" label="客户名称"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
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
                            <el-button v-show="scope.row.status=='WTJ'" type="primary" @click="showEditRepairOrderView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" @click="deleteRepairOrder(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        background
                        :page-size="10"
                        @current-change="currentChange"
                        :current-page="currentPage"
                        layout="prev,pager,next"
                        :total="totalCount">
                </el-pagination>
            </el-main>

        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="77%">
            <repair-order-form :isEdit="isEdit" :oldRepairOrder="oldRepairOrder" @close="closeWin" @callback="callback"></repair-order-form>
        </el-dialog>
    </div>
</template>

<script>

    import RepairOrderForm from "@/views/erp/aftersales/repairOrder/RepairOrderForm";

    export default {
        name: "List",
        components: {RepairOrderForm},
        data() {
            return{
                repairOrders: [],
                totalCount: -1,
                currentPage: 1,
                dialogVisible: false,
                dialogTitle: '',
                isEdit: false,
                oldRepairOrder: {}
            }
        },
        mounted() {
            this.initDate();
        },
        methods: {
            //关闭详情窗口
            closeWin() {
                this.dialogVisible = false;
            },
            //返回维修单列表
            callback() {
                this.dialogVisible = false;
                this.initDate();
            },
            //加载数据
            initDate() {
                this.getRequest('/erp/repairOrder/page?page=' + this.currentPage + '&size=10').then(resp => {
                    if (resp && resp.data){
                        this.repairOrders = resp.data.repairOrders;
                        this.totalCount = resp.data.count;
                    }
                })
            },
            //换页
            currentChange(page) {
                this.currentPage = page;
                this.initDate();
            },
            //添加维修单
            showAddRepairOrderView() {
                this.isEdit = false;
                this.oldRepairOrder= {
                    initDate:'',
                    codeGeneratorType: 'AUTO',
                    code:'',
                    customer:{
                        name:''
                    },
                    reason:'',
                    problemDescription:'',
                    details:[]
                };
                this.dialogTitle = "添加订单";
                this.dialogVisible = true;
            },
            //双击一条数据
            rowDblclick() {

            },
            //查看详情
            showDetails() {

            },
            //开启流程
            startFlow() {

            },
            //修改换货单
            showEditRepairOrderView(row) {
                this.isEdit = true;
                this.getRequest('/erp/repairOrder/'+row.id).then((resp)=>{
                    this.oldRepairOrder = resp.data;
                })
                this.dialogVisible = true;
                this.dialogTitle = "编辑订单";
            },
            //删除换货单
            deleteRepairOrder() {

            }
        }
    }
</script>

<style scoped>

</style>