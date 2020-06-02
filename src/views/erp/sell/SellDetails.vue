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
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="单据日期:">
                                <span style="float: left">{{sell.initDate}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <span>单号：{{sell.code}}</span>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="客户:">
                                <span style="float: left">{{sell.customer.name}}</span>
                            </el-form-item >
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="收货地址:" prop="receiving.id">
                                <span style="float:left">{{sell.receivingContext}}</span>
                            </el-form-item>

                        </el-col>
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
                    <el-table
                            :data="sell.details"
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="index"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" width="200"  ></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>

                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>

                        <el-table-column label="发货仓库" prop="warehouse.name"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
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
                                    <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                                    <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                                    <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>
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
            <el-card shadow="hover">
                <el-button @click="resetSellDetail" size="mini" type="danger" v-show="isReception">取回</el-button>
                <el-button @click="close" size="mini" type="info">关闭</el-button>
            </el-card>

        </el-form>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <sell-print-formwork :getChineseNumber="func.getChineseNumber" :oldSell="oldSell" :oldCosts="oldCosts"></sell-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import vueEasyPrint from "vue-easy-print";
    import SellPrintFormwork from "@/views/erp/order/SellPrintFormwork";
    export default {
        name: "SellDetails",
        components:{vueEasyPrint, SellPrintFormwork },
        props:{
            sell:{
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
            sell:{
                handler(val){
                    this.loadCost();
                    this.loadHistory();
                    this.oldSell = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        data(){
            return{
                costs:[],
                histories:[],
                oldSell:{},
                oldCosts:[]
            }
        },
        mounted() {

        },
        methods: {
            //取回
            resetSellDetail() {
                this.$confirm('确定取回该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.getRequest('/erp/sell/reset?id=' + this.oldSell.id).then(resp => {
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
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.sell.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
            //加载物流信息
            loadCost(){

                this.getRequest('/erp/cost/getCostByForeignKey?foreignKey='+this.sell.id).then((resp)=>{
                    this.costs = resp.data;
                    this.oldCosts= this.costs;
                })
            },
            destroySell() {
                this.$confirm('确定作废该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.postRequest('/erp/sell/destroy?id=' + this.sell.id);
                })
            },
            //关闭
            close(){
                this.$emit("close");
            }
        }
    }
</script>

<style scoped>

</style>