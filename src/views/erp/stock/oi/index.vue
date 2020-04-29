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
                <el-table :data="ois" size="mini">
                    <el-table-column type="selection" align="left" width="30"></el-table-column>
                    <el-table-column prop="code" align="left"  label="单号" ></el-table-column>
                    <el-table-column prop="initDate" align="left"  label="下单日期"  ></el-table-column>
                    <el-table-column prop="warehouse.name" align="left"  label="仓库" ></el-table-column>
                    <el-table-column prop="status" align="left"  label="状态" :formatter="statusFormat" ></el-table-column>
                    <el-table-column prop="cuser.realName" align="left"  label="创建人" ></el-table-column>
                    <el-table-column prop="ctime" align="left"  label="创建日期" ></el-table-column>
                    <el-table-column prop="etime" align="left"  label="完成日期" ></el-table-column>
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
            <opening-inventory-form></opening-inventory-form>
        </el-dialog>
    </div>
</template>

<script>
    import OpeningInventoryForm from "@/views/erp/stock/oi/OpeningInventoryForm";
    export default {
        name: "index",
        components: {OpeningInventoryForm},
        mounted(){
            this.loadData();
        },
        methods:{
            statusFormat(row,column){

            },
            loadData(){
                this.getRequest('/oi/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.ois = resp.data.ois;
                    this.totalCount = resp.data.count;
                })
            },
            showAddOiView(){
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
                ois:[]
            }
        }
    }
</script>

<style scoped>

</style>