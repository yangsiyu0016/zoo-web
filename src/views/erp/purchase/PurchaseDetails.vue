<template>
    <div>
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
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-table :data="purchase.details" size="mini" style="width: 100%">
                        <el-table-column type="index" align="left" width="30" ></el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" ></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>

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
            <el-card shadow="hover">
                <div slot="header">
                    <span style="float: left;">审批步骤</span>
                </div>
                <div>
                    <el-table :data="historyTasks" size="mini">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="任务名称"></el-table-column>
                        <el-table-column label="审批人"></el-table-column>
                        <el-table-column label="审批意见"></el-table-column>
                        <el-table-column label="开始时间"></el-table-column>
                        <el-table-column label="结束时间"></el-table-column>
                        <el-table-column label="停留时间"></el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card>
                <el-button @click="destroyPurchase" size="mini" type="danger" v-show="canDestroy">作废</el-button>
                <el-button @click="close" size="mini" type="info">关闭</el-button>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "PurchaseDetails",
        props:{
            purchase:{
                type:Object,
                default:()=>{}
            },
            canDestroy: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            purchase:{
                handler(val){
                    this.loadCost();
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            //this.loadCost();
        },
        methods:{
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
            }
        },
        data(){
            return{
                historyTasks:[],
                costs:[]
            }
        }
    }
</script>

<style scoped>

</style>