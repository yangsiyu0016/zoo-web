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
            <el-card shadow="hover" >
                <el-button @click="resetInventoryCheckDetail" size="mini" type="danger" v-show="isReception">取回</el-button>
                <el-button @click="close" size="mini" type="info">关闭</el-button>
            </el-card>
        </el-form>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <inventory-check-print-formwork :getChineseNumber="func.getChineseNumber" :oldCheck="oldCheck"></inventory-check-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import vueEasyPrint from "vue-easy-print";
    import inventoryCheckPrintFormwork from "@/views/erp/order/InventoryCheckPrintFormwork";
    export default {
        name: "InventoryCheckDetails",
        components: {vueEasyPrint, inventoryCheckPrintFormwork},
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
                    this.oldCheck = this.check;
                    this.loadHistory();
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.check.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
            //打印
            print(){

                this.$refs.easyPrint.print();
            },
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

                },
                oldCheck: {

                },
                histories:[]
            }
        }
    }
</script>

<style scoped>

</style>