<template>
    <div>
        <el-form size="mini" :rules="rules" ref="logisticsForm" :model="cost" label-width="120px">
            <el-card shadow="hover">
                <el-form-item label="物流:" prop="express.id">
                    <el-select size="mini" value-key="id" style="float: left" v-model="cost.express"  filterable >
                        <el-option v-for="(item,i) in expresses" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运费:" prop="money" >
                    <el-input-number size="mini" :min="0"  style="float: left" v-model="cost.money"></el-input-number>
                </el-form-item>
                <el-form-item label="物流单号:" prop="logisticsNumber" >
                    <el-input size="mini" v-model="cost.logisticsNumber"></el-input>
                </el-form-item>
                <el-form-item label="联系方式:" prop="phone">
                    <el-input size="mini" v-model="cost.phone"></el-input>
                </el-form-item>
                <el-form-item label="起发地址" prop="startAddress">
                    <el-input size="mini" v-model="cost.startAddress"></el-input>
                </el-form-item>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix"><span style="float: left">产品列表</span></div>
                <div>

                    <el-table size="mini" :data="cost.details" :expand-row-keys="expandRowKeys" row-key="id">
                        <el-table-column type="expand" >
                            <template slot-scope="props">
                                <el-table :data="props.row.cdgas">
                                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                                    <el-table-column label="数量" prop="number"></el-table-column>
                                    <el-table-column
                                            label="操作" width="160">
                                        <template slot-scope="scope">

                                            <el-button type="danger"  @click="deleteCdga(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" width="80px"></el-table-column>
                        <el-table-column label="产品名称" prop="productSku.product.name"></el-table-column>
                        <el-table-column label="特殊属性" prop="productSku.ownSpec"></el-table-column>
                        <el-table-column label="通用属性" prop="productSku.product.productDetail.genericSpec"></el-table-column>
                        <el-table-column label="数量" prop="number">
                            <!--<template slot-scope="scope">
                                <el-input-number size="mini" :min="0" v-bind:max="scope.row.notOutNumber" v-model="scope.row.number"></el-input-number>
                            </template>-->
                        </el-table-column>
                        <el-table-column
                                label="操作" width="160">
                            <template slot-scope="scope">
                                <el-button type="primary"  @click="setGoodsAllocation(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">设置出库货位</el-button>
                                <el-button type="danger"  @click="deleteDetail(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <el-card shadow="hover">
                <el-button size="mini" @click="saveLogistics" type="primary">保存</el-button>
                <el-button size="mini" @click="close" type="info">关闭</el-button>
            </el-card>
        </el-form>
        <el-dialog :title="gaDialogTitle" :visible.sync="gaDialogVisible" :close-on-click-modal="false" :append-to-body="true">

            <sell-goods-allocation-set-form :oldCdga="oldCdga" :costDetail="currentCostDetail"  @cancel="closeGoodsAllocationSetDialog" @callback="callback"></sell-goods-allocation-set-form>
        </el-dialog>
    </div>
</template>

<script>
    import SellGoodsAllocationSetForm from "@/views/oa/task/SellGoodsAllocationSetForm";
    export default {
        name: "SellLogisticsForm",
        components: {SellGoodsAllocationSetForm},
        props:{
            sell:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            sell:{
                handler(val){
                    this.currentSell = JSON.parse(JSON.stringify(val));
                    if(this.currentSell.details){
                        this.currentSell.details.forEach((detail)=>{
                            if(detail.notOutNumber>0){
                                let costDetail = {
                                    productSku:detail.productSku,
                                    number:0,
                                    warehouse:detail.warehouse,
                                    detailId:detail.id,
                                    cdgas:[]
                                }
                                this.cost.details.push(costDetail);
                            }

                        })
                    }else{
                        this.cost.details =[];
                    }

                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.loadExpresses();
        },
        methods:{
            deleteCdga(row){
               this.cost.details.forEach((item)=>{
                   if(item.cdgas){
                       item.cdgas.some((item2,i)=>{
                           if(item2==row){
                               item.cdgas.splice(i,1);
                               item.number-=row.number;
                           }
                       })
                   }
               })
            },
            callback(cdga){
                this.expandRowKeys.push(this.currentCostDetail.id);
                this.closeGoodsAllocationSetDialog();
                this.currentCostDetail.number+=cdga.number;
                this.currentCostDetail.cdgas.push(cdga);
            },
            closeGoodsAllocationSetDialog(){
                this.gaDialogVisible = false;
            },
            setGoodsAllocation(row){
                this.oldCdga={
                    goodsAllocation:{},
                    number:0
                },
                this.currentCostDetail = row;
                this.gaDialogVisible = true;
                this.gaDialogTitle="设置出库货位";
            },
            deleteDetail(row){
                this.cost.details.some((item,i)=>{
                    if(item==row){
                        this.cost.details.splice(i,1);
                    }
                })
            },
            saveLogistics(){
                this.$refs['logisticsForm'].validate((valid)=>{
                    if(valid){
                        let length = this.cost.details.length;
                        if(length>0){

                            try {
                                this.cost.details.forEach((item)=>{
                                    if(item.number>0){
                                        //console.log(item.cdgas);
                                    }else {
                                        throw new Error("产品数量不能为0");
                                    }
                                })
                                Object.assign(this.cost,{foreignKey:this.currentSell.id});
                                this.postNoEnCodeRequest('/erp/cost/addCostFromSell',this.cost).then((resp)=>{
                                    if(resp&&resp.data.status=="200"){
                                        this.$message.success("保存成功");
                                        this.$emit("callback");
                                    }else{
                                        this.$message.error(resp.data.msg);
                                    }
                                })
                            }catch (e) {
                                this.$message.error(e.message)
                            }

                        }else{
                            this.$message.error("产品不能为空");
                        }
                    }else{
                        return false;
                    }
                })
            },
            loadExpresses(){
                this.getRequest('/system/express/all').then((resp)=>{
                    this.expresses = resp.data;
                })
            },
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                expresses:[],
                cost:{
                    express:{},
                    details:[]
                },
                currentSell:{

                },
                rules:{
                    'express.id':[{required:true,message:'选择物流',trigger:'blur'}],
                    logisticsNumber:[{required:true,message:'填写单号',trigger:'blur'}]
                },
                gaDialogTitle:'',
                gaDialogVisible:false,
                currentCostDetail:{},
                oldCdga:{},
                expandRowKeys:[]
            }
        }
    }
</script>

<style scoped>

</style>