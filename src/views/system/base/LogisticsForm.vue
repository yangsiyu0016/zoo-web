<template>
    <el-form :model="express" ref="expressForm" :rules="rules"  label-width="80px" label-position="right">
        <el-form-item label="名称" prop="name" >
            <el-input size="mini" v-model="express.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
            <el-select size="mini" style="float: left" v-model="express.type">
                <el-option label="物流" value="LOGISTICS"></el-option>
                <el-option label="快递" value="EXPRESS"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
            <el-input size="mini" v-model="express.phone"></el-input>
        </el-form-item>
        <el-form-item label="始发地址" prop="startAddress">
            <el-input size="mini" v-model="express.startAddress"></el-input>
        </el-form-item>
        <el-button size="mini" @click="saveExpress" type="primary">保存</el-button>
        <el-button size="mini" @click="close" type="info">取消</el-button>
    </el-form>
</template>

<script>
    export default {
        name: "LogisticsForm",
        props:{
            oldExpress:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldExpress: {
                handler(val){
                    this.express = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            saveExpress(){
                this.$refs['expressForm'].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/system/express/updateExpress',this.express).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("更新失败")
                                }
                            })
                        }else{
                            this.postNoEnCodeRequest('/system/express/addExpress',this.express).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("保存失败")
                                }
                            })
                        }

                    }else{
                        return false;
                    }
                })
            },
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                express:{
                    name:'',
                    phone:'',
                    startAddress:'',
                    type:'LOGISTICS'
                },
                rules:{
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}],
                    type:[{required:true,message:"类型不能为空",trigger:'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>