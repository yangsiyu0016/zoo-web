<template>
    <div>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="float: left;">单据基本信息</span>
            </div>
            <div>
                <el-row  :gutter="20">
                    <el-col :span="8"><span>单据日期:{{oi.initDate}}</span></el-col>
                    <el-col :span="8"><span>单号：{{oi.code}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><span>仓库:{{oi.warehouse.name}}</span></el-col>
                </el-row>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="float: left;">产品清单</span>
            </div>
            <div>
                <el-table :data="oi.details" size="mini">
                    <el-table-column type="index" align="left" width="60"></el-table-column>
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
                    <el-table-column label="成本价" prop="costPrice" v-if="oi.status=='CWSH'" width="300">
                        <template slot-scope="scope">
                            <el-input-number @change="priceChange(scope.row)" v-if="handleVisible" :min="0" :precision="4" size="mini" v-model="scope.row.costPrice"></el-input-number>
                            <span v-else>{{scope.row.costPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总额" prop="totalMoney" v-if="oi.status=='CWSH'"></el-table-column>
                </el-table>
            </div>
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
        <el-card shadow="hover" v-show="handleVisible">
            <div slot="header" class="clearfix">
                <span style="float: left;">审批意见</span>
            </div>
            <el-input type="textarea" v-model="comment"></el-input>
        </el-card>
        <el-card shadow="hover">
            <el-button v-show="handleVisible && oi.status !== 'REJECT'" @click="handle" type="primary" size="mini">通过</el-button>
            <el-button v-show="rejectVisible || rejectFlag" @click="reject" type="primary" size="mini">驳回</el-button>
            <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
            <el-button v-show="editVisible || canEdit" @click="edit" type="primary" size="mini">编辑</el-button>
            <el-button v-show="oi.status=='REJECT'" type="primary" size="mini" @click="reSubmit">重新提交</el-button>
            <el-button v-show="oi.status=='REJECT'" type="primary" size="mini" @click="destory">作废</el-button>
            <el-button @click="close" type="info" size="mini">关闭</el-button>
        </el-card>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <opening-inventory-form :isEdit="isEdit" :oldOi="oldOi" @close="closeWin" @callback="callback"></opening-inventory-form>
        </el-dialog>
    </div>
</template>

<script>
    import OpeningInventoryForm from "@/views/erp/stock/oi/OpeningInventoryForm";
    export default {
        name: "OpeningInventoryTaskDetails",
        components: {OpeningInventoryForm},
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
                    this.getRequest('/oi/getOiById?id='+val.businessKey).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.oi = resp.data;
                            this.loadHistory();
                        }else{
                            this.$message.error("获取表单信息失败");
                        }
                    })
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            edit() {
                this.isEdit = true;
                this.getRequest("/oi/getOiById?id="+this.oi.id).then((resp)=>{
                    this.oldOi=resp.data;
                    this.dialogTitle="编辑单据";
                    this.dialogVisible = true;
                })
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

            //入库价格更新
            priceChange(row){
                let m = 0,s1=row.costPrice.toString(),s2=row.number.toString();
                try{m+=s1.split(".")[1].length}catch(e){}
                try{m+=s2.split(".")[1].length}catch(e){}
                row.totalMoney = Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
                this.putRequest('/oi/detail/updatePrice',{id:row.id,costPrice:row.costPrice,totalMoney:row.totalMoney}).then((resp)=>{

                })
            },
            //办理
            handle(){
                this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.oi.status=='CWSH'){
                        this.oi.details.forEach((detail)=>{
                            if(!detail.costPrice){
                                this.$message.error('有产品未设置成本价');
                                return false;
                            }else{
                                if(detail.costPrice==0){
                                    this.$message.error('成本价不能为0');
                                    return false;
                                }else{
                                    this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment + '&idea=AGREE').then((resp)=>{
                                        this.$emit("close");
                                        this.$emit("refresh");
                                    })
                                }
                            }
                        })
                    }else{
                        this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment + '&idea=AGREE').then((resp)=>{
                            this.$emit("close");
                            this.$emit("refresh");
                        })
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
                    this.postRequest('/flow/task/claim?taskId='+this.task.id + '&id=' + this.oi.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;
                            if(this.oi.status === 'ZGSH' ) {
                                this.rejectFlag = true;
                            }
                            if(this.oi.status === 'REJECT') {
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
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.oi.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            }
        },
        data(){
            return{
                oi:{
                    warehouse:{
                        name:''
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
                oldOi: {},
                histories:[]
            }
        }
    }
</script>

<style scoped>

</style>