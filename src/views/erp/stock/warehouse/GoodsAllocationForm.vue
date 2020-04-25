<template>
    <div>
        <el-form ref="gaForm" :rules="rules" size="mini" label-width="120px" :model="ga">
            <el-form-item label="名称：" prop="name">
                <el-input v-model="ga.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" size="mini" type="primary">保存</el-button>
                <el-button @click="cancel" size="mini" type="info">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "GoodsAllocationForm",
        props:{
            oldGa:{
                type:Object,
                default:()=>{}
            },
            gaEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldGa:{
                handler(val){
                    this.ga=JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            submit(){
              this.$refs["gaForm"].validate((valid)=>{
                  if(valid){
                      if(this.gaEdit){
                          this.$emit("editGa",this.ga);
                      }else{
                          this.$emit("addGa",this.ga);
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
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}]
                },
                ga:{
                    name:''
                }
            }
        }
    }
</script>

<style scoped>

</style>