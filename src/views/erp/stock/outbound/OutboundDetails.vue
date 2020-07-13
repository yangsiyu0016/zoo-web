<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-printer"
                               @click="print">
                        打印
                    </el-button>
                </div>
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
                                <el-col :span="8">
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
                            <el-table
                                    :data="outbound.details"
                                    size="mini"
                                    style="width:100%" >
                                <el-table-column
                                        type="index"
                                        align="left"
                                        width="80">
                                </el-table-column>
                                <el-table-column prop="product.imageUrl" label="图片">
                                    <template slot-scope="scope">
                                        <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                                    </template>
                                </el-table-column>
                                <el-table-column label="产品编号" prop="product.code" ></el-table-column>
                                <el-table-column label="产品名称" prop="product.name" ></el-table-column>
                                <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                                <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                                <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
                                <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                                <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                                <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                                <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                                <el-table-column prop="product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>

                                <el-table-column label="数量" prop="number"></el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                    <el-card shadow="hover" style="text-align: center">
                        <el-button @click="close" size="mini" type="info" icon="el-icon-close">关闭</el-button>
                    </el-card>
                </el-form>
            </el-main>
        </el-container>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <outbound-print-formwork :outbound="outbound"></outbound-print-formwork>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import vueEasyPrint from "vue-easy-print";
    import OutboundPrintFormwork from "@/views/erp/stock/outbound/OutboundPrintFormwork";
    export default {
        name: "OutboundDetails",
        components:{OutboundPrintFormwork, vueEasyPrint},
        props:{
            outbound:{
                type:Object,
                default:()=>{}
            }
        },
        methods:{
            //打印
            print(){

                this.$refs.easyPrint.print();
            },
            close(){
                this.$emit("close");
            }
        }
    }
</script>

<style scoped>

</style>