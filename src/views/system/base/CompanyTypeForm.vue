<template>
    <div>
        <el-form ref="typeForm" :model="type" label-width="120px" size="mini" :rules="rules">
            <el-form-item label="名称：" prop="name">
                <el-input prefix-icon="el-icon-edit" v-model="type.name" size="mini"
                          placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="说明：" prop="description">
                <el-input type="textarea" prefix-icon="el-icon-edit" v-model="type.description" size="mini"
                          placeholder="请输入说明"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary" @click="save('typeForm')">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "CompanyTypeForm",
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldType:{
                type:Object,
                default: ()=>{}
            }
        },
        watch:{
            oldType:{
                handler(val){
                    this.type = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            save(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putRequest('/company/type/update',this.type).then(resp=>{
                                if(resp&&resp.status==200){

                                    this.$message({type:resp.status,message:'修改成功'});
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("修改失败");
                                }
                            })
                        }else{
                            this.postRequest("/company/type/add",this.type).then(resp=>{
                                if(resp&&resp.status==201){
                                    this.$message({type:resp.status,message:'添加成功'});
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("添加失败");
                                }
                            })
                        }

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
                rules:{
                    name:[{required:true,message:'名称不能为空',trigger:'blur'}]
                },
                type:{
                    name:'',
                    description:''
                }
            }
        }
    }
</script>

<style scoped>

</style>