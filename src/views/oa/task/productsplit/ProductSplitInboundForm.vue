<template>
    <div>
        <el-form ref="detailForm" :rules="rules" :model="inboundDetail" label-width="120px" size="mini">
            <el-form-item label="产品：" prop="product.id">
                <el-select v-model="inboundDetail.product"  value-key="id" @change="productChange">
                    <el-option v-for="(item,i) in products" :label="item.name" :value="item">

                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="货位："  prop="goodsAllocation.id">
                <el-select v-model="inboundDetail.goodsAllocation" value-key="id">
                    <el-option v-for="item in gas" :key="item.id" :value="item" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数量：" prop="number">
                <el-input-number :min="0" :max="max" :precision="4" v-model="inboundDetail.number"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveDetail" type="primary" icon="el-icon-check">保存</el-button>
                <el-button @click="cancel" type="info" icon="el-icon-close">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "ProductSplitInboundForm",
        props: {
            warehouseId:{
                type:String,
                default:()=>{}
            },
            waitInProducts:{
                type:Array,
                default:()=>[]
            },
            oldDetail:{
                type:Object,
                default:()=>{}
            }
        },
        watch: {
            waitInProducts: {
                handler(val){
                    let products =[]
                    val.forEach(item=>{
                        products.push(item.product);
                    })
                    this.products = products;
                },
                deep:true,
                immediate:true
            },
            oldDetail:{
                handler(val){
                    this.inboundDetail = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate: true
            },
        },
        data() {
            let checkNumber = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('必填：数量'))
                }
                if(!Number.isInteger(value)){
                    callback(new Error('提示:必须为数字'));
                }else{
                    if(value<=0){
                        callback(new Error('提示:必须大于0'));
                    }else{
                        callback();
                    }
                }
            };
            return {
                products:[],
                gas:[],
                inboundDetail:{
                    product:{},
                    goodsAllocation:{},
                    number:0
                },
                max:0,
                rules:{
                    'product.id':[{required:true,message:"选择产品",trigger:'blur'}],
                    'goodsAllocation.id':[{required:true,message:"选择货位",trigger:'blur'}],
                    number:[{required:true,validator:checkNumber,trigger:'blur'}]
                }
            }
        },
        mounted() {
            this.loadGas();
        },
        methods: {
            productChange(product){
                if (product){
                    this.waitInProducts.forEach(item=>{
                        if(item.product.id==product.id){
                            this.inboundDetail.number = item.notInNumber;
                            this.max = item.notInNumber;
                        }
                    })
                }
            },
            saveDetail() {
                this.$refs['detailForm'].validate((valid)=>{
                    if(valid){

                        this.$emit('callback',this.inboundDetail);
                    }else{
                        return false;
                    }
                })
            },
            cancel() {
                this.$emit('cancel');
            },
            loadGas(){
                this.getRequest('/warehouse/ga/getGaByWarehouseId?warehouseId='+this.warehouseId).then((resp)=>{
                    this.gas = resp.data;
                })
            },
        }
    }
</script>

<style scoped>

</style>