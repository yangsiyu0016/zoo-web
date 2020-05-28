<template>
    <div>
        <el-form label-width="120px">
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="单据日期:">
                                <span style="float: left">{{check.initDate}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <span>单号：{{check.code}}</span>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="仓库:">
                                <span style="float: left">{{check.warehouse.name}}</span>
                            </el-form-item >
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-table
                            :data="check.details"
                            size="mini"
                            style="width:100%">
                        <el-table-column
                                type="index"
                                align="left"
                                width="30">
                        </el-table-column>
                        <el-table-column label="类型" prop="type">
                            <template slot-scope="scope">
                                <el-tag size="mini" type="success" v-if="scope.row.type=='LOSSES'">盘亏</el-tag>
                                <el-tag size="mini" type="danger" v-else>盘盈</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品编号" prop="productSku.code" width="200"  ></el-table-column>

                        <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                        <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>

                        <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>

                        <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="数量" prop="number"></el-table-column>
                    </el-table>
                </div>
            </el-card>

            <el-card shadow="hover">
                <el-button @click="resetInventoryCheckDetail" size="mini" type="danger" v-show="isReception">取回</el-button>
                <el-button @click="close" size="mini" type="info">关闭</el-button>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "InventoryCheckDetails",
        props:{
            currentCheck:{
                type:Object,
                default:()=>{}
            },
            isReception: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            currentCheck: {
                handler(val){
                    this.check = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            resetInventoryCheckDetail() {
                this.$confirm('确定取回该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.getRequest('/inventoryCheck/reset?id=' + this.check.id).then(resp => {
                        this.$emit("callback");
                    });

                })

            },
            close(){
                this.$emit("close");
            },
            showDetails() {
                this.$emit("showDetails")
            }
        },
        data(){
            return{
                check:{

                }
            }
        }
    }
</script>

<style scoped>

</style>