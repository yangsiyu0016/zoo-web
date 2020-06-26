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