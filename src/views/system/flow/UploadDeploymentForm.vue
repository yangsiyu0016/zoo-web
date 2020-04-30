<template>
    <div>
        <el-form :model="deployment" :rules="rules" ref="uploadDeploymentForm" label-width="120px">
            <el-form-item label="公司:" prop="companyId">
                <el-select v-model="deployment.companyId" size="mini" style="float: left">
                    <el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-upload
                        ref="upload"
                        class="upload-demo"
                        :auto-upload="false"
                        action="http://192.168.1.237:8081/flow/deployment/upload"
                        :file-list="fileList"
                        :multiple="false"
                        :on-success="upFile"
                        :limit="1"
                        :data="upData"
                        :with-credentials="true">
                    <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>

                <el-button size="mini" type="primary" @click="uploadDeployment('uploadDeploymentForm')">确 定</el-button>
                <el-button size="mini" type="info" @click="cancelEdit">取 消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "UploadDeploymentForm",
        mounted(){
            this.loadCompany();
        },
        computed:{
            upData:function(){
                return {
                    body:JSON.stringify(this.deployment)
                }
            }
        },
        methods:{
            uploadDeployment(formName){
                let _this = this;
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.$refs.upload.submit();

                    }else{
                        return false;
                    }
                });
            },
            cancelEdit(){
                this.$emit("close");
            },
            upFile(res,file){
                if(res){
                    this.$message({type:res,message:'上传成功'});
                }else {
                    this.$message({type:res,message:'上传失败'});
                    let _this = this;
                    setTimeout(function() {
                        _this.$refs.upload.clearFiles();
                    }, 1000);
                }
            },
            loadCompany(){
                let _this = this;
                _this.getRequest('/company/all').then(resp=>{
                    _this.companyOptions = resp.data;
                })
            }
        },
        data(){
            return{
                fileList:[],
                companyOptions:{},
                deployment:{
                    companyId:''
                },
                rules:{
                    companyId:[{required: true, message: '必选:公司', trigger: 'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>