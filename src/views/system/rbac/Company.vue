<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">

                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddCompanyView">
                        添加公司
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div>

                    <el-table
                            :data="companys"
                            border
                            stripe
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column prop="name" align="left"  label="公司名称" ></el-table-column>
                        <el-table-column prop="companyType.name" align="left"  label="类型 "></el-table-column>
                        <el-table-column prop="systemUser.userName" align="left"  label="管理员账号 "></el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showEditCompanyView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
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
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <company-form :isEdit="isEdit" :oldCompany="oldCompany" @close="closeDialog" @callback="callback"></company-form>
        </el-dialog>
    </div>
</template>

<script>
    import CompanyForm from "@/views/system/rbac/CompanyForm";
    export default {
        name: "Company",
        components: {CompanyForm},
        mounted(){
            this.loadCompanys();
        },
        methods:{
            callback(){
                this.loadCompanys();
                this.closeDialog();
            },
            closeDialog(){
                this.dialogVisible = false;
            },
            showEditCompanyView(row){
                this.isEdit = true;
                this.oldCompany = row;
                this.dialogTitle="编辑公司";
                this.dialogVisible = true;
            },
            showAddCompanyView(){
                this.isEdit = false;
                this.oldCompany = {
                    name:'',
                    companyType:{},
                    userName:''
                };
                this.dialogTitle="添加公司";
                this.dialogVisible = true;
            },
            loadCompanys(){
                let _this = this;
                this.getRequest("/company/page?page="+this.currentPage+
                    "&size=10").then(resp=>{
                    if(resp&&resp.status==200){
                        let data = resp.data;
                        _this.companys = data.companys;
                        _this.totalCount = data.totalCount;
                    }
                })
            }
        },
        data(){
            return{
                companys:[],
                currentPage:1,
                totalCount:-1,
                dialogTitle:'',
                dialogVisible:false,
                isEdit:false,
                oldCompany:{}
            }
        }
    }
</script>

<style scoped>

</style>