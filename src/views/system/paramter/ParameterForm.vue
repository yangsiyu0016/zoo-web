<template>
    <div>
        <el-form ref="parameterForm" size="mini" label-width="120px" :rules="rules" :model="parameter">
            <el-form-item label="目录名称:" prop="parameterDirectory.name">
                <el-input size="mini"  class="input-with-select"  disabled  style="float:left;width:400px" v-model="parameter.parameterDirectory.name">
                    <el-button size="mini" slot="append" icon="el-icon-search" @click="showDirectoryDialog"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="参数名称:" prop="name">
                <el-input v-model="parameter.name"></el-input>
            </el-form-item>
            <el-form-item label="参数值" prop="parameterValue">
                <el-input v-model="parameter.parameterValue"></el-input>
            </el-form-item>
            <el-form-item label="参数代码:" prop="code">
                <el-input v-model="parameter.code"></el-input>
            </el-form-item>

            <el-form-item label="备注:" prop="description">
                <el-input type="textarea" v-model="parameter.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveParameter('parameterForm')">保存</el-button>
            </el-form-item>
        </el-form>

        <directory-dialog :dialogVisible="directoryDialogVisible" :dialogTitle="directoryDialogTitle" @close="closeDirectoryDialog" @callback="directoryCallback"></directory-dialog>
    </div>
</template>

<script>
    import DirectoryDialog from "@/views/system/paramter/DirectoryDialog";
    export default {
        name: "ParameterForm",
        components: {DirectoryDialog},
        props:{
            oldParameter: {
                type: Object,
                default: ()=> {}
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            oldParameter:{
                handler(val){
                    this.parameter = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            saveParameter(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        if (this.isEdit) {
                            this.postNoEnCodeRequest('/system/parameter/updateParameter',this.parameter).then(resp=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }else {
                            this.postNoEnCodeRequest('/system/parameter/addParameter',this.parameter).then(resp=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }
                    }else{
                        return false;
                    }
                })
            },
            directoryCallback(row){
                this.parameter.parameterDirectory = row;
                this.closeDirectoryDialog();
            },
            closeDirectoryDialog(){
                this.directoryDialogVisible = false;
            },
            showDirectoryDialog(){
                this.directoryDialogTitle="选择参数目录";
                this.directoryDialogVisible = true;
            },
            cancel(){
                this.$emit("close");
            }
        },
        data(){
            return{
                parameter:{
                    parameterDirectory:{
                        name:''
                    },
                    name:'',
                    code:'',
                    description:'',
                    parameterValue:''
                },
                rules:{
                    'parameterDirectory.name':[{required:true,message:'请选择目录',trigger:'blur'}],
                    name:[{required:true,message:'名称不能为空',trigger:'blur'}],
                    code:[{required:true,message:'代码不能为空',trigger:'blur'}],
                    parameterValue:[{required:true,message:'参数值不能为空',trigger:'blur'}]
                },
                directoryDialogVisible:false,
                directoryDialogTitle:''
            }

        }
    }
</script>

<style scoped>

</style>