<template>
    <div>
        <el-form ref="detailForm" size="mini" :rules="rules" :model="detail" label-width="120px">
            <el-form-item label="产品:" prop="product.name">
                <el-input size="mini" class="input-with-select" style="width: 50%"  disabled v-model="detail.product.name"  >
                    <el-button size="mini" slot="append" icon="el-icon-search" @click="selectProduct" ></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="货位:" prop="goodsAllocation.id">
                <el-select size="mini" value-key="id" v-model="detail.goodsAllocation">
                    <el-option v-for="(item,i) in goodsAllocations" :key="item.id" :label="item.name" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数量:" prop="number">
                <el-input-number size="mini" :min="0" v-model="detail.number"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveDetail" size="mini" type="primary">保存</el-button>
                <el-button @click="cancel" size="mini" type="info">取消</el-button>
            </el-form-item>
        </el-form>
        <product-dialog @dblclick="dblclick" @closeWin="closeWin" :visible="productDialogVisible"></product-dialog>
    </div>
</template>

<script>
    import ProductDialog from "@/components/dialog/ProductDialog";
    export default {
        name: "OpeningInventoryDetailForm",
        components: {ProductDialog},
        props:{
            warehouseId:{
                type:String,
                default:''
            },
            oldDetail:{
                type:Object,
                default: ()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            warehouseId:{
                handler(val){
                    this.loadGoodsAllocation();
                },
                deep:true,
                immediate:true
            },
            oldDetail:{
                handler(val){
                    this.detail = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            //this.loadGoodsAllocation();
        },
        methods:{
            //填充产品信息
            dblclick(row){
               this.detail.product = row;
               this.productDialogVisible = false;
            },
            //加载货位信息
            loadGoodsAllocation(){
                this.getRequest('/warehouse/ga/getGaByWarehouseId?warehouseId='+this.warehouseId).then((resp)=>{

                    this.goodsAllocations = resp.data;
                })
            },
            //关闭产品选择窗口
            closeWin(){
                this.productDialogVisible = false;
            },
            //保存产品
            saveDetail(){
                this.$refs["detailForm"].validate((valid)=>{//验证表单
                    if(valid){
                        if(this.isEdit){
                            this.$emit("editDetail",this.detail);//调用父组件的editDetail方法
                        }else{
                            this.$emit("addDetail",this.detail);//调用父组件的addDetail方法
                        }

                    }else{
                        return false;
                    }
                })
            },
            cancel(){
                this.$emit("close");
            },
            selectProduct(){
                this.productDialogVisible = true;
            }
        },
        data(){
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
            return{
                productDialogTitle:'选择产品',
                productDialogVisible:false,
                goodsAllocations:[],
                detail:{
                    number:0,
                    goodsAllocation:{},
                    product:{
                    }
                },
                rules:{
                    'product.name':[{required:true,message:"请选择产品",trigger:'blur'}],
                    'goodsAllocation.id':[{required:true,message:"请选择货位",trigger:'blur'}],
                    number:[{required:true,validator:checkNumber,trigger:'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>