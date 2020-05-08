<template>
    <div>
        <el-from>
            <el-card shadow="hover" >
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="单据日期:">
                                <span>{{sell.initDate}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <span>单号：{{sell.code}}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <span>客户:{{sell.customer.name}}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <span>收货地址:{{sell.receiving.receivingContext}}</span>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card>
                <el-button @click="destroySell" size="mini" type="danger" v-show="canDestroy">作废</el-button>
                <el-button @click="close" size="mini" type="info">关闭</el-button>
            </el-card>
        </el-from>
    </div>
</template>

<script>
    export default {
        name: "SellDetails",
        props:{
            sell:{
                type:Object,
                default:()=>{}
            },
            canDestroy: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
            }
        },
        mounted() {

        },
        methods: {
            destroySell() {
                this.$confirm('确定作废该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.postRequest('/erp/sell/destroy?id=' + this.sell.id);
                })
            },
            //关闭
            close(){
                this.$emit("close");
            }
        }
    }
</script>

<style scoped>

</style>