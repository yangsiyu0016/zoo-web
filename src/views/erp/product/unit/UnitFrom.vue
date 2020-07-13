<template>
    <div>
        <el-form ref="unitForm" :rules="rules" :model="unit" label-width="120px">
            <el-form-item label="名称" prop="name">
                <el-input size="mini" v-model="unit.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveUnit" type="primary" size="mini">保存</el-button>
                <el-button @click="cancel" type="info" size="mini">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "UnitFrom",
        props: {
            oldUnit:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldUnit: {
                handler(val){
                    this.unit=JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            //this.loadTypes();
        },
        methods:{
            saveUnit(){
                this.$refs["unitForm"].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/product/unit/update',this.unit).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }else{
                            this.postNoEnCodeRequest('/product/unit/addUnit',this.unit).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            });
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
                unit:{
                    name:''
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