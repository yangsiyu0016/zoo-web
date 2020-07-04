<template>
    <div>
        <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
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
    	text-shadow: 0px 1px 3px #CCC;">入库订单</span>
                </el-col>
                <!-- <td  class="middle pageTitle" style="font-size: 25px; vertical-align: top;">订单</td>-->
            </el-row>
        </el-header>
        <el-form size="mini" label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left">入库产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="入库时间:">
                                <span style="float: left">{{currentInbound.ctime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="入库单号:">
                                <span style="float: left">{{currentInbound.code}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="入库单来自:">
                                <span style="float: left" v-show="currentInbound.type === 'CF'?true:false">拆分单</span>
                                <span style="float: left" v-show="currentInbound.type === 'ZZ'?true:false">组装单</span>
                                <span style="float: left" v-show="currentInbound.type === 'PURCHASE'?true:false">采购单</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="入库仓库:">
                                <span style="float: left">{{currentInbound.warehouse.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">入库产品明细</span>
                </div>

                <table v-for="(item, i) in currentInbound.details" style="border-collapse: collapse; border: none; width: 100%;">
                    <tr v-if="i==0">
                        <td width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品图片</td>
                        <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                        <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                        <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">单位</td>
                        <td width="25%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">规格</td>
                        <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                    </tr>
                    <tr>
                        <td width="5%" v-text="(i + 1)" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">
                            <el-image style="width: 100px;height: 100px"  v-if="item.product.imageUrl" :src="item.product.imageUrl" ></el-image>
                        </td>
                        <td width="15%" v-text="item.product.code" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="10%" v-text="item.product.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="10%" v-text="item.product.unit==null?'':item.product.unit.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="25%" v-text="item.product.spec" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="15%" v-text="item.number" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>

                    </tr>
                </table>
            </el-card>
            <el-card shadow="hover">
                <el-row>
                    <span>制单人：{{currentInbound.cuser.realName}}</span>
                </el-row>
                <el-row>
                    <span>制单日期：{{currentInbound.ctime}}</span>
                </el-row>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    import logo from '@/assets/logo.jpg'
    export default {
        name: "InboundDetailsPrintFormwork",
        props: {
            currentInbound: {
                type:Object,
                default:()=>{}
            }
        },
        data(){
            return{
                logo:logo
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