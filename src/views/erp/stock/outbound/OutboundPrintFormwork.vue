<template>
    <el-container>
        <el-header style="width: 100%; text-align: center">
            <span style="text-align: center; font-size: 24px; font-weight: bold">出库单</span>
        </el-header>
        <el-main>
            <el-form label-width="120px">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span style="float: left;">单据基本信息</span>
                    </div>
                    <div>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item>
                                    单号：<span>{{outbound.code}}</span>
                                </el-form-item>

                            </el-col>
                            <el-col :span="12">
                                <el-form-item>
                                    来自：<span v-if="outbound.type=='CF'">拆分单</span>
                                    <span v-if="outbound.type=='SELL'">销售单</span>
                                </el-form-item>

                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item>
                                    仓库：<span >{{outbound.warehouse.name}}</span>
                                </el-form-item>

                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span style="float: left;">物流信息</span>
                    </div>
                    <div>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item>
                                    物流/快递：<span>{{outbound.cost.express.name}}</span>
                                </el-form-item>

                            </el-col>
                            <el-col :span="12">
                                <el-form-item>
                                    费用：<span>{{outbound.cost.money}}</span>
                                </el-form-item>

                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span style="float: left;">出库明细</span>
                    </div>
                    <div>
                        <table id="table" style="border-collapse: collapse; border: none; width: 100%;">
                            <tr >
                                <td width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                                <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                                <td width="25%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                                <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品图片</td>
                                <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>

                            </tr>
                            <tr v-for="(item, i) in outbound.details">

                                <td width="5%" v-text="(i + 1)" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                                <td width="15%" v-text="item.product.code" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                                <td width="25%" v-text="item.product.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                                <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">
                                    <el-image style="width: 100px;height: 100px"  v-if="item.product.imageUrl" :src="item.product.imageUrl" ></el-image>
                                </td>
                                <td width="10%" v-text="item.number" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>

                            </tr>
                            <tr>
                                <td width="5%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">合计</td>
                                <td width="15%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                                <td width="25%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                                <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                                <td width="10%"  style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">{{totalNumber}}</td>

                            </tr>
                        </table>
                    </div>
                </el-card>
                <el-card shadow="hover" style="text-align: left">
                    <el-row>
                        <span>制单人：{{outbound.cuser.realName}}</span>
                    </el-row>
                    <el-row>
                        <span>制单日期：{{outbound.ctime}}</span>
                    </el-row>
                </el-card>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "OutboundPrintFormwork",
        props:{
            outbound:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            outbound:{
                handler(val){
                    this.totalNumber = 0;
                    val.details.forEach((detail)=>{
                        this.totalNumber+=detail.number;
                    })
                },
                deep:true,
                immediate:true
            }
        },
        data(){
            return{
                totalNumber:0
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