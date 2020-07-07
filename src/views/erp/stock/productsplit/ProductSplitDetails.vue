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
                <div slot="header" class="clearfix">
                    <span style="float: left;">出库信息</span>
                </div>
                <div>
                    <el-table :data="outboundDetails" size="mini">
                        <el-table-column type="index" width="80"></el-table-column>
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
                        <el-table-column prop="product.description" align="left" label="备注" :show-tooltip-when-overflow="true"></el-table-column>
                        <el-table-column label="出库货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="出库数量" prop="number"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.number === 0 ? false:true" type="success" size="mini" effect="dark">已出库</el-tag>
                            </template>
                        </el-table-column>
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
            <el-card shadow="hover">
                <div style="text-align: center">
                    <el-button @click="resetProductSplitDetail" size="mini" type="danger" v-show="isReception">取回</el-button>
                    <el-button @click="destroyProductSplit" v-show="canDestroy"  size="mini" type="danger" >作废</el-button>
                    <el-button @click="cancel" type="info" size="mini">关闭</el-button>
                </div>
            </el-card>
        </el-form>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <product-split-print-formwork :productSplit="oldProductSplit"></product-split-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>

    import vueEasyPrint from "vue-easy-print";
    import ProductSplitPrintFormwork from "@/views/erp/stock/productsplit/ProductSplitPrintFormwork"

    export default {
        name: "ProductSplitDetails",
        components:{vueEasyPrint, ProductSplitPrintFormwork},
        props:{
            oldProductSplit:{
                type:Object,
                default:()=>{}
            },
            canDestroy:{
                type:Boolean,
                default:false
            },
            isReception:{
                type:Boolean,
                default:false
            }
        },
        mounted(){
            this.loadHistory();
            this.loadOut(this.oldProductSplit.id);
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
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.oldProductSplit.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
            //加载出库信息
            loadOut(id) {
                this.getRequest('/erp/outbound/detail/getDetailByOutboundForeignKey?foreignKey=' + id).then(resp=> {
                    this.outboundDetails = resp.data;
                })
            },
        },
        data(){
            return{
                outboundDetails:[],
                histories:[]
            }
        }
    }
</script>

<style scoped>

</style>