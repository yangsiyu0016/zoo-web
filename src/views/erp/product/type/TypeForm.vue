<template>
    <div>
        <el-form ref="typeForm" :rules="rules" :model="type" label-width="120px">
            <el-form-item label="名称:" prop="name">
                <el-input size="mini" v-model="type.name"></el-input>
            </el-form-item>
            <el-form-item label="编码:" prop="code">
                <el-input :disabled="isEdit" size="mini" v-model="type.code"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveType" size="mini" type="primary">保存</el-button>
                <el-button @click="cancel" size="mini" type="info">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "TypeForm",
        props:{
            oldType:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
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
            cancel(){
                this.$emit("close");
            },
            saveType(){
                this.$refs["typeForm"].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putRequest('/product/type/update',this.type).then((resp)=>{
                                if(resp&&resp.data.status=="200"){

                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("更新失败");
                                }
                            })
                        }else{
                            this.postRequest('/product/type/add',this.type).then((resp)=>{
                                if(resp&&resp.data.status=="200"){

                                    this.$message.success("添加成功");
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
            }
        },
        data(){
            return{
                rules:{
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}],
                    code:[{required:true,message:"编码不能为空",trigger:'blur'}]
                },
                type:{
                    name:'',
                    code:''
                }
            }
        }
    }
</script>

<style scoped>

</style>