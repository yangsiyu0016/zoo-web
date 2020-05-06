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
                <el-table :data="purchases">
                    <el-table-column type="index" width="30px"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column prop="customer.name" label="供应商"></el-table-column>
                    <el-table-column prop="cuser.realName" label="创建人"></el-table-column>
                    <el-table-column prop="ctime" label="创建时间"></el-table-column>
                    <el-table-column prop="etime" label="完成时间"></el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button  type="primary" @click="showEditSellView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
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
            <purchase-form></purchase-form>
        </el-dialog>
    </div>
</template>

<script>
    import PurchaseForm from "@/views/erp/purchase/PurchaseForm";
    export default {
        name: "List",
        components: {PurchaseForm},
        methods:{
            showAddSellView(){
                this.dialogTitle = "添加订单";
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                purchases:[],
                currentPage:1,
                totalCount:-1,
                dialogVisible:false,
                dialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>