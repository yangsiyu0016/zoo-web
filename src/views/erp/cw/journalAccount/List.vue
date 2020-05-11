<template>
    <div>
        <el-table :data="journalAccounts" v-loading="tableLoading" size="mini" style="width:100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="type" align="left"  label="类型" ></el-table-column>
            <el-table-column prop="orderCode" align="left"  label="单号" width="180" ></el-table-column>
            <el-table-column prop="stock.warehouse.name" align="left" label="仓库"></el-table-column>
            <el-table-column prop="stock.productSku.product.name" align="left" label="产品名称"></el-table-column>
            <el-table-column prop="stock.productSku.ownSpec" align="left" label="特殊规格参数" width="300"></el-table-column>
            <el-table-column prop="stock.productSku.product.productDetail.genericSpec" align="left" label="通用规格参数" width="300"></el-table-column>
            <el-table-column prop="rkNumber" align="left" label="入库数量"></el-table-column>
            <el-table-column prop="rkPrice" align="left" label="入库单价"></el-table-column>
            <el-table-column prop="rkTotalMoney" align="left" label="入库总额"></el-table-column>
            <el-table-column prop="ckNumber" align="left" label="出库数量"></el-table-column>
            <el-table-column prop="ckPrice" align="left" label="出库单价"></el-table-column>
            <el-table-column prop="ckTotalMoney" align="left" label="出库总额"></el-table-column>
            <el-table-column prop="totalNumber" align="left" label="结存数量"></el-table-column>
            <el-table-column prop="costPrice" align="left" label="结存单价"></el-table-column>
            <el-table-column prop="totalMoney" align="left" label="结存总额"></el-table-column>
            <el-table-column prop="ctime" align="left" label="创建时间" width="300"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "List",
        data(){
            return{
                journalAccounts:[],
                tableLoading:false,
                totalCount:-1,
                currentPage:1
            }
        },
        mounted() {
            this.loadData();
        },
        methods:{
            loadData(){
                this.getRequest('/erp/ja/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.journalAccounts = resp.data.journalAccounts;
                    this.totalCount = resp.data.count;
                })
            }
        }
    }
</script>

<style scoped>

</style>