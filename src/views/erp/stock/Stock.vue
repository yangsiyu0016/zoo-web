<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="display: inline">
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过产品编码、产品名称搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              :disabled="searchViewVisible"
                              @keyup.enter.native="searchStock"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="searchStock" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                               @click="showSearchView">
                        <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                    </el-button>
                </div>
            </el-header>
            <el-main>
                <transition name="slide-fade">
                    <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8">
                                产品编号：<el-input v-model="searchData.productCode" size="mini" style="width: 400px" placeholder="产品编号" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                产品名称：<el-input v-model="searchData.productName" size="mini" style="width: 400px" placeholder="产品名称" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                仓库：
                                <el-select clearable  size="mini" v-model="searchData.warehouseId" style="width: 400px">
                                    <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="searchStock" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                        </el-row>
                    </div>
                </transition>
                <el-table :data="stocks"
                          v-loading="loading"
                          size="mini"
                          style="width:100%">
                    <el-table-column type="index" align="left" width="80">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="warehouse.name" label="仓库" align="left"></el-table-column>
                    <el-table-column prop="product.imageUrl" label="图片">
                        <template slot-scope="scope">
                            <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品编号"  >
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.product.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品名称"  >
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.product.name)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                    <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                    <el-table-column prop="product.spec" align="left" label="规格"></el-table-column>
                    <el-table-column prop="product.unit.name" align="left" label="单位"></el-table-column>
                    <el-table-column prop="product.weight" align="left" label="重量"></el-table-column>
                    <el-table-column prop="product.color" align="left" label="颜色"></el-table-column>
                    <el-table-column prop="product.puse" align="left" label="用途"></el-table-column>
                    <el-table-column prop="product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="usableNumber" label="可用数量" align="left"></el-table-column>
                    <el-table-column prop="lockedNumber" label="锁定数量" align="left"></el-table-column>
                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
                    <el-pagination
                            background
                            :page-sizes="[10,20,50,100,200]"
                            :page-size="pageSize"
                            :current-page="currentPage"
                            @current-change="currentChange"
                            @size-change="sizeChange"
                            layout="total,sizes,prev,pager,next,jumper"
                            :total="totalCount">
                    </el-pagination>

                </div>
            </el-main>
        </el-container>

    </div>
</template>

<script>
    export default {
        name: "Stock",
        mounted(){
            this.loadStocks();
            this.loadWarehouse();
        },
        methods:{
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.loadStocks();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptySearchData();
                    this.loadStocks();
                }
            },
            emptySearchData(){
                this.searchData={
                    productCode:'',
                    productName:'',
                    warehouseId:''
                }
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadStocks();
            },
            currentChange(page){
                this.currentPage = page;
                this.loadStocks();
            },
            keywordsChange(){
                if(val==''){
                    this.loadStocks();
                }
            },
            searchStock(){
                this.loadStocks();
            },
            loadStocks(){
                this.loading = true;
                this.getRequest('/erp/stock/page?page='+this.currentPage+
                    "&size="+this.pageSize+"&keywords="+this.keywords+
                    "&productCode="+this.searchData.productCode+
                    "&productName="+this.searchData.productName+
                    "&warehouseId="+this.searchData.warehouseId).then((resp)=>{
                    this.stocks = resp.data.stocks;
                    this.totalCount = resp.data.count;
                    this.loading = false;
                })
            },
            loadWarehouse() {
                this.getRequest('/erp/warehouse/all').then(resp=> {
                    if (resp &&resp.data) {
                        this.warehouses = resp.data;
                    }
                })
            }
        },
        data(){
            return{
                loading:false,
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                keywords:'',
                searchViewVisible:false,
                stocks:[],
                currentPage:1,
                totalCount:-1,
                pageSize:10,
                searchData:{
                    productCode:'',
                    productName:'',
                    warehouseId:''
                },
                warehouses:[],
            }
        }
    }
</script>

<style scoped>

</style>