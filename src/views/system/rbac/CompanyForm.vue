<template>
    <div>
        <el-form ref="companyForm" :rules="rules" :model="company">
            <el-form-item label="名称：" label-width="120px" prop="name">
                <el-input prefix-icon="el-icon-edit" v-model="company.name" size="mini"
                          placeholder="请输入公司名称"></el-input>
            </el-form-item>
            <el-form-item label="类型：" label-width="120px" prop="companyType.id">
                <el-select :disabled="isEdit" value-key="id" v-model="company.companyType" size="mini"  style="float: left">
                    <el-option
                            v-for="item in typeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="管理员账号：" label-width="120px" prop="userName">
                <el-input :disabled="isEdit" prefix-icon="el-icon-edit" v-model="company.userName" size="mini"
                          placeholder="请输入管理员账号"></el-input>
            </el-form-item>
            <el-form-item label="简介："  label-width="120px" prop="description">
                <el-input type="textarea" prefix-icon="el-icon-edit" v-model="company.description" size="mini"
                          placeholder="简介"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary" @click="saveCompany('companyForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "CompanyForm",
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldCompany:{
                type:Object,
                default: ()=>{}
            }
        },
        watch:{
            oldCompany:{
                handler(val){
                    this.company = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.loadTypes();
        },
        methods:{
            saveCompany(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/company/update',this.company).then(resp=>{
                                if(resp&&resp.status==200){

                                    this.$message({type:resp.status,message:'修改成功'});
                                    this.$emit("callback");
                                }
                            })
                        }else{
                            this.postNoEnCodeRequest("/company/add",this.company).then(resp=>{
                                if(resp&&resp.status==201){
                                    this.$message({type:resp.status,message:'添加成功'});
                                    this.$emit("callback");
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
            },
            loadTypes(){

                let _this = this;
                _this.getRequest('/company/type/all').then(resp=>{
                    _this.typeOptions = resp.data;
                })
            }
        },
        data(){
            return{
                rules:{
                    name:[{required:true,message:'名称不能为空',trigger:'blur'}],
                    'companyType.id':[{required:true,message:'类型不能为空',trigger:'blur'}],
                    userName:[{required: true, message: '必填:管理员账号', trigger: 'blur'}]
                },
                company:{
                    name:'',
                    companyType:{

                    },
                    userName:''
                },
                typeOptions:{}
            }
        }
    }
</script>

<style scoped>

</style>