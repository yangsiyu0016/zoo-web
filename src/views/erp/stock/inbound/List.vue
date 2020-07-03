<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div></div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过单号搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              @keyup.enter.native="loadInbounds"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="loadInbounds" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                               @click="showSearchView">
                        <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                    </el-button>
                </div>
            </el-header>
            <transition name="slide-fade">
                <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                    <el-row :gutter="20" style="margin-top: 20px">
                        <el-col :span="8">
                            入库单编号：<el-input v-model="searchData.code" size="mini" style="width: 400px" placeholder="入库单编号" ></el-input>
                        </el-col>
                        <el-col :span="8">
                            产品编号：<el-input v-model="searchData.productCode" size="mini" style="width: 400px" placeholder="产品编号" ></el-input>
                        </el-col>
                        <el-col :span="8">
                            产品名称：<el-input v-model="searchData.productName" size="mini" style="width: 400px" placeholder="产品名称" ></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" style="margin-top: 20px">
                        <el-col :span="8">
                            入库仓库：
                            <el-select clearable  size="mini" v-model="searchData.warehouseId" style="width: 400px">
                                <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            入库单来自：
                            <!--<el-input v-model="searchData.type" size="mini" style="width: 400px" placeholder="入库单来自" ></el-input>-->
                            <el-select clearable  size="mini" v-model="searchData.type" style="width: 400px">
                                <el-option label="拆分单" value="CF"></el-option>
                                <el-option label="组装单" value="ZZ"></el-option>
                                <el-option label="采购单" value="PURCHASE"></el-option>
                            </el-select>
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
                        <el-button icon="el-icon-search" type="primary" size="mini" @click="loadInbounds">搜索</el-button>
                    </el-row>
                </div>
            </transition>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="inbounds" size="mini" style="width:100%" @sort-change="sortChange" v-loading="loading">
                    <el-table-column type="index"  width="50">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="50px"
                                     label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showInbound(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.details">
                                <el-table-column type="index" align="left" width="80"></el-table-column>
                                <el-table-column prop="product.imageUrl" label="图片">
                                    <template slot-scope="scope">
                                        <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                                    </template>
                                </el-table-column>
                                <el-table-column label="产品编号" prop="product.code"></el-table-column>
                                <el-table-column label="产品名称" prop="product.name"></el-table-column>
                                <el-table-column prop="product.typeName" align="left" label="分类"></el-table-column>
                                <el-table-column prop="product.productBrand.name" align="left" label="品牌"></el-table-column>
                                <el-table-column label="入库数量" prop="number"></el-table-column>
                                <el-table-column label="入库货位" prop="goodsAllocation.name"></el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="来自">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.type=='CF'" size="mini" type="warning" effect="dark">拆分单</el-tag>
                            <el-tag v-if="scope.row.type=='ZZ'" size="mini" type="success" effect="dark">组装单</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="入库单号" align="left">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="warehouse.name" label="仓库名称" align="left"></el-table-column>
                    <el-table-column prop="ctime" label="入库时间" align="left" sortable></el-table-column>
                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
                    <el-pagination
                            background
                            :page-sizes="[10,20,50,100,200]"
                            :page-size="pageSize"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="currentPage"
                            layout="total,sizes,prev,pager,next,jumper"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <inbound-details @close="closeDialog" :currentInbound="currentInbound"></inbound-details>
        </el-dialog>
    </div>
</template>

<script>
    import InboundDetails from "./InboundDetails";
    export default {
        name: "List",
        components: {InboundDetails},
        data() {
            return{
                warehouses: [],
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                searchViewVisible:false,
                pageSize: 10,
                inbounds: [],
                currentPage: 1,
                totalCount: -1,
                keywords: '',
                sort:'ctime',
                order:'desc',
                loading: false,
                searchData: {
                    code:'',
                    productCode:'',
                    productName:'',
                    type:'',
                    warehouseId:'',
                    ctime:''
                },
                dialogVisible: false,
                dialogTitle: '',
                currentInbound: {},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
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
            this.loadInbounds();
            this.loadWarehouse();
        },
        methods: {
            closeDialog() {
                this.dialogVisible = false;
            },
            showInbound(row) {
                this.dialogVisible = true;
                this.dialogTitle = '入库信息详情';
                this.getRequest('/erp/inbound/getInboundById?id=' +row.id).then(resp => {
                    if (resp&&resp.status===200) {
                        this.currentInbound = resp.data;
                    }
                })
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.loadInbounds();
            },
            emptySearchData() {
                this.searchData = {
                    code:'',
                    productCode:'',
                    productName:'',
                    type:'',
                    warehouseId:'',
                    ctime:''
                }
            },
            loadWarehouse() {
                this.getRequest('/erp/warehouse/all').then(resp=> {
                    if (resp &&resp.data) {
                        this.warehouses = resp.data;
                    }
                })
            },
            showSearchView() {
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible) {
                    this.emptySearchData();
                    this.loadInbounds();
                }
            },
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.loadInbounds();
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadInbounds();
            },
            keywordsChange(val){
                if(val==''){
                    this.loadInbounds();
                }
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadInbounds();
            },
            loadInbounds() {
                this.loading = true;
                let start_ctime = '';
                let end_ctime = '';
                if(this.searchData.ctime&&this.searchData.ctime.length>0){
                    start_ctime = this.searchData.ctime[0];
                    end_ctime = this.searchData.ctime[1];
                }
                this.getRequest('/erp/inbound/page?page=' + this.currentPage + '&size='+this.pageSize+'&sort='+this.sort+
                    '&order='+this.order+
                    '&keywords='+this.keywords +
                    '&code=' + this.searchData.code +
                    '&productCode=' + this.searchData.productCode +
                    '&productName=' + this.searchData.productName +
                    '&type=' + this.searchData.type +
                    '&warehouseId=' + this.searchData.warehouseId +
                    '&start_ctime=' + start_ctime +
                    '&end_ctime=' + end_ctime).then(resp => {
                    if (resp.data.status == '200') {
                        this.inbounds = resp.data.inbounds;
                        this.totalCount = resp.data.count;
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>