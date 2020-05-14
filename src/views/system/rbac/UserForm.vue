<template>
    <div>
        <el-form ref="userForm" :model="user" size="mini" :rules="rules" label-width="120px">
            <el-form-item label="姓名：" prop="realName">
                <el-input prefix-icon="el-icon-edit" v-model="user.realName" size="mini"
                          placeholder="请输入用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" prop="userName">
                <el-input prefix-icon="el-icon-edit" v-model="user.userName" size="mini"
                          placeholder="请输入登录用户名"></el-input>
            </el-form-item>
            <el-form-item label="职位：">
                <el-select v-model="user.positions"
                           size="mini"
                           multiple placeholder="请选择"
                           value-key="id" style="float: left">
                    <el-option
                            v-for="item in positionOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                    </el-option>

                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary" @click="saveUser('userForm')">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "UserForm",
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldUser:{
                type:Object,
                default: ()=>{}
            }
        },
        watch:{
            oldUser:{
                handler(val){
                    this.user = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.initPositionData();
        },
        methods:{
            saveUser(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/user/update',this.user).then(resp=>{
                                if(resp&&resp.status==200){

                                    this.$message({type:resp.status,message:'修改成功'});
                                    this.$emit("callback");
                                }
                            })
                        }else{
                            this.postNoEnCodeRequest("/user/add",this.user).then(resp=>{
                                if(resp){
                                    this.$message({type:"success",message:'添加成功'});
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
            initPositionData(){
                this.getRequest('/position/all').then(resp=>{
                    this.positionOptions = resp.data;
                });
            }
        },
        data(){
            return{
                positionOptions:[],
                user:{
                    realName:'',
                    userName:'',
                    positions:[]
                },
                rules:{
                    realName:[{required: true, message: '必填:姓名', trigger: 'blur'}],
                    userName:[{required: true, message: '必填:用户名', trigger: 'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>