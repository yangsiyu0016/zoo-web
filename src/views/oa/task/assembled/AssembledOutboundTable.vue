<template>
    <div>
        <el-container>
            <el-header>
                <el-button @click="showAddView" size="mini" type="primary" icon="el-icon-plus">新增</el-button>
            </el-header>
            <el-main>
                <el-table size="mini" :data="details">
                    <el-table-column type="index" width="80"></el-table-column>
                    <el-table-column label="产品名称" prop="product.name"></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="deleteDetail(scope.row)" icon="el-icon-delete" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer style="text-align: center">
                <el-button icon="el-icon-close" type="info" size="mini" @click="close">取消</el-button>
                <el-button icon="el-icon-check" @click="saveOutbound" type="primary" size="mini">保存</el-button>
            </el-footer>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :append-to-body="true" :close-on-click-modal="false" width="40%">
            <assembled-outbound-form :warehouseId="warehouseId" :waitOutProducts="tempWaitOutProducts" :oldData="oldData"  @cancel="cancel" @callback="callback"></assembled-outbound-form>
        </el-dialog>
    </div>
</template>

<script>
    import AssembledOutboundForm from "./AssembledOutboundForm";
    export default {
        name: "AssembledOutboundTable",
        components: {AssembledOutboundForm},
        props:{
            assembledId:{
                type:String,
                default:''
            },
            warehouseId:{
                type:String,
                default:''
            },
            waitOutProducts:{
                type:Array,
                default:()=>[]
            }
        },
        watch: {
            waitOutProducts:{
                handler(val){
                    this.tempWaitOutProducts = JSON.parse(JSON.stringify(val));
                    this.details = [];
                },
                deep:true,
                immediate: true
            }
        },
        data() {
            return {
                tempWaitOutProducts:[],
                details:[],
                dialogVisible: false,
                dialogTitle: '',
                oldData:{

                }
            }
        },
        methods: {
            showAddView() {
                let newWaitOutProducts = JSON.parse(JSON.stringify(this.waitOutProducts));
                let tempWaitOutProducts = [];

                for(let i =0;i<newWaitOutProducts.length;i++){
                    let tempWaitOutProduct = newWaitOutProducts[i];
                    for(let j=0;j<this.details.length;j++){
                        if(tempWaitOutProduct.product.id==this.details[j].product.id){
                            tempWaitOutProduct.notOutNumber-=this.details[j].number;
                        }
                    }
                    if(tempWaitOutProduct.notOutNumber!=0){
                        tempWaitOutProducts.push(tempWaitOutProduct);
                    }

                }
                this.tempWaitOutProducts = tempWaitOutProducts;

                this.dialogVisible = true;
                this.dialogTitle = '货位设置';
                this.oldData= {
                    goodsAllocation: {},
                    number: 0,
                    product: {
                        id: '',
                        name: ''
                    }
                }

            },
            saveOutbound() {
                this.postNoEnCodeRequest('/erp/assembledMaterial/addOutbound', {
                    foreignKey: this.assembledId,
                    details: this.details
                }).then(resp => {
                    if (resp && resp.data.status == "200") {
                        this.$message.success("保存成功");
                        this.details = [];
                        this.$emit('callback');
                    }else {
                        this.$message.error(resp.data.msg);
                    }
                })
            },
            deleteDetail(row) {
                this.details.some((item, i) => {
                    if (item === row) {
                        this.details.splice(i, 1);
                    }
                })
            },
            callback(data){



                this.details.push(data);
               /* this.oldProductAssembled.materials.forEach((item, i) => {
                    if (item.product.id == data.product.id) {
                        if (item.notOutNumber === data.number){
                            this.oldProductAssembled.materials.splice(i, 1);
                        }else {
                            item.notOutNumber -= data.number;
                        }
                    }
                });*/
                this.cancel();
            },
            cancel(){
                this.dialogVisible = false;
            },
            close(){
                this.$emit("close");
                this.details = [];
            },
        }
    }
</script>

<style scoped>

</style>