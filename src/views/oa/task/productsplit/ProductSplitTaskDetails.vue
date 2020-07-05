<template>
    <div>
        <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
            <div style="margin-left: 5px;margin-right: 20px;display: inline">
                <el-button type="primary" size="mini" icon="el-icon-printer"
                           @click="print">
                    打印
                </el-button>
            </div>
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
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">拆分材料明细</span>
                </div>
                <el-table
                        :data="productSplit.details"
                        size="mini"
                        style="width:100%" >
                   <el-table-column
                            type="index"
                            align="left"
                            width="80">
                    </el-table-column>
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

            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">入库信息</span>
                </div>
                <div>
                    <el-table :data="inboundDetails" size="mini">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table :data="props.row.details">
                                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                                    <el-table-column label="数量" prop="number"></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品名称" prop="splitDetail.product.name"></el-table-column>
                        <el-table-column label="单位" prop="splitDetail.product.unit.name"></el-table-column>
                        <el-table-column label="数量" prop="splitDetail.totalNumber"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.splitDetail.notInNumber === 0 ? true:false" type="success" size="mini" effect="dark">已入库</el-tag>
                                <el-tag v-if="scope.row.splitDetail.notInNumber === 0 ? false:true" type="danger" size="mini" effect="dark">未入库</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">出库信息</span>
                </div>
                <div>
                    <el-table :data="outboundDetails" size="mini">
                        <el-table-column type="index" width="80"></el-table-column>
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
                        <el-table-column prop="product.description" align="left" label="备注" :show-tooltip-when-overflow="true"></el-table-column>
                        <el-table-column label="出库货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="出库数量" prop="number"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.number === 0 ? false:true" type="success" size="mini" effect="dark">已出库</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="handleVisible && task.taskKey === 'productsplitckll' ">
                            <template slot-scope="scope">
                                <el-button @click="deleteOut(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">审批流程</span>
                </div>
                <div>
                    <el-table :data="histories" size="mini">
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
                    <el-button v-show="handleVisible && task.taskKey === 'productsplitrk' " @click="showAddInBound" type="primary" size="mini" icon="el-icon-plus">添加入库库信息</el-button>
                    <el-button v-show="handleVisible && task.taskKey === 'productsplitckll' " @click="showAddOutBound" type="primary" size="mini" icon="el-icon-plus">添加出库信息</el-button>
                    <el-button v-show="handleVisible && productSplit.status !== 'REJECT' " @click="handle" type="primary" size="mini" icon="el-icon-check">通过</el-button>
                    <el-button v-show="rejectVisible || rejectFlag" @click="reject" type="danger" size="mini" icon="el-icon-close">驳回</el-button>
                    <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
                    <el-button v-show="editVisible || canEdit" @click="edit" type="primary" size="mini">编辑</el-button>
                    <el-button v-show="productSplit.status=='REJECT'" type="primary" size="mini" @click="reSubmit">重新提交</el-button>
                    <el-button v-show="productSplit.status=='REJECT'" type="primary" size="mini" @click="destory">作废</el-button>
                    <el-button @click="close" type="info" size="mini" icon="el-icon-close">关闭</el-button>
                </div>
            </el-card>
        </el-form>
        <el-dialog :title="gaDialogTitle" :visible.sync="gaDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="40%">
            <product-split-outbound-table @callback="callbackGa" @close="cancel" :splitId="productSplit.id" :warehouseId="productSplit.warehouse.id" :notOutNumber="productSplit.notOutNumber"></product-split-outbound-table>
        </el-dialog>
        <el-dialog :title="gaInDialogTitle" :visible.sync="gaInDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-split-inbound-table @cancel="cancelGaIn" :warehouseId = "productSplit.warehouse.id" :waitInProducts="waitInProducts"></product-split-inbound-table>
            <!--<product-split-inbound-form :splitDetail="detail" @cancel="cancelGaIn" @callback="callbackGaIn" :warehouseId="productSplit.warehouse.id"></product-split-inbound-form>-->
        </el-dialog>
        <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-split-form :isEdit="isEdit" :oldProductSplit="productSplit" @close="closeEditWin" @callback="callbackEdit"></product-split-form>
        </el-dialog>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <product-split-print-formwork :getChineseNumber="func.getChineseNumber" :productSplit="productSplit"></product-split-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import ProductSplitOutboundForm from "./ProductSplitOutboundForm";
    import ProductSplitForm from "../../../erp/stock/productsplit/ProductSplitForm";
    import vueEasyPrint from "vue-easy-print";
    import ProductSplitPrintFormwork from "@/views/erp/stock/productsplit/ProductSplitPrintFormwork";
    import ProductSplitInboundTable from "@/views/oa/task/productsplit/ProductSplitInboundTable";
    import ProductSplitOutboundTable from "@/views/oa/task/productsplit/ProductSplitOutboundTable";
    export default {
        name: "ProductSplitTaskDetails",
        components: {
            ProductSplitOutboundTable,
            ProductSplitInboundTable,
            ProductSplitPrintFormwork,
            vueEasyPrint,ProductSplitForm, ProductSplitOutboundForm},
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
                   // this.loadIn(val.businessKey);
                    //this.loadOut(val.businessKey);
                    /*if (val.taskKey === 'productsplitrk') {
                        this.isIn = true;
                        this.loadIn(val.businessKey);
                    }else if (val.taskKey === 'productsplitckll'){
                        this.isIn = false;
                        this.loadOut(val.businessKey);
                    }else if (val.taskKey === 'productsplit') {
                        this.isIn = false;
                        this.isOperate = true;
                    }*/

                    this.getRequest('/erp/split/getProductSplitById?id=' + val.businessKey).then(resp => {
                        if (resp && resp.status == 200) {
                            this.productSplit = resp.data;
                            this.loadHistory();
                            this.loadIn(this.productSplit.id);
                            this.loadOut(this.productSplit.id);
                        }else {
                            this.$message.error('获取表单信息失败');
                        }
                    })
                },
                deep:true,
                immediate:true
            }
        },

        methods: {
            //打印
            print(){

                this.$refs.easyPrint.print();
            },
            closeEditWin() {
                this.editDialogVisible = false;
            },
            callbackEdit() {
                this.closeEditWin();
            },
            edit() {
                this.isEdit = true;
                this.getRequest('/erp/split/getProductSplitById?id=' + this.productSplit.id).then(resp => {
                    this.productSplit = resp.data;
                });
                this.editDialogVisible = true;
                this.editDialogTitle = '编辑单据'
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.productSplit.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
            cancelGaIn() {
                this.gaInDialogVisible = false;
            },
            callbackGaIn(row) {
                this.cancelGaIn();
                this.addInbound(row);
                this.updateNotInNumberById(row);
                this.loadIn(this.productSplit.id);
                this.$emit('showDetailView', this.task);
            },
            loadIn(id) {
                this.getRequest('/erp/inbound/detail/getDetailByInboundForeignKey?foreignKey=' + id).then(resp=> {
                    if (resp&&resp.data.status===200) {
                        this.inboundDetails = resp.data;
                    }
                })
            },
            updateNotInNumberById(row) {
                let num = row.detail.notInNumber - row.number;
                this.getRequest('/erp/splitDetail/updateNotInNumberById?notInNumber=' + num + '&id=' + row.detail.id);
            },
            showAddInBound(row) {
               let flag = false;
               let waitInProducts = [];
               this.productSplit.details.forEach(detail=>{
                    if(detail.notInNumber>0){
                        flag = true;
                        waitInProducts.push(detail);
                    }
               });
               if(flag){
                   this.waitInProducts = waitInProducts;
                   this.gaInDialogVisible = true;
                   this.gaInDialogTitle = '添加入库信息'
               }else{
                   this.$message.error("入库信息已添加完成");
               }

            },
            //删除出库信息
            deleteOut(row) {
                this.$confirm("是否同时删除其它一起出库的数据？","提示",{
                    confirmButtonText:'同时删除',
                    cancelButtonText:"只删除此一条",
                    type:"warning"
                }).then(()=>{
                    this.doDeleteOut(row,"all");

                }).catch(()=>{
                    this.doDeleteOut(row,"only");
                })

            },
            doDeleteOut(row,type){
                this.$confirm("此操作不可恢复，是否继续?","提示",{

                    confirmButtonText:"继续",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.deleteRequest('/erp/split/deleteOut?splitId='+this.productSplit.id+"&outboundDetailId="+row.id+"&type="+type).then(resp=>{
                        if(resp.data&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.loadOut(this.productSplit.id);
                            this.productSplit.notOutNumber = resp.data.notOutNumber;
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            //加载出库信息
            loadOut(id) {
                this.getRequest('/erp/outbound/detail/getDetailByOutboundForeignKey?foreignKey=' + id).then(resp=> {
                        this.outboundDetails = resp.data;
                })
            },
            callbackGa(notOutNumber) {
                this.cancel();
                this.productSplit.notOutNumber = notOutNumber;
                this.loadOut(this.productSplit.id);
            },
            cancel() {
                this.gaDialogVisible = false;
            },
            //办理
            handle(){
                let isInFlag = true;
                for (let num in this.newInbounds) {
                    if (this.newInbounds[num].splitDetail.notInNumber !== 0) {
                        isInFlag = false;
                        break;
                    }
                }
                if (this.productSplit.status !== 'CKLL' && this.productSplit.status !== 'CLRK') {
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
                }else {
                    if (this.productSplit.status === 'CKLL') {
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
                        }else {
                            this.$message.error('有产品未出库')
                        }
                    }else if (this.productSplit.status === 'CLRK'){
                        if (isInFlag && this.newInbounds.length > 0) {
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
                        }else {
                            this.$message.error('有产品未入库')
                        }
                    }
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
            callback() {
                this.closeWin();
            },
            closeWin() {
                this.dialogVisible = false;
            },
            //驳回任务
            doReject(){

                this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment + "&idea=UNAGREE").then((resp)=>{
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
                this.$confirm("确定要作废该任务嘛？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(()=> {
                    this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment + "&idea=UNAGREE").then((resp)=>{
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
                            this.loadHistory();
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
                waitInProducts:[],
                oldDetails:[],
                editDialogTitle: '',
                editDialogVisible: false,
                isOperate:false,
                detail: {},
                gaInDialogVisible: false,
                gaInDialogTitle: '',
                inboundDetails: [],
                outboundDetails:[],

                outbound:{

                },
                inbound:{

                },
                gaDialogTitle: '',
                gaDialogVisible: false,
                productSplit: {
                    warehouse: {
                        name: ''
                    },
                    product:{
                        code:'',
                        name:''
                    },
                    splitMan:{
                        realName:''
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
                histories:[]
            }
        }
    }
</script>

<style scoped>

</style>