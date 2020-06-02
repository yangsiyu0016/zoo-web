<template>
    <div style="width: 100%; text-align: center">
        <span style="text-align: center; font-size: 24px; font-weight: bold">销售订单</span>
        <el-form label-width="120px">
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{sell.code}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据日期:">
                                <span style="float: left">{{sell.initDate}}</span>
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
                    <table v-for="(item, i) in sell.details" style="border-collapse: collapse; border: none; width: 100%;">
                        <tr v-if="i==0">
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">特殊规格参数</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">通用规格参数</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">发货仓库</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">价格</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">总额</td>
                        </tr>
                        <tr>
                            <td v-text="(i + 1)" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.code" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.product.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.ownSpec" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.productSku.product.productDetail.genericSpec" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-text="item.warehouse.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
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
        name: "SellCheckPrintFormwork",
        props: {
            oldSell: {
                type:Object,
                default: ()=>{}
            },
            oldCosts:{
                type: Array,
                default: ()=>{}
            }
        },
        watch: {
            oldSell:{
                handler(val) {
                    this.sell = JSON.parse(JSON.stringify(val));
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
        methods: {

        },
        data() {
            return{
                sell:{},
                costs:[]
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