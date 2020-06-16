<template>
    <div>
        <el-form size="mini" :model="repairOrder" :rules="rules" ref="repairOrderForm" label-width="120px">
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
                                        v-model="repairOrder.initDate"
                                        placeholder="选择日期"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy 年 MM 月 dd 日"
                                        :picker-options="pickerOptions">

                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="!repairOrder.id">
                            <el-form-item label="单号录入方式:">
                                <el-select size="mini" v-model="repairOrder.codeGeneratorType">
                                    <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                    <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="repairOrder.id||repairOrder.codeGeneratorType=='SELF'">
                            <el-form-item label="单号:" prop="code" :required="repairOrder.codeGeneratorType=='SELF'">
                                <el-input :disabled="isEdit" size="mini" v-model="repairOrder.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="客户名称:" prop="customer.name">
                                <el-input size="mini"  class="input-with-select" v-model="repairOrder.customer.name"  disabled  style="float:left;width:400px">
                                    <el-button size="mini" slot="append" icon="el-icon-search" @click="selectCustomer"></el-button>
                                </el-input>
                            </el-form-item >
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="原因:" prop="reason">
                                <el-select size="mini" style="float: left;width: 400px"  v-model="repairOrder.reason">
                                    <el-option label="拍错/不喜欢/效果不好" value="拍错/不喜欢/效果不好"></el-option>
                                    <el-option label="材质与商品描叙不符" value="材质与商品描叙不符"></el-option>
                                    <el-option label="大小尺寸与商品描叙不符" value="大小尺寸与商品描叙不符"></el-option>
                                    <el-option label="卖家发错货" value="卖家发错货"></el-option>
                                    <el-option label="假冒品牌" value="假冒品牌"></el-option>
                                    <el-option label="收到商品少件/破损或污渍" value="收到商品少件/破损或污渍"></el-option>
                                    <el-option label="做工粗糙/有瑕疵" value="做工粗糙/有瑕疵"></el-option>
                                    <el-option label="其他" value="其他"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <!--<el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="问题描述:" prop="problemDescription">
                                <el-input type="textarea" v-model="repairOrder.problemDescription"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               style="float: left"    @click="showAddSkuView">
                        添加产品
                    </el-button>
                    <el-table
                            :data="repairOrder.details"
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" width="200" ></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <!--<el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>

                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                        <el-table-column label="出库仓库" prop="warehouse.name"></el-table-column>-->


                        <el-table-column label="维修数量" prop="number"></el-table-column>
                        <!--<el-table-column label="价格" prop="price"></el-table-column>
                        <el-table-column label="总额" prop="totalMoney"></el-table-column>-->
                        <el-table-column
                                label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button  type="primary" @click="showEditSkuView(scope.row)"  style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button type="danger"  @click="deleteDetail(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <el-form-item>
                    <el-button @click="saveRepairOrder" type="primary">保存</el-button>
                    <el-button @click="cancel" type="info">取消</el-button>
                </el-form-item>
            </el-card>
        </el-form>
        <customer-dialog @callback="customerCallback" @closeWin="closeCustomerWin" :title="customerDialogTitle" :visible="customerDialogVisible"></customer-dialog>
        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <repair-order-detail-form :oldDetail="oldDetail" @close="closeDetailDialog" @callback="detailCallback"></repair-order-detail-form>
        </el-dialog>
    </div>
</template>

<script>

    import CustomerDialog from "@/components/dialog/CustomerDialog";
    import RepairOrderDetailForm from "@/views/erp/aftersales/repairOrder/RepairOrderDetailForm";

    export default {
        name: "RepairOrderForm",
        components:{CustomerDialog, RepairOrderDetailForm },
        props: {
            isEdit: {
                type: Boolean,
                default: false
            },
            oldRepairOrder: {
                type: Object,
                default: ()=>{}
            }
        },
        watch: {
            oldRepairOrder: {
                handler(val) {
                    this.repairOrder = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods: {
            cancel() {
                this.$emit('close');
            },
            closeDetailDialog() {
                this.detailDialogVisible = false;
            },
            detailCallback(detail) {
                if(this.detailIsEdit){
                    if(this.isEdit){
                        this.putNoEnCodeRequest('/erp/repairOrder/detail/update',detail).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("更新成功");
                                this.repairOrder.details.some((item,i)=>{
                                    if(item==this.oldDetail){
                                        this.repairOrder.details.splice(i,1,detail);
                                    }
                                })
                                this.detailDialogVisible = false;
                            }else{
                                this.$message.error("更新失败");
                            }
                        })
                    }else{
                        this.repairOrder.details.some((item,i)=>{
                            if(item==this.oldDetail){
                                this.repairOrder.details.splice(i,1,detail);
                            }
                        })
                        this.detailDialogVisible = false;
                    }

                }else{
                    if(this.isEdit){
                        Object.assign(detail,{repairOrderId:this.repairOrder.id});
                        this.postNoEnCodeRequest('/erp/repairOrder/detail/add',detail).then((resp)=>{
                            if(resp&&resp.data.status==200){
                                this.$message.success("保存成功");
                                this.repairOrder.details.push(resp.data.detail);
                                this.detailDialogVisible = false;
                            }else{
                                this.$message.error("保存失败");
                            }
                        })
                    }else{
                        this.repairOrder.details.push(detail);
                        this.detailDialogVisible = false;
                    }

                }
            },
            //客户选择赋值
            customerCallback(row){
                this.customerDialogVisible = false;
                this.repairOrder.customer = row;
                //this.receivings = row.receivings;
            },
            //关闭客户选择框
            closeCustomerWin(){
                this.customerDialogVisible = false;
            },
            //选择客户
            selectCustomer(){
                this.customerDialogVisible = true;
                this.customerDialogTitle="选择客户";
            },
            showAddSkuView(){
                this.detailIsEdit = false;
                this.oldDetail = {
                    productSku:{
                        product:{
                            name:''
                        }
                    },
                    warehouse:{

                    },
                    number:0,
                    price:0,
                    totalMoney:0
                },
                    this.detailDialogVisible = true;
                this.detailDialogTitle = "添加产品";
            },
            showEditSkuView(row) {
                this.detailIsEdit = true;
                this.oldDetail = row;
                this.detailDialogVisible = true;
                this.detailDialogTitle="编辑产品";
            },
            deleteDetail(row) {
                if(this.isEdit){
                    this.$confirm("确定要删除吗?","提示",{
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:'warning'
                    }).then(()=>{
                        this.deleteRequest('/erp/repairOrder/detail/'+row.id).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("删除成功");
                                this.repairOrder.details.some((item,i)=>{
                                    if(item==row){
                                        this.repairOrder.details.splice(i,1);
                                        return true;
                                    }
                                })
                            }else{
                                this.$message.error("删除失败");
                            }
                        })
                    })
                }else{
                    this.repairOrder.details.some((item,i)=>{
                        if(item==row){
                            this.repairOrder.details.splice(i,1);
                            return true;
                        }
                    })
                }
            },
            saveRepairOrder() {
                this.$refs['repairOrderForm'].validate((valid)=>{
                    if(valid){
                        let length = this.repairOrder.details.length;
                        if(length>0){
                            if(this.isEdit){
                                this.putNoEnCodeRequest('/erp/repairOrder/updateRepairOrder',this.repairOrder).then((resp)=>{
                                    if(resp.data.status==="200"){
                                        this.$message.success("更新成功");
                                        this.$emit('callback');
                                    }else{
                                        this.$message.error("更新失败");
                                    }
                                })

                            }else{
                                this.postNoEnCodeRequest('/erp/repairOrder/addRepairOrder',this.repairOrder).then((resp)=>{
                                    if(resp.data.status==="200"){
                                        this.$message.success("保存成功");
                                        this.$emit('callback');
                                    }else{
                                        this.$message.error("保存失败");
                                    }
                                })
                            }

                        }else{
                            this.$message.error("请添加产品");
                            return false;
                        }
                    }else{
                        return false;
                    }
                })
            },
        },
        data() {
            return {
                repairOrder: {},
                detailIsEdit: false,
                detailDialogVisible: false,
                detailDialogTitle: '',
                oldDetail: {},
                customerDialogTitle: '',
                customerDialogVisible: false,
                rules:{
                    initDate:[{required: true, message: '必填:单据日期', trigger: 'blur'}],
                    'customer.name':[{required: true, message: '必选：客户', trigger: 'blur'}],
                    //'receiving.id':[{required:true,message:'地址不能为空',trigger:'blur'}]
                    //reason:[{required: true, message: '必填:原因', trigger: 'blur'}],
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