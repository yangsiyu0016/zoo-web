<template>
    <div>
        <el-form ref="logisticsForm" :model="cost" label-width="120px">
            <el-card>
                <el-form-item label="物流:">
                    <el-select size="mini" value-key="id" style="float: left" v-model="cost.express"  filterable >
                        <el-option v-for="(item,i) in expresses" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运费:" >
                    <el-input-number size="mini" :min="0" style="float: left" v-model="cost.money"></el-input-number>
                </el-form-item>
                <el-form-item label="物流单号:" >
                    <el-input size="mini" v-model="cost.logisticsNumber"></el-input>
                </el-form-item>
                <el-form-item label="联系方式:">
                    <el-input size="mini"></el-input>
                </el-form-item>
                <el-form-item label="起发地址">
                    <el-input size="mini"></el-input>
                </el-form-item>
            </el-card>
            <el-card>
                <div slot="header" class="clearfix"><span style="float: left">产品列表</span></div>
                <div>

                    <el-table :data="cost.details">
                        <el-table-column type="index" width="80px"></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name"></el-table-column>
                        <el-table-column label="特殊属性" prop="productSku.ownSpec"></el-table-column>
                        <el-table-column label="通用属性" prop="productSku.product.productDetail.genericSpec"></el-table-column>
                        <el-table-column label="数量" >
                            <template slot-scope="scope">
                                <el-input-number size="mini" :min="0" v-model="scope.row.number"></el-input-number>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
            </el-card>
            <el-card>
                <el-button size="mini" @click="saveLogistics" type="primary">保存</el-button>
                <el-button size="mini" @click="close" type="info">关闭</el-button>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "PurchaseLogisticsForm",
        methods:{
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                cost:{
                    details:[]
                }
            }
        }
    }
</script>

<style scoped>

</style>