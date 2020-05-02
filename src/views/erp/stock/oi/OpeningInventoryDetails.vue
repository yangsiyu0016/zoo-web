<template>
    <div>
        <el-card shadow="hover" >
            <div slot="header" class="clearfix">
                <span style="float: left;">单据基本信息</span>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span>单据日期:{{oi.initDate}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>单号：{{oi.code}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span>仓库:{{oi.warehouse.name}}</span>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header">
                <span style="float: left;">产品清单</span>
            </div>
            <div>
                <el-table :data="oi.details" size="mini" style="width: 100%">
                    <el-table-column type="index" align="left" width="30" fixed></el-table-column>
                    <el-table-column label="产品编号" prop="productSku.code" fixed></el-table-column>
                    <el-table-column label="产品名称" prop="productSku.product.name" fixed></el-table-column>
                    <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                    <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400" fixed ></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>

                </el-table>
            </div>
        </el-card>
        <el-card>
            <el-button @click="close" size="mini" type="info">关闭</el-button>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "OpeningInventoryDetails",
        props:{
            oi:{
                type:Object,
                default:()=>{}
            }
        },
        methods:{
            close(){
                this.$emit("close");
            }
        }
    }
</script>

<style scoped>

</style>