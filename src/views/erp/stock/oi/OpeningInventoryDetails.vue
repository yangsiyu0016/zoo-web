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
        <el-card shadow="hover" >
            <div slot="header" class="clearfix">
                <span style="float: left;">单据基本信息</span>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span>单据日期:{{currentOi.initDate}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>单号：{{currentOi.code}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span>仓库:{{currentOi.warehouse.name}}</span>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header">
                <span style="float: left;">产品清单</span>
            </div>
            <div>
                <el-table :data="currentOi.details" size="mini" style="width: 100%" show-summary>
                    <el-table-column type="index" align="left" width="80" fixed></el-table-column>
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
                    <el-table-column prop="product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>

                </el-table>
            </div>
        </el-card>
        <el-card>
            <div slot="header" class="clearfix">
                <span style="float: left;">附件列表</span>
            </div>
            <div>
                <el-table
                        :data="oi.annexs"
                        size="mini"
                        style="width:100%">
                    <el-table-column label="附件名称" prop="title" ></el-table-column>
                    <el-table-column label="格式" prop="suffix" ></el-table-column>
                    <el-table-column label="大小" prop="size" ></el-table-column>
                    <el-table-column label="上传时间" prop="utime" ></el-table-column>

                    <el-table-column
                            label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button type="primary"   @click="downloadAnnex(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">下载</el-button>
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
        <el-card>
            <el-button @click="resetOiDetail" size="mini" type="danger" v-show="isReception">取回</el-button>
            <el-button @click="destroyOi" v-show="canDestroy&&currentOi.status!='DESTROY'"  size="mini" type="danger" >作废</el-button>
            <el-button @click="close" size="mini" type="info">关闭</el-button>
        </el-card>
        <div v-show="false">
            <vue-easy-print table-show ref="easyPrint" style="width: 100%">
                <template slot-scope="func">
                    <opening-inventory-print-formwork :getChineseNumber="func.getChineseNumber" :oi="currentOi"></opening-inventory-print-formwork>
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
        watch:{
            oi:{
                handler(val){
                    this.currentOi = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted() {
          this.loadHistory();
        },
        methods:{
            downloadAnnex(row) {
                window.open(row.url + "?fileName=" + row.fileName);
            },
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
                    this.getRequest('/oi/reset?id=' + this.currentOi.id).then(resp => {
                        if(resp&&resp.data.status=='200'){
                            this.$message.success("操作成功");
                            this.$emit("callback");
                        }else{
                            this.$message.error("操作失败");
                        }

                    });

                })
            },
            //加载审批过程
            loadHistory(){
                this.getRequest('/flow/history/action/getHistory?processInstanceId='+this.currentOi.processInstanceId).then((resp)=>{
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
                    this.postRequest('/oi/destroy?id=' + this.currentOi.id).then(resp=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("作废成功");
                            this.$emit("callback");
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            }
        },
        data() {
            return {
                histories:[],
                currentOi:{
                    warehouse:{
                        name:''
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>