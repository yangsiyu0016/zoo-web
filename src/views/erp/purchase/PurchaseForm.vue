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
                                <el-input :disabled="isEdit" size="mini" v-model="purchase.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="供应商:" prop="supplier.name">
                                <el-input size="mini"  class="input-with-select" v-model="purchase.supplier.supplierName"  disabled  style="float:left;width:400px">
                                    <el-button size="mini" slot="append" icon="el-icon-search" @click="selectSupplier"></el-button>
                                </el-input>
                            </el-form-item >
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="付款账号:" prop="supplierAccount.id">
                                <el-select style="float:left;width:400px" size="mini" value-key="id" v-model="purchase.supplierAccount" >
                                    <el-option v-for="(item,i) in accounts" :key="i" :label="item.accountContext" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
                            :data="purchase.details"
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" width="200" ></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>

                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                        <el-table-column label="收货仓库" prop="warehouse.name"></el-table-column>


                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="价格" prop="price"></el-table-column>
                        <el-table-column label="总额" prop="totalMoney"></el-table-column>
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
                    <el-button @click="savePurchase" type="primary">保存</el-button>
                    <el-button @click="cancel" type="info">取消</el-button>
                </el-form-item>
            </el-card>

        </el-form>
        <supplier-dialog :title="suppplierDialogTitle" :visible="supplierDialogVisible" @close="closeWin" @callback="callback"></supplier-dialog>
        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" @close="closeDetailDialog" :append-to-body="true">
            <purchase-detail-form :isEdit="detailIsEdit" @close="closeDetailDialog" :oldDetail="oldDetail" @callback="editDetail"></purchase-detail-form>
        </el-dialog>
    </div>
</template>

<script>
    import SupplierDialog from "@/components/dialog/SupplierDialog";
    import PurchaseDetailForm from "@/views/erp/purchase/PurchaseDetailForm";
    export default {
        name: "PurchaseForm",
        components: {PurchaseDetailForm, SupplierDialog},
        props:{
            oldPurchase:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldPurchase:{
                handler(val){
                    this.purchase = JSON.parse(JSON.stringify(val));
                    this.loadAccounts(this.purchase.supplier.id);
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            //删除产品
            deleteDetail(row){
                if(this.isEdit){
                    this.$confirm("确定要删除吗?","提示",{
                        confirmButtonText:"确定",
                        cancelButtonText:'取消',
                        type:'warning'
                    }).then(()=>{
                        this.deleteRequest('/erp/purchase/detail/'+row.id).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("删除成功");
                                this.purchase.details.some((item,i)=>{
                                    if(item==row){
                                        this.purchase.details.splice(i,1);
                                        return true;
                                    }
                                })
                            }else{
                                this.$message.error("删除失败");
                            }
                        })
                    })
                }else{
                    this.purchase.details.some((item,i)=>{
                        if(item==row){
                            this.purchase.details.splice(i,1);
                        }
                    })
                }

            },
            editDetail(row){
                if(this.detailIsEdit){//修改
                    if(this.isEdit){
                        this.putNoEnCodeRequest("/erp/purchase/detail/update",row).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("更新成功");
                                this.purchase.details.some((item,i)=>{
                                    if(item==this.oldDetail){
                                        this.purchase.details.splice(i,1,row);
                                        this.detailDialogVisible = false;
                                    }
                                })
                            }else{
                                this.$message.error(resp.data.msg);
                            }
                        })
                    }else{
                        this.purchase.details.some((item,i)=>{
                            if(item==this.oldDetail){
                                this.purchase.details.splice(i,1,row);
                                this.detailDialogVisible = false;
                            }
                        })
                    }

                }else{//新增
                    if(this.isEdit){
                        Object.assign(row,{purchaseId:this.purchase.id});
                        this.postNoEnCodeRequest('/erp/purchase/detail/add',row).then((resp)=>{
                            if(resp&&resp.data.status==200){
                                this.$message.success("添加成功");
                                this.purchase.details.push(row);
                                this.detailDialogVisible = false;
                            }else{
                                this.$message.error(resp.data.msg);
                            }
                        })
                    }else{
                        this.purchase.details.push(row);
                        this.detailDialogVisible = false;
                    }

                }

            },
            closeDetailDialog(){
                this.detailDialogVisible = false;
            },
            showEditSkuView(row){
                this.detailIsEdit = true;
                this.oldDetail = row;
                this.detailDialogVisible = true;
                this.detailDialogTitle = "编辑产品";
            },

            //显示添加产品界面
            showAddSkuView(){
                this.detailIsEdit = false;
                this.oldDetail={
                    productSku: {
                        product: {
                            name: ''
                        }
                    },
                    warehouse: {},
                    number: 0,
                    price: 0,
                    totalMoney: 0
                },
                this.detailDialogVisible = true;
                this.detailDialogTitle = "添加产品";
            },
            cancel(){
                this.$emit("close");
            },
            callback(row){
                this.accounts = row.supplierAccounts;
                this.purchase.supplier = row;
                this.supplierDialogVisible = false;
            },
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
                        if(this.isEdit){//更新
                            this.putNoEnCodeRequest('/erp/purchase/updatePurchase',this.purchase).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }else{//新增
                            this.postNoEnCodeRequest('/erp/purchase/addPurchase',this.purchase).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }

                    }else{
                        return false;
                    }
                })
            },
            //加载开户信息
            loadAccounts(supplierId){
                this.getRequest('/erp/supplierAccount/getSupplierAccountsById?id='+supplierId).then((resp)=>{
                    this.accounts = resp.data.supplierAccounts;
                });
            }
        },
        data(){
            return{
                accounts:[],
                purchase:{
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    supplier:{
                        supplierName:''
                    },
                    supplierAccount:{

                    },
                    details:[]
                },
                rules:{
                    initDate:[{required:true,message:'选择日期',trigger:'blue'}],
                    'supplier.supplierName':[{required:true,message:'选择供应商',trigger:'blue'}]
                },
                supplierDialogVisible:false,
                suppplierDialogTitle:'',
                detailDialogVisible:false,
                detailDialogTitle:'',
                oldDetail:{},
                detailIsEdit:false,
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