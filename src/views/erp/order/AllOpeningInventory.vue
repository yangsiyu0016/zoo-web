<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">

            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="ois"  @row-dblclick="dblclick">
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
            <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
                <opening-inventory-details @close="closeDetailsWin" :oi="currentOi" :canDestroy="canDestroy"></opening-inventory-details>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
    import OpeningInventoryDetails from '@/views/erp/stock/oi/OpeningInventoryDetails';
    export default {
        name: "AllOpeningInventory",
        components:{OpeningInventoryDetails},
        data() {
            return{
                ois: [],
                currentPage: 1,
                totalCount: -1,
                currentOi: {},
                detailsDialogVisible: false,
                detailsDialogTitle: '',
                canDestroy: false
            }
        },
        mounted() {
            this.loadOis();
        },
        methods: {

            //关闭详情页
            closeDetailsWin(){
                this.detailsDialogVisible = false;
            },
            //单行双击事件
            dblclick(row) {
                this.canDestroy = true;
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
            //查看详情
            showDetails(row) {
                this.dblclick(row);
            },
            //加载数据
            loadOis() {
                this.getRequest('/oi/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.ois = resp.data.ois;
                    this.totalCount = resp.data.count;
                })
            }
        }
    }
</script>

<style scoped>

</style>