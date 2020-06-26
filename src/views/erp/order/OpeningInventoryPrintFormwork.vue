<template>
    <div style="width: 100%; text-align: center">
        <el-header>
            <el-row>
                <el-col :span="6">
                    <el-image :src="logo" style="float: left"></el-image>
                </el-col>
                <el-col :span="12">
                    <span style="text-align: center;
    	margin-bottom: 1em;
    	font-size: 20pt;
    	font-weight: bold;
    	line-height: 1.5;
   	 	color: #000833;
    	text-shadow: 0px 1px 3px #CCC;">牧疆南北期初订单</span>
                </el-col>
                <!-- <td  class="middle pageTitle" style="font-size: 25px; vertical-align: top;">订单</td>-->
            </el-row>
        </el-header>
        <el-form size="mini"  label-width="120px">
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <div>
                    <el-form>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="单号:">
                                    <span style="float: left">{{currentOi.code}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="单据日期:">
                                    <span style="float: left">{{currentOi.initDate}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="仓库:">
                                    <span style="float: left">{{currentOi.warehouse.name}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <table v-for="(item, i) in currentOi.details" style="border-collapse: collapse; border: none; width: 100%;">
                        <tr v-if="i==0">
                            <td width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品图片</td>
                            <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
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
                            <td width="15%" v-text="item.product.unit==null?'':item.product.unit.name" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                        </tr>
                    </table>
                </div>
            </el-card>
            <el-card shadow="hover" style="text-align: left">
                <el-row>
                    <span>制单人：{{currentOi.cuser.realName}}</span>
                </el-row>
                <el-row>
                    <span>制单日期：{{currentOi.ctime}}</span>
                </el-row>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    import logo from '@/assets/logo.jpg'
    export default {
        name: "OpengingInventoryPrintFormwork",
        props:{
            oi:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oi:{
                handler(val){
                    this.currentOi = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        data(){
            return{
                logo:logo,
                currentOi:{
                    code:'',
                    warehouse:{
                        name:''
                    },
                    cuser:{
                        realName:''
                    }
                }
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