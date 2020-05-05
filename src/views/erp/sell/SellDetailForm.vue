<template>
    <div>
        <el-form ref="detailForm" size="mini" :model="detail" label-width="120px" :rules="rules">
            <el-form-item label="产品:" prop="productSku.product.name">
                <el-input class="input-with-select" v-model="detail.productSku.product.name"  disabled  style="float:left;width:400px">
                    <el-button slot="append" icon="el-icon-search" @click="selectProduct"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="出库仓库:" prop="warehouse.name">
                <el-select style="float: left" v-model="detail.warehouse" value-key="id" placeholder="选择仓库">
                    <el-option
                            v-for="(item,i) in warehouses"
                            :key="item.id"
                            :label="item.name"
                            :value="item">

                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数量:" prop="number">
                <el-input-number @change="numberChange" size="mini" :precision="4" v-model="detail.number"  :min="0" style="float: left"></el-input-number>
            </el-form-item>
            <el-form-item label="价格:" prop="price">
                <el-input-number v-model="detail.price" @change="priceChange"  :min="0" :precision="4" style="float: left"></el-input-number>
            </el-form-item>
            <el-form-item label="总额:" prop="totalMoney">
                <el-input-number @change="totalMoneyChange" v-model="detail.totalMoney"  :min="0" :precision="4" style="float: left"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveDetail">保存</el-button>
                <el-button  type="info" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
        <product-dialog :visible="dialogVisible" :title="dialogTitle" @dblclick="dblclick"></product-dialog>
    </div>
</template>

<script>
    import ProductDialog from "@/components/dialog/ProductDialog";
    export default {
        name: "SellDetailForm",
        components: {ProductDialog},
        props:{
            oldDetail:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldDetail:{
                handler(val){
                    this.detail = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.loadWarehouses();
        },
        methods:{
            //保存产品信息
            saveDetail(){
                this.$refs['detailForm'].validate((valid)=>{
                    if(valid){
                        this.$emit('callback',this.detail);
                    }else{
                        return false;
                    }
                })
            },
            //两个数字相除
            accDiv(arg1,arg2){
                let t1=0,t2=0,r1,r2;
                try{t1=arg1.toString().split(".")[1].length}catch(e){}
                try{t2=arg2.toString().split(".")[1].length}catch(e){}
                //with(Math){
                    r1=Number(arg1.toString().replace(".",""))
                    r2=Number(arg2.toString().replace(".",""))
                    return (r1/r2)*Math.pow(10,t2-t1);
                //}
            },
            //两个数字相乘
            accMul(arg1,arg2){
                let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try { m += s1.split(".")[1].length } catch (e) { }
                try { m += s2.split(".")[1].length } catch (e) { }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
            },
            //数量变化
            numberChange(currentValue,oldValue){
                this.detail.totalMoney = this.accMul(currentValue,this.detail.price);
            },
            //价格变化
            priceChange(currentValue,oldValue){
                this.detail.totalMoney = this.accMul(currentValue,this.detail.number);

            },
            //总额变化
            totalMoneyChange(currentValue,oldValue){
                if(this.detail.number==0){
                    return 0;
                }else{
                    this.detail.price = this.accDiv(currentValue,this.detail.number);
                }
            },
            //加载仓库信息
            loadWarehouses(){
                this.getRequest('/erp/warehouse/all').then((resp)=>{
                    this.warehouses = resp.data;
                })
            },
            //产品填充
            dblclick(row){
                this.detail.productSku = row;
                this.dialogVisible = false;
            },
            //选择产品
            selectProduct(){
                this.dialogVisible = true;
                this.dialogTitle="选择产品";
            },
            //取消
            cancel(){
                this.$emit("close");
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
                detail:{
                    productSku:{
                        product:{
                            name:''
                        }
                    },
                    warehouse:{

                    },
                    number:0,
                    price:0,
                    totalMoney:0
                },
                rules:{
                    'productSku.product.name':[{required:true,message:'请选择产品',trigger:'blur'}],
                    'warehouse.name':[{required:true,message:'请选择出库仓库',trigger:'blur'}],
                    number:[{required:true,validator:checkNumber,trigger:'blur'}]
                },
                dialogVisible:false,
                dialogTitle:'',
                warehouses:[]
            }
        }
    }
</script>

<style scoped>

</style>