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
            }
        },
        data(){
            return{
            }
        }
    }
</script>

<style scoped>

</style>