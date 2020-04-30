<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddPositionView">
                        添加职位
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="positions" size="mini">
                    <el-table-column type="index" width="30"></el-table-column>
                    <el-table-column prop="name" align="left"  label="名称" ></el-table-column>
                    <el-table-column prop="code" align="left"  label="编码"></el-table-column>
                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px"><el-pagination
                        background
                        :page-size="10"
                        :current-page="currentPage"
                        layout="prev,pager,next"
                        :total="totalCount">
                </el-pagination>

                </div>
            </el-main>
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <position-form :isEdit="isEdit" :oldPosition="oldPosition" @close="closeWin" @callback="callback"></position-form>
        </el-dialog>
    </div>
</template>

<script>
    import PositionForm from "@/views/system/rbac/PositionForm";
    export default {
        name: "Position",
        components: {PositionForm},
        mounted(){
            this.loadPosition();
        },
        methods:{
            //保存成功后调用
            callback(){
                this.loadPosition();
                this.dialogVisible = false;
            },
            //关闭编辑窗口
            closeWin(){
                this.dialogVisible = false;
            },
            //添加职位
            showAddPositionView(){
                this.isEdit = false;
                this.oldPosition = {
                    name:'',
                    code:''
                },
                this.dialogTitle="添加职位";
                this.dialogVisible = true;
            },
            loadPosition(){
                let _this = this;
                this.getRequest("/position/page?page="+this.currentPage+
                    "&size=10").then(resp=>{
                    if(resp&&resp.status==200){
                        let data = resp.data;
                        _this.positions = data.positions;
                        _this.totalCount = data.count;
                    }
                })
            }
        },
        data(){
            return{
                positions:[],
                currentPage:1,
                totalCount:-1,
                dialogTitle:'',
                dialogVisible:false,
                isEdit:false,
                oldPosition:{}
            }
        }
    }
</script>

<style scoped>

</style>