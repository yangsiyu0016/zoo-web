<template>
    <div>
        <el-form ref="sellForm" size="mini" label-width="120px" :rules="rules" :model="sell">
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
                                        v-model="sell.initDate"
                                        placeholder="选择日期"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy 年 MM 月 dd 日"
                                        :picker-options="pickerOptions">

                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="!sell.id">
                            <el-form-item label="单号录入方式:">
                                <el-select size="mini" v-model="sell.codeGeneratorType">
                                    <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                    <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="sell.id||sell.codeGeneratorType=='SELF'">
                            <el-form-item label="单号:" prop="code" :required="sell.codeGeneratorType=='SELF'">
                                <el-input size="mini" v-model="sell.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="客户:" prop="customer.name">
                                <el-input size="mini"  class="input-with-select" v-model="sell.customer.name"  disabled  style="float:left;width:400px">
                                    <el-button size="mini" slot="append" icon="el-icon-search" @click="selectCustomer"></el-button>
                                </el-input>
                            </el-form-item >
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="收货地址:" prop="receiving.id">
                                <el-select size="mini" style="float: left;width: 500px" value-key="id" v-model="sell.receiving">
                                    <el-option v-for="(item,i) in receivings" :key="item.id" :label="item.receivingContext" :value="item"></el-option>
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
                            :data="sell.details"
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" width="200"  fixed></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" fixed></el-table-column>

                        <el-table-column label="发货仓库" prop="warehouse.name"></el-table-column>
                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400" fixed ></el-table-column>
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
                <el-button @click="saveSell" type="primary" size="mini">保存</el-button>
                <el-button @click="cancel" type="info" size="mini">取消</el-button>
            </el-card>
        </el-form>
        <customer-dialog @callback="customerCallback" @closeWin="closeCustomerWin" :title="customerDialogTitle" :visible="customerDialogVisible"></customer-dialog>

        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <sell-detail-form :oldDetail="oldDetail" @close="closeDetailDialog" @callback="detailCallback"></sell-detail-form>
        </el-dialog>
    </div>
</template>

<script>
    import CustomerDialog from "@/components/dialog/CustomerDialog";
    import SellDetailForm from "@/views/erp/sell/SellDetailForm";
    export default {
        name: "SellForm",
        components: {SellDetailForm, CustomerDialog},
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldSell:{
                type:Object,
                default: ()=>{}
            }
        },
        watch:{
            oldSell:{
                handler(val){
                    this.sell = JSON.parse(JSON.stringify(val));
                    this.loadReceivings(this.sell.customer.id);
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            //保存销售单
            saveSell(){
                this.$refs['sellForm'].validate((valid)=>{
                    if(valid){
                        let length = this.sell.details.length;
                        if(length>0){
                            if(this.isEdit){
                                this.putNoEnCodeRequest('/erp/sell/update',this.sell).then((resp)=>{
                                    if(resp.data.status==="200"){
                                        this.$message.success("更新成功");
                                        this.$emit('callback');
                                    }else{
                                        this.$message.error("更新失败");
                                    }
                                })

                            }else{
                                this.postNoEnCodeRequest('/erp/sell/add',this.sell).then((resp)=>{
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
            //callback
            detailCallback(detail){
                if(this.detailIsEdit){
                    if(this.isEdit){
                        this.putNoEnCodeRequest('/erp/sell/detail/update',detail).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("更新成功");
                                this.sell.details.some((item,i)=>{
                                    if(item==this.oldDetail){
                                        this.sell.details.splice(i,1,detail);
                                    }
                                })
                                this.detailDialogVisible = false;
                            }else{
                                this.$message.error("更新失败");
                            }
                        })
                    }else{
                        this.sell.details.some((item,i)=>{
                            if(item==this.oldDetail){
                                this.sell.details.splice(i,1,detail);
                            }
                        })
                        this.detailDialogVisible = false;
                    }

                }else{
                    if(this.isEdit){
                        Object.assign(detail,{sellId:this.sell.id});
                        this.postNoEnCodeRequest('/erp/sell/detail/add',detail).then((resp)=>{
                            if(resp&&resp.data.status==200){
                                this.$message.success("保存成功");
                                this.sell.details.push(resp.data.detail);
                                this.detailDialogVisible = false;
                            }else{
                                this.$message.error("保存失败");
                            }
                        })
                    }else{
                        this.sell.details.push(detail);
                        this.detailDialogVisible = false;
                    }

                }

            },
            //关闭产品编辑页面
            closeDetailDialog(){
                this.detailDialogVisible = false;
            },
            //删除产品
            deleteDetail(row){
                if(this.isEdit){
                    this.$confirm("确定要删除吗?","提示",{
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:'warning'
                    }).then(()=>{
                        this.deleteRequest('/erp/sell/detail/'+row.id).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("删除成功");
                                this.sell.details.some((item,i)=>{
                                    if(item==row){
                                        this.sell.details.splice(i,1);
                                        return true;
                                    }
                                })
                            }else{
                                this.$message.error("删除失败");
                            }
                        })
                    })
                }else{
                    this.sell.details.some((item,i)=>{
                        if(item==row){
                            this.sell.details.splice(i,1);
                            return true;
                        }
                    })
                }

            },
            //显示编辑产品页面
            showEditSkuView(row){
                this.detailIsEdit = true;
                this.oldDetail = row;
                this.detailDialogVisible = true;
                this.detailDialogTitle="编辑产品";
            },
            //显示添加产品页面
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
            //加载收货地址
            loadReceivings(customerId){
                this.getRequest('/customer/receiving/getReceivingsByCustomerId?customerId='+customerId).then((resp)=>{
                    this.receivings = resp.data;
                });
            },
            //客户选择赋值
            customerCallback(row){
                this.customerDialogVisible = false;
                this.sell.customer = row;
                this.receivings = row.receivings;
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
            //取消
            cancel(){
                this.$emit("close");
            }
        },
        data(){
            return{
                sell:{
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    customer:{
                        name:''
                    },
                    receiving:{},
                    details:[]
                },
                rules:{
                    initDate:[{required: true, message: '必填:单据日期', trigger: 'blur'}],
                    'customer.name':[{required: true, message: '必选：客户', trigger: 'blur'}],
                    'receiving.id':[{required:true,message:'地址不能为空',trigger:'blur'}]
                },
                customerDialogTitle:'',
                customerDialogVisible:false,
                receivings:[],
                detailDialogVisible:false,
                detailDialogTitle: '',
                detailIsEdit:false,
                oldDetail:{},
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