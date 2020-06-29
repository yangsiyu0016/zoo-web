<template>
    <div>
        <el-header>
            <el-row>
                <el-col :span="8">
                    <el-image :src="logo"></el-image>
                </el-col>
                <el-col :span="16">
                    <span style="text-align: center;
    	margin-bottom: 1em;
    	font-size: 20pt;
    	font-weight: bold;
    	line-height: 1.5;
   	 	color: #000833;
    	text-shadow: 0px 1px 3px #CCC;">牧疆南北组装订单</span>
                </el-col>
                <!-- <td  class="middle pageTitle" style="font-size: 25px; vertical-align: top;">订单</td>-->
            </el-row>
        </el-header>
        <el-form size="mini"  label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">拆分产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item   label="拆分日期:">
                                <span style="float: left">{{productSplit.splitTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{productSplit.code}}</span>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" >
                            <el-form-item label="拆分仓库:" >
                                <span style="float: left">{{productSplit.warehouse.name}}</span>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="产品编号:">
                                <span style="float: left">{{productSplit.product.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:">
                                <span style="float: left">{{productSplit.product.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="拆分数量:" >
                                <span style="float: left">{{productSplit.number}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col >
                            <el-form-item label="备注:" prop="description">
                                <span style="float: left">{{productSplit.description}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">拆分材料明细</span>
                </div>
                <table v-for="(item, i) in productSplit.details" style="border-collapse: collapse; border: none; width: 100%;">
                    <tr v-if="i==0">
                        <td width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品图片</td>
                        <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                        <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">拆分总数</td>
                        <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">单位</td>
                    </tr>
                    <tr>
                        <td width="5%" v-text="(i + 1)" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="20%" v-text="item.product.code" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="20%" v-text="item.product.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">
                            <el-image style="width: 100px;height: 100px"  v-if="item.product.imageUrl" :src="item.product.imageUrl" ></el-image>
                        </td>
                        <td width="15%" v-text="item.number" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="15%" v-text="item.totalNumber" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="15%" v-text="item.product.unit==null?'':item.product.unit.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                    </tr>
                </table>
            </el-card>
            <el-card shadow="hover">
                <el-row>
                    <span>制单人：{{productSplit.splitMan.realName}}</span>
                </el-row>
                <el-row>
                    <span>制单日期：{{productSplit.ctime}}</span>
                </el-row>
            </el-card>
        </el-form>
    </div>
</template>

<script>

    import logo from '@/assets/logo.jpg'

    export default {
        name: "ProductSplitPrintFormwork",
        props: {
            productSplit: {
                type:Object,
                default: ()=>{}
            }
        },
        data() {
            return {
                logo: logo
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