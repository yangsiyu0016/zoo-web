<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
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
        <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
            <inventory-check-details :currentCheck="currentCheck" @callback="callback" @close="closeDetailsDialog" @showDetails="showDetails" :isReception="isReception"></inventory-check-details>
        </el-dialog>
    </div>
</template>

<script>

    import InventoryCheckDetails from "@/views/erp/stock/inventorycheck/InventoryCheckDetails";

    export default {
        name: "AllInventoryCheck",
        components: {InventoryCheckDetails},
        data(){
            return{
                inventorychecks: [],
                currentPage: 1,
                totalCount: -1,
                currentCheck: {},
                detailsDialogTitle: '',
                detailsDialogVisible: false,
                isReception: false
            }
        },
        mounted(){
            this.initData();
        },
        methods: {

            callback(){
                this.closeDetailsDialog();
                this.initData();
            },
            //加载分页数据
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
            //双击时间
            dblclick(row){
                this.getRequest('/inventoryCheck/getIcById?id='+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.detailsDialogTitle="订单查看";
                        this.detailsDialogVisible = true;
                        this.currentCheck = resp.data;

                        this.isReception = false;
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })
            },
            closeDetailsDialog(){
                this.detailsDialogVisible = false;
            },
            showDetails(row){
                this.dblclick(row);
            },
        }
    }
</script>

<style scoped>

</style>