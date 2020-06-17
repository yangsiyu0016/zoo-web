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
                                    value-format="yyyy-MM-dd"
                                    format="yyyy 年 MM 月 dd 日"
                                    :picker-options="pickerOptions">

                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="!isEdit">
                        <el-form-item label="单号录入方式">
                            <el-select v-model="oi.codeGeneratorType">
                                <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="oi.id||oi.codeGeneratorType=='SELF'" >
                        <el-form-item label="单号" prop="code" :required="oi.codeGeneratorType=='SELF'">
                            <el-input :disabled="isEdit" v-model="oi.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="仓库" prop="warehouse.id">
                            <el-select :disabled="oi.details.length>0" v-model="oi.warehouse" value-key="id" placeholder="选择仓库">
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
                              :disabled="!oi.warehouse.id" style="float: left" v-show="!oi.processInstanceId"   @click="showAddProductView">
                        添加产品
                    </el-button>
                    <el-table :data="oi.details" size="mini" style="width: 100%" show-summary>
                        <el-table-column type="selection" align="left" width="80"></el-table-column>
                        <el-table-column prop="product.imageUrl" label="图片">
                            <template slot-scope="scope">
                                <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品编号" prop="product.code" ></el-table-column>
                        <el-table-column label="产品名称" prop="product.name" ></el-table-column>
                        <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                        <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                        <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
                        <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                        <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                        <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                        <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                        <el-table-column prop="product.description" align="left" label="备注"></el-table-column>
                        <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showEditProductView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button @click="deleteDetail(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <el-button @click="saveOi" size="mini" type="primary">保存</el-button>
                <el-button @click="saveAndStart" size="mini" type="warning" v-show="oi.status !== 'REJECT'">保存并启动流程</el-button>
                <el-button @click="cancel" size="mini" type="info">取消</el-button>
            </el-card>
        </el-form>
        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <opening-inventory-detail-form :isEdit="this.detailIsEdit" :oldDetail="oldDetail" :warehouseId="oi.warehouse.id" @addDetail="addDetail" @editDetail="editDetail" @close="closeWin"></opening-inventory-detail-form>
        </el-dialog>
    </div>
</template>

<script>
    import OpeningInventoryDetailForm from "@/views/erp/stock/oi/OpeningInventoryDetailForm";
    export default {
        name: "OpeningInventoryForm",
        components: {OpeningInventoryDetailForm},
        mounted(){
            this.loadWarehouses();
        },
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldOi:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldOi:{
                handler(val){
                    this.oi=JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            //保存并启动流程
            saveAndStart(){
                this.$message.info("暂时不实现");
            },
            //保存期初订单
            saveOi(){
                this.$refs["oiForm"].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/oi/update',this.oi).then((resp)=>{
                                if(resp.data.status=="200"){
                                    this.$message.info("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            });
                        }else{
                            if(this.oi.details.length>0){

                                this.postNoEnCodeRequest('/oi/add',this.oi).then((resp)=>{
                                    if(resp.data.status=="200"){
                                        this.$message.info("保存成功");
                                        this.$emit("callback");
                                    }else{
                                        this.$message.error(resp.data.msg);
                                    }
                                })

                            }else{
                                this.$message.info("请添加产品信息");
                            }
                        }

                    }else{
                        return false;
                    }
                })
            },
            //取消
            cancel(){
                this.$emit("close");
            },
            //编辑产品
            showEditProductView(row){
                this.detailIsEdit = true;
                this.oldDetail = row;
                this.detailDialogVisible = true;
            },
            //删除产品
            deleteDetail(row){
                if(this.isEdit){
                    this.$confirm('此操作将永久删除，是否继续？','提示',{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消',
                        type:'warning'
                    }).then(()=>{
                        this.deleteRequest('/oi/detail/'+row.id).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("删除成功");
                                this.oi.details.some((item,i)=>{
                                    if(item==row){
                                        this.oi.details.splice(i,1);
                                        return true;
                                    }
                                })
                            }else{
                                this.$message.error("删除失败");
                            }
                        })
                    })
                }else{
                    this.oi.details.some((item,i)=>{
                        if(item==row){
                            this.oi.details.splice(i,1);
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

            },
            //添加产品
            addDetail(detail){
                //判断订单是修改还是新增
                if(this.isEdit){
                    Object.assign(detail,{openingInventoryId:this.oi.id});
                    this.postNoEnCodeRequest('/oi/detail/add',detail).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.$message.success("添加成功");
                            this.oi.details.push(resp.data.detail);
                            this.detailDialogVisible = false;
                        }else{
                            this.$message.error(resp.msg);
                        }
                    });
                }else{
                    this.oi.details.push(detail);
                    this.detailDialogVisible = false;
                }

            },
            closeWin(){
                this.detailDialogVisible = false;
            },
            showAddProductView(){
                this.detailIsEdit = false;
                this.oldDetail = {
                    number:0,
                    goodsAllocation:{},
                    product:{
                        name:''
                    }
                };
                this.detailDialogVisible = true;
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
                detailDialogVisible:false,
                detailDialogTitle:"添加产品",
                warehouses:[],
                oi:{
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    processInstanceId:'',
                    warehouse:{},
                    details:[]
                },
                oldDetail:{},
                detailIsEdit:false,
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