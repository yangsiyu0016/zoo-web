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
                            <el-form-item label="单号:">
                                <span style="float: left">{{purchase.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单日期:">
                                <span style="float: left">{{purchase.initDate}}</span>
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
                    <!--<el-table :data="purchase.details" size="mini" style="width: 100%">
                        <el-table-column type="index" align="left" width="30" ></el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" ></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>

                        <el-table-column label="数量" prop="number"></el-table-column>
                        <el-table-column label="价格" prop="price"></el-table-column>
                        <el-table-column label="总额" prop="totalMoney"></el-table-column>
                    </el-table>-->
                    <table v-for="(item, i) in purchase.details" style="border-collapse: collapse; border: none; width: 100%;">
                        <tr v-if="i==0">
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">特殊规格参数</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">通用规格参数</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">价格</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">总额</td>
                        </tr>
                        <tr>
                            <td v-text="(i+1)" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.code" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.product.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.ownSpec" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.product.productDetail.genericSpec" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.number" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.price" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.totalMoney" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        </tr>
                    </table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">物流信息</span>
                </div>
                <div>
                    <!--<el-table :data="costs" size="mini">

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
                    </el-table>-->
                    <table v-for="(item, i) in costs" style="border-collapse: collapse; border: none; width: 100%;">
                        <tr v-if="i == 0">
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">物流名称</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">单号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">运费</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">联系方式</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">创建时间</td>
                        </tr>
                        <tr>
                            <td v-text="(i+1)" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.express.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.logisticsNumber" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.money" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.express.phone" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.ctime" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        </tr>
                    </table>
                </div>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "PurchasePrintFormwork",
        props:{
            oldPurchase: {
                type: Object,
                default:() => {}
            },
            oldCosts: {
                type: Array,
                default: () => {}
            }
        },
        watch: {
            oldPurchase:{
                handler(val) {
                    this.purchase = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate: true
            },
            oldCosts: {
                handler(val) {
                    this.costs = JSON.parse(JSON.stringify(val));
                },
                deep: true,
                immediate: true
            }
        },
        data() {
            return{
                purchase: {},
                costs: []
            }
        }
    }
</script>

<style scoped>
    @page{
        size: auto A4 landscape;
        margin: 3mm;
    }
</style>