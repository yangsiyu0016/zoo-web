<template>
    <div>
        <el-form label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">组装产品信息</span>
                </div>
                <div>
                    <el-row  :gutter="20" >
                        <el-col :span="8" >
                            <el-form-item label="组装日期:">
                                <span style="float: left">{{productAssembled.assembledTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号：">
                                <span style="float: left">{{productAssembled.code}}</span>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="组装仓库:">
                                <span style="float: left">{{productAssembled.warehouse.name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品编号:"  >
                                <span style="float:left" >{{productAssembled.product.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:"  >
                                <span style="float:left" >{{productAssembled.product.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="组装数量:" >
                                <span style="float: left">{{productAssembled.number}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="备注:" prop="description">
                                <span style="float:left">{{productAssembled.description}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">组装材料明细</span>
                </div>
                <div>
                    <el-table :data="productAssembled.materials" size="mini">
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
                        <el-table-column prop="product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>
                        <el-table-column prop="warehouse.name" label="出库仓库"></el-table-column>
                        <el-table-column label="数量" prop="needNumber"></el-table-column>
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
                        <el-table-column label="操作" v-if="handleVisible && task.taskKey === 'getmaterials' ">
                            <template slot-scope="scope">
                                <el-button @click="deleteOut(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">入库信息</span>
                </div>
                <div>
                    <el-table :data="inboundDetails" size="mini">
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
                        <el-table-column label="入库货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="入库数量" prop="number"></el-table-column>
                        <el-table-column v-if="task.taskKey==='assemblededitprice'" label="入库成本" prop="price"></el-table-column>
                        <el-table-column v-if="task.taskKey==='assemblededitprice'" label="入库总额" prop="totalMoney"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.finished" type="success" size="mini" effect="dark">已入库</el-tag>
                                <el-tag v-if="!scope.row.finished" type="danger" size="mini" effect="dark">未入库</el-tag>

                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="handleVisible && (task.taskKey === 'inbound' || task.taskKey == 'assemblededitprice')" style="width: 100px">
                            <template slot-scope="scope">
                                <el-tag type="danger" size="mini" effect="dark" v-if="task.taskKey === 'inbound'&&!scope.row.finished && (scope.row.price==0 ||scope.row.price==null)">等待录入成本价</el-tag>
                                <el-button @click="inboundOperation(scope.row)" type="primary" size="mini"  v-if="task.taskKey === 'inbound'&&!scope.row.finished&& scope.row.price>0" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-s-home">入库</el-button>
                                <el-button @click="cancelInbound(scope.row)" type="danger" size="mini"  v-if="task.taskKey === 'inbound'&&scope.row.finished" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-close">取消入库</el-button>
                                <el-button @click="editCostPrice(scope.row)" v-if="handleVisible && task.taskKey == 'assemblededitprice' " size="mini" type="primary" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-edit">录入入库成本</el-button>
                                <el-button @click="deleteIn(scope.row)" v-if="task.taskKey === 'inbound' && !scope.row.finished " type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-delete">删除</el-button>
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
                <!--<el-button v-show="handleVisible&&task.taskKey==='purchasecgnq'" size="mini" @click="addLogistics" type="primary">添加物流信息</el-button>-->


                <el-button v-show="editVisible || canEdit" @click="edit" type="primary" size="mini" >编辑</el-button>
                <el-button v-show="handleVisible && task.taskKey === 'getmaterials' " icon="el-icon-plus" size="mini" @click="showAddOutbound" type="primary">添加出库信息</el-button>
                <el-button v-show="handleVisible && task.taskKey === 'inbound' " icon="el-icon-plus" @click="showAddInBound" type="primary" size="mini">添加入库信息</el-button>
                <el-button v-show="productAssembled.status=='DDTZ'" type="primary" size="mini" @click="reSubmit">重新提交</el-button>
                <el-button v-show="productAssembled.status=='DDTZ'" type="primary" size="mini" @click="destroy">作废</el-button>
                <el-button v-show="rejectVisible" @click="reject" type="primary" size="mini">驳回</el-button>
                <el-button v-show="handleVisible && productAssembled.status !== 'DDTZ'" @click="handle" type="primary" size="mini">通过</el-button>
                <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
                <el-button @click="close" type="info" size="mini">关闭</el-button>
            </el-card>
        </el-form>
        <!--<el-dialog :title="gaOutDialogTitle" :visible.sync="gaOutDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <assembled-outbound-form :assembledMaterial="material" @cancel="cancelGaOut" @callback="callbackGaOut" :warehouseId="productAssembled.warehouse.id"></assembled-outbound-form>
        </el-dialog>-->
        <el-dialog :title="gaOutDialogTitle" :visible.sync="gaOutDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <assembled-outbound-table @close="cancelGaOut" @callback="callbackGaOut" :waitOutProducts="waitOutProducts" :assembledId="productAssembled.id" :warehouseId="productAssembled.warehouse.id" ></assembled-outbound-table>
        </el-dialog>
        <el-dialog :title="gaInDialogTitle"  :visible.sync="gaInDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <assembled-inbound-table @callback="callbackGaIn" @close="cancelGaIn" :assembledId="productAssembled.id" :warehouseId="productAssembled.warehouse.id" :notInNumber="productAssembled.notInNumber"></assembled-inbound-table>
        </el-dialog>
        <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-assembled-form :isEdit="isEdit"  @close="closeEditWin" @callback="callbackEdit" :oldProductAssembled="oldProductAssembled"></product-assembled-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductAssembledForm from "../../../erp/stock/productassembled/ProductAssembledForm";
    import AssembledOutboundTable from "./AssembledOutboundTable";
    import AssembledInboundTable from "./AssembledInboundTable";
    export default {
        name: "AssembledTaskDetails",
        components: {AssembledOutboundTable, ProductAssembledForm, AssembledInboundTable},
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
                    /*console.log(val.businessKey)
                    if (val.taskKey === 'getmaterials') {
                        //显示出库信息
                        this.isOut = true;
                        this.isOperate = true;
                        this.isMaterials = false;
                        this.loadOut(val.businessKey);
                    }else if(val.taskKey === 'inbound'){
                        this.isMaterials = false;
                        this.isOut = false;
                        this.isOperate = false;
                        this.isIn = true;
                        this.loadIn(val.businessKey);
                    }else {
                        this.isMaterials = true;
                        this.isOut = false;
                        this.isIn = false;
                        this.isOperate = false;
                    }*/
                    if(val.assignee){
                        if(val.taskKey==='assembledckzg') {
                            this.rejectVisible = true;
                        }
                        this.handleVisible = true;
                        this.claimVisible = false;
                    }else{
                        this.handleVisible = false;
                        this.claimVisible = true;
                    }
                    this.initData(val.businessKey);
                   /* this.getRequest('/erp/assembled/'+val.businessKey).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.productAssembled = resp.data;
                            this.loadOut(this.productAssembled.id);
                            this.loadIn(this.productAssembled.id);
                            this.loadHistory();
                        }else{
                            this.$message.error("获取表单信息失败");
                        }
                    })*/
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            cancelInbound(row){
                this.$confirm("确定取消入库吗?","提示",{
                    cancelButtonText:"取消",
                    confirmButtonText:"确定",
                    type:"warning"
                }).then(()=>{
                    this.postRequest('/erp/assembledMaterial/cancelInbound',{
                        id:row.id
                    }).then((resp)=>{
                        if(resp.data&&resp.data.status=="200"){
                            this.$message.success("取消成功");
                            this.loadIn(this.productAssembled.id);
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            initData(productAssembledId){
                this.getRequest('/erp/assembled/'+productAssembledId).then((resp)=>{
                    if(resp&&resp.status==200){
                        this.productAssembled = resp.data;
                        this.loadOut(productAssembledId);
                        this.loadIn(productAssembledId);
                        this.loadHistory();
                    }else{
                        this.$message.error("获取表单信息失败");
                    }
                })
            },
            loadAssembled() {
                this.getRequest('/erp/assembled/getAssembledById?id=' + this.productAssembled.id).then(resp => {
                    this.productAssembled = resp.data;
                })
            },
            inboundOperation(row){
                this.$confirm("确定入库吗？","提示",{
                    cancelButtonText:"取消",
                    confirmButtonText:"确定",
                    type:"warning"
                }).then(()=>{//确定入库
                    this.getRequest('/erp/assembled/inboundOperation?id=' + row.id).then(resp => {
                        if (resp&& resp.data.status=="200") {
                            this.loadIn(this.productAssembled.id);
                            this.$message.success('入库成功');
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                    //this.
                }).catch(()=>{})
            },
            editCostPrice(row){
                this.$prompt('请输入成本价','成本价编辑',{
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    inputPattern:/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
                    inputErrorMessage:'成本价格式不正确'
                }).then(({value})=>{
                    this.putRequest("/erp/inbound/detail/updatePrice",{
                        id:row.id,
                        costPrice:value
                    }).then((resp)=>{
                        if(resp.data&&resp.data.status=="200"){
                            this.$message.success("保存成功");
                            this.inboundDetails.some((item,i)=>{
                                if(item==row){
                                    this.inboundDetails.splice(i,1,resp.data.inboundDetail);
                                }
                            })
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                }).catch(()=>{

                })
            },
            deleteIn(row) {
                this.$confirm("是否删其他一起入库数据？", "提示", {
                    confirmButtonText: "同时删除",
                    cancelButtonText: "只删除一条",
                    type: "warning"
                }).then(() => {
                    this.doDeleteIn(row, 'all');
                }).catch(() => {
                    this.doDeleteIn(row, 'only');
                })
            },
            doDeleteIn(row, type) {
                this.$confirm("此操作不可恢复，是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.deleteRequest('/erp/assembled/deleteIn?assembledId=' + this.productAssembled.id + '&inboundDetailId=' + row.id + '&type=' + type).then(resp => {
                        if (resp.data && resp.data.status === "200") {
                            this.$message.success('删除成功');
                            this.loadIn(this.productAssembled.id);
                            this.productAssembled.notInNumber = resp.data.notInNumber;
                        }else {
                            this.$message.error(resp.data.msg);
                        }
                    })
                }).catch(()=>{})
            },
            deleteOut(row) {
                this.$confirm("是否同时删除其他一起出库的数据？", "提示", {
                    confirmButtonText:"同时删除",
                    cancelButtonText:"只删除一条",
                    type:"warning"
                }).then(() => {
                    this.doDeleteOut(row, "all");
                }).catch(() => {
                    this.doDeleteOut(row, "only")
                })
            },
            doDeleteOut(row, type) {
                this.$confirm("此操作不可恢复，是否继续？", "提示", {
                    confirmButtonText:"继续",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=> {
                    this.deleteRequest('/erp/assembledMaterial/deleteOut?assembledId=' + this.productAssembled.id + '&outboundDetailId=' + row.id + '&type=' + type).then(resp => {
                        if (resp.data && resp.data.status == '200') {
                            this.$message.success('删除成功');
                            this.loadOut(this.productAssembled.id);
                            this.loadAssembled();
                            this.$emit('showDetailView', row);
                        }else {
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            closeEditWin() {
                this.editDialogVisible = false;
            },
            callbackEdit() {
                this.closeEditWin();
            },
            edit() {
                this.isEdit = true;
                this.getRequest('/erp/assembled/getAssembledById?id=' + this.productAssembled.id).then(resp => {
                    this.oldProductAssembled = resp.data;
                })
                this.editDialogVisible = true;
                this.editDialogTitle = '编辑单据';
            },
            callbackGaIn() {
                this.cancelGaIn();
                this.initData(this.productAssembled.id);
            },
            loadIn(id) {
                this.getRequest('/erp/inbound/detail/getDetailByInboundForeignKey?foreignKey=' + id).then(resp => {
                    if (resp && resp.status == 200) {
                        this.inboundDetails = resp.data;
                    }
                })
            },
            cancelGaIn() {
                this.gaInDialogVisible = false;
            },

            showAddInBound() {
                if (this.productAssembled.notInNumber !== 0) {
                    this.gaInDialogTitle = '添加入库信息';
                    this.gaInDialogVisible = true;
                }else {
                    this.gaInDialogVisible = false;
                    this.$message.error('已添加全部入库产品');
                }

            },

            destroy() {

            },
            cancelGaOut() {
                this.gaOutDialogVisible = false;
            },
            callbackGaOut() {
                this.cancelGaOut();
                this.initData(this.productAssembled.id);
            },
            //加载出库信息
            loadOut(id) {
                this.getRequest('/erp/outbound/detail/getDetailByOutboundForeignKey?foreignKey=' + id).then(resp=> {
                    this.outboundDetails = resp.data;
                })
            },

            reSubmit() {
                this.handle();
            },
            showAddOutbound() {
                let flag = false;
                let waitOutProducts = [];
                this.productAssembled.materials.forEach(material=>{
                    if(material.notOutNumber>0){
                        flag = true;
                        waitOutProducts.push(material);
                    }
                })
                if (flag) {
                    this.waitOutProducts = waitOutProducts;
                    this.gaOutDialogVisible = true;
                    this.gaOutDialogTitle = '添加出库信息'
                }else {
                    this.gaOutDialogVisible = false;
                    this.$message.error('已添加全部出库产品');
                }
            },
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
            doComplete(taskId, comment, idea) {
                this.postRequest('/flow/task/complete?taskId='+taskId+"&comment="+comment + '&idea='+idea).then((resp)=>{
                    this.$emit("close");
                    this.$emit("refresh");
                });
            },
            handle(){
                this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.productAssembled.status=='CKLL'){
                        if(this.outboundDetails.length>0){
                            let flag = true;
                            this.productAssembled.materials.forEach(material=>{
                                if(material.notOutNumber>0) flag = false;
                            })
                            if(!flag){
                                this.$message.error("有产品没有出库，不能完成");
                            }else{
                                this.doComplete(this.task.id,this.comment,"AGREE");
                            }
                        }else{
                            this.$message.error("出库信息为空,等待仓库录入出库信息，暂时不能通过 ");
                        }
                    }else if(this.productAssembled.status=='CLRK'&&this.task.taskKey=="assemblededitprice"){
                        if(this.inboundDetails.length>0){
                            let flag = true;
                            this.inboundDetails.forEach(detail=>{
                                if(detail.price==undefined||detail.price==0||!detail.finished){
                                    flag = false
                                }
                            })
                            if(!flag){
                                this.$message.error("产品成本价有误或产品没有入库完成，不能完成");
                            }else{
                                this.doComplete(this.task.id,this.comment,"AGREE");
                            }
                        }else{
                            this.$message.error("入库信息为空,等待仓库录入入库信息，暂时不能通过 ");
                        }
                    }else if(this.productAssembled.status=='CLRK'&&this.task.taskKey=="inbound"){
                        if(this.inboundDetails.length>0){
                            let flag = true;
                            this.inboundDetails.forEach(detail=>{
                                if(!detail.finished) flag = false;
                            })
                            if(!flag||this.productAssembled.notInNumber!=0){
                                this.$message.error("有产品没有入库，不能完成");
                            }else{
                                this.doComplete(this.task.id,this.comment,"AGREE");
                            }
                        }else{
                            this.$message.error("入库信息不能为空");
                        }
                    }else{
                        this.doComplete(this.task.id,this.comment,"AGREE");
                    }
                })
            },
            claim(){
                this.$confirm("签收后只能由签收人处理该任务，确定要签收吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.postRequest('/flow/task/claim?taskId='+this.task.id + '&id=' + this.productAssembled.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;
                            /*if(val.taskkey==='assembledckzg') this.rejectVisible = true;*/
                            /*if(this.sell.status === 'REJECT') {
                                this.editVisible = true;
                            }*/
                            if (this.productAssembled.status === 'ZGSH') {
                                this.rejectVisible = true;
                            }
                            this.loadHistory();
                            this.$emit("refresh");
                        }
                    })
                })
            },
            close(){
                this.$emit("close")
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.productAssembled.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            }
        },
        data(){
            return{
                waitOutProducts:[],
                disabled: false,
                editVisible: false,
                isEdit: false,
                editDialogTitle: '',
                editDialogVisible: false,
                oldProductAssembled:{},
                isIn: false,
                inbound: {},
                outbound: {},
                isMaterials: true,
                isOperate: false,
                gaOutDialogTitle: '',
                gaOutDialogVisible: false,
                gaInDialogTitle: '',
                gaInDialogVisible: false,
                material: {},
                isOut: false,
                newInbound: {},
                productAssembled:{
                    warehouse:{
                        name:''
                    },
                    product:{
                        code:'',
                        name:''
                    }
                },
                histories:[],
                claimVisible:false,
                handleVisible:false,
                comment:'',
                outboundDetails: [],
                inboundDetails: []
            }
        }
    }
</script>

<style scoped>

</style>