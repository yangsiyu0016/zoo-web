<template>
    <div>
        <el-form size="mini" :model="purchase" :rules="rules" ref="purchaseForm" label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8" >
                            <el-form-item prop="initDate"  label="单据日期:">
                                <el-date-picker
                                        style="float: left"
                                        align="right"
                                        type="date"
                                        size="mini"
                                        v-model="purchase.initDate"
                                        placeholder="选择日期"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy 年 MM 月 dd 日"
                                        :picker-options="pickerOptions">

                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="!purchase.id">
                            <el-form-item label="单号录入方式:">
                                <el-select size="mini" v-model="purchase.codeGeneratorType">
                                    <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                    <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="purchase.id||purchase.codeGeneratorType=='SELF'">
                            <el-form-item label="单号:" prop="code" :required="purchase.codeGeneratorType=='SELF'">
                                <el-input size="mini" v-model="purchase.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="供应商:" prop="supplier.name">
                                <el-input size="mini"  class="input-with-select" v-model="purchase.supplier.name"  disabled  style="float:left;width:400px">
                                    <el-button size="mini" slot="append" icon="el-icon-search" @click="selectSupplier"></el-button>
                                </el-input>
                            </el-form-item >
                        </el-col>
                    </el-row>
                </div>
            </el-card>

            <el-card shadow="hover">
                <el-form-item>
                    <el-button @click="savePurchase" type="primary">保存</el-button>
                    <el-button type="info">取消</el-button>
                </el-form-item>
            </el-card>

        </el-form>
        <supplier-dialog :title="suppplierDialogTitle" :visible="supplierDialogVisible" @close="closeWin"></supplier-dialog>
    </div>
</template>

<script>
    import SupplierDialog from "@/components/dialog/SupplierDialog";
    export default {
        name: "PurchaseForm",
        components: {SupplierDialog},
        methods:{
            //close
            closeWin(){
                this.supplierDialogVisible = false;
            },
            //选择供应商
            selectSupplier(){
                this.supplierDialogVisible = true;
                this.suppplierDialogTitle="选择供应商";
            },
            //保存订单
            savePurchase(){
                this.$refs['purchaseForm'].validate((valid)=>{
                    if(valid){
                        this.$message.success("验证成功");
                    }else{
                        return false;
                    }
                })
            }
        },
        data(){
            return{
                purchase:{
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    supplier:{
                        name:''
                    }
                },
                rules:{
                    initDate:[{required:true,message:'选择日期',trigger:'blue'}],
                    'supplier.name':[{required:true,message:'选择供应商',trigger:'blue'}]
                },
                supplierDialogVisible:false,
                suppplierDialogTitle:'',
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