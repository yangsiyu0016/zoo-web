<template>
    <div>
        <el-button @click="showAddView" size="mini" type="primary" icon="el-icon-plus">新增</el-button>
        <el-table size="mini">
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column label="货位"></el-table-column>
            <el-table-column label="数量"></el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :append-to-body="true" :close-on-click-modal="false"  width="40%" >
            <product-split-inbound-form></product-split-inbound-form>
        </el-dialog>

    </div>
</template>

<script>
    import ProductSplitInboundForm from "@/views/oa/task/productsplit/ProductSplitInboundForm";
    export default {
        name: "ProductSplitInboundTable",
        components: {ProductSplitInboundForm},
        methods:{
            showAddView(){
                this.dialogTitle="货位设置";
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                dialogVisible:false,
                dialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>