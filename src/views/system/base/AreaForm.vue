<template>
    <div>
        <el-form :model="area" ref="areaForm" :rules="rules" size="mini" label-width="120px">
            <el-form-item label="名称：" prop="name">
                <el-input size="mini" v-model="area.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveArea" size="mini" type="primary">保存</el-button>
                <el-button @click="cancel" size="mini" type="info">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "AreaForm",
        props:{
            oldNode:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldNode:{
                handler(val){
                    this.area = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            saveArea(){
                this.$refs["areaForm"].validate((valid)=>{
                    if(valid){
                        this.$emit("callback",this.area);
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
                  name:[{required:true,message:"名称不能为空",trigger:'blur'}]
              },
                area:{
                  name:''
                }
            }
        }
    }
</script>

<style scoped>

</style>