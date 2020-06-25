<template>
    <div>
        <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        </el-header>
        <el-form size="mini"  label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">拆分产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item   label="拆分日期:">
                                <span style="float: left">{{productSplit.splitTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{productSplit.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" >
                            <el-form-item label="拆分仓库:" >
                                <span style="float: left">{{productSplit.warehouse.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="产品编号:">
                                <span style="float: left">{{productSplit.product.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:">
                                <span style="float: left">{{productSplit.product.name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="拆分数量:" >
                                <span style="float: left">{{productSplit.number}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col >
                            <el-form-item label="备注:" prop="description">
                                <span style="float: left">{{productSplit.description}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover" v-show="isShowMaterial">
                <div slot="header" class="clearfix">
                    <span style="float: left;">拆分材料明细</span>
                </div>
                <el-table
                        :data="productSplit.details"
                        size="mini"
                        style="width:100%" >
                   <!-- <el-table-column
                            type="selection"
                            align="left"
                            width="80">
                    </el-table-column>-->
                    <el-table-column prop="product.imageUrl" label="图片">
                        <template slot-scope="scope">
                            <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品编号" prop="product.code" ></el-table-column>
                    <el-table-column label="产品名称" prop="product.name" ></el-table-column>
                    <el-table-column label="拆分单数" prop="number"></el-table-column>
                    <el-table-column label="拆分总数" prop="totalNumber" ></el-table-column>
                    <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                    <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                    <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
                    <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                    <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                    <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                    <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                    <el-table-column prop="product.description" align="left" label="备注" :show-tooltip-when-overflow="true"></el-table-column>

                </el-table>
            </el-card>
            <el-card shadow="hover" v-show="isSplitMan">
                <div slot="header" class="clearfix">
                    <span style="float: left;">出库信息</span>
                </div>
                <div>
                    <el-table :data="newOutbound.details">
                        <el-table-column label="产品名称" prop="product.name"></el-table-column>
                        <el-table-column label="出库货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="出库数量" prop="number"></el-table-column>
                        <el-table-column label="未出库数量" prop="notOutNumber"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.number === 0 ? false:true" type="success" size="mini" effect="dark">已出库</el-tag>
                                <el-tag v-if="scope.row.status=='CGJLSH'" type="danger" size="mini" effect="dark">未出库</el-tag>

                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="deleteOut(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--<el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="产品名称:">
                            <span style="float: left">{{productSplit.product.name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出库货位:">
                            <span style="float: left">{{productSplit.goodsAllocation ? productSplit.goodsAllocation.name : ''}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出库数量:">
                            <span style="float: left">{{productSplit.number - productSplit.notOutNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="拆分数量:" >
                            <span style="float: left">{{productSplit.number}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>-->

            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">审批流程</span>
                </div>
                <div>
                    <el-table :data="histories">
                        <el-table-column type="index" width="80px"></el-table-column>
                        <el-table-column label="节点名称" prop="actName"></el-table-column>
                        <el-table-column label="意见" prop="message"></el-table-column>
                        <el-table-column label="办理人" prop="assigneeName"></el-table-column>
                        <el-table-column label="开始时间" prop="stime"></el-table-column>
                        <el-table-column label="结束时间" prop="etime"></el-table-column>
                        <el-table-column label="用时" prop="duration"></el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">审批意见</span>
                </div>
                <el-input type="textarea" v-model="comment"></el-input>
            </el-card>
            <el-card shadow="hover">
                <div style="text-align: center">
                    <el-button v-show="handleVisible && task.taskKey === 'productsplitckll' " @click="showAddOutBound" type="primary" size="mini">添加出库信息</el-button>
                    <el-button v-show="handleVisible && productSplit.status !== 'REJECT' " @click="handle" type="primary" size="mini">通过</el-button>
                    <el-button v-show="rejectVisible || rejectFlag" @click="reject" type="primary" size="mini">驳回</el-button>
                    <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
                    <el-button v-show="editVisible || canEdit" @click="edit" type="primary" size="mini">编辑</el-button>
                    <el-button v-show="productSplit.status=='REJECT'" type="primary" size="mini" @click="reSubmit">重新提交</el-button>
                    <el-button v-show="productSplit.status=='REJECT'" type="primary" size="mini" @click="destory">作废</el-button>
                    <el-button @click="close" type="info" size="mini">关闭</el-button>
                </div>
            </el-card>
        </el-form>
        <el-dialog :title="gaDialogTitle" :visible.sync="gaDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-split-outbound-form :notOutNumber="productSplit.notOutNumber" @cancel="cancel" @callback="callbackGa" :warehouseId="productSplit.warehouse.id"></product-split-outbound-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductSplitOutboundForm from "./ProductSplitOutboundForm";
    export default {
        name: "ProductSplitTaskDetails",
        components: {ProductSplitOutboundForm},
        props:{
            task:{
                type:Object,
                default:()=>{}
            },
            rejectVisible:{
                type:Boolean,
                default: false
            },
            canEdit: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            task: {
                handler(val) {
                    if (val.assignee) {
                        this.handleVisible = true;
                        this.claimVisible = false;
                    }else {
                        this.handleVisible = false;
                        this.claimVisible = true;
                    }
                    this.loadOut(val.businessKey);
                    this.getRequest('/erp/split/getProducrSplitById?id=' + val.businessKey).then(resp => {
                        if (resp && resp.status == 200) {
                            this.productSplit = resp.data;
                        }else {
                            this.$message.error('获取表单信息失败');
                        }
                    })
                },
                deep:true,
                immediate:true
            }
        },
        mounted() {

        },
        methods: {
            //删除出库信息
            deleteOut() {

            },
            //加载出库信息
            loadOut(id) {
                this.getRequest('/erp/outbound/getOutboundByForeignKey?foreignKey=' + id).then(resp=> {
                    if (resp && resp.status == 200) {
                        this.newOutbound = resp.data;
                    }
                })
            },
            callbackGa(row) {
                this.goodsAllocation = row.goodsAllocation;
                this.productSplit.notOutNumber = this.productSplit.notOutNumber - row.number;
                if (this.productSplit.notOutNumber === 0) {
                    this.isPass = true;
                }
                this.cancel();
                this.addOutbound(row.number);
                this.updateNotOutNumber();
                this.loadOut(this.productSplit.id);
            },
            addOutbound(number) {
                Object.assign(this.outbound,{foreignKey:this.productSplit.id, taskId:this.task.id});
                this.postNoEnCodeRequest('/erp/split/addOutbound?goodsAllocationId=' + this.goodsAllocation.id + '&number=' + number, this.outbound);
            },
            cancel() {
                this.gaDialogVisible = false;
            },
            updateNotOutNumber() {
                this.getRequest('/erp/split/updateNotOutNumberById?notOutNumber=' + this.productSplit.notOutNumber + '&id=' + this.productSplit.id);
            },
            //办理
            handle(){
                if (this.productSplit.notOutNumber == 0) {
                    this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment + '&idea=AGREE').then((resp)=>{
                            this.$emit("close");
                            this.$emit("refresh");
                        });
                    })
                }else  {
                    this.$message.error('有产品未出库')
                }

            },
            showAddOutBound() {
                this.gaDialogTitle = '添加出库信息';
                if (this.productSplit.notOutNumber > 0) {
                    this.gaDialogVisible = true;
                }else {
                    this.gaDialogVisible = false;
                    this.$message.error('已添加全部出库产品');
                }
            },
            edit() {

            },
            callback() {
                this.closeWin();
            },
            closeWin() {
                this.dialogVisible = false;
            },
            //驳回任务
            doReject(){

                this.postRequest('/flow/task/reject?taskId='+this.task.id+"&comment="+this.comment + "&idea=UNAGREE").then((resp)=>{
                    if(resp&&resp.data.status=="200"){
                        this.$emit("close");
                        this.$emit("refresh");
                        this.$message.success(resp.data.msg);
                    }else{
                        this.$message.error(resp.data.msg);
                    }

                })
            },
            //驳回
            reject(){
                this.$confirm("确定要驳回任务嘛？将此任务返回至创建人！", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(()=> {
                    this.doReject();
                })
            },
            //重新提交
            reSubmit(){
                this.handle();
            },
            //作废
            destory(){
                console.log(this.task)
                this.$confirm("确定要作废该任务嘛？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(()=> {
                    this.postRequest('/flow/task/destory?taskId='+this.task.id+"&comment="+this.comment + "&idea=UNAGREE&id=" + this.oi.id + '&code=QC').then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$emit("close");
                            this.$emit("refresh");
                            this.$message.success(resp.data.msg);
                        }else{
                            this.$message.error(resp.data.msg);
                        }

                    })
                })
            },
            //签收
            claim() {
                this.$confirm("签收后只能由签收人处理该任务，确定要签收吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.postRequest('/flow/task/claim?taskId='+this.task.id + '&id=' + this.productSplit.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;
                            if(this.productSplit.status === 'CKZG' ) {
                                this.rejectFlag = true;
                            }
                            if(this.productSplit.status === 'REJECT') {
                                this.editVisible = true;
                            }
                            //this.loadHistory();
                            this.$emit("refresh");
                        }
                    })
                })
            },
            //关闭窗口
            close(){
                this.$emit("close");
            }
        },
        data() {
            return {
                isSplitMan: false,
                newOutbound: {
                    details: [],
                    product:{
                        name: ''
                    },
                    goodsAllocation:{
                        name:''
                    }
                },
                goodsAllocation:{},
                outbound:{

                },
                isPass: false,
                gaDialogTitle: '',
                gaDialogVisible: false,
                isShowMaterial: false,
                productSplit: {
                    warehouse: {
                        name: ''
                    }
                },
                claimVisible:false,
                handleVisible:false,
                comment:'',
                rejectFlag: false,
                editVisible: false,
                dialogTitle: '',
                dialogVisible: false,
                isEdit: false,
                histories:[],
                oldProductSplit:{}
            }
        }
    }
</script>

<style scoped>

</style>