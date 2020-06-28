<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddView">添加</el-button>
                    <!--<el-input size="mini" placeholder="通过产品名称搜索，记得回车呦..." clearable style="width: 300px;margin: 0px;padding: 0px;" prefix-icon="el-icon-search"></el-input>
                    <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                               @click="showSearchView">
                        <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                    </el-button>-->

                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过单号、产品编码、产品名称搜索，记得回车呦..."
                              clearable
                              style="width: 300px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              :disabled="searchViewVisible"
                              @keyup.enter.native="searchProductSplit"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchProductSplit">搜索</el-button>
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                               @click="showSearchView">
                        <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div>
                    <transition name="slide-fade">
                        <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-col :span="8">
                                    拆分单编号：<el-input v-model="productSplit.code" size="mini" style="width: 400px" placeholder="拆分单编号" ></el-input>
                                </el-col>
                                <el-col :span="8">
                                    产品编号：<el-input v-model="productSplit.productCode" size="mini" style="width: 400px" placeholder="产品编号" ></el-input>
                                </el-col>
                                <el-col :span="8">
                                    产品名称：<el-input v-model="productSplit.productName" size="mini" style="width: 400px" placeholder="产品名称" ></el-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-col :span="8">
                                    拆分仓库：
                                    <el-select clearable  size="mini" v-model="productSplit.warehouseId" style="width: 400px">
                                        <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    拆分日期：
                                    <el-date-picker
                                            v-model="productSplit.splitTime"
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
                                            v-model="productSplit.ctime"
                                            size="mini"
                                            type="datetimerange"
                                            align="right"
                                            unlink-panels
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-col>
                                <!--<el-col :span="5">
                                    <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                                    <el-button icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                                </el-col>-->
                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-col :span="8">
                                    订单状态：
                                    <el-select size="mini" style="width: 400px" v-model="productSplit.status" clearable>
                                        <el-option label="未提交" value="WTJ"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                                <el-button icon="el-icon-search" type="primary" size="mini" @click="searchProductSplit">搜索</el-button>
                            </el-row>
                        </div>
                    </transition>
                    <el-table @sort-change="sortChange" v-loading="loading" :data="productSplits" @row-dblclick="dblclick" tooltip-effect="dark" ref="multipleTable" style="width: 100%" id="table" >
                        <!--<el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>-->
                        <el-table-column type="index" width="20px">
                            <template slot-scope="scope" >
                                <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200px"
                                         label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                                <el-button v-show="scope.row.status=='WTJ'" @click="startFlow(scope.row)" size="mini" type="success" style="padding: 3px 4px 3px 4px;margin: 2px">启动流程</el-button>
                                <el-button v-show="scope.row.status=='WTJ'"  type="primary" @click="showEditView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button v-show="scope.row.status=='WTJ'||scope.row.status=='DESTROY'" @click="deleteProductSplit(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="拆分单编号" width="200px">
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.code)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="warehouse.name" label="拆分仓库"></el-table-column>
                        <el-table-column prop="splitTime" label="拆分日期" sortable="custom" width="150px"></el-table-column>
                        <el-table-column label="产品编号" width="150px">
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.product.code)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product.imageUrl" label="图片">
                            <template slot-scope="scope">
                                <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品名称">
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.product.name)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="number" label="拆分数量"></el-table-column>
                        <!--<el-table-column prop="batchNumber" label="批号"></el-table-column>-->
                        <el-table-column prop="" label="状态" width="120px">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                                <el-tag v-if="scope.row.status=='CKZG'" color="#B03060" size="mini" effect="dark">仓库主管审核</el-tag>
                                <el-tag v-if="scope.row.status=='DESTROY'"  type="info" size="mini" effect="dark">已作废</el-tag>
                                <el-tag v-if="scope.row.status=='CKLL'"  color="#7b1fa2" size="mini" effect="dark">仓库领料</el-tag>
                                <el-tag v-if="scope.row.status=='CF'"  type="warning" size="mini" effect="dark">产品拆分中。。。</el-tag>
                                <el-tag v-if="scope.row.status=='CLRK'"  type="danger" size="mini" effect="dark">材料入库</el-tag>
                                <el-tag v-if="scope.row.status=='DDTZ'"  type="primary" size="mini" effect="dark">订单调整</el-tag>
                                <el-tag v-if="scope.row.status=='FINISHED'"  type="success" size="mini" effect="dark">订单完成</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="splitMan.realName" label="创建人"></el-table-column>
                        <el-table-column prop="ctime" label="创建日期" width="200px"></el-table-column>
                        <el-table-column prop="etime" label="完成日期" width="200px"></el-table-column>
                        <el-table-column prop="description" label="备注" :show-tooltip-when-overflow="true" :show-overflow-tooltip='true'></el-table-column>
                        <!--<el-table-column width="200px"
                                         label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                                <el-button v-show="scope.row.status=='WTJ'" @click="startFlow(scope.row)" size="mini" type="success" style="padding: 3px 4px 3px 4px;margin: 2px">启动流程</el-button>
                                <el-button v-show="scope.row.status=='WTJ'"  type="primary" @click="showEditView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button v-show="scope.row.status=='WTJ'||scope.row.status=='DESTROY'" @click="deleteProductAssembled(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                            </template>
                        </el-table-column>-->
                    </el-table>
                    <div style="display: flex;justify-content: space-between;margin: 2px">
                        <el-pagination
                                background
                                :page-sizes="[10,20,50,100,200]"
                                :page-size="pageSize"
                                @current-change="currentChange"
                                :current-page="currentPage"
                                @size-change="sizeChange"
                                layout="total,sizes,prev,pager,next,jumper"
                                :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-split-form   @close="closeDialog" :isEdit="isEdit" @callback="callback" :oldProductSplit="oldProductSplit"></product-split-form>
        </el-dialog>
        <el-dialog :visible.sync="detailsDialogVisible" :title="detailsDialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-split-details   @close="closeDetailDialog" :isEdit="isDetailsEdit" :oldProductSplit="oldProductSplit" @callback="detailsCallback"></product-split-details>
        </el-dialog>
    </div>
</template>

<script>
    import ProductSplitForm from "./ProductSplitForm";
    import ProductSplitDetails from "./ProductSplitDetails";
    export default {
        name: "List",
        components: {ProductSplitDetails, ProductSplitForm},
        mounted() {
            this.loadSplit();
            this.loadWarehouse();
        },
        data() {
            return {
                sort:'ctime',
                order:'desc',
                loading:false,
                pageSize:10,
                keywords: '',
                isDetailsEdit: false,
                detailsDialogVisible:false,
                detailsDialogTitle: '',

                isEdit:false,
                oldProductSplit:{

                },
                productSplit: {
                    code:'',
                    ctime:'',
                    splitTime: '',
                    productCode:'',
                    productName:'',
                    warehouseId:'',
                    status:''
                },
                warehouses: [],
                searchViewVisible:false,
                dialogVisible:false,
                dialogTitle: '',
                productSplits: [],
                currentPage: 1,
                totalCount: -1,
                searchDate:[],
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                isClaimed: false,
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
                },
            }
        },
        methods: {
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.loadSplit();
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadSplit();
            },
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            searchProductSplit() {
                this.loadSplit();
            },
            keywordsChange(val) {
                if(val==''){
                    this.loadSplit();
                }
            },
            closeDetailDialog() {
                this.detailsDialogVisible = false;
            },
            detailsCallback() {
                this.loadSplit();
                this.closeDetailDialog();
            },

            showDetails(row) {
                this.detailsDialogVisible = true;
                this.detailsDialogTitle = "拆分单详情";
                this.oldProductSplit = row;
            },
            startFlow(row) {
                this.$confirm('确定要开启审批流程吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
                    this.getRequest('/erp/split/startFlow?id=' + row.id).then(resp => {
                        if (resp && resp.data.status == '200') {
                            this.$message.success('启动成功');
                            this.loadSplit();
                        }else {
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            showEditView(row) {
                this.isEdit = true;
                this.oldProductSplit = row;
                this.dialogVisible = true;
                this.dialogTitle = "编辑拆分单";
            },
            deleteProductSplit(row) {
                this.$confirm("确定要删除吗？删除后不可恢复！","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/erp/split/'+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.loadSplit();
                        }else {
                            this.$message.error("删除失败");
                        }
                    })
                })
            },
            loadSplit() {
                this.loading = true;
                let start_splitTime = '',
                    end_splitTime = '',
                    start_ctime = '',
                    end_ctime = '';
                if (this.productSplit.splitTime && this.productSplit.splitTime.length > 0) {
                    start_splitTime = this.productSplit.splitTime[0];
                    end_splitTime = this.productSplit.splitTime[1];
                }
                if (this.productSplit.ctime && this.productSplit.ctime.length > 0) {
                    start_ctime = this.productSplit.ctime[0];
                    end_ctime = this.productSplit.ctime[1];
                }
                this.getRequest('/erp/split/page?page=' + this.currentPage +
                    '&size=' + this.pageSize +
                    '&keywords=' + this.keywords +
                    '&code=' + this.productSplit.code +
                    '&productCode=' + this.productSplit.productCode +
                    '&productName=' + this.productSplit.productName +
                    '&warehouseId=' + this.productSplit.warehouseId +
                    '&status=' + this.productSplit.status +
                    '&start_splitTime=' + start_splitTime +
                    '&end_splitTime=' + end_splitTime +
                    '&start_ctime=' + start_ctime +
                    '&end_ctime=' + end_ctime +
                    '&sort=' + this.sort +
                    '&order=' + this.order).then(resp => {
                    if (resp&&resp.data) {
                        this.productSplits = resp.data.productSplits;
                        this.totalCount = resp.data.count;
                        this.loading = false;
                    }
                })
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptyProductSplitData();
                this.loadSplit();
            },
            showSearchView() {
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                    if(!this.searchViewVisible) {
                        this.emptyProductSplitData();
                        this.loadSplit();
                    }
            },
            callback() {
                this.dialogVisible = false;
                this.loadSplit();
            },
            closeDialog() {
                  this.dialogVisible = false;
            },
            search() {

            },
            currentChange(page) {
                this.currentPage = page;
                this.loadSplit();
            },
            showAddView() {
                this.isEdit = false;
                this.oldProductSplit = {
                    splitTime: '',
                    product: {
                        code: ''
                    },
                    warehouse:{
                        name:''
                    },
                    details:[],
                    codeGeneratorType:"AUTO",
                    number:1
                };
                this.dialogVisible = true;
                this.dialogTitle = "添加拆分单";
            },
            loadWarehouse() {
                this.getRequest('/erp/warehouse/all').then(resp=> {
                    if (resp &&resp.data) {
                        this.warehouses = resp.data;
                    }
                })
            },
            //列表双击事件
            dblclick(row) {
                this.getRequest('/erp/split/getProducrSplitById?id=' + row.id).then(resp => {
                    if (resp&&resp.data) {
                        this.oldProductSplit = resp.data;
                        this.detailsDialogVisible = true;
                        this.detailsDialogTitle = '订单查看';
                        if (resp.data.isClaimed !== 'Y' && (resp.data.status !== 'WTJ' || resp.data.status === 'DESTORY')) {
                            this.isReception = true;
                        }else {
                            this.isReception = false;
                        }
                    }else {
                        this.$message.error("获取订单失败");
                    }
                })
            },
            emptyProductSplitData(){
                this.productSplit={
                    code:'',
                    assembledTime:'',
                    ctime:'',
                    productCode:'',
                    productName:'',
                    warehouseId:'',
                    status:''
                }
            },
        }
    }
</script>

<style scoped>

</style>