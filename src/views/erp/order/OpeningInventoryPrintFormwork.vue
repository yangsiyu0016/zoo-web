<template>
    <div style="width: 100%; text-align: center">
        <span style="text-align: center; font-size: 24px; font-weight: bold">期初订单</span>
        <el-card shadow="hover" >
            <div slot="header" class="clearfix">
                <span style="float: left;">单据基本信息</span>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="单号:">
                            <span style="float: left">{{oi.code}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单据日期:">
                            <span style="float: left">{{oi.initDate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="仓库:">
                            <span style="float: left">{{oi.warehouse.name}}</span>
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
                <!--<el-table :data="oi.details" size="mini" style="width: 100%">
                    <el-table-column type="index" align="left" width="30" fixed></el-table-column>
                    <el-table-column label="产品编号" prop="productSku.code" fixed></el-table-column>
                    <el-table-column label="产品名称" prop="productSku.product.name" fixed></el-table-column>
                    <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                    <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400" fixed ></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>

                </el-table>-->
                <table v-for="(item, i) in oi.details" style="border-collapse: collapse; border: none; width: 100%;">
                    <tr v-if="i==0">
                        <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                        <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                        <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                        <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">特殊规格参数</td>
                        <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">通用规格参数</td>
                        <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">货位</td>
                        <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                    </tr>
                    <tr>
                        <td v-text="i" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td v-text="item.productSku.code" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td v-text="item.productSku.product.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td v-text="item.productSku.ownSpec" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td v-text="item.productSku.product.productDetail.genericSpec" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td v-text="item.goodsAllocation.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td v-text="item.number" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                    </tr>
                </table>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "OpengingInventoryPrintFormwork",
        data() {
            return {
                oi:{}
            }
        },
        watch:{
            oldOi:{
                handler(val){
                    this.oi = JSON.parse(JSON.stringify(val));
                    /* this.loadHistory();*/
                },
                deep:true,
                immediate:true
            }
        },
    }
</script>

<style scoped>
    @page{
        size: auto A4 landscape;
        margin: 3mm;
    }
</style>