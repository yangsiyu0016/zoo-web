<template>
    <div>
        <el-table :data="stocks"
                  size="mini"
                  style="width:100%">
            <el-table-column
                    type="selection"
                    align="left"
                    width="30">
            </el-table-column>
            <el-table-column prop="warehouse.name" label="仓库" align="left"></el-table-column>
            <el-table-column prop="productSku.product.name" label="产品名称" align="left"></el-table-column>
            <el-table-column prop="productSku.ownSpec" label="特殊规格参数" align="left"></el-table-column>
            <el-table-column prop="productSku.product.productDetail.genericSpec" label="通用规格参数" align="left"></el-table-column>
            <el-table-column prop="usableNumber" label="可用数量" align="left"></el-table-column>
            <el-table-column prop="lockedNumber" label="锁定数量" align="left"></el-table-column>
        </el-table>
        <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-pagination
                    background
                    :page-size="10"
                    :current-page="currentPage"
                    layout="prev,pager,next"
                    :total="totalCount">
            </el-pagination>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Stock",
        mounted(){
            this.loadStocks();
        },
        methods:{
            loadStocks(){
                this.getRequest('/erp/stock/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.stocks = resp.data.stocks;
                    this.totalCount = resp.data.count;
                })
            }
        },
        data(){
            return{
                stocks:[],
                currentPage:1,
                totalCount:-1
            }
        }
    }
</script>

<style scoped>

</style>