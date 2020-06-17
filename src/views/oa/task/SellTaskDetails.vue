<template>
    <div>
        <el-form label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">订单基本信息</span>
                </div>
                <div>
                    <el-row  :gutter="20" >
                        <el-col :span="8" >
                            <el-form-item label="订单日期:">
                                <span style="float: left">{{sell.initDate}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号：">
                                <span style="float: left">{{sell.code}}</span>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-form-item label="客户:">
                            <span style="float: left">{{sell.customer.name}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="20">
                        <el-form-item label="收货信息:">
                            <span style="float: left">{{sell.receivingContext}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="运费类型:" prop="freightType" >

                                <span style="float:left" v-if="sell.freightType=='YES'">包邮</span>
                                <span style="float:left" v-else>不包邮</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="付款方式:" prop="receivableType">
                                <span style="float:left" v-if="sell.receivableType=='FULLPAYMENT'">全款发货</span>
                                <span style="float:left" v-else-if="sell.receivableType=='LOAN'">借款抵</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="备注:" prop="description">
                                <span style="float:left">{{sell.description}}</span>
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
                    <el-table :data="sell.details" size="mini" show-summary :summary-method="getSummaries">
                        <el-table-column type="index" align="left" width="80"></el-table-column>
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
                        <el-table-column prop="warehouse.name" label="出库仓库"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="未发货数量" prop="notOutNumber"></el-table-column>
                        <el-table-column v-if="sell.status!='OUT'" label="价格" prop="price"  width="300"></el-table-column>
                        <el-table-column v-if="sell.status!='OUT'" label="总额" prop="totalMoney" ></el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">物流信息</span>
                </div>
                <div>
                    <el-table :data="costs" size="mini">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table size="mini" :data="props.row.details">
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-table :data="props.row.cdgas">
                                                <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                                                <el-table-column label="数量" prop="number"></el-table-column>

                                            </el-table>
                                        </template>
                                    </el-table-column>
                                    <el-table-column type="index"></el-table-column>
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
                                    <el-table-column label="数量" prop="number"></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" width="80px"></el-table-column>
                        <el-table-column label="物流名称" prop="express.name"></el-table-column>
                        <el-table-column label="单号" prop="logisticsNumber"></el-table-column>
                        <el-table-column label="运费" prop="money"></el-table-column>
                        <el-table-column label="联系方式" prop="express.phone"></el-table-column>
                        <el-table-column label="创建时间" prop="ctime"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-tag size="mini" type="success" v-show="scope.row.finished">发货完成</el-tag>
                                <el-button v-show="handleVisible&&task.taskKey==='purchasecgnq'&&!scope.row.finished"  type="primary" @click="showEditCostView(scope.row)"  style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button v-show="handleVisible&&task.taskKey==='selloutbound'&&!scope.row.finished" type="danger"  @click="deleteCost(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">附件列表</span>
                </div>
                <div>
                    <el-table
                            :data="sell.annexs"
                            size="mini"
                            style="width:100%">
                        <el-table-column label="附件名称" prop="title" ></el-table-column>
                        <el-table-column label="附件格式" prop="suffix" ></el-table-column>
                        <el-table-column label="大小" prop="size" ></el-table-column>

                        <el-table-column label="上传时间" prop="utime" ></el-table-column>

                        <el-table-column
                                label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="downloadAnnex(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">下载</el-button>
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
                <el-button v-show="handleVisible&&task.taskKey==='selloutbound'" size="mini" @click="addLogistics" type="primary">添加物流信息</el-button>
                <el-button v-show="handleVisible && sell.status !== 'REJECT'" @click="handle" type="primary" size="mini">通过</el-button>
                <el-button v-show="rejectVisible || rejectFlag" @click="reject" type="primary" size="mini">驳回</el-button>
                <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
                <el-button v-show="editVisible || canEdit" @click="edit" type="primary" size="mini">编辑</el-button>
                <el-button v-show="sell.status=='REJECT'" type="primary" size="mini" @click="reSubmit">重新提交</el-button>
                <el-button v-show="sell.status=='REJECT'" type="primary" size="mini" @click="destory">作废</el-button>
                <el-button @click="close" type="info" size="mini">关闭</el-button>
            </el-card>
        </el-form>
        <el-dialog :visible.sync="logisticsDialogVisible" :title="logisticsDialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <sell-logistics-form @close="closeLogisticsDialog" @callback="callback" :sell="currentSell"></sell-logistics-form>
        </el-dialog>
        <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <sell-form :isEdit="isEdit" :oldSell="sell" @close="closeDialog" @callback="editCallback"></sell-form>
        </el-dialog>
    </div>
</template>

<script>

    import SellLogisticsForm from "@/views/oa/task/SellLogisticsForm";
    import SellForm from "../../erp/sell/SellForm";
    export default {
        name: "SellTaskDetails",
        components: {SellForm, SellLogisticsForm},
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
                    this.getRequest('/erp/sell/'+val.businessKey).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.sell = resp.data;
                            this.loadCost(this.sell.id);
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
            downloadAnnex(row) {

                window.open(row.url + "?fileName=" + row.fileName);
            },

            closeDialog() {
                this.editDialogVisible = false;
            },
            editCallback() {
                this.closeDialog();
            },
            reSubmit() {
                this.handle();
            },
            //作废
            destory(){
                this.$confirm("确定要作废该任务嘛？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(()=> {
                    this.postRequest('/flow/task/destory?taskId='+this.task.id+"&comment="+this.comment + "&idea=AGREE&id=" + this.sell.id + '&code=XS').then((resp)=>{
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
            //调整订单
            edit() {
                this.isEdit = true;
                this.getRequest('/erp/sell/'+this.sell.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.editDialogTitle="编辑盘点单";
                        this.editDialogVisible = true;
                        this.sell = resp.data;
                    }else{
                        this.$message.error("获取数据失败");
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
            //删除物流信息
            deleteCost(row){

                this.$confirm("确定要删除吗?","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    //this.$message.error("请稍等^^");
                    this.deleteRequest("/erp/cost/deleteCostFromSell?id="+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.loadCost(this.sell.id);
                            this.loadDetails();
                        }else{
                            this.$message.error("删除失败");
                        }

                    })
                })
            },
            //物流编辑完后调用
            callback(){
                this.logisticsDialogVisible = false;
                this.currentSell = {};
                this.loadCost(this.sell.id);
                this.loadDetails();
            },
            //关闭编辑物流窗口
            closeLogisticsDialog(){

                this.logisticsDialogVisible = false;
                this.currentSell = {};
            },
            showEditCostView(row){
                this.$message.error("暂时不支持修改，请删除重新添加！！！")
                //this.logisticsDialogTitle="编辑物流信息";
                //this.logisticsDialogVisible =true;
            },
            //添加物流信息
            addLogistics(){
                this.currentSell = this.sell;
                this.logisticsDialogTitle="添加物流信息";
                this.logisticsDialogVisible =true;
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.sell.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
            //加载产品信息
            loadDetails(){
                this.getRequest('/erp/sell/detail/getDetailBySellId?sellId='+this.sell.id).then((resp)=>{
                    this.sell.details = resp.data;
                })
            },
            //加载物流信息
            loadCost(sellId){
                this.getRequest('/erp/cost/getCostByForeignKey?foreignKey='+sellId).then((resp)=>{
                    this.costs = resp.data;

                })
            },
            //办理
            handle(){
                this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.task.taskKey==="selloutbound"){
                        let can = true;
                        this.sell.details.forEach((item)=>{
                            if(item.notOutNumber>0){
                                can = false;
                            }
                        })
                        if(can){
                            this.doComponent();
                        }else{
                            this.$message.error("有产品未发货");
                        }
                    }else{
                        this.doComponent();
                    }


                })
            },
            //完成任务
            doComponent(){
                this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment+ "&idea=AGREE").then((resp)=>{
                    this.$emit("close");
                    this.$emit("refresh");
                })
            },
            //签收
            claim() {
                this.$confirm("签收后只能由签收人处理该任务，确定要签收吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.postRequest('/flow/task/claim?taskId='+this.task.id + '&id=' + this.sell.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;
                            if(this.sell.status === 'CWSH') {
                                this.rejectFlag = true;
                            }
                            if(this.sell.status === 'REJECT') {
                                this.editVisible = true;
                            }
                            this.loadHistory();
                            this.$emit("refresh");
                        }
                    })
                })
            },
            close(){
                this.$emit("close");
            },
            getSummaries(param){
                const {columns,data}  = param;
                const sums =[];
                columns.forEach((column,index)=>{
                    if(index===0){
                        sums[index]='总额';
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
                sell:{
                    customer:{
                        name:''
                    }
                },
                claimVisible:false,
                handleVisible:false,
                comment:'',
                costs:[],
                logisticsDialogVisible:false,
                logisticsDialogTitle:'',
                currentSell:{},
                oldCost:{},
                editDialogTitle: '',
                editDialogVisible: false,
                isEdit: false,
                rejectFlag: false,
                editVisible: false,
                histories:[]
            }
        }
    }
</script>

<style scoped>

</style>