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
                    <span style="float: left;">组装产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item   label="组装日期:">
                                <span style="float: left">{{currentProductAssembled.assembledTime}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单号:">
                                <span style="float: left">{{currentProductAssembled.code}}</span>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" >
                            <el-form-item label="组装仓库:" >
                                <span style="float: left">{{currentProductAssembled.warehouse.name}}</span>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="产品编号:">
                                <span style="float: left">{{currentProductAssembled.product.code}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:">
                                <span style="float: left">{{currentProductAssembled.product.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="组装数量:" >
                                <span style="float: left">{{currentProductAssembled.number}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col >
                            <el-form-item label="备注:" prop="description">
                                <span style="float: left">{{currentProductAssembled.description}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">组装材料明细</span>
                </div>
                <el-table
                        :data="currentProductAssembled.materials"
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
                    <el-table-column label="组合单数" prop="number"></el-table-column>
                    <el-table-column label="需求总数" prop="needNumber" ></el-table-column>
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
                    <span style="float: left;">入库信息</span>
                </div>
                <div>
                    <el-table :data="inboundDetails" size="mini">
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
                        <el-table-column label="入库货位" prop="goodsAllocation.name"></el-table-column>
                        <el-table-column label="入库数量" prop="number"></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.finished" type="success" size="mini" effect="dark">已入库</el-tag>
                                <el-tag v-if="!scope.row.finished" type="danger" size="mini" effect="dark">未入库</el-tag>

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
                    <el-button @click="takeBack" size="mini" type="danger" v-show="isReception">取回</el-button>
                    <el-button @click="destroyPa" v-show="canDestroy"  size="mini" type="danger" >作废</el-button>
                    <el-button @click="cancel" type="info" size="mini">关闭</el-button>
                </div>
            </el-card>
        </el-form>
        <div v-show="false">

            <vue-easy-print table-show ref="easyPrint" style="width: 65%">
                <template slot-scope="func">
                    <product-assembled-print-formwork :product-assembled="currentProductAssembled"></product-assembled-print-formwork>
                </template>
            </vue-easy-print>
        </div>
    </div>
</template>

<script>
    import vueEasyPrint from "vue-easy-print";
    import ProductAssembledPrintFormwork from "@/views/erp/stock/productassembled/ProductAssembledPrintFormwork";
    export default {
        name: "ProductAssembledDetails",
        components:{ProductAssembledPrintFormwork, vueEasyPrint},
        props:{
            productAssembled:{
                type:Object,
                default:()=>{}
            },
            canDestroy:{
                type:Boolean,
                default:false
            },
            isReception: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            productAssembled:{
                handler(val){

                    this.currentProductAssembled = JSON.parse(JSON.stringify(val));
                    this.loadHistory();
                    this.loadIn(val.id);
                    this.loadOut(val.id)
                },
                deep:true,
                immediate:true
            }
        },
        data(){
            return{
                currentProductAssembled:{},
                histories:[],
                outboundDetails: [],
                inboundDetails: []
            }
        },

        methods:{
            loadIn(id) {
                this.getRequest('/erp/inbound/detail/getDetailByInboundForeignKey?foreignKey=' + id).then(resp => {
                    if (resp && resp.status == 200) {
                        this.inboundDetails = resp.data;
                    }
                })
            },
            //加载出库信息
            loadOut(id) {
                this.getRequest('/erp/outbound/detail/getDetailByOutboundForeignKey?foreignKey=' + id).then(resp=> {
                    this.outboundDetails = resp.data;
                })
            },
            destroyPa() {
                this.$confirm('确定作废订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest('/erp/assembled/destroy?id=' + this.currentProductAssembled.id).then(resp => {
                        if (resp && resp.data.status == "200") {
                            this.$message.success('作废成功');
                            this.$emit('callback');
                        }else {
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            takeBack(){
                this.$confirm('确定取回该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(() => {
                    this.getRequest('/erp/assembled/takeBack?id=' + this.currentProductAssembled.id).then(resp => {
                        if(resp.data&&resp.data.status=="200"){
                            this.$message.success("取回成功");
                            this.$emit("callback");
                        }else{
                            this.$message.error(resp.data.msg);
                        }

                    });

                })
            },
            print(){
                this.$refs.easyPrint.print();
            },
            cancel(){
                this.$emit("close");
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.currentProductAssembled.processInstanceId).then((resp)=>{
                    this.histories = resp.data;
                })
            },
        }
    }
</script>

<style scoped>

</style>