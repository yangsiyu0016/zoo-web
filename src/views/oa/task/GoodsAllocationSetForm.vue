<template>
    <div>
        <el-form ref="gaForm" :rules="rules" :model="cdga" label-width="120px" size="mini">
            <el-form-item label="货位："  prop="goodsAllocation.id">
                <el-select v-model="cdga.goodsAllocation" value-key="id">
                    <el-option v-for="item in gas" :key="item.id" :value="item" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数量:" prop="number">
                <el-input-number :min="0" :max="max" :precision="4" v-model="cdga.number"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="cancel" type="info">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "GoodsAllocationSetForm",
        props:{
            warehouseId:{
                type:String,
                default:()=>{}
            },
            costDetail:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            costDetail:{
                handler(val){
                    let number = val.number;
                    val.cdgas.forEach((item)=>{
                        number-=item.number;
                    });
                    this.cdga.number = number;
                    this.max = number;
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.loadGas();
        },
        methods:{
            save(){
                this.$refs['gaForm'].validate((valid)=>{
                    if(valid){
                        this.$emit('callback',this.cdga);
                    }else{
                        return false;
                    }
                })
            },
            cancel(){
                this.$emit("cancel");
            },
          loadGas(){
              this.getRequest('/warehouse/ga/getGaByWarehouseId?warehouseId='+this.warehouseId).then((resp)=>{
                  this.gas = resp.data;
              })
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
                gas:[],
                cdga:{
                    goodsAllocation:{},
                    number:0
                },
                max:0,
                rules:{
                    'goodsAllocation.id':[{required:true,message:"选择货位",trigger:'blur'}],
                    number:[{required:true,validator:checkNumber,trigger:'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>