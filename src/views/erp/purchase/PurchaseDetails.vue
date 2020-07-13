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
        <el-form label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="订单日期:">
                                <span style="float: left">{{purchase.initDate}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{purchase.code}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="供应商:">
                                <span style="float: left">{{purchase.supplier.supplierName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="付款信息:">
                                <span style="float: left">{{purchase.accountContext}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="运费类型:" prop="freightType" >

                                <span style="float:left" v-if="purchase.freightType=='YES'">包邮</span>
                                <span style="float:left" v-else>不包邮</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="付款方式:" prop="paymentType">
                                <span style="float:left" v-if="purchase.paymentType=='FULLPAYMENT'">全款发货</span>
                                <span style="float:left" v-else-if="purchase.paymentType=='LOAN'">借款抵</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="备注:" prop="description">
                                <span style="float:left">{{purchase.description}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-table :data="purchase.details" size="mini" style="width: 100%" show-summary :summary-method="getSummaries">
                        <el-table-column type="index" align="left"  width="80"></el-table-column>
                        <el-table-column prop="product.imageUrl" label="图片">
                            <template slot-scope="scope">
                                <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品编号" prop="product.code" width="150px"></el-table-column>
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
                                    <el-table-column prop="product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>
                                    <el-table-column label="收货仓库" prop="warehouse.name"></el-table-column>
                                    <el-table-column label="数量" prop="number"></el-table-column>
                                    <el-table-column label="未发货数量" prop="notOutNumber"></el-table-column>
                                    <el-table-column label="未收货数量" prop="noutInNumber"></el-table-column>
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
                                <el-tag size="mini" type="info" v-show="!scope.row.finished">等待收货</el-tag>
                                <el-tag size="mini" type="success" v-show="scope.row.finished">收货完成</el-tag>
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
                            :data="purchase.annexs"
                            size="mini"
                            style="width:100%">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="附件名称" prop="title" ></el-table-column>
                        <el-table-column label="附件格式" prop="suffix" ></el-table-column>

                        <el-table-column label="大小" prop="size" ></el-table-column>

                        <el-table-column label="上传时间" prop="utime" ></el-table-column>

                        <el-table-column
                                label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="downloadAnnex(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-download">下载</el-button>
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
                        <el-table-column label="用时" prop="duration" :formatter="getDuration"></el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card>
                <el-button @click="destroyPurchase" size="mini" type="danger" v-show="canDestroy" icon="el-icon-delete">作废</el-button>
                <el-button @click="resetPurchaseDetail" size="mini" type="danger" v-show="isReception" icon="el-icon-caret-right">取回</el-button>
                <el-button @click="close" size="mini" type="info" icon="el-icon-close">关闭</el-button>
            </el-card>
        </el-form>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <purchase-print-formwork :getChineseNumber="func.getChineseNumber" :oldPurchase="purchase" :oldCosts="costs"></purchase-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import vueEasyPrint from "vue-easy-print";
    import PurchasePrintFormwork from "@/views/erp/order/PurchasePrintFormwork";
    import {DateTimeFormatUtil} from "@/components/format/DateTimeFormaterUtil";
    export default {
        name: "PurchaseDetails",
        components:{vueEasyPrint, PurchasePrintFormwork},
        mixins:[DateTimeFormatUtil],
        props:{
            purchase:{
                type:Object,
                default:()=>{}
            },
            canDestroy: {
                type: Boolean,
                default: false
            },
            isReception: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            purchase:{
                handler(val){
                    this.currentPurchase = JSON.parse(JSON.stringify(val));
                    this.loadCost();
                    this.loadHistory()
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            //this.loadCost();
        },
        methods:{
            getDuration(row){
                return this.getDurationTime(row.duration);
            },
            downloadAnnex(row) {

                window.open(row.url + "?fileName=" + row.fileName);
            },
            resetPurchaseDetail() {
                this.$confirm('确定取回该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.getRequest('/erp/purchase/reset?id=' + this.purchase.id).then(resp => {
                        this.$emit("callback");
                    });

                })
            },
            //打印
            print(){

                this.$refs.easyPrint.print();
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.purchase.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
            //加载物流信息
            loadCost(){

                this.getRequest('/erp/cost/getCostByForeignKey?foreignKey='+this.purchase.id).then((resp)=>{
                    this.costs = resp.data;

                })
            },

            destroyPurchase() {
                this.$confirm("确定作废此订单吗?","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.postRequest('/erp/purchase/destroy?id='+this.purchase.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("作废成功");
                            this.$emit("callback");
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                })

            },
            //关闭
            close(){
                this.$emit("close");
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
                histories:[],
                costs:[],
                currentPurchase:{

                }
            }
        }
    }
</script>

<style scoped>

</style>