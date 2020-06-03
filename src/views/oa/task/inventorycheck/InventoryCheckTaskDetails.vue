<template>
    <div>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="float: left;">单据基本信息</span>
            </div>
            <div>
                <el-row  :gutter="20">
                    <el-col :span="8"><span>单据日期:{{check.initDate}}</span></el-col>
                    <el-col :span="8"><span>单号：{{check.code}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><span>仓库:{{check.warehouse.name}}</span></el-col>
                </el-row>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="float: left;">产品清单</span>
            </div>
            <div>
                <el-table :data="check.details" size="mini">
                    <el-table-column type="index" align="left" width="60"></el-table-column>
                    <el-table-column label="类型" prop="type">
                        <template slot-scope="scope">
                            <el-tag size="mini" type="success" v-if="scope.row.type=='LOSSES'">盘亏</el-tag>
                            <el-tag size="mini" type="danger" v-else>盘盈</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                    <el-table-column label="产品编号" prop="productSku.code" width="200" ></el-table-column>
                    <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                    <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>
                    <el-table-column label="成本价" prop="costPrice" v-if="check.status=='CW'" width="150">
                        <template slot-scope="scope">
                            <el-input-number @change="priceChange(scope.row)" v-if="handleVisible" :min="0" :precision="4" size="mini" v-model="scope.row.costPrice"></el-input-number>
                            <span v-else>{{scope.row.costPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总额" prop="totalMoney" v-if="check.status=='CW'"></el-table-column>
                    <el-table-column label="当前库存成本价" width="150" prop="currentCostPrice" v-if="check.status=='CW'"></el-table-column>
                    <el-table-column label="当前总成本" prop="currentTotalMoney" v-if="check.status=='CW'"></el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card shadow="hover" v-show="handleVisible">
            <div slot="header" class="clearfix">
                <span style="float: left;">审批意见</span>
            </div>
            <el-input type="textarea" v-model="comment"></el-input>
        </el-card>
        <el-card shadow="hover">
            <el-button v-show="handleVisible && check.status !== 'REJECT'" @click="handle" type="primary" size="mini">通过</el-button>
            <el-button v-show="rejectVisible || rejectFlag" @click="reject" type="primary" size="mini">驳回</el-button>
            <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
            <el-button v-show="editVisible || canEdit" @click="edit" type="primary" size="mini">编辑</el-button>
            <el-button v-show="check.status=='REJECT'" type="primary" size="mini" @click="reSubmit">重新提交</el-button>
            <el-button v-show="check.status=='REJECT'" type="primary" size="mini" @click="destory">作废</el-button>
            <el-button @click="close" type="info" size="mini">关闭</el-button>
        </el-card>
        <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <inventory-check-form :isEdit="isEdit" :oldCheck="oldCheck" @close="closeDialog" @callback="editCallback"></inventory-check-form>
        </el-dialog>
    </div>
</template>

<script>
    import InventoryCheckForm from "@/views/erp/stock/inventorycheck/InventoryCheckForm";
    export default {
        name: "InventoryCheckTaskDetails",
        components:{InventoryCheckForm},
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
        watch:{
            task:{
                handler(val){
                    if(val.assignee){
                        this.handleVisible = true;
                        this.claimVisible = false;
                    }else{
                        this.handleVisible = false;
                        this.claimVisible = true;
                    }
                    this.getRequest('/inventoryCheck/getIcById?id='+val.businessKey).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.check = resp.data;

                        }else{
                            this.$message.error("获取表单信息失败");
                        }
                    })
                },
                deep:true,
                immediate:true
            },

        },

        methods:{
            closeDialog(){
                this.editDialogVisible = false;
            },
            editCallback() {
                this.closeDialog();
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
                    this.postRequest('/flow/task/destory?taskId='+this.task.id+"&comment="+this.comment + "&idea=UNAGREE&id=" + this.check.id + '&code=PD').then((resp)=>{
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

            edit() {
                this.isEdit = true;
                this.getRequest('/inventoryCheck/getIcById?id='+this.check.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.editDialogTitle="编辑盘点单";
                        this.editDialogVisible = true;
                        this.oldCheck = resp.data;
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })
            },

            //成本价格更新
            priceChange(row){
                if(row.costPrice){
                    let m = 0,s1=row.costPrice.toString(),s2=row.number.toString();
                    try{m+=s1.split(".")[1].length}catch(e){}
                    try{m+=s2.split(".")[1].length}catch(e){}
                    row.totalMoney = Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
                }else{
                    row.totalMoney='';
                }

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
            //办理
            handle(){
                this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.task.taskKey==='inventorycheckckzg'){
                        let can = true;
                        this.check.details.forEach((item)=>{
                            if(!item.costPrice||item.costPrice<=0){
                                can = false;
                            }
                        })
                        if(can){
                            this.postNoEnCodeRequest('/inventoryCheck/checkStock',this.check).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.doComponent();
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })

                        }else{
                            this.$message.error("有产品未设置成本价");
                        }
                    }else{
                        this.doComponent();
                    }

                })
            },
            //完成任务
            doComponent(){
                this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment + "&idea=AGREE").then((resp)=>{
                    if(resp&&resp.data.status=="200"){
                        this.$emit("close");
                        this.$emit("refresh");
                        this.$message.success("办理成功");
                    }else{
                        this.$message.error(resp.data.msg);
                    }

                })
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

            //签收
            claim() {
                this.$confirm("签收后只能由签收人处理该任务，确定要签收吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.postRequest('/flow/task/claim?taskId='+this.task.id + '&id=' + this.check.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;

                            if(this.purchase.status === 'ZGSH' || this.purchase.status === 'CWSH') {
                                this.rejectFlag = true;
                            }
                            if(this.purchase.status === 'REJECT') {
                                this.editVisible = true;
                            }
                            this.$emit("refresh");
                        }
                    })
                })
            },
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                check:{
                    warehouse:{
                        name:''
                    }
                },
                claimVisible:false,
                handleVisible:false,
                comment:'',
                idea: '',
                editDialogTitle: '',
                editDialogVisible: false,
                isEdit: false,
                rejectFlag: false,
                editVisible: false,
                oldCheck:{}
            }
        }
    }
</script>

<style scoped>

</style>