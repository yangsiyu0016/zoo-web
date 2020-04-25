<template>
    <div>
        <el-form :rules="rules" ref="linkmanForm" :model="linkman" label-width="120px">
            <el-form-item label="姓名:" prop="realName">
                <el-input size="mini"  v-model="linkman.realName" ></el-input>
            </el-form-item>
            <el-form-item label="称呼:" prop="nikeName">
                <el-input size="mini" v-model="linkman.nikeName"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
                <el-select size="mini" v-model="linkman.sex">
                    <el-option v-for="item in sexs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职位:" prop="sex">
                <el-input size="mini" v-model="linkman.job"></el-input>
            </el-form-item>
            <el-form-item label="座机:" prop="telphone">
                <el-input size="mini" v-model="linkman.telphone" ></el-input>
            </el-form-item>
            <el-form-item label="手机:" prop="cellphone">
                <el-input size="mini" v-model="linkman.cellphone" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input size="mini" v-model="linkman.email" ></el-input>
            </el-form-item>
            <el-form-item label="生日:" prop="birthday">
                <el-date-picker size="mini"
                                align="right"
                                type="date"
                                v-model="linkman.birthday"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions">

                </el-date-picker>
            </el-form-item>
            <el-form-item label="备注:" prop="description">
                <el-input type="textarea" size="mini" v-model="linkman.description" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="submitForm('linkmanForm')">保存</el-button>
                <el-button size="mini" @click="resetForm('linkmanForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "LinkmanForm",
        props:{
            oldLinkman:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldLinkman: {
                handler(val){
                    if(val){
                        this.linkman = JSON.parse(JSON.stringify(val));
                    }else{
                        this.linkman={
                            realName:'',
                            nikeName:'',
                            sex:1,
                            job:'',
                            telphone:'',
                            cellphone:'',
                            email:'',
                            birthday:'',
                            description:''
                        }
                    }

                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            submitForm(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.$emit("editLinkman",this.linkman);
                        }else{
                            this.$emit("addLinkman",this.linkman);
                        }

                        this.linkman={
                            realName:'',
                            nikeName:'',
                            sex:1,
                            job:'',
                            telphone:'',
                            cellphone:'',
                            email:'',
                            birthday:'',
                            description:''
                        }
                    }else{
                        return false;
                    }
                })
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            }
        },
        data(){
            return{
                sexs:[{
                    value:1,
                    label:'男'
                },{
                    value:0,
                    label:'女'
                }],
                rules:{
                    realName:[{required:true,message:'必填:姓名', trigger: 'blur'}]
                },
                linkman:{
                    realName:'',
                    nikeName:'',
                    sex:'1',
                    job:'',
                    telphone:'',
                    cellphone:'',
                    email:'',
                    birthday:'',
                    description:''
                },
                //日期选择器
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }
            }
        }
    }
</script>

<style scoped>

</style>