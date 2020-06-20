<template>
    <div>
        <el-form size="mini" :rules="rules" :model="productAssembled"  ref="productAssembledForm" label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">组装产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item prop="assembledTime"  label="组装日期:">
                                <el-date-picker
                                        style="float: left; "
                                        align="right"
                                        type="date"
                                        size="mini"
                                        v-model="productAssembled.assembledTime"
                                        placeholder="组装日期"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy 年 MM 月 dd 日"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" >
                            <el-form-item label="单号录入方式:">
                                <el-select style="float: left" size="mini" v-model="productAssembled.codeGeneratorType">
                                    <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                    <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="productAssembled.id||productAssembled.codeGeneratorType=='SELF'">
                            <el-form-item label="单号:" prop="code" :required="productAssembled.codeGeneratorType=='SELF'">
                                <el-input size="mini" v-model="productAssembled.code" :disabled="isEdit"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" >
                            <el-form-item label="组装仓库:" prop="warehouse.name">
                                <el-select style="float: left" size="mini" value-key="id" v-model="productAssembled.warehouse">
                                    <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="产品编号:" prop="product.id">
                                <el-input class="input-with-select" v-model="productAssembled.product.code"  disabled  style="float:left">
                                    <el-button slot="append" icon="el-icon-search" @click="selectProduct"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:">
                                <span style="float: left">{{productAssembled.product.name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="组装数量：" prop="number">
                                <el-input-number style="float: left" :min="0" v-model="productAssembled.number"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col >
                            <el-form-item label="备注:" prop="description">
                                <el-input type="textarea" v-model="productAssembled.description"></el-input>
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
                        :data="productAssembled.assembledMaterials"
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
                    <el-table-column label="需求总数" prop="needNumber" :formatter="needNumberFormatter"></el-table-column>
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
                <div style="text-align: center">
                    <el-button @click="save" type="primary" size="mini">保存</el-button>
                    <el-button @click="cancel" type="info" size="mini">取消</el-button>
                </div>
            </el-card>
        </el-form>
        <product-dialog @closeWin="closeProductDialog" :visible="proDialogVisible" :title="proDialogTitle" @dblclick="proDblclick"></product-dialog>
    </div>
</template>

<script>

    import ProductDialog from "@/components/dialog/ProductDialog";

    export default {
        name: "ProductAssembledForm",
        components: {ProductDialog},
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldProductAssembled:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            oldProductAssembled: {
                handler(val){
                    this.productAssembled=JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted() {
            this.loadWarehouse();
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
                proDialogTitle: '',
                proDialogVisible: false,
                productAssembled: {
                    assembledTime:'',
                    product: {
                        code: ''
                    },
                    warehouse:{
                        name:''
                    },
                    assembledMaterials:[],
                    codeGeneratorType:"AUTO",
                    number:1
                },
                rules:{
                    assembledTime:[{required:true,message:"选择组装日期",trigger:'blue'}],
                    'warehouse.name':[{required:true,message:"选择仓库",trigger:'blue'}],
                    'product.id':[{required:true,message:"选择产品",trigger:'blue'}],
                    number:[{required:true,validator:checkNumber,trigger:'blur'}]
                },
                warehouses:[],
                //日期选择器
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }
            }
        },
        methods: {
            needNumberFormatter(row,column,cellValue,index){
                return row.number*this.productAssembled.number;
            },
            save() {

            },
            cancel() {
                this.$emit("close");
            },
            showEditProductView() {

            },
            deleteDetail() {

            },
            loadWarehouse() {
                this.getRequest('/erp/warehouse/all').then(resp=> {
                    if (resp &&resp.data) {
                        this.warehouses = resp.data;
                    }
                })
            },
            closeProductDialog() {
                this.proDialogVisible= false;
            },
            proDblclick(row) {

                this.getRequest('/product/ms/getMS?productId='+row.id).then(resp=>{
                   if(resp&&resp.data){
                       this.productAssembled.assembledMaterials = resp.data.details;
                       this.productAssembled.product = row;
                       this.closeProductDialog();
                   } else{
                       this.$message.error(row.name+"没有创建bom");
                   }
                });

            },
            selectProduct() {
                this.proDialogVisible = true;
                this.proDialogTitle = '选择产品';
            }
        }
    }
</script>

<style scoped>

</style>