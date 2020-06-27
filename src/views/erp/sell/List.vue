<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddSellView">
                        新增
                    </el-button>
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过单号、产品编码、产品名称、客户名称搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              :disabled="searchViewVisible"
                              @keyup.enter.native="searchSell"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="searchSell" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
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
                                客户名称：
                                <el-input v-model="searchData.customerName" size="mini" style="width: 400px" placeholder="客户名称" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                下单日期：
                                <el-date-picker
                                        v-model="searchData.initDate"
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
                            <el-col :span="8">
                                订单状态：
                                <el-select size="mini" style="width: 400px" v-model="searchData.status" multiple clearable>
                                    <el-option label="未提交" value="WTJ"></el-option>
                                    <el-option label="财务审核" value="CWSH"></el-option>
                                    <el-option label="驳回" value="REJECT"></el-option>
                                    <el-option label="出库中..." value="OUT"></el-option>
                                    <el-option label="已作废" value="DESTROY"></el-option>
                                    <el-option label="订单完成" value="FINISHED"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="searchSell" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                        </el-row>
                    </div>
                </transition>
                <el-table @sort-change="sortChange" v-loading="loading" :data="sells"  size="mini" style="width:100%" @row-dblclick="dblclick">
                    <el-table-column type="index" width="80px">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                            <el-button v-show="scope.row.status=='WTJ'" @click="startFlow(scope.row)" size="mini" type="success" style="padding: 3px 4px 3px 4px;margin: 2px">启动流程</el-button>
                            <el-button v-show="scope.row.status=='WTJ'"  type="primary" @click="showEditSellView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button v-show="scope.row.status=='WTJ'||scope.row.status=='DESTROY'" @click="deleteSell(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="单号">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
                    <el-table-column prop="customer.name" label="客户">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="freightType" label="运费类型">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.freightType=='YES'" type="success" size="mini" effect="dark">包邮</el-tag>
                            <el-tag v-if="scope.row.freightType=='NO'" type="warning" size="mini" effect="dark">不包邮</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="付款方式">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.receivableType=='FULLPAYMENT'" type="success" size="mini" effect="dark">全款发货</el-tag>
                            <el-tag v-if="scope.row.receivableType=='LOAN'" type="warning" size="mini" effect="dark">借款抵</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column  label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-if="scope.row.status=='CWSH'" type="warning" size="mini" effect="dark">财务审核</el-tag>
                            <el-tag v-if="scope.row.status=='REJECT'" type="danger" size="mini" effect="dark">驳回</el-tag>
                            <el-tag v-if="scope.row.status=='OUT'"  color="#7b1fa2" size="mini" effect="dark">出库中...</el-tag>
                            <el-tag v-if="scope.row.status=='DESTROY'"  type="info" size="mini" effect="dark">已作废</el-tag>
                            <el-tag v-if="scope.row.status=='FINISHED'"  type="success" size="mini" effect="dark">订单完成</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cuser.realName" label="创建人"></el-table-column>
                    <el-table-column prop="ctime" label="创建时间" sortable></el-table-column>
                    <el-table-column prop="etime" label="完成时间"></el-table-column>

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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false"  width="77%">
            <sell-form :isEdit="isEdit" :oldSell="oldSell" @close="closeWin" @callback="callback"></sell-form>
        </el-dialog>
        <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
            <sell-details @close="closeDetailDialog" :sell="currentSell" :isReception="isReception" @callback="callbackDetails"></sell-details>
        </el-dialog>
    </div>
</template>

<script>
    import SellForm from "@/views/erp/sell/SellForm";
    import SellDetails from "@/views/erp/sell/SellDetails";

    export default {
        name: "List",
        components: {SellDetails, SellForm},
        mounted(){
            this.loadSells();
        },
        methods:{
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.loadSells();
            },
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            deleteSell(row){
                this.$confirm("确定要删除吗？删除后不可恢复！","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/erp/sell/'+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.loadSells();
                        }else {
                            this.$message.error("删除失败");
                        }
                    })
                })
            },
            startFlow(row){
                this.$confirm("确定要启动审批流程吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.postRequest('/erp/sell/startFlow?id='+row.id).then((resp)=>{
                        if(resp&&resp.data.status==200){
                            this.$message.success("启动成功");
                            this.loadSells();

                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            //列表双击事件
            dblclick(row){
                this.getRequest('/erp/sell/'+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.currentSell = resp.data;
                        this.detailsDialogVisible = true;
                        this.detailsDialogTitle="订单查看";
                        if (resp.data.isClaimed !== 'Y' && (resp.data.status !== 'WTJ' || resp.data.status === 'DESTORY')) {
                            this.isReception = true;
                        }else {
                            this.isReception = false;
                        }
                    }else{
                        this.$message.error("获取订单失败");
                    }
                })

            },
            closeDetailDialog(){
                this.detailsDialogVisible = false;
            },
            //显示订单详情
            showDetails(row){
                this.dblclick(row);
            },
            callback(){
                this.dialogVisible = false;
                this.loadSells();
            },
            callbackDetails() {
                this.detailsDialogVisible = false;
                this.loadSells();
            },
            //关闭编辑窗口
            closeWin(){
                this.dialogVisible = false;
            },
            //编辑订单
            showEditSellView(row){
                this.isEdit = true;
                this.getRequest('/erp/sell/'+row.id).then((resp)=>{
                    this.oldSell = resp.data;
                })
                this.dialogVisible = true;
                this.dialogTitle = "编辑订单";
            },
            //添加订单
            showAddSellView(){
                this.isEdit = false;
                this.oldSell = {
                    initDate:'',
                    codeGeneratorType:"AUTO",
                    code:'',
                    customer:{
                        name:''
                    },
                    receiving:{},
                    receivableType:'FULLPAYMENT',
                    freightType:'YES',
                    description:'',
                    details:[],
                    annexs:[]
                };
                this.dialogVisible = true;
                this.dialogTitle = "添加订单";
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.loadSells();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptySearchData();
                    this.loadSells();
                }
            },
            emptySearchData(){
                this.searchData={
                    code:'',
                    productCode:'',
                    productName:'',
                    customerName:'',
                    initDate:'',
                    ctime:'',
                    status:''
                }
            },
            searchSell(){
                this.loadSells();
            },
            //加载 订单
            loadSells(){
                this.loading = true;
                if(this.searchData.initDate&&this.searchData.initDate.length>0){
                    start_initDate = this.searchData.initDate[0];
                    end_initDate=this.searchData.initDate[1];
                }
                if(this.searchData.ctime&&this.searchData.ctime.length>0){
                    start_ctime = this.searchData.ctime[0];
                    end_ctime = this.searchData.ctime[1];
                }
                let start_initDate='',end_initDate='',start_ctime='',end_ctime='';
                this.getRequest('/erp/sell/page?page='+
                    this.currentPage+
                    "&size="+this.pageSize+
                    "&sort="+this.sort+
                    "&order="+this.order+
                    "&keywords="+this.keywords+
                    "&code="+this.searchData.code+
                    "&productCode="+this.searchData.productCode+
                    "&productName="+this.searchData.productName+
                    "&customerName="+this.searchData.customerName+
                    "&start_initDate="+start_initDate+
                    "&end_initDate="+end_initDate+
                    "&start_ctime="+start_ctime+
                    "&end_ctime="+end_ctime+"&status="+this.searchData.status).then((resp)=>{
                    this.sells = resp.data.sells;
                    this.totalCount = resp.data.count;
                    this.loading = false;
                })
            },
            keywordsChange(val){
                if(val==''){
                    this.loadData();
                }
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadSells();
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadSells();
            },
        },
        data(){
            return{
                searchData:{
                    code:'',
                    productCode:'',
                    productName:'',
                    customerName:'',
                    initDate:'',
                    ctime:'',
                    status:''
                },
                keywords:'',
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                searchViewVisible:false,
                loading:false,
                sells:[],
                currentPage:1,
                totalCount:-1,
                sort:'ctime',
                order:'',
                pageSize:10,
                dialogTitle:'',
                dialogVisible:false,
                isEdit:false,
                oldSell:[],
                currentSell:[],
                detailsDialogVisible:false,
                detailsDialogTitle:'',
                isReception: false,
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
        }
    }
</script>

<style scoped>

</style>