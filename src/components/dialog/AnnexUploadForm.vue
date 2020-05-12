<template>
    <div>
        <el-form>
            <el-form-item>
                <el-upload
                        ref="upload"
                        class="upload-demo"
                        :auto-upload="false"
                        action="http://192.168.1.177:8081/annex/upload"
                        :file-list="fileList"
                        :multiple="false"
                        :on-success="upFile"
                        :limit="1"
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
        name: "AnnexUploadForm",
        data() {
            return{
                fileList: [],
                uploadData: {
                    purchaseId: ''
                }
            }
        },
        methods: {

            uploadDeployment(){

                this.$refs.upload.submit();
            },
            upFile(res){
                if(res){
                    this.$emit('addAnnex', res.annex);
                    this.$message({type:res,message:'上传成功'});
                }else {
                    this.$message({type:res,message:'上传失败'});
                    let _this = this;
                    setTimeout(function() {
                        _this.$refs.upload.clearFiles();
                    }, 1000);
                }
            },
            cancelEdit() {
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>

</style>