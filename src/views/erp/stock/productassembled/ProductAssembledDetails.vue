<template>
    <div>
        <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
            <div style="margin-left: 5px;margin-right: 20px;display: inline">
                <el-button type="primary" size="mini" icon="el-icon-printer"
                           @click="print">
                    打印
                </el-button>
            </div>
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
                <el-table
                        :data="productAssembled.materials"
                        size="mini"
                        style="width:100%" >
                    <el-table-column
                            type="selection"
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
                    <el-table-column label="组合单数" prop="number"></el-table-column>
                    <el-table-column label="需求总数" prop="needNumber" ></el-table-column>
                    <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                    <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                    <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
                    <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                    <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                    <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                    <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                    <el-table-column prop="product.description" align="left" label="备注" :show-tooltip-when-overflow="true"></el-table-column>

                </el-table>
            </el-card>
            <el-card shadow="hover">
                <div style="text-align: center">
                    <el-button @click="cancel" type="info" size="mini">关闭</el-button>
                </div>
            </el-card>
        </el-form>
        <div v-show="false">

            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <product-assembled-print-formwork :product-assembled="productAssembled"></product-assembled-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import vueEasyPrint from "vue-easy-print";
    import ProductAssembledPrintFormwork from "@/views/erp/stock/productassembled/ProductAssembledPrintFormwork";
    export default {
        name: "ProductAssembledDetails",
        components:{ProductAssembledPrintFormwork, vueEasyPrint},
        props:{
            productAssembled:{
                type:Object,
                default:()=>{}
            }
        },
        methods:{
            print(){
                this.$refs.easyPrint.print();
            },
            cancel(){
                this.$emit("close");
            }
        }
    }
</script>

<style scoped>

</style>