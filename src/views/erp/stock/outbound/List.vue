<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">

                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过单号、产品编码、产品名称、客户名称搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              :disabled="searchViewVisible"
                              @keyup.enter.native="loadOutbounds"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="loadOutbounds" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
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
                            <el-col :span="8" style="padding-left: 40px">
                                单号：<el-input v-model="searchData.code" size="mini" style="width: 400px" placeholder="单号" ></el-input>
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
                                仓库：
                                <el-select clearable  size="mini" v-model="searchData.warehouseId" style="width: 400px">
                                    <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8">
                                来自：
                                <el-select clearable  size="mini" v-model="searchData.type" style="width: 400px">
                                    <el-option label="拆分单" value="CF"></el-option>
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
                        <!--<el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8">
                                状态：
                                <el-select size="mini" style="width: 400px" v-model="searchData.status" multiple clearable>

                                </el-select>
                            </el-col>
                        </el-row>-->
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="loadOutbounds" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                        </el-row>
                    </div>
                </transition>
                <el-table @sort-change="sortChange" v-loading="loading" :data="outbounds" size="mini" style="width:100%">
                    <el-table-column type="index"  width="50">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                        </template>

                    </el-table-column>
                    <el-table-column prop="type" label="来自">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.type=='CF'" size="mini" type="warning" effect="dark">拆分单</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="出库单号">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="warehouse.name" label="仓库"></el-table-column>

                    <el-table-column prop="ctime" label="出库时间" sortable></el-table-column>
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
        <el-dialog :visible.sync="detailDialogVisible" :title="detailDialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <outbound-details @close="closeDetailDialog" :outbound="outbound"></outbound-details>
        </el-dialog>
    </div>
</template>

<script>
    import OutboundDetails from "@/views/erp/stock/outbound/OutboundDetails";
    export default {
        name: "List",
        components: {OutboundDetails},
        data() {
            return{
                outbound:{

                },
                detailDialogVisible:false,
                detailDialogTitle:'',
                warehouses:[],
                loading:false,
                outbounds: [],
                currentPage: 1,
                totalCount: -1,
                pageSize:10,
                sort:'ctime',
                order:'desc',
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                searchViewVisible:false,
                keywords:'',
                searchData:{
                    code:'',
                    productCode:'',
                    productName:'',
                    type:'',
                    warehouseId:'',
                    ctime:''
                },
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
            this.loadOutbounds();
            this.loadWarehouse()
        },
        methods: {
            closeDetailDialog(){
                this.detailDialogVisible = false;
            },
            showDetails(row){
                this.outbound = row;
                this.detailDialogTitle = '出库单查看';
                this.detailDialogVisible = true;
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.loadOutbounds();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptySearchData();
                    this.loadOutbounds();
                }
            },
            emptySearchData(){
                this.searchData={
                    code:'',
                    productCode:'',
                    productName:'',
                    type:'',
                    warehouseId:'',
                    ctime:''
                }
            },
            keywordsChange(val){
                if(val==''){
                    this.loadOutbounds();
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
                this.loadOutbounds();
            },
            sizeChange(size){
                this.size = size;
                this.loadOutbounds();
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadOutbounds();
            },
            loadOutbounds() {
                this.loading = true;
                let start_ctime='',end_ctime='';
                if(this.searchData.ctime&&this.searchData.ctime.length>0){
                    start_ctime = this.searchData.ctime[0];
                    end_ctime = this.searchData.ctime[1];
                }
                this.getRequest('/erp/outbound/page?page=' + this.currentPage +
                    '&size='+this.pageSize+
                    "&sort="+this.sort+
                    "&order="+this.order+
                    "&keywords="+this.keywords+
                    "&code="+this.searchData.code+
                    "&productCode="+this.searchData.productCode+
                    "&productName="+this.searchData.productName+
                    "&type="+this.searchData.type+
                    "&warehouseId="+this.searchData.warehouseId+"&start_ctime="+start_ctime+"&end_ctime="+end_ctime).then(resp => {
                    if (resp.data.status == '200') {
                        this.outbounds = resp.data.outbounds;
                        this.totalCount = resp.data.count;
                        this.loading = false;
                    }else{
                        this.$message.error("获取数据失败");
                    }
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