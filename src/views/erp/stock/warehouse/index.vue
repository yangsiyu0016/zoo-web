<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddWarehouseView">
                        添加仓库
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div>
                    <el-table :data="warehouses" size="mini" style="width:100%">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column prop="name" align="left"  label="名称" ></el-table-column>
                        <el-table-column prop="address" align="left"  label="地址" ></el-table-column>
                        <el-table-column  align="left"  label="管理员" >
                            <template slot-scope="scope" >
                                <div v-for="(item,index) in scope.row.managers" :key="index">
                                    <span>{{item.realName}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showEditWarehouseView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button @click="deleteWarehouse" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: space-between;margin: 2px">
                        <el-pagination
                                background
                                :page-size="10"
                                :current-page="currentPage"
                                layout="prev,pager,next"
                                @current-change="currentChange"
                                :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <warehouse-form :isEdit="isEdit" :oldWarehouse="oldWarehouse" @callback="callback" @close="closeWin"></warehouse-form>
        </el-dialog>
    </div>
</template>

<script>
    import WarehouseForm from "@/views/erp/stock/warehouse/WarehouseForm";
    export default {
        name: "index",
        components: {WarehouseForm},
        mounted(){
            this.loadWarehouse();
        },
        methods:{
            currentChange(page){
                alert(page);
            },
            deleteWarehouse(){
              this.$message.info("删除请联系统管理员");
            },
            callback(){
                this.dialogVisible = false;
                this.loadWarehouse();
            },
            loadWarehouse(){
                var _this = this;
                this.tablLoading = true;
                this.getRequest("/erp/warehouse/page?page="+this.currentPage+
                    "&size=10").then(resp=>{
                    if(resp&&resp.status==200){
                        var data = resp.data;
                        _this.warehouses = data.warehouses;
                        _this.totalCount = data.count;
                    }
                })
            },
            closeWin(){
                this.dialogVisible= false;
            },
            showEditWarehouseView(warehouse){
                this.isEdit = true;
                this.oldWarehouse= warehouse;
                this.dialogVisible = true;
                this.dialogTitle = "编辑仓库";
            },
            showAddWarehouseView(){
                this.isEdit = false;
                this.oldWarehouse={
                    name:'',
                    address:'',
                    managers:[],
                    goodsAllocations:[]
                };
                this.dialogVisible = true;
                this.dialogTitle = "添加仓库";
            }
        },
        data(){
            return{
                dialogTitle:'',
                dialogVisible:false,
                currentPage:1,
                totalCount:-1,
                warehouses:[],
                oldWarehouse:{},
                isEdit:false
            }
        }
    }
</script>

<style scoped>

</style>