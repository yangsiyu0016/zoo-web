<template>
    <div>
        <el-form ref="checkForm" size="mini" label-width="120px" :rules="rules" :model="inventoryCheck">
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
                                        v-model="inventoryCheck.initDate"
                                        placeholder="选择日期"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy 年 MM 月 dd 日"
                                        :picker-options="pickerOptions">

                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="!inventoryCheck.id">
                            <el-form-item label="单号录入方式:">
                                <el-select style="float: left" size="mini" v-model="inventoryCheck.codeGeneratorType">
                                    <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                    <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="inventoryCheck.id||inventoryCheck.codeGeneratorType=='SELF'">
                            <el-form-item label="单号:" prop="code" :required="inventoryCheck.codeGeneratorType=='SELF'">
                                <el-input :disabled="isEdit" size="mini" v-model="inventoryCheck.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="仓库" prop="warehouse.id">
                                <el-select style="float: left" :disabled="inventoryCheck.details.length>0" v-model="inventoryCheck.warehouse" value-key="id" placeholder="选择仓库">
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
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-button type="primary" size="mini" icon="el-icon-plus" :disabled="!inventoryCheck.warehouse.id"
                               style="float: left"    @click="showAddSkuView">
                        添加产品
                    </el-button>
                    <el-table
                            :data="inventoryCheck.details"
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="selection"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column label="类型" prop="type">
                            <template slot-scope="scope">
                                <el-tag size="mini" type="success" v-if="scope.row.type=='LOSSES'">盘亏</el-tag>
                                <el-tag size="mini" type="danger" v-else>盘盈</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" width="200"  ></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>
                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                        <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
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
                <el-button @click="saveCheck" type="primary" size="mini">保存</el-button>
                <el-button @click="cancel" type="info" size="mini">取消</el-button>
            </el-card>
        </el-form>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true">
            <inventory-check-detail-form :isEdit="detailIsEdit" :oldDetail="oldDetail" :warehouseId="inventoryCheck.warehouse.id" @addDetail="addDetail" @editDetail="editDetail" @close="closeDialog"></inventory-check-detail-form>
        </el-dialog>
    </div>
</template>

<script>
    import InventoryCheckDetailForm from "@/views/erp/stock/inventorycheck/InventoryCheckDetailForm";
    export default {
        name: "InventoryCheckForm",
        components: {InventoryCheckDetailForm},
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldCheck:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldCheck:{
                handler(val){
                    this.inventoryCheck = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.loadWarehouses();
        },
        methods:{
            //删除产品
            deleteDetail(row){
                if(this.isEdit){
                    this.$confirm('此操作将永久删除，是否继续？','提示',{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消',
                        type:'warning'
                    }).then(()=>{
                        this.deleteRequest('/inventoryCheck/detail/'+row.id).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("删除成功");
                                this.inventoryCheck.details.some((item,i)=>{
                                    if(item==row){
                                        this.inventoryCheck.details.splice(i,1);
                                        return true;
                                    }
                                })
                            }else{
                                this.$message.error("删除失败");
                            }
                        })
                    })
                }else{
                    this.inventoryCheck.details.some((item,i)=>{
                        if(item==row){
                            this.inventoryCheck.details.splice(i,1);
                            return true;
                        }
                    })
                }

            },
            //更新产品
            editDetail(detail){
                if(this.isEdit){
                    this.putNoEnCodeRequest('/oi/detail/update',detail).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("更新成功");
                            this.oi.details.some((item,i)=>{
                                if(item==this.oldDetail){
                                    this.oi.details.splice(i,1,detail);
                                }
                            })
                            this.detailDialogVisible = false;
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                }else {
                    this.oi.details.some((item,i)=>{
                        if(item==this.oldDetail){
                            this.oi.details.splice(i,1,detail);
                        }
                    })
                    this.detailDialogVisible = false;
                }

            },//更新产品
            editDetail(detail){
                if(this.isEdit){
                    this.putNoEnCodeRequest('/inventoryCheck/detail/update',detail).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("更新成功");
                            this.inventoryCheck.details.some((item,i)=>{
                                if(item==this.oldDetail){
                                    this.inventoryCheck.details.splice(i,1,detail);
                                }
                            })
                            this.dialogVisible = false;
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                }else {
                    this.inventoryCheck.details.some((item,i)=>{
                        if(item==this.oldDetail){
                            this.inventoryCheck.details.splice(i,1,detail);
                        }
                    })
                    this.dialogVisible = false;
                }

            },
            //添加产品
            addDetail(detail){
                //判断订单是修改还是新增
                if(this.isEdit){
                    Object.assign(detail,{panDianId:this.inventoryCheck.id});
                    this.postNoEnCodeRequest('/inventoryCheck/detail/add',detail).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.$message.success("添加成功");
                            this.inventoryCheck.details.push(resp.data.detail);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error(resp.msg);
                        }
                    });
                }else{
                    this.inventoryCheck.details.push(detail);
                    this.dialogVisible = false;
                }

            },

            closeDialog(){
                this.dialogVisible = false;
            },
            showEditSkuView(row){
                this.detailIsEdit = true;
                this.oldDetail = row;
                this.dialogVisible = true;
            },
            showAddSkuView(){
                this.detailIsEdit = false;
                this.oldDetail={
                    productSku:{
                        product:{
                            name:''
                        }
                    },
                    goodsAllocation:{},
                    number:0,
                    type:'LOSSES'
                },
                this.dialogVisible = true;
                this.dialogTitle ='添加产品';
            },
            saveCheck(){
                this.$refs['checkForm'].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/inventoryCheck/update',this.inventoryCheck).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }else{
                            let length = this.inventoryCheck.details.length;
                            if(length>0){
                                this.postNoEnCodeRequest('/inventoryCheck/add',this.inventoryCheck).then((resp)=>{
                                    if(resp&&resp.data.status=="200"){
                                        this.$message.success("保存成功");
                                        this.$emit("callback");
                                    }else{
                                        this.$message.error(resp.data.msg);
                                    }
                                })
                            }else{
                                this.$message.error("产品列表不能为空");
                            }
                        }
                    }else{
                        return false;
                    }
                })
            },
            cancel(){
                this.$emit("close");
            },
            loadWarehouses(){
                this.getRequest('/erp/warehouse/all').then((resp)=>{
                    this.warehouses = resp.data;
                })
            }
        },
        data(){
            return{
                warehouses:[],
                inventoryCheck:{
                    code:'',
                    codeGeneratorType:'AUTO',
                    initData:'',
                    warehouse:{
                        name:''
                    },
                    details:[]
                },
                rules:{
                    initDate:[{required:true,message:'请选择单据日期',trigger:'blur'}],
                    'warehouse.id':[{required:true,message:'请选择仓库',trigger:'blur'}]
                },
                dialogTitle:'',
                dialogVisible:false,
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
        },
    }
</script>

<style scoped>

</style>