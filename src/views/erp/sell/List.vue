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
                <el-table :data="sells"  size="mini" style="width:100%">
                    <el-table-column type="index" width="30px"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column prop="customer.name" label="客户"></el-table-column>
                    <el-table-column  label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-else-if="scope.row.status=='ZGSH'" type="warning" size="mini" effect="dark">仓库主管审核</el-tag>
                            <el-tag v-else-if="scope.row.status=='CWSH'" type="danger" size="mini" effect="dark">财务审核</el-tag>
                            <el-tag v-else-if="scope.row.status=='FINISHED'" type="success" size="mini" effect="dark">流程完成</el-tag>
                        </template>
                    </el-table-column>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false"  width="77%">
            <sell-form :isEdit="isEdit" :oldSell="oldSell" @close="closeWin" @callback="callback"></sell-form>
        </el-dialog>

    </div>
</template>

<script>
    import SellForm from "@/views/erp/sell/SellForm";

    export default {
        name: "List",
        components: {SellForm},
        mounted(){
            this.loadSells();
        },
        methods:{
            callback(){
                this.dialogVisible = false;
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
                    details:[]
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
                oldSell:[]

            }
        }
    }
</script>

<style scoped>

</style>