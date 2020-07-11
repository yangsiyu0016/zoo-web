<template>
    <div>
        <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
            <div style="display: inline">
            </div>
            <div style="margin-left: 5px;margin-right: 20px;display: inline">
                <el-input size="mini" placeholder="通过产品编码、产品名称搜索，记得回车呦..."
                          clearable
                          style="width: 350px;margin: 0px;padding: 0px;"
                          prefix-icon="el-icon-search"
                          :disabled="searchViewVisible"
                          @keyup.enter.native="searchJa"
                          v-model="keywords"
                          @change="keywordsChange"
                ></el-input>
                <el-button @click="searchJa" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                           @click="showSearchView">
                    <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                </el-button>
            </div>
        </el-header>
        <el-container>
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
                            <el-col :span="8">
                                单号：<el-input v-model="searchData.code" size="mini" style="width: 400px" placeholder="单号" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                创建日期：
                                <el-date-picker
                                        v-model="searchData.ctime"
                                        size="mini"
                                        type="datetimerange"
                                        align="right"
                                        unlink-panels
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="searchJa" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                        </el-row>
                    </div>
                </transition>
                <el-table @sort-change="sortChange" :data="journalAccounts" v-loading="tableLoading" size="mini" style="width:100%">
                    <el-table-column type="index" width="80">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" align="left"  label="类型" width="120px">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.type=='QC'" type="info" size="mini" effect="dark">期初</el-tag>
                            <el-tag v-if="scope.row.type=='PURCHASE'"  color="#7b1fa2" size="mini" effect="dark">采购</el-tag>
                            <el-tag v-if="scope.row.type=='SELL'" type="warning" size="mini" effect="dark">销售</el-tag>
                            <el-tag v-if="scope.row.type=='LOSSES'" type="success" size="mini" effect="dark">盘亏</el-tag>
                            <el-tag v-if="scope.row.type=='QCDESTROY'" type="info" size="mini" effect="dark">期初作废</el-tag>
                            <el-tag v-if="scope.row.type=='PURCHASEDESTROY'" type="info" size="mini" effect="dark">采购作废</el-tag>
                            <el-tag v-if="scope.row.type=='SPLITCK'" type="warning" size="mini" effect="dark">拆分出库</el-tag>
                            <el-tag v-if="scope.row.type=='SPLITRK'" type="warning" size="mini" effect="dark">拆分入库</el-tag>
                            <el-tag v-if="scope.row.type=='CFCANCELRK'" type="warning" size="mini" effect="dark">拆分取消入库</el-tag>
                            <el-tag v-if="scope.row.type=='SPLITCKDELETE'" type="warning" size="mini" effect="dark">拆分出库删除</el-tag>
                            <el-tag v-if="scope.row.type=='SPLITRKDELETE'" type="warning" size="mini" effect="dark">拆分入库删除</el-tag>
                            <el-tag v-if="scope.row.type=='CFDESTROY'" type="danger" size="mini" effect="dark">拆分单作废</el-tag>
                            <el-tag v-if="scope.row.type=='ASSEMBLEDCK'" type="success" size="mini" effect="dark">组装出库</el-tag>
                            <el-tag v-if="scope.row.type=='ASSEMBLEDCKDELETE'" type="success" size="mini" effect="dark">组装出库删除</el-tag>
                            <el-tag v-if="scope.row.type=='ZZCANCELRK'" type="success" size="mini" effect="dark">组装取消入库</el-tag>
                            <el-tag v-if="scope.row.type=='ASSEMBLEDDESTROY'" type="success" size="mini" effect="dark">组装单作废</el-tag>
                            <el-tag v-if="scope.row.type=='ASSEMBLEDRK'" type="success" size="mini" effect="dark">组装单入库</el-tag>
                            <el-tag v-if="scope.row.type=='ASSEMBLEDRKDELETE'" type="success" size="mini" effect="dark">组装入库删除</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderCode" align="left"  label="单号" width="180" ></el-table-column>
                    <el-table-column prop="stock.warehouse.name" align="left" label="仓库"></el-table-column>
                    <el-table-column prop="stock.product.imageUrl" label="图片">
                        <template slot-scope="scope">
                            <el-image v-if="scope.row.stock.product.imageUrl" :src="scope.row.stock.product.imageUrl" :preview-src-list="[scope.row.stock.product.imageUrl]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品编号" prop="stock.product.code" width="180"></el-table-column>
                    <el-table-column label="产品名称" prop="stock.product.name" ></el-table-column>
                    <el-table-column prop="stock.product.typeName" align="left" width="100" label="分类"></el-table-column>
                    <el-table-column prop="stock.product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                    <el-table-column prop="stock.product.spec" align="left" label="规格"></el-table-column>
                    <el-table-column prop="stock.product.unit.name" align="left" label="单位"></el-table-column>
                    <el-table-column prop="stock.product.weight" align="left" label="重量"></el-table-column>
                    <el-table-column prop="stock.product.color" align="left" label="颜色"></el-table-column>
                    <el-table-column prop="stock.product.puse" align="left" label="用途"></el-table-column>
                    <el-table-column prop="stock.product.description" align="left" label="备注" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="rkNumber" align="left" label="入库数量"></el-table-column>
                    <el-table-column prop="rkPrice" align="left" label="入库单价"></el-table-column>
                    <el-table-column prop="rkTotalMoney" align="left" label="入库总额"></el-table-column>
                    <el-table-column prop="ckNumber" align="left" label="出库数量"></el-table-column>
                    <el-table-column prop="ckPrice" align="left" label="出库单价"></el-table-column>
                    <el-table-column prop="ckTotalMoney" align="left" label="出库总额"></el-table-column>
                    <el-table-column prop="totalNumber" align="left" label="结存数量"></el-table-column>
                    <el-table-column prop="costPrice" align="left" label="结存单价"></el-table-column>
                    <el-table-column prop="totalMoney" align="left" label="结存总额"></el-table-column>
                    <el-table-column prop="ctime" align="left" label="创建时间" width="300" sortable></el-table-column>
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
        name: "List",
        data(){
            return{
                warehouses:[],
                keywords:'',
                searchViewVisible:false,
                searchData:{
                    code:'',
                    productCode:'',
                    productName:'',
                    warehouseId:'',
                    ctime:''
                },
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                journalAccounts:[],
                tableLoading:false,
                totalCount:-1,
                currentPage:1,
                pageSize:10,
                sort:'ctime',
                order:'desc',
                //时间选择器
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        mounted() {
            this.loadData();
            this.loadWarehouse();
        },
        methods:{
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.loadData();
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.loadData()
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptySearchData();
                    this.loadData();
                }
            },
            emptySearchData() {
                this.searchData={
                    code:'',
                    productCode:'',
                    productName:'',
                    warehouseId:''
                }
            },
            keywordsChange(val){
                if(val==''){
                    this.loadData();
                }
            },
            searchJa(){
                this.loadData();
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadData();
            },
            currentChange(page){
                this.currentPage= page;
                this.loadData();
            },
            loadData(){
                this.tableLoading = true;
                let start_ctime='',
                    end_ctime='';

                if(this.searchData.ctime&&this.searchData.ctime.length>0){
                    start_ctime = this.searchData.ctime[0];
                    end_ctime = this.searchData.ctime[1];
                }
                this.getRequest('/erp/ja/page?page='+this.currentPage+"" +
                    "&size="+this.pageSize+
                    "&sort="+this.sort+
                    "&order="+this.order+
                    "&keywords="+this.keywords+
                    "&code="+this.searchData.code+
                    "&productCode="+this.searchData.productCode+
                    "&productName="+this.searchData.productName+
                    "&warehouseId="+this.searchData.warehouseId+
                    "&start_ctime="+start_ctime+"&end_ctime="+end_ctime).then((resp)=>{
                    this.journalAccounts = resp.data.journalAccounts;
                    this.totalCount = resp.data.count;
                    this.tableLoading = false;
                })
            },
            loadWarehouse() {
                this.getRequest('/erp/warehouse/all').then(resp=> {
                    if (resp &&resp.data) {
                        this.warehouses = resp.data;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>