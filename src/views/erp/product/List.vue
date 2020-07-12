<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddProductView">
                        新增
                    </el-button>
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过产品编码、产品名称、助记码搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              :disabled="searchViewVisible"
                              @keyup.enter.native="loadProducts"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="loadProducts" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" :disabled="searchViewVisible">搜索</el-button>
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                               @click="showSearchView">
                        <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <transition name="slide-fade">
                    <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8">
                                产品编号：<el-input v-model="searchData.code" size="mini" style="width: 400px" placeholder="产品编号" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                产品名称：<el-input v-model="searchData.name" size="mini" style="width: 400px" placeholder="产品名称" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                助记码：<el-input v-model="searchData.mnemonic" size="mini" style="width: 400px" placeholder="助记码" ></el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20"  style="margin-top: 20px">
                            <el-col :span="8" style="margin-left: -100px">
                                产品分类:
                                <el-cascader ref="typeCascader"

                                             size="mini"
                                             v-model="searchData.typeId"
                                             :options="types"
                                             :props="props">

                                </el-cascader>
                            </el-col>
                            <el-col :span="8">
                                品牌:
                                <el-select :clearable="true"  value-key="id" v-model="searchData.brandId" size="mini" ref="brandSelect" >
                                    <el-option v-for="item in brands" :key="item.id" :label="item.name"  :value="item.id"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="loadProducts" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                        </el-row>
                    </div>
                </transition>
                <el-table @sort-change="sortChange" :data="products" size="mini" v-loading="loading">
                    <el-table-column type="index" align="left" width="80">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showUpdateProductView(scope.row)"  type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" size="mini" @click="deleteProduct(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="imageUrl" label="图片">
                        <template slot-scope="scope">
                            <el-image v-show="scope.row.imageUrl" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" align="left"  label="编号">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" align="left"  label="名称">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.name)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mnemonic" align="left"  label="助记码">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.mnemonic)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="typeName" align="left"  label="产品分类"></el-table-column>
                    <el-table-column prop="productBrand.name" align="left"  label="品牌"></el-table-column>
                    <el-table-column prop="spec" align="left"  label="规格"></el-table-column>
                    <el-table-column prop="unit.name" align="left"  label="计量单位"></el-table-column>
                    <el-table-column prop="weight" align="left"  label="重量"></el-table-column>
                    <el-table-column prop="color" align="left"  label="颜色"></el-table-column>
                    <el-table-column prop="puse" align="left"  label="用途"></el-table-column>

                    <el-table-column prop="description" align="left" label="备注"  :show-overflow-tooltip='true' ></el-table-column>
                    <el-table-column prop="ctime" label="创建时间" sortable></el-table-column>
                    <el-table-column prop="hasBom" label="BOM">
                        <template slot-scope="scope">
                            <el-tag v-if="!scope.row.hasBom" type="info">未做BOM</el-tag>
                            <el-tag v-if="scope.row.hasBom" type="danger">已 做BOM</el-tag>
                        </template>
                    </el-table-column>

                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
                    <el-pagination
                            background
                            :page-sizes="[10,20,50,100,200]"
                            :page-size="pageSize"
                            :current-page="currentPage"
                            layout="total,sizes,prev,pager,next,jumper"
                            @current-change="currentChange"
                            @size-change="sizeChange"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <product-form :isEdit="isEdit" :oldProduct="oldProduct" @close="closeProductDialog" @callback="callback"></product-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductForm from "@/views/erp/product/ProductForm";
    export default {
        name: "List",
        components: {ProductForm},
        mounted(){
            this.loadProducts();
            this.loadTypes();
            this.loadBrands();
        },
        methods:{
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.loadProducts();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptySearchData();
                    this.loadProducts();
                }
            },
            emptySearchData(){
                this.searchData={
                    typeId:[],
                    brandId:'',
                    name:'',
                    code:'',
                    mnemonic:''
                }
            },
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val==="undefined"?'':val;
                }
            },
            keywordsChange(val){
                if(val==''){
                    this.loadProducts();
                }
            },
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.loadProducts();
            },
            deleteProduct(row) {
                this.$confirm('确定要删除该条数据嘛？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(()=> {
                    this.deleteRequest('/product/' + row.id).then(resp => {
                        if (resp.data.status == '200') {
                            this.$message.success('删除成功');
                            this.products.some((item, i) => {
                                if (item == row) {
                                    this.products.splice(i, 1);
                                    return true;
                                }
                            })
                        }else {
                            this.$message.error("删除失败");
                        }
                    })
                })
            },
            callback(){
                this.closeProductDialog();
                this.loadProducts();
            },
            closeProductDialog() {
              this.dialogVisible = false;
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadProducts();
            },
            currentChange(page){
                this.currentPage = page;
                this.loadProducts();
            },
            showUpdateProductView(row){
                this.getRequest('/product/getProductById?id='+row.id).then(resp=>{
                    if(resp&&resp.data){
                        this.isEdit=true;
                        this.oldProduct = resp.data;
                        this.dialogVisible = true;
                        this.dialogTitle = "编辑产品";
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })

            },
            showAddProductView(){
                this.isEdit = false;
                this.oldProduct = {
                    typeId:'',
                    productBrand:{},
                    unit:{},
                    name:'',
                    spec:'',
                    weight:'',
                    color:'',
                    puse:'',
                    description:'',
                    imageUrl:'',
                    mnemonic:''
                },
                this.dialogVisible = true;
                this.dialogTitle = "新增产品";
            },
            loadProducts(){
                this.loading = true;
                let  typeId='';
                if(this.searchData.typeId.length>0){
                    typeId=this.searchData.typeId[this.searchData.typeId.length-1];
                }
                this.getRequest('/product/page?page='+this.currentPage+"&size="+this.pageSize+"&sort="+this.sort+"&order="+this.order+
                    "&keywords="+this.keywords+"&typeId="+typeId+"&brandId="+this.searchData.brandId+"&name="+this.searchData.name+"&code="+this.searchData.code+"&mnemonic="+this.searchData.mnemonic).then((resp)=> {
                    this.products = resp.data.products;
                    this.totalCount = resp.data.count;
                    this.loading = false;
                });
            },
            loadBrands() {
                this.getRequest('/product/brand/list').then((resp)=>{
                    this.brands=resp.data;
                });
            },
            loadTypes(){
                this.getRequest('/product/type/tree').then((result)=>{
                    this.types = result.data;
                })
            },
        },
        data(){
            return{
                props:{
                    label:'name',
                    value:'id'
                },
                types:[],
                brands:[],
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                searchViewVisible:false,
                loading:false,
                products:[],
                totalCount:-1,
                currentPage:1,
                pageSize:10,
                sort:'ctime',
                order:'desc',
                dialogVisible:false,
                dialogTitle:'',
                isEdit:false,
                oldProduct:{},
                keywords:'',
                searchData:{
                    typeId:[],
                    brandId:'',
                    name:'',
                    code:'',
                    mnemonic:''
                }
            }
        }
    }
</script>

<style lang="css">
    .el-tooltip__popper{font-size: 15px; max-width:40%} /*设置显示隐藏部分内容，按40%显示*/
</style>