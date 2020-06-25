<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showUploadView">
                        上传流程
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div>
                    <el-table :data="deployments" size="mini">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column prop="companyName" align="left"  label="公司名称" ></el-table-column>
                        <el-table-column prop="name" align="left"  label="流程名称" ></el-table-column>
                        <el-table-column prop="key" align="left"  label="key"></el-table-column>
                        <el-table-column prop="deploymentId" align="left"  label="部署ID"></el-table-column>
                        <el-table-column prop="version" align="left"  label="版本"></el-table-column>
                        <el-table-column prop="resourceName" align="left"  label="resourceName"></el-table-column>
                        <el-table-column prop="dgrmResourceName" align="left"  label="dgrmResourceName"></el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: space-between;margin: 2px">
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
            <upload-deployment-form @close="closeWin"></upload-deployment-form>
        </el-dialog>
    </div>
</template>

<script>
    import UploadDeploymentForm from "@/views/system/flow/UploadDeploymentForm";
    export default {
        name: "index",
        components: {UploadDeploymentForm},
        mounted(){
            this.loadDeployments();
        },
        methods:{
            closeWin(){
                this.dialogVisible = false;
            },
            showUploadView(){
                this.dialogVisible = true;
                this.dialogTitle="上传流程";
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadDeployments();
            },
            loadDeployments(){
                let _this = this;
                this.tablLoading = true;
                this.getRequest("/flow/deployment/page?page="+this.currentPage+
                    "&size=10").then(resp=>{
                    this.tablLoading = false;
                    if(resp&&resp.status==200){
                        let data = resp.data;
                        _this.deployments = data.deployments;
                        _this.totalCount = data.count;
                    }
                })
            }
        },
        data(){
            return{
                deployments:[],
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