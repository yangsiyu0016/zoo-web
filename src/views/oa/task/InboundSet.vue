<template>
    <div>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span>物流信息</span>
            </div>
            <div>
                <el-form label-width="120px">
                    <el-form-item label="物流名称:">
                        <span>{{cost.express.name}}</span>
                    </el-form-item>
                    <el-form-item label="单号:">
                        <span>{{cost.logisticsNumber}}</span>
                    </el-form-item>
                    <el-form-item label="运费:">
                        <span>{{cost.money}}</span>
                    </el-form-item>
                    <el-form-item label="联系方式:">
                        <span>{{cost.phone}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header" class="clearfix"><span style="float: left">产品列表</span></div>
            <div>

                <el-table size="mini" :data="cost.details" :expand-row-keys="expandRowKeys" row-key="id" >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.cdgas">
                                <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                                <el-table-column label="数量" prop="number"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteCostDetailGoodsAllocation(scope)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" width="80px"></el-table-column>
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
                    <el-table-column label="数量" prop="number"> </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="setGoodsAllocation(scope)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">货位设置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card shadow="hover">
            <el-button @click="inbound" size="mini" type="primary">确定收货</el-button>
            <el-button @click="cancel" size="mini" type="info">取消</el-button>
        </el-card>
        <el-dialog :title="gaDialogTitle" :visible.sync="gaDialogVisible" :close-on-click-modal="false" :append-to-body="true">
            <goods-allocation-set-form :costDetail="currentCostDetail" :warehouseId="cost.warehouse.id" @cancel="closeGoodsAllocationSetDialog" @callback="callback"></goods-allocation-set-form>
        </el-dialog>
    </div>
</template>

<script>
    import GoodsAllocationSetForm from "@/views/oa/task/GoodsAllocationSetForm";
    export default {
        name: "InboundSet",
        components: {GoodsAllocationSetForm},
        props:{
            oldCost:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldCost:{
                handler(val){
                    this.cost = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            inbound(){
                this.$confirm("确定要入库吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"danger",
                    center:true
                }).then(()=>{
                    let can = true;
                    this.cost.details.forEach((item)=>{
                        let number = item.number;
                        item.cdgas.forEach((item2)=>{
                            number-=item2.number;
                        })
                        if(number>0){
                            can = false;
                        }
                    });
                    if(can){
                        this.postNoEnCodeRequest('/erp/cost/inboundFromPurchase?costId='+this.cost.id).then((resp)=>{
                            if(resp&&resp.data.status=="200"){
                                this.$message.success("收货完成");
                                this.$emit("inboundCallback");
                            }else{
                                this.$message.error(resp.data.msg);
                            }
                        })
                    }else{
                      this.$message.error("有产品未设置货位");
                    }
                })
            },
            deleteCostDetailGoodsAllocation(scope){
                if(this.currentCostDetail.cdgas.length<1){
                    this.cost.details.forEach((item)=>{
                        item.cdgas.some((item2)=>{

                            if(item2==scope.row){
                                this.currentCostDetail = item;
                            }
                        })
                    })
                }

                this.$confirm("确定要删除吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning',
                    center:true
                }).then(()=>{
                    this.deleteRequest('/erp/cost/goodsAllocation/'+scope.row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.currentCostDetail.cdgas.some((item,i)=>{
                                if(item==scope.row){
                                    this.currentCostDetail.cdgas.splice(i,1);
                                }
                            })
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                }).catch(()=>{

                })
            },
            callback(cdga){
                Object.assign(cdga,{costDetailId:this.currentCostDetail.id});
                this.postNoEnCodeRequest('/erp/cost/goodsAllocation/addCostDetailGoodsAllocation',cdga).then((resp)=>{
                    if(resp&&resp.data.status==200){
                        this.closeGoodsAllocationSetDialog();
                        this.$message.success("添加成功");
                        this.expandRowKeys.push(this.currentCostDetail.id);
                        this.currentCostDetail.cdgas.push(resp.data.costDetailGoodsAllocation);
                    }else{
                        this.$message.error("添加失败");
                    }
                })

            },
            closeGoodsAllocationSetDialog(){
                this.gaDialogVisible = false;
            },
            //货位设置
            setGoodsAllocation(scope){

                this.currentScope = scope;
                this.currentCostDetail = scope.row;
                let number = this.currentCostDetail.number;
                this.currentCostDetail.cdgas.forEach((item)=>{
                    number-=item.number;
                })
                if(number>0){
                    this.gaDialogTitle="货位设置";
                    this.gaDialogVisible = true;
                }else{
                    this.$message.error("所有产品已设置完货位");
                }

            },
            cancel(){
                this.$emit("closeInbound");
            }
        },
        data(){
            return{
                cost:{
                    express:{}
                },
                gaDialogTitle:'',
                gaDialogVisible:false,
                currentCostDetail:{
                    cdgas:[]
                },
                currentScope:{},
                expandRowKeys:[]
            }

        }
    }
</script>

<style>
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>