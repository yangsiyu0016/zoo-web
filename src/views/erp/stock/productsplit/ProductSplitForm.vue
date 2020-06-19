<template>
    <div>
        <el-form size="mini"   ref="productForm" label-width="150px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">拆分产品信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item prop="initDate"  label="单据日期:">
                                <el-date-picker
                                        style="float: left; "
                                        align="right"
                                        type="date"
                                        size="mini"
                                        v-model="productSplit.initDate"
                                        placeholder="选择日期"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy 年 MM 月 dd 日"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" >
                            <el-form-item label="单号录入方式:">
                                <el-select size="mini" v-model="productSplit.codeGeneratorType">
                                    <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                    <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-show="productSplit.id||productSplit.codeGeneratorType=='SELF'">
                            <el-form-item label="单号:" prop="code" :required="productSplit.codeGeneratorType=='SELF'">
                                <el-input size="mini" v-model="productSplit.code" :disabled="isEdit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" >
                            <el-form-item label="拆分仓库:">
                                <el-select size="mini" value-key="id" v-model="productSplit.warehouse">
                                    <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="产品编号:">
                                <el-input
                                        style="width: 300px; float: left"
                                        size="mini"
                                        v-model="productSplit.product.code">
                                </el-input>
                                <el-button style="margin-top: 0px;float: left" size="mini" type="success" @click="selectProduct">选择</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产品名称:">
                                <el-input
                                        style="width: 300px; float: left"
                                        size="mini"
                                        v-model="productSplit.product.name">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="备注:" prop="description">
                                <el-input type="textarea" v-model="productSplit.description"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">产品清单</span>
                </div>
                <div>
                    <el-button style="margin-top: 0px;float: left" size="mini" type="success" @click="selectProduct">选择材料</el-button>
                </div>
                <el-table
                        :data="productSplit.product"
                        size="mini"
                        style="width:100%" >
                    <el-table-column
                            type="selection"
                            align="left"
                            width="80">
                    </el-table-column>
                    <el-table-column label="产品编号" prop="code" ></el-table-column>
                    <el-table-column label="产品名称" prop="name" ></el-table-column>
                    <el-table-column prop="typeName" align="left" width="100" label="分类"></el-table-column>
                    <el-table-column prop="productBrand.name" align="left"  label="品牌" ></el-table-column>

                    <el-table-column prop="spec" align="left" label="规格"></el-table-column>
                    <el-table-column prop="unit.name" align="left" label="单位"></el-table-column>
                    <el-table-column prop="weight" align="left" label="重量"></el-table-column>
                    <el-table-column prop="color" align="left" label="颜色"></el-table-column>
                    <el-table-column prop="puse" align="left" label="用途"></el-table-column>
                    <el-table-column prop="description" align="left" label="备注"></el-table-column>

                    <!--<el-table-column label="数量" prop="number"></el-table-column>
                    <el-table-column label="价格" prop="price"></el-table-column>
                    <el-table-column label="总额" prop="totalMoney"></el-table-column>-->
                    <el-table-column
                            label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button  type="primary" @click="showEditProductView(scope.row)"  style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger"  @click="deleteDetail(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
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
        name: "ProductSplitForm",
        components: {ProductDialog},
        mounted() {
            this.loadWarehouse();
        },
        data() {
            return {
                isEdit: false,
                proDialogTitle: '',
                proDialogVisible: false,
                productSplit: {
                    product: {
                        code: ''
                    }
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
            save() {

            },
            cancel() {

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
                this.productSplit.product = row;
                //this.productSplit.product.name = row.name;
                this.closeProductDialog();
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