<template>
    <div>
        <el-form ref="detailForm" size="mini" :model="detail" :rules="rules" label-width="120px">
            <el-form-item label="产品：" prop="product.name">
                <el-input class="input-with-select" v-model="detail.product.name"  disabled  style="float:left;width:400px">
                    <el-button :disabled="isEdit"  slot="append" icon="el-icon-search" @click="selectProduct"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="数量:" prop="number">
                <el-input-number style="float:left" v-model="detail.number"></el-input-number>
            </el-form-item>
            <el-form-item label="备注:" prop="description">
                <el-input type="textarea" v-model="detail.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="close">取消</el-button>
                <el-button type="primary" @click="save('detailForm')">保存</el-button>
            </el-form-item>
        </el-form>
        <product-dialog @closeWin="closeProductDialog" :visible="productDialogVisible" :title="productDialogTitle" @dblclick="dblclick"></product-dialog>
    </div>
</template>

<script>
    import ProductDialog from "@/components/dialog/ProductDialog";
    export default {
        name: "MaterialStructureDetailForm",
        components: {ProductDialog},
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldDetail:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldDetail: {
                handler(val){
                    this.detail = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            save(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                      this.$emit("callback",this.detail);
                    }else{
                        return false;
                    }
                })
            },
            close(){
                this.$emit("close");
            },
            selectProduct(){
                this.productDialogVisible = true;
                this.productDialogTitle="选择产品";
            },
            dblclick(row) {
                this.detail.product = row;
                this.closeProductDialog();
            },
            closeProductDialog(){
                this.productDialogVisible = false;
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
                    product:{
                        name:''
                    },
                    number:0,
                    description:''
                },
                rules:{
                    'product.name':[{required:true,message:"选择产品",trigger:'blur'}],
                    number:[{required:true,validator:checkNumber,trigger:'blur'}]
                },
                productDialogVisible:false,
                productDialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>