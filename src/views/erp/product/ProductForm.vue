<template>
    <div>
        <el-form size="mini" :rules="rules" :model="product" ref="productForm" label-width="120px">
            <el-row>
                <el-col :span="5">
                    <el-upload class="avatar-uploader" :before-upload="beforeUpload" action="">
                        <img v-if="product.imageUrl" :src="product.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-col>
                <el-col :span="19">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="商品分类:" prop="typeId">
                                <el-cascader ref="typeCascader"
                                             style="float: left"
                                             size="mini"
                                             v-model="product.typeId"
                                             :options="types"
                                             :props="props">

                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="品牌:" prop="productBrand">
                                <el-select :clearable="true" style="float: left" value-key="id" v-model="product.productBrand" size="mini" ref="brandSelect" @visible-change="v=>brandVisibleChange(v,'brandSelect')">
                                    <el-option v-for="item in brands" :key="item.id" :label="item.name"  :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="商品名称:" prop="name">
                            <el-input v-model="product.name"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="规格:" prop="spec">
                                <el-input v-model="product.spec"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="计量单位:" prop="unit.id">
                                <el-select :clearable="true" value-key="id" v-model="product.unit"  style="float: left" ref="unitSelect" @visible-change="v=>unitVisibleChange(v,'unitSelect')">
                                    <el-option v-for="item in units" :key="item.id" :label="item.name" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="重量:" prop="weight">
                                <el-input v-model="product.weight"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="颜色:" prop="color">
                                <el-input v-model="product.color"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                            <el-form-item label="用途:" prop="puse">
                                <el-input v-model="product.puse"></el-input>
                            </el-form-item>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="备注:" label-width="80px" prop="description">
                    <el-input type="textarea" v-model="product.description"></el-input>
                </el-form-item>
            </el-row>

            <el-form-item>
                <el-button type="info" @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveProduct('productForm')">保存</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="brandEditDialogVisible" :title="brandEditDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <brand-from :isEdit="brandEdit" :oldBrand="oldBrand" @close="closeBrandEditDialog" @callback="brandEditDialogCallback"></brand-from>
        </el-dialog>
        <el-dialog :visible.sync="unitEditDialogVisible" :title="unitEditDialogTitle" :close-on-click-modal="false" :append-to-body="true">
            <unit-from  :isEdit="unitEdit" :oldUnit="oldUnit" @close="closeUnitEditDialog" @callback="unitEditDialogCallback"></unit-from>
        </el-dialog>
    </div>
</template>

<script>
    import {selectBottomAction} from '@/components/select/SelectBottomAction.js';
    import BrandFrom from "@/views/erp/product/brand/BrandFrom";
    import UnitFrom from "@/views/erp/product/unit/UnitFrom";
    export default {
        name: "ProductForm",
        components: {UnitFrom, BrandFrom},
        mixins:[selectBottomAction],
        props:{
            oldProduct:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                defalut:false
            }
        },
        watch:{
            oldProduct:{
                handler(val){
                    this.product = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.loadTypes();
            this.loadBrands();
            this.loadUnits();
        },

        methods:{
            saveProduct(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        //处理typeId
                        let nodes = this.$refs['typeCascader'].getCheckedNodes(true);
                        if(nodes.length>0) this.product.typeId=nodes[0].data.id;
                        this.params.append('product',JSON.stringify(this.product));
                        if(this.isEdit){//更新

                        }else{//添加
                            this.uploadFileRequest('/product/add',this.params).then(resp=>{
                                if(resp&&resp.data.status=='200'){
                                    this.$message.success("添加成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }

                        /*if(this.isEdit){
                            this.postNoEnCodeRequest('/product/update',this.product).then(resp=>{
                                if(resp&&resp.data.status=='200'){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }else{
                            this.postNoEnCodeRequest('/product/add',this.product).then((resp)=>{
                                if(resp&&resp.data.status=='200'){
                                    this.$message.success("添加成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error(resp.data.msg);
                                }
                            })
                        }*/

                    }else{
                        return false;
                    }
                })
            },
            cancel(){
                this.$emit("close");
            },
            unitEditDialogCallback(){
                this.closeUnitEditDialog();
                this.loadUnits();
            },
            closeUnitEditDialog(){
                this.unitEditDialogVisible = false;
            },
            unitVisibleChange(visible,ref){
                let _this = this;
                let clickHandler =()=>{
                    this.unitEdit = false;
                    _this.oldUnit={
                        name:''
                    };
                    _this.unitEditDialogTitle="新增单位";
                    _this.unitEditDialogVisible = true;
                }
                _this.selectBottomAction(visible,{ref,click:clickHandler,label:'添加单位',icon:'el-icon-plus',arrow:false});
            },
            brandEditDialogCallback(){
                this.closeBrandEditDialog();
                this.loadBrands();
            },
            closeBrandEditDialog(){
                this.brandEditDialogVisible = false;
            },
            brandVisibleChange(visible,ref){
                let _this = this;
                let clickHandler =()=>{
                    this.brandEdit = false;
                    _this.oldBrand={
                        name:''
                    };
                    _this.brandEditDialogTitle="新增品牌";
                    _this.brandEditDialogVisible = true;
                }
                _this.selectBottomAction(visible,{ref,click:clickHandler,label:'添加品牌',icon:'el-icon-plus',arrow:false});
            },

            beforeUpload(file){
                let windowURL = window.URL||window.webkitURL;
                this.product.imageUrl = windowURL.createObjectURL(file);

                //this.params = new FormData();
                this.params.append('file',file,file.name);
                return false;
            },
            loadTypes(){
                this.getRequest('/product/type/tree').then((result)=>{
                    this.types = result.data;
                })
            },
            loadBrands() {
                this.getRequest('/product/brand/list').then((resp)=>{
                    this.brands=resp.data;
                });
            },
            loadUnits(){
                this.getRequest('/product/unit/list').then(resp=>{
                    this.units = resp.data;
                })
            }
        },
        data(){
            return{
                props:{
                    label:'name',
                    value:'id'
                },
                types:[],
                brands:[],
                units:[],

                product:{
                    typeId:'',
                    productBrand:{},
                    unit:{},
                    name:'',
                    spec:'',
                    weight:'',
                    color:'',
                    puse:'',
                    imageUrl:'',
                    description:''
                },
                params:new FormData(),//表单要提交的参数
                rules:{
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}],
                    'unit.id':[{required:true,message:"计量单位不能为空",trigger:'blur'}]
                },
                brandEditDialogVisible:false,
                brandEditDialogTitle:'',
                oldBrand:{},
                brandEdit:false,
                unitEditDialogTitle:'',
                unitEditDialogVisible:false,
                oldUnit:{},
                unitEdit:false
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader  {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader :hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>