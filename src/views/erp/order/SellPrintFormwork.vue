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
                    <table id="table" style="border-collapse: collapse; border: none; width: 100%;">
                        <tr >
                            <td width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                            <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                            <td width="25%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品图片</td>
                            <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                            <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">价格</td>
                            <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">总额</td>
                        </tr>
                        <tr v-for="(item, i) in sell.details">
                            <td width="5%" v-text="(i + 1)" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="15%" v-text="item.product.code" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="25%" v-text="item.product.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">
                                <el-image style="width: 100px;height: 100px"  v-if="item.product.imageUrl" :src="item.product.imageUrl" ></el-image>
                            </td>
                            <td width="10%" v-text="item.number" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="10%" v-text="item.price" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="10%" v-text="item.totalMoney" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        </tr>
                        <tr>
                            <td width="5%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">合计</td>
                            <td width="15%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="25%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="10%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td width="10%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        </tr>
                    </table>
                </div>
            </el-card>
            <el-card shadow="hover" style="text-align: left">
                <el-row>
                    <span>制单人：{{sell.cuser.realName}}</span>
                </el-row>
                <el-row>
                    <span>制单日期：{{sell.ctime}}</span>
                </el-row>
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
        mounted(){
            this.total();
        },
        methods: {
            total(){
                let table = document.getElementById("table");
                let trs = table.getElementsByTagName('tr');
                let start=1,end = trs.length-1;
                let number=0,totalMoney = 0;
                for (let i=start;i<end;i++){
                    let numbertd = trs[i].getElementsByTagName('td')[4];
                    let totalmoneytd = trs[i].getElementsByTagName('td')[6];
                    let td_number = parseFloat(numbertd.innerHTML);
                    let td_totalMoney = parseFloat(totalmoneytd.innerHTML);
                    number+=td_number;
                    totalMoney+=td_totalMoney;
                }
                trs[end].getElementsByTagName('td')[4].innerHTML=number;
                trs[end].getElementsByTagName('td')[6].innerHTML=totalMoney;
            }

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