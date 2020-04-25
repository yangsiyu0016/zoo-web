<template>
    <div>
        <el-form ref="groupForm" :rules="rules" :model="group" label-width="120px">
            <el-form-item label="组名" prop="name">
                <el-input size="mini" v-model="group.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveGroup" size="mini" type="primary">保存</el-button>
                <el-button @click="cancel" size="mini" type="inof">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "SepcGroupForm",
        props:{
            typeId:{
                type:String,
                default:''
            },
            oldGroup:{
                type:Object,
                default: ()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldGroup:{
                handler(val){
                    this.group = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            cancel(){
                this.$emit("close");
            },
            saveGroup(){
                this.$refs['groupForm'].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putRequest('/product/spec/updateGroup',this.group).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功！");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("更新失败！");
                                }
                            })
                        }else{
                            Object.assign(this.group,{typeId:this.typeId});
                            this.postRequest('/product/spec/addGroup',this.group).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功！");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("保存失败！");
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
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}]
                },
                group:{
                    name:""
                }
            }

        }
    }
</script>

<style scoped>

</style>