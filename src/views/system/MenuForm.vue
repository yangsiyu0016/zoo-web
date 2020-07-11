<template>
    <div>
        <el-form ref="menuForm" label-width="120px" :model="menu" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="名称:" prop="name">
                        <el-input size="mini"  v-model="menu.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="标题:" prop="title">
                        <el-input size="mini"  v-model="menu.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="类型" prop="type">
                        <el-select size="mini" style="float: left"  v-model="menu.type">
                            <el-option value="NORMAL" label="普通菜单"></el-option>
                            <el-option value="BOTH" label="BOTH"></el-option>
                            <el-option value="ADMIN" label="超级管理员专用"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item label="路径" prop="path">
                        <el-input size="mini" v-model="menu.path"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="组件" prop="component">
                        <el-input size="mini"  v-model="menu.component"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="图标">
                        <el-input size="mini" v-model="menu.iconCls"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-button size="mini" @click="cancel" type="info">取消</el-button>
            <el-button size="mini" @click="saveMenu" type="primary">保存</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "MenuForm",
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldMenu:{
                type:Object,
                default:()=>{}
            }
        },
        methods:{
            saveMenu(){
                this.$refs["menuForm"].validate((valid)=>{
                    if(valid){
                        this.$emit("callback",this.menu);


                    }else{
                        return;
                    }
                })
            },
            cancel(){
                this.$emit("closeDialog");
            }
        },
        data(){

            return{
                menu:{
                    name:'',
                    title:'',
                    iconCls:'',
                    path:'',
                    component:'',
                    type:'NORMAL'
                },
                rules:{
                    name:[{required: true, message: '必填:名称', trigger: 'blur'}],
                    title:[{required: true, message: '必填:title', trigger: 'blur'}],
                    path:[{required: true, message: '必填:path', trigger: 'blur'}],
                    component:[{required: true, message: '必填:组件', trigger: 'blur'}]
                }
            }
        },
        watch:{
            oldMenu:{
              handler(val){
                  this.menu = JSON.parse(JSON.stringify(val));
              },
                deep: true,
                immediate :true
            }

        }
    }
</script>

<style scoped>

</style>