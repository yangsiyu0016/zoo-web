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
                    <span style="float: left;">拆分产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item   label="拆分日期:">
                                <span style="float: left">{{oldProductSplit.splitTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{oldProductSplit.code}}</span>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" >
                            <el-form-item label="拆分仓库:" >
                                <span style="float: left">{{oldProductSplit.warehouse.name}}</span>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="产品编号:">
                                <span style="float: left">{{oldProductSplit.product.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:">
                                <span style="float: left">{{oldProductSplit.product.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="拆分数量:" >
                                <span style="float: left">{{oldProductSplit.number}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col >
                            <el-form-item label="备注:" prop="description">
                                <span style="float: left">{{oldProductSplit.description}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">拆分材料明细</span>
                </div>
                <el-table
                        :data="oldProductSplit.details"
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
                    <el-table-column label="拆分单数" prop="number"></el-table-column>
                    <el-table-column label="拆分总数" prop="totalNumber" ></el-table-column>
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
                    <el-button @click="resetProductSplitDetail" size="mini" type="danger" >取回</el-button>
                    <el-button @click="destroyProductSplit" v-show="oldProductSplit.status!='DESTROY'"  size="mini" type="danger" >作废</el-button>
                    <el-button @click="cancel" type="info" size="mini">关闭</el-button>
                </div>
            </el-card>
        </el-form>
        <div v-show="false">

            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <product-assembled-print-formwork :product-assembled="oldProductSplit"></product-assembled-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProductSplitDetails",
        props:{
            oldProductSplit:{
                type:Object,
                default:()=>{}
            }
        },
        methods: {
            print(){
                this.$refs.easyPrint.print();
            },
            cancel(){
                this.$emit("close");
            },
            resetProductSplitDetail() {
                this.$confirm('确定取回订单吗？','提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.getRequest('/erp/split/reset?id=' + this.oldProductSplit.id).then(resp => {
                        if (resp && resp.data.status == '200') {
                            this.$message.success('取回成功');
                            this.$emit('callback');
                        }else {
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            destroyProductSplit() {
                this.$confirm('确定作废此订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest('/erp/split/destroy?id=' + this.oldProductSplit.id).then(resp => {
                        if (resp && resp.data.status == '200') {
                            this.$message.success('作废成功');
                            this.$emit('callback');
                        }else {
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>