<template>
    <div>
        <el-form ref="directoryForm" size="mini" label-width="120px" :model="directory" :rules="rules">
            <el-form-item label="上级目录名称:" prop="parentId">
                <el-input size="mini"  class="input-with-select"  disabled  style="float:left;width:400px" v-model="directory.parentId">
                    <el-button size="mini" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="目录名称:" prop="name">
                <el-input v-model="directory.name"></el-input>
            </el-form-item>
            <el-form-item label="序号:" prop="orderNumber">
                <el-input-number :min="0" style="float: left" v-model="directory.orderNumber"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveDirectory('directoryForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "DirectoryForm",
        methods:{

            saveDirectory(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.postNoEnCodeRequest('/system/parameterDirectory/addDirectory',this.directory).then(resp=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("保存成功");
                                this.$emit("callback");
                            }else{
                                this.$message.error(resp.data.msg);
                            }
                        })
                    }else{
                       return false;
                    }
                })
            },
            cancel(){
                this.$emit("close");
            }
        },
        data(){
            return{
                directory:{
                    parentId:'',
                    name:'',
                    orderNumber:0
                },
                rules:{
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>