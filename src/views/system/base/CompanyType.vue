<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">

                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddTypeView">
                        添加类型
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div>

                    <el-table
                            :data="types"
                            border
                            stripe
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column prop="name" align="left"  label="名称" ></el-table-column>
                        <el-table-column prop="description" align="left"  label="说明" ></el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showEditTypeView(scope.row)"  type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button @click="showResourceView(scope.row)"  type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">可访问资源</el-button>
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
            <company-type-form :isEdit="isEdit" :oldType="oldType" @close="closeDialog" @callback="callback"></company-type-form>
        </el-dialog>
        <el-dialog :title="resourceDialogTitle" :visible.sync="resourceDialogVisible" :close-on-click-modal="false">
            <resource-tree :typeId="typeId" @close="closeResourceDialog"></resource-tree>
        </el-dialog>
    </div>
</template>

<script>
    import CompanyTypeForm from "@/views/system/base/CompanyTypeForm";
    import ResourceTree from "@/views/system/base/ResourceTree";
    export default {
        name: "CompanyType",
        components: {ResourceTree, CompanyTypeForm},
        mounted(){
            this.loadTypes();
        },
        methods:{
            closeResourceDialog(){
                this.typeId='';
                this.resourceDialogVisible = false;
            },
            showResourceView(row){
                this.typeId=row.id;
                this.resourceDialogTitle="可访问资源设置";
                this.resourceDialogVisible = true;
            },
            callback(){
                this.closeDialog();
                this.loadTypes();
            },
            closeDialog(){
                this.dialogVisible = false;
            },
            showEditTypeView(row){
                this.isEdit = true;
                this.oldType = row;
                this.dialogTitle="编辑类型";
                this.dialogVisible = true;
            },
            showAddTypeView(){
                this.isEdit = false;
                this.oldType={
                    name:'',
                    description:''
                }
                this.dialogVisible=true;
                this.dialogTitle='添加类型';
            },
            loadTypes(){
                let _this = this;
                this.getRequest("/company/type/page?page="+this.currentPage+
                    "&size=10").then(resp=>{
                    if(resp&&resp.status==200){
                        let data = resp.data;
                        _this.types = data.types;
                        _this.totalCount = data.count;
                    }
                })
            }
        },
        data(){
            return{
                types:[],
                currentPage:1,
                totalCount:-1,
                dialogVisible:false,
                dialogTitle:'',
                isEdit:false,
                oldType:{},
                resourceDialogTitle:'',
                resourceDialogVisible:false,
                typeId:''
            }
        }
    }
</script>

<style scoped>

</style>