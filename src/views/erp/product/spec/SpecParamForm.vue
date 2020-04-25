<template>
    <el-form ref="paramForm" :rules="rules" :model="param" label-width="120px">
        <el-form-item label="参数名称" prop="name">
            <el-input size="mini" v-model="param.name"></el-input>
        </el-form-item>
        <el-form-item >
            <el-checkbox :disabled="isEdit" style="float: left" size="mini" v-model="param.generic">是否为通用参数</el-checkbox>
        </el-form-item>
        <el-form-item>
            <el-button @click="saveParam" size="mini" type="primary">保存</el-button>
            <el-button @click="cancel" size="mini" type="inof">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "SepcParamForm",
        props:{
          groupId:{
              type:String,
              default:''
          },
            typeId:{
              type:String,
                default:''
            },
            oldParam:{
              type:Object,
                default:()=>{}
            },
            isEdit:{
              type:Boolean,
                default:false
            }
        },
        watch:{
            oldParam: {
                handler(val){
                    this.param=JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            saveParam(){
                this.$refs['paramForm'].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putRequest('/product/spec/updateParam',this.param).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功！");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("更新失败");
                                }
                            })
                        }else{
                            Object.assign(this.param,{groupId:this.groupId,typeId:this.typeId});
                            this.postRequest('/product/spec/addParam',this.param).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功！");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("保存失败");
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
                param:{
                    name:'',
                    generic:true
                },
                rules:{
                    name:[{required:true,message:"参数名称不能为空",trigger:'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>