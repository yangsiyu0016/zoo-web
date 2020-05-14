<template>
    <div>
        <el-form :model="position" ref="positionForm" size="mini" label-width="120px" :rules="rules">
            <el-form-item label="名称" prop="name">
                <el-input size="mini" v-model="position.name"></el-input>
            </el-form-item>
            <el-form-item label="编码" prop="code">
                <el-input size="mini" v-model="position.code"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="savePosition" size="mini" type="primary">保存</el-button>
                <el-button @click="cancel" size="mini" type="info">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "PositionForm",
        props:{
          isEdit:{
              type:Boolean,
              default:false
          },
            oldPosition:{
              type:Object,
                default: ()=>{}
            }
        },
        watch:{
            oldPosition: {
                handler(val){
                    this.position = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            //保存
            savePosition(){
                this.$refs['positionForm'].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/position/update',this.position).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }else{
                            this.postNoEnCodeRequest('/position/add',this.position).then((resp)=>{
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
            //取消
            cancel(){
                this.$emit("close");
            }
        },
        data(){
            return{
                position:{
                    name:'',
                    code:''
                },
                rules:{
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}],
                    code:[{required:true,message:"编码不能为空",trigger:'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>