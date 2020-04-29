<template>
    <div >
        <el-form size="mini" label-width="120px" :rules="rules" :model="oi" ref="oiForm">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item prop="initDate" label="单据日期">
                            <el-date-picker
                                    align="right"
                                    type="date"
                                    v-model="oi.initDate"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">

                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单号录入方式">
                            <el-select v-model="oi.codeGeneratorType">
                                <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="oi.id||oi.codeGeneratorType=='SELF'">
                        <el-form-item label="单号" prop="code" :required="oi.codeGeneratorType=='SELF'">
                            <el-input v-model="oi.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="仓库" prop="warehouse.id">
                            <el-select v-model="oi.warehouse" value-key="id" placeholder="选择仓库">
                                <el-option
                                        v-for="(item,i) in warehouses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item">

                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card shadow="hover">
                <div slot="header">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               style="float: left" v-show="!oi.processInstanceId"   @click="showAddSkuView">
                        添加产品
                    </el-button>
                </div>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "OpeningInventoryForm",
        mounted(){
            this.loadWarehouses();
        },
        methods:{
            showAddSkuView(){

            },
            loadWarehouses(){
                this.getRequest('/erp/warehouse/all').then((resp)=>{
                    this.warehouses = resp.data;
                })
            }
        },
        data(){
            let checkCode = (rule,value,callback)=>{
                if(this.oi.code===""&&this.oi.codeGeneratorType=='SELF'){
                    callback(new Error("必填：单号"));
                }else{
                    callback();
                }
            };
            return{
                warehouses:[],
                oi:{
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    processInstanceId:'',
                    warehouse:{}
                },
                rules:{
                    initDate:[{required: true, message: '必填:单据日期', trigger: 'blur'}],
                    "warehouse.id":[{required: true, message: '必选:仓库', trigger: 'blur'}],
                    code:[{validator:checkCode}]
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