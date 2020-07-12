<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="display: inline">

                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-form @submit.native.prevent>
                        <el-input size="mini" placeholder="通过单号、产品编码、产品名称搜索，记得回车呦..."
                                  clearable
                                  style="width: 350px;margin: 0px;padding: 0px;"
                                  prefix-icon="el-icon-search"
                                  :disabled="searchViewVisible"

                                  @keyup.enter.native="searchOi"
                                  v-model="keywords"
                                  @change="keywordsChange"
                        ></el-input>
                        <el-button @click="searchOi" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                        <el-button  type="primary" size="mini" style="margin-left: 5px"
                                   @click="showSearchView">
                            <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                        </el-button>
                    </el-form>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <transition name="slide-fade">
                    <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8">
                                单号：<el-input v-model="oi.code" size="mini" style="width: 400px" placeholder="单号" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                产品编号：<el-input v-model="oi.productCode" size="mini" style="width: 400px" placeholder="产品编号" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                产品名称：<el-input v-model="oi.productName" size="mini" style="width: 400px" placeholder="产品名称" ></el-input>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8">
                                仓库：
                                <el-select clearable  size="mini" v-model="oi.warehouseId" style="width: 400px">
                                    <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8">
                                下单日期：
                                <el-date-picker
                                        v-model="oi.initDate"
                                        size="mini"
                                        style="width: 400px"
                                        type="daterange"
                                        align="right"
                                        unlink-panels
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="8">
                                创建日期：
                                <el-date-picker
                                        v-model="oi.ctime"
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
                            <el-col :span="8">
                                订单状态:
                                <el-select size="mini" style="width: 400px" v-model="oi.status" clearable>
                                    <el-option label="未提交" value="WTJ"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="searchOi" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                        </el-row>
                    </div>
                </transition>
                <el-table  @sort-change="sortChange" v-loading="loading" :data="ois"  @row-dblclick="dblclick" size="mini" highlight-current-row>
                    <el-table-column type="selection" align="left" width="80">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px" icon="fa fa-eye">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" align="left"  label="单号" >
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="initDate" align="left"  label="下单日期"  sortable></el-table-column>
                    <el-table-column prop="warehouse.name" align="left"  label="仓库" ></el-table-column>
                    <el-table-column  align="left"  label="状态" >
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-else-if="scope.row.status=='ZGSH'" type="warning" size="mini" effect="dark">仓库主管审核</el-tag>
                            <el-tag v-else-if="scope.row.status=='CWSH'" type="danger" size="mini" effect="dark">财务审核</el-tag>
                            <el-tag v-else-if="scope.row.status=='FINISHED'" type="success" size="mini" effect="dark">流程完成</el-tag>
                            <el-tag v-else-if="scope.row.status=='DESTROY'" type="info" size="mini" effect="dark">作废</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cuser.realName" align="left"  label="创建人" ></el-table-column>
                    <el-table-column prop="ctime" align="left"  label="创建日期" sortable></el-table-column>
                    <el-table-column prop="etime" align="left"  label="完成日期" ></el-table-column>

                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
                    <el-pagination
                            background
                            :page-sizes="[10,20,50,100,500]"
                            :page-size="pageSize"
                            :current-page="currentPage"
                            @current-change="currentChange"
                            @size-change="sizeChange"
                            layout="total,sizes,prev,pager,next,jumper"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </el-main>
            <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
                <opening-inventory-details @close="closeDetailsWin" :oi="currentOi" :canDestroy="canDestroy" @callback="callback"></opening-inventory-details>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
    import OpeningInventoryDetails from '@/views/erp/stock/oi/OpeningInventoryDetails';
    export default {
        name: "AllOpeningInventory",
        components:{OpeningInventoryDetails},
        data() {
            return{
                loading:false,
                keywords:'',
                searchViewVisible:false,
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                oi:{
                    code:'',
                    productCode:'',
                    productName:'',
                    warehouseId:'',
                    initDate:[],
                    ctime:[],
                    status:''
                },
                ois: [],
                currentPage: 1,
                totalCount: -1,
                pageSize:10,
                sort:'ctime',
                order:'desc',
                currentOi: {},
                detailsDialogVisible: false,
                detailsDialogTitle: '',
                canDestroy: false,
                warehouses:[],
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
            this.loadOis();
            this.loadWarehouse();
        },
        methods: {

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
                this.loadOis();
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadOis();
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadOis();
            },
            keywordsChange(val){
                if(val==''){
                    this.loadOis();
                }
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptyOiData();
                this.loadOis();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptyOiData();
                    this.loadOis();
                }
            },
            emptyOiData(){
                this.oi={
                    code:'',
                    productCode:'',
                    productName:'',
                    warehouseId:'',
                    initDate:[],
                    ctime:[],
                    status:''
                }
            },
            searchOi(){
                this.loadOis();
            },
            callback(){
                this.closeDetailsWin();
                this.loadOis();
            },
            //关闭详情页
            closeDetailsWin(){
                this.detailsDialogVisible = false;
            },
            //单行双击事件
            dblclick(row) {
                this.canDestroy = true;
                this.getRequest('/oi/getOiById?id='+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.currentOi = resp.data;
                        this.detailsDialogVisible = true;
                        this.detailsDialogTitle="订单查看";
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })
            },
            //查看详情
            showDetails(row) {
                this.dblclick(row);
            },
            //加载数据
            loadOis() {
                this.loading = true;
                let start_initDate ='',
                    end_initDate='',
                    start_ctime='',
                    end_ctime='';
                if(this.oi.initDate&&this.oi.initDate.length>0){
                    start_initDate = this.oi.initDate[0];
                    end_initDate=this.oi.initDate[1];
                }
                if(this.oi.ctime&&this.oi.ctime.length>0){
                    start_ctime = this.oi.ctime[0];
                    end_ctime = this.oi.ctime[1];
                }
                this.getRequest('/oi/all?page='+this.currentPage+"&size="+this.pageSize+
                    "&keywords="+this.keywords+
                    "&code="+this.oi.code+
                    "&productCode="+this.oi.productCode+
                    "&productName="+this.oi.productName+
                    "&warehouseId="+this.oi.warehouseId+
                    "&status="+this.oi.status+
                    "&start_initDate="+start_initDate+
                    "&end_initDate="+end_initDate+
                    "&start_ctime="+start_ctime+
                    "&end_ctime="+end_ctime+
                    "&sort="+this.sort+
                    "&order="+this.order).then((resp)=>{
                    this.ois = resp.data.ois;
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
        }
    }
</script>

<style scoped>

</style>