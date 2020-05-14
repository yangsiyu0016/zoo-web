<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddUserView">
                        添加用户
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="users" size="mini">
                    <el-table-column
                            type="index"
                            align="left"
                            width="30">
                    </el-table-column>
                    <el-table-column prop="realName" align="left"  label="姓名" ></el-table-column>
                    <el-table-column prop="userName" align="left"  label="用户名" ></el-table-column>
                    <el-table-column  align="left"  label="职位" >
                        <template slot-scope="scope" >
                            <div v-for="(item,index) in scope.row.positions" :key="index">
                                <span>{{item.name}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showEditUserView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
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
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <user-form :isEdit="isEdit" :oldUser="oldUser" @close="closeWin" @callback="callback"></user-form>
        </el-dialog>
    </div>
</template>

<script>
    import UserForm from "@/views/system/rbac/UserForm";
    export default {
        name: "User",
        components: {UserForm},
        mounted(){
            this.loadUsers();
        },
        methods:{
            //保存成功后调用
            callback(){
                this.closeWin();
                this.loadUsers();
            },
            //关闭窗口
            closeWin(){
                this.dialogVisible = false;
            },
            //显示编辑用户界面
            showEditUserView(row){
                this.isEdit = true;
                this.oldUser = row;
                this.dialogTitle="编辑用户";
                this.dialogVisible = true;
            },
            //显示添加用户界面
            showAddUserView(){
                this.isEdit = false;
                this.oldUser = {

                };
                this.dialogTitle='添加用户';
                this.dialogVisible = true;
            },
            loadUsers(){
                let _this = this;
                this.tablLoading = true;
                this.getRequest("/user/queryUserByPage?page="+this.currentPage+
                    "&size=10&keywords="+this.keywords).then(resp=>{
                    if(resp&&resp.status==200){
                        let data = resp.data;
                        _this.users = data.users;
                        _this.totalCount = data.count;
                    }
                })
            }
        },
        data(){
            return{
                dialogVisible:false,
                dialogTitle:'',
                isEdit:false,
                oldUser:{},
                currentPage:1,
                totalCount:-1,
                users:[],
                keywords:''
            }
        }
    }
</script>

<style scoped>

</style>