<template>
    <div>
        <el-table :data="journalAccounts" v-loading="tableLoading" size="mini" style="width:100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="type" align="left"  label="类型" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type=='QC'" type="info" size="mini" effect="dark">期初</el-tag>
                    <el-tag v-if="scope.row.type=='PURCHASE'"  color="#7b1fa2" size="mini" effect="dark">采购</el-tag>
                    <el-tag v-if="scope.row.type=='SELL'" type="warning" size="mini" effect="dark">销售</el-tag>
                    <el-tag v-if="scope.row.type=='LOSSES'" type="success" size="mini" effect="dark">盘亏</el-tag>
                    <el-tag v-if="scope.row.type=='QCDESTROY'" type="info" size="mini" effect="dark">期初作废</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="orderCode" align="left"  label="单号" width="180" ></el-table-column>
            <el-table-column prop="stock.warehouse.name" align="left" label="仓库"></el-table-column>
            <el-table-column prop="stock.product.imageUrl" label="图片">
                <template slot-scope="scope">
                    <el-image v-if="scope.row.stock.product.imageUrl" :src="scope.row.stock.product.imageUrl" :preview-src-list="[scope.row.stock.product.imageUrl]"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="产品编号" prop="stock.product.code" width="180"></el-table-column>
            <el-table-column label="产品名称" prop="stock.product.name" ></el-table-column>
            <el-table-column prop="stock.product.typeName" align="left" width="100" label="分类"></el-table-column>
            <el-table-column prop="stock.product.productBrand.name" align="left"  label="品牌" ></el-table-column>

            <el-table-column prop="stock.product.spec" align="left" label="规格"></el-table-column>
            <el-table-column prop="stock.product.unit.name" align="left" label="单位"></el-table-column>
            <el-table-column prop="stock.product.weight" align="left" label="重量"></el-table-column>
            <el-table-column prop="stock.product.color" align="left" label="颜色"></el-table-column>
            <el-table-column prop="stock.product.puse" align="left" label="用途"></el-table-column>
            <el-table-column prop="stock.product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>
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