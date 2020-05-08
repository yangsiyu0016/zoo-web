<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddExpressView">
                        添加
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div>
                    <el-table :data="expresses" size="mini">
                        <el-table-column type="index" width="50px"></el-table-column>
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="类型" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.type=='LOGISTICS'">物流</span>
                                <span v-else>快递</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="联系电话" prop="phone"></el-table-column>
                        <el-table-column label="始发地址" prop="startAddress"></el-table-column>
                        <el-table-column label="备注" prop="description"></el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showEditExpressView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button @click="deleteExpress(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: space-between;margin: 2px">
                        <el-button
                                type="danger"
                                size="mini"
                                v-if="expresses.length>0" :disabled="multipleSelection.length==0">批量删除</el-button>
                        <el-pagination
                                background
                                :page-size="10"
                                :current-page="currentPage"
                                @current-change="currentChange"
                                layout="prev,pager,next"
                                :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
            <logistics-form :isEdit="isEdit" :oldExpress="oldExpress"  @close="onClose" @callback="callback"></logistics-form>
        </el-dialog>
    </div>
</template>

<script>
    import LogisticsForm from "@/views/system/base/LogisticsForm";
    export default {
        name: "Logistics",
        components: {LogisticsForm},
        mounted() {
            this.loadExpresses();
        },
        methods:{
            deleteExpress(){
                this.$message.error("正在开发中……");
            },
            callback(){
                this.dialogVisible = false;
                this.loadExpresses();
            },
            onClose(){
                this.dialogVisible = false;
            },
            currentChange(currentChange){
                this.currentPage = currentChange;
                this.loadExpresses();
            },
            showEditExpressView(row){
                this.getRequest('/system/express/getExpressById?id='+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.isEdit = true;

                        this.oldExpress = resp.data;
                        this.dialogVisible = true;
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })

            },
            showAddExpressView(){
                this.isEdit = false;
                this.dialogVisible = true;
                this.dialogTitle="添加物流信息";
                this.oldExpress = {
                    name:'',
                    phone:'',
                    startAddress:'',
                    type:'LOGISTICS'
                };
            },
            loadExpresses(){
                this.getRequest('/system/express/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.expresses = resp.data.expresses;
                    this.totalCount = resp.data.count;
                })
            }
        },
        data(){
            return{
                multipleSelection:[],
                dialogVisible:false,
                dialogTitle:'',
                expresses:[],
                currentPage:1,
                totalCount:-1,
                isEdit:false,   //是否是编辑
                oldExpress:{} //即将被编辑的物流数据
            }
        }
    }
</script>

<style scoped>

</style>