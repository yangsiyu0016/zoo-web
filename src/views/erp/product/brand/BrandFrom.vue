<template>
    <div>
        <el-form ref="brandForm" :rules="rules" :model="brand" label-width="120px">
            <el-form-item label="名称" prop="name">
                <el-input size="mini" v-model="brand.name"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="typeIds">
                <el-cascader v-model="brand.typeIds" style="float: left;width: 400px;padding-top:7px" size="mini" :props="props" :options="types">

                </el-cascader>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveBrand" type="primary" size="mini">保存</el-button>
                <el-button @click="cancel" type="info" size="mini">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "BrandFrom",
        props: {
            oldBrand:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldBrand: {
                handler(val){
                    this.brand=JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.loadTypes();
        },
        methods:{
            saveBrand(){
                this.$refs["brandForm"].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putRequest('/product/brand/update',this.brand).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("更新失败");
                                }
                            })
                        }else{
                            this.postRequest('/product/brand/add',this.brand).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("保存失败");
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
            },
            loadTypes(){
                this.getRequest('/product/type/tree').then((result)=>{
                    this.types = result.data;
                })
            }
        },
        data(){
            return{
                props:{
                    label:"name",
                    value:'id',
                    multiple:true
                },
                types:[],
                brand:{
                    name:'',
                    typeIds:[]
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