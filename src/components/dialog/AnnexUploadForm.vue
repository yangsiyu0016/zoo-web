<template>
    <div>
        <el-form :model="annex" size="mini" :rules="rules" ref="annexForm" label-width="80px">
            <el-form-item label="标题：" prop="title">
                <el-input size="mini" v-model="annex.title" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-upload
                        ref="upload"
                        class="upload-demo"
                        :auto-upload="false"
                        action="http://192.168.1.237:8081/annex/upload"
                        accept=".pdf,.PDF"
                        :before-upload="beforeUpload"
                        :file-list="fileList"
                        :multiple="false"
                        :on-success="upFile"
                        :limit="1"
                        :data="upData"
                        :with-credentials="true">
                    <el-button slot="trigger" size="mini" type="primary" icon="el-icon-folder-add">选取文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>

                <el-button size="mini" type="primary" @click="uploadAnnex('annexForm')" icon="el-icon-check">确 定</el-button>
                <el-button size="mini" type="info" @click="cancelEdit" icon="el-icon-close">取 消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "AnnexUploadForm",
        props:{
            oldAnnex:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldAnnex:{
                handler(val){
                    this.annex = JSON.parse(JSON.stringify(val));

                },
                deep:true,
                immediate:true
            }
        },
        data() {
            return{
                fileList: [],
                annex:{
                    title:''
                },
                rules:{
                    title:[{required: true, message: '标题不能为空', trigger: 'blur'}]
                }
            }
        },
        computed:{
            upData:function(){
                return {
                    body:JSON.stringify(this.annex)
                }
            }
        },
        methods: {
            beforeUpload(file) {
                let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
                const isPdf = fileType === 'PDF' || fileType === 'pdf';
                if (!isPdf) {
                    this.$message({
                        message: '附件格式只支持 pdf / PDF 格式',
                        type: 'warning'
                    })
                    return false;
                }
                const isLt10 = file.size/1024/1024 < 10;
                if (!isLt10) {
                    this.$message({
                        message:'附件最大只支持10M',
                        type: 'warning'
                    })
                    return false;
                }
                return isPdf || isLt10;
            },

            uploadAnnex(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.$refs.upload.submit();
                    }else{
                        return false;
                    }
                });

            },
            upFile(res){

                if(res&&res.status=="200"){
                    this.$emit('addAnnex', res.annex);
                    this.$message({type:res,message:'上传成功'});
                    this.$refs.upload.clearFiles();
                }else {
                    this.$message({type:res,message:res.msg});
                    let _this = this;
                    setTimeout(function() {
                        _this.$refs.upload.clearFiles();
                    }, 1000);
                }
            },
            cancelEdit() {
                this.$emit('close');
                this.$refs.upload.clearFiles();
            }
        }
    }
</script>

<style scoped>

</style>