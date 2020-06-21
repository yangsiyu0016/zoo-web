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
                    <span style="float: left;">组装产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item   label="组装日期:">
                                <span style="float: left">{{productAssembled.assembledTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{productAssembled.code}}</span>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" >
                            <el-form-item label="组装仓库:" >
                                <span style="float: left">{{productAssembled.warehouse.name}}</span>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="产品编号:">
                                <span style="float: left">{{productAssembled.product.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:">
                                <span style="float: left">{{productAssembled.product.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="组装数量:" >
                                <span style="float: left">{{productAssembled.number}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col >
                            <el-form-item label="备注:" prop="description">
                                <span style="float: left">{{productAssembled.description}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">组装材料明细</span>
                </div>
                <table v-for="(item, i) in productAssembled.materials" style="border-collapse: collapse; border: none; width: 100%;">
                    <tr v-if="i==0">
                        <td width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                        <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品图片</td>
                        <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                        <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">需求数量</td>
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
                        <td width="15%" v-text="item.needNumber" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        <td width="15%" v-text="item.product.unit==null?'':item.product.unit.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                    </tr>
                </table>
            </el-card>
            <el-card shadow="hover">
                <el-row>
                    <span>制单人：{{productAssembled.cuser.realName}}</span>
                </el-row>
                <el-row>
                    <span>制单日期：{{productAssembled.ctime}}</span>
                </el-row>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    import logo from '@/assets/logo.jpg'
    export default {
        name: "ProductAssembledPrintFormwork",
        props:{
            productAssembled:{
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