<template>
    <div>
        <el-card shadow="hover" >
            <div slot="header" class="clearfix">
                <span style="float: left;">单据基本信息</span>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span>单据日期:{{oi.initDate}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>单号：{{oi.code}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span>仓库:{{oi.warehouse.name}}</span>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header">
                <span style="float: left;">产品清单</span>
            </div>
            <div>
                <el-table :data="oi.details" size="mini" style="width: 100%">
                    <el-table-column type="index" align="left" width="30" fixed></el-table-column>
                    <el-table-column label="产品编号" prop="productSku.code" fixed></el-table-column>
                    <el-table-column label="产品名称" prop="productSku.product.name" fixed></el-table-column>
                    <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                    <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400" fixed ></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>

                </el-table>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="float: left;">审批流程</span>
            </div>
            <div>
                <el-table :data="histories">
                    <el-table-column type="index" width="80px"></el-table-column>
                    <el-table-column label="节点名称" prop="actName"></el-table-column>
                    <el-table-column label="意见" prop="message"></el-table-column>
                    <el-table-column label="办理人" prop="assigneeName"></el-table-column>
                    <el-table-column label="开始时间" prop="stime"></el-table-column>
                    <el-table-column label="结束时间" prop="etime"></el-table-column>
                    <el-table-column label="用时" prop="duration"></el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card>
            <el-button @click="resetOiDetail" size="mini" type="danger" v-show="isReception">取回</el-button>
            <el-button @click="close" size="mini" type="info">关闭</el-button>
        </el-card>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <opening-inventory-print-formwork :getChineseNumber="func.getChineseNumber" :oldOi="oi"></opening-inventory-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import vueEasyPrint from "vue-easy-print";
    import OpeningInventoryPrintFormwork from "@/views/erp/order/OpeningInventoryPrintFormwork";
    export default {
        name: "OpeningInventoryDetails",
        components:{vueEasyPrint,OpeningInventoryPrintFormwork },
        props:{
            oi:{
                type:Object,
                default:()=>{}
            },
            canDestroy: {
                type: Boolean,
                default: false
            },
            isReception: {
                type: Boolean,
                default: false
            }
        },

        mounted() {
          this.loadHistory();
        },
        methods:{
            //打印
            print(){

                this.$refs.easyPrint.print();
            },
            resetOiDetail() {
                this.$confirm('确定取回该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.getRequest('/oi/reset?id=' + this.oi.id).then(resp => {
                        this.$emit("callback");
                    });

                })
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.oi.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
            close(){
                this.$emit("close");
            },
            destroyOi() {
                this.$confirm('确定作废此订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.postRequest('/oi/destroy?id=' + this.oi.id);
                })
            }
        },
        data() {
            return {
                histories:[]
            }
        }
    }
</script>

<style scoped>

</style>