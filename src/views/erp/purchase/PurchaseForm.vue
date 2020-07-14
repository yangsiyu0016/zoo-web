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
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="运费类型:" prop="freightType" >
                                <el-select size="mini" style="float: left;" v-model="purchase.freightType">
                                    <el-option label="包邮" value="YES"></el-option>
                                    <el-option label="不包邮" value="NO"></el-option>
                                </el-select>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="付款方式:" prop="paymentType">
                                <el-select size="mini" style="float: left;" v-model="purchase.paymentType">
                                    <el-option label="全款发货" value="FULLPAYMENT" ></el-option>
                                    <el-option label="借款抵" value="LOAN"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="备注:" prop="description">
                                <el-input type="textarea" v-model="purchase.description"></el-input>
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
                               style="float: left"    @click="showAddProductView">
                        添加产品
                    </el-button>
                    <el-table
                            :data="purchase.details"
                            size="mini"
                            style="width:100%" show-summary :summary-method="getSummaries">

                        <el-table-column type="index"></el-table-column>
                        <el-table-column
                                label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button  type="primary" @click="showEditProductView(scope.row)"  style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger"  @click="deleteDetail(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-close">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product.imageUrl" label="图片">
                            <template slot-scope="scope">
                                <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品编号" prop="product.code"  width="150px"></el-table-column>
                        <el-table-column label="产品名称" prop="product.name" ></el-table-column>
                        <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                        <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                        <el-table-column prop="product.spec" align="left" label="规格" width="250px"></el-table-column>
                        <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                        <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                        <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                        <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                        <el-table-column prop="product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>
                        <el-table-column label="收货仓库" prop="warehouse.name" width="120px"></el-table-column>


                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="未发货数量" prop="notOutNumber"></el-table-column>
                        <el-table-column label="未收货数量" prop="notInNumber"></el-table-column>
                        <el-table-column label="价格" prop="price"></el-table-column>
                        <el-table-column label="总额" prop="totalMoney"></el-table-column>

                    </el-table>
                </div>
            </el-card>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">附件列表</span>
                </div>
                <div>
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               style="float: left"    @click="showAddAnnexView">
                        添加附件
                    </el-button>
                    <el-table
                            :data="purchase.annexs"
                            size="mini"
                            style="width:100%">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="附件名称" prop="title" ></el-table-column>
                        <el-table-column label="格式" prop="suffix" ></el-table-column>
                        <el-table-column label="大小" prop="size" ></el-table-column>
                        <el-table-column label="上传时间" prop="utime" ></el-table-column>

                        <el-table-column
                                label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary"  v-show="isEdit"  @click="downloadAnnex(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-download">下载</el-button>
                                <el-button type="danger"  @click="deleteAnnex(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-cloase">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <el-form-item>
                    <el-button @click="savePurchase" type="primary" icon="el-icon-check">保存</el-button>
                    <el-button @click="cancel" type="info" icon="el-icon-close">取消</el-button>
                </el-form-item>
            </el-card>

        </el-form>
        <supplier-dialog :title="suppplierDialogTitle" :visible="supplierDialogVisible" @close="closeWin" @callback="callback"></supplier-dialog>
        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" @close="closeDetailDialog" :append-to-body="true">
            <purchase-detail-form :isEdit="detailIsEdit" @close="closeDetailDialog" :oldDetail="oldDetail" @callback="editDetail"></purchase-detail-form>
        </el-dialog>
        <el-dialog :visible.sync="uploadDialogVisible" :title="uploadDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <annex-upload-form :oldAnnex="oldAnnex" @close="closeUploadForm"  @addAnnex="addAnnex"></annex-upload-form>
        </el-dialog>
    </div>
</template>

<script>
    import SupplierDialog from "@/components/dialog/SupplierDialog";
    import PurchaseDetailForm from "@/views/erp/purchase/PurchaseDetailForm";
    import AnnexUploadForm from "@/components/dialog/AnnexUploadForm";
    export default {
        name: "PurchaseForm",
        components: {PurchaseDetailForm, SupplierDialog, AnnexUploadForm},
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
            deleteAnnex(row) {
                this.$confirm('确定删除该附件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(()=>{
                    this.postNoEnCodeRequest('/annex/delete', row).then(resp => {
                        if (resp.data.status == '200') {
                            this.$message.success('删除成功');
                            this.purchase.annexs.some((item, i) => {
                                if (item == row) {
                                    this.purchase.annexs.splice(i, 1);
                                    return true;
                                }
                            })
                        }else {
                            this.$message.error('删除失败')
                        }
                    })
                })
            },
            addAnnex(data) {
                let annex = data;
                if(this.isEdit){
                    Object.assign(annex,{foreignKey:this.purchase.id});
                    this.putNoEnCodeRequest('/annex/add',annex).then((resp)=>{
                        if(resp&&resp.data.status==200) {
                            this.purchase.annexs.push(resp.data.annex);
                            this.closeUploadForm();
                        }else{
                            this.$message.error("保存附件信息失败");
                        }
                    });
                }else{
                    this.purchase.annexs.push(annex);
                    this.closeUploadForm();
                }
            },
            downloadAnnex(row) {
                window.open(row.url + "?fileName=" + row.fileName);
            },
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
            closeUploadForm(){
                this.uploadDialogVisible = false;
            },
            showEditProductView(row){
                this.detailIsEdit = true;
                this.oldDetail = row;
                this.detailDialogVisible = true;
                this.detailDialogTitle = "编辑产品";
            },

            showAddAnnexView(){
                this.oldAnnex = {title:''};
              this.uploadDialogVisible = true;
              this.uploadDialogTitle = '添加附件'
            },

            //显示添加产品界面
            showAddProductView(){
                this.detailIsEdit = false;
                this.oldDetail={
                    product: {
                        name:''
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
                this.loadAccounts(row.id);
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
                        let length = this.purchase.details.length;
                        if(length>0){
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
                            this.$message.error("请添加产品");
                            return false;
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
            },
            getSummaries(param){
                const {columns,data}  = param;
                const sums =[];
                columns.forEach((column,index)=>{
                    if(index===0){
                        sums[index]='合计';
                        //return;
                    }
                    if(column.property=='totalMoney'){
                        const values = data.map(item => Number(item[column.property]));
                        sums[index]= values.reduce((prev,curr)=>{
                            const value = Number(curr);
                            return prev+curr;
                        },0);
                    }
                });
                return sums;
            }
        },
        data(){
            return{
                accounts:[],
                annex:{
                    id: '',
                    title: '',
                    url: '',
                    utime: '',

                },
                oldAnnex:{},
                purchase:{
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    supplier:{
                        supplierName:''
                    },
                    supplierAccount:{

                    },
                    details:[],
                    annexs:[],
                    paymentType:'FULLPAYMENT',
                    freightType:'YES',
                    description:''
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
                uploadDialogVisible: false,
                uploadDialogTitle: '',
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