<template>
    <div style="width: 100%; text-align: center">
        <span style="text-align: center; font-size: 24px; font-weight: bold">盘点单</span>
        <el-form label-width="120px">
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{check.code}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据日期:">
                                <span style="float: left">{{check.initDate}}</span>
                            </el-form-item>

                        </el-col>

                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="仓库:">
                                <span style="float: left">{{check.warehouse.name}}</span>
                            </el-form-item >
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <!--<el-table
                            :data="check.details"
                            size="mini"
                            style="width:100%; font-size: 5px">
                        <el-table-column
                                type="index"
                                align="left" label="序号">
                        </el-table-column>
                        <el-table-column label="类型" prop="type">
                            <template slot-scope="scope">
                                <el-tag size="mini" type="success" v-if="scope.row.type=='LOSSES'">盘亏</el-tag>
                                <el-tag size="mini" type="danger" v-else>盘盈</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code"  ></el-table-column>

                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" ></el-table-column>

                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" label="通用规格参数" ></el-table-column>

                        <el-table-column label="货位" prop="goodsAllocation.name" ></el-table-column>
                        <el-table-column label="数量" prop="number" ></el-table-column>
                    </el-table>-->
                    <table v-for="(item, i) in check.details" style="border-collapse: collapse; border: none; width: 100%;">
                        <tr v-if="i==0">
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">序号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">类型</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品编号</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">产品名称</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">特殊规格参数</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">通用规格参数</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">货位</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">数量</td>
                        </tr>
                        <tr>
                            <td v-text="i" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;"></td>
                            <td v-if="item.type == 'LOSSES'" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">
                                {{'盘亏'}}
                            </td>
                            <td v-else="item.type !== 'LOSSES'" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;">
                                {{'盘盈'}}
                            </td>
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
           <!-- <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">审批流程</span>
                </div>
                <div>
                   <el-table :data="histories" size="mini">
                        <el-table-column type="index" width="80px"></el-table-column>
                        <el-table-column label="节点名称" prop="actName"></el-table-column>
                        <el-table-column label="意见" prop="message"></el-table-column>
                        <el-table-column label="办理人" prop="assigneeName"></el-table-column>
                        <el-table-column label="开始时间" prop="stime"></el-table-column>
                        <el-table-column label="结束时间" prop="etime"></el-table-column>
                        <el-table-column label="用时" prop="duration"></el-table-column>
                    </el-table>
                    <table v-for="(item, i) in histories" style="border-collapse: collapse; border: none; width: 100%;">
                        <tr v-if="i == 0" >
                            <td width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px">序号</td>
                            <td width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px">节点名称</td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px">意见</td>
                            <td width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px">办理人</td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px">开始时间</td>
                            <td width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px">结束时间</td>
                            <td style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px">用时</td>
                        </tr>
                        <tr >
                            <td v-text="i" width="5%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px"></td>
                            <td v-text="item.actName" width="15%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px"></td>
                            <td v-text="item.message" width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px"></td>
                            <td v-text="item.assigneeName" width="10%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px"></td>
                            <td v-text="item.stime" width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px"></td>
                            <td v-text="item.etime" width="20%" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px"></td>
                            <td v-text="item.duration" style="border: solid #BCB0B0 1px; vertical-align: middle; text-align: center; font-size: 10px"></td>
                        </tr>
                    </table>
                </div>
            </el-card>-->
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "InventoryCheckPrintFormwork",
        props: {
            oldCheck:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldCheck:{
                handler(val){
                    this.check = JSON.parse(JSON.stringify(val));
                   /* this.loadHistory();*/
                },
                deep:true,
                immediate:true
            }
        },
        methods: {
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.check.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
        },
        data() {
            return{
                check:{

                },
                histories: []
            }
        }
    }
</script>

<style scoped>
    @page{
        size: auto A4 landscape;
        margin: 3mm;
    }
    /** table 细边框 **/
    table{border-collapse: collapse; border: none; width: 100%;}
    td{border: solid #BCB0B0 1px; vertical-align: middle; text-align: center;}
</style>