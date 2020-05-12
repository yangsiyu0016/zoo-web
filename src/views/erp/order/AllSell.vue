<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="sells" style="width:100%" @row-dblclick="dblclick">
                    <el-table-column type="index" width="30px"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column prop="customer.name" label="客户"></el-table-column>
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
            <sell-details :sell="currentSell" @callback="callback" @close="closeWin" :canDestroy="canDestroy"></sell-details>
        </el-dialog>
    </div>
</template>

<script>

        import SellDetails from '@/views/erp/sell/SellDetails';

        export default {
        name: "AllSell",
        components: {
            SellDetails
        },
        mounted() {
          this.loadSells();
        },
        data(){
            return{
                sells: [],
                totalCount: -1,
                currentPage: 1,
                currentSell: {},
                detailsDialogVisible: false,
                detailsDialogTitle: '',
                canDestroy: false
            }
        },
        methods: {
            loadSells(){
                this.getRequest('/erp/sell/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.sells = resp.data.sells;
                    this.totalCount = resp.data.count;
                })
            },
            showDetails(row) {
                this.dblclick(row);
            },
            //列表双击事件
            dblclick(row){
                this.canDestroy = true;
                this.getRequest('/erp/sell/'+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.currentSell = resp.data;
                        this.detailsDialogVisible = true;
                        this.detailsDialogTitle="订单查看";
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })
            },
            //关闭编辑窗口
            closeWin(){
                this.detailsDialogVisible = false;
            },
            callback() {
                this.detailsDialogVisible = false;
                this.loadSells();
            }
        }
    }
</script>

<style scoped>

</style>