<template>
    <el-table size="mini" :data="cdata">
        <el-table-column  type="expand">
            <template slot-scope="scope">
                <div v-if="scope.row.details.length>0">
                    <material-structure-detail-table :cdata="scope.row.details"></material-structure-detail-table>
                </div>

            </template>
        </el-table-column>
        <el-table-column label="产品编号" prop="product.code" ></el-table-column>
        <el-table-column label="产品名称" prop="product.name" ></el-table-column>
        <el-table-column prop="product.imageUrl" label="图片">
            <template slot-scope="scope">
                <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
            </template>
        </el-table-column>
        <el-table-column label="数量" prop="number" ></el-table-column>
        <el-table-column label="产品参数">
            <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
            <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

            <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
            <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
            <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
            <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
            <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
            <el-table-column prop="product.description" align="left" label="备注" :show-overflow-tooltip='true'></el-table-column>
        </el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <!--<el-table-column>
            <template slot-scope="scope">
                <el-button @click="showEditBomView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"  type="primary">编辑</el-button>
            </template>
        </el-table-column>-->
    </el-table>
</template>

<script>
    export default {
        name: "MaterialStructureDetailTable",
        props:["cdata"],
        methods:{
            showEditBomView(row){
                this.$emit("editMethod",row.product.id);
            }

        }
    }
</script>

<style scoped>

</style>