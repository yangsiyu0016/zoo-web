<template>
    <div>
        <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
            <div style="display: inline">
            </div>
            <el-form @submit.native.prevent>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过采购单号、产品名称搜索、客户名称进行搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              :disabled="searchViewVisible"
                              @keyup.enter.native="searchSs"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="searchSs" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                               @click="showSearchView">
                        <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索/导出
                    </el-button>
                </div>
            </el-form>
        </el-header>
        <el-container>
            <el-main>
                <transition name="slide-fade">
                    <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8">
                                销售单号：<el-input v-model="searchData.code" size="mini" style="width: 400px" placeholder="销售单号" ></el-input>
                            </el-col>
                            <el-col :span="8" >
                                订单状态：
                                <el-select size="mini" v-model="searchData.status" style="width: 400px">
                                    <el-option key="WTJ" label="未提交" value="WTJ"></el-option>
                                    <el-option key="CWSH" label="财务审核" value="CWSH"></el-option>
                                    <el-option key="IN" label="入库中..." value="IN"></el-option>
                                    <el-option key="DESTROY" label="已作废" value="DESTROY"></el-option>
                                    <el-option key="FINISHED" label="已完成" value="FINISHED"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8">
                                产品名称：
                                <el-input
                                        style="width: 400px"
                                        size="mini"
                                        v-model="searchData.productName" placeholder="产品名称">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8" >
                                下单日期：
                                <el-date-picker
                                        style="width: 400px"
                                        align="right"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        size="mini"
                                        v-model="searchData.initDate"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy 年 MM 月 dd 日"
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
                            <el-col :span="8">
                                客户：<el-input
                                    style="width: 400px"
                                    size="mini"
                                    placeholder="请输入客户名称"
                                    v-model="searchData.customerName">
                            </el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="searchSs" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                            <el-button @click="exportExcel" style="margin-top: 2px;" size="mini" icon="el-icon-download" type="primary">导出</el-button>
                        </el-row>
                    </div>
                </transition>
            </el-main>
        </el-container>
        <el-card shadow="hover">
            <el-main style="padding-left: 0px;padding-top: 0px">
                <!--<div class="export" style="float: right">
                    <el-button @click="exportExcel" style="margin-top: 2px;" size="mini" icon="el-icon-download" type="primary">导出</el-button>
                </div>-->
                <el-table v-loading="loading" :data="sellStatisticses" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60px">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="typeName" label="产品类型"></el-table-column>
                    <el-table-column prop="productName" label="产品名称">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.productName)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="spec" label="规格"></el-table-column>
                    <el-table-column prop="number" label="销售数量"></el-table-column>
                    <el-table-column prop="notOutNumber" label="未出货数量"></el-table-column>
                    <el-table-column prop="price" label="销售单价"></el-table-column>
                    <el-table-column prop="code" label="单号">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="initDate" label="下单日期" sortable></el-table-column>
                    <el-table-column prop="realName" label="客户来自"></el-table-column>
                    <el-table-column prop="customerName" label="客户名称">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.customerName)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-if="scope.row.status=='CWSH'" type="warning" size="mini" effect="dark">财务审核</el-tag>
                            <el-tag v-if="scope.row.status=='OUT'"  color="#7b1fa2" size="mini" effect="dark">出库中...</el-tag>
                            <el-tag v-if="scope.row.status=='DESTROY'"  type="info" size="mini" effect="dark">已作废</el-tag>
                            <el-tag v-if="scope.row.status=='FINISHED'"  type="success" size="mini" effect="dark">订单完成</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ctime" label="创建时间" sortable></el-table-column>

                </el-table>
                <el-pagination
                        background
                        :page-sizes="[10,20,50,100,200]"
                        :page-size="pageSize"
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        :current-page="currentPage"
                        layout="total,sizes,prev,pager,next,jumper"
                        :total="totalCount">
                </el-pagination>
            </el-main>
        </el-card>
        <product-dialog @closeWin="closeProductDialog" :visible="dialogVisible" :title="dialogTitle" @dblclick="dblclick"></product-dialog>
        <div v-show="false">
            <el-table :data="exportSellStatistics" tooltip-effect="dark" ref="multipleTable" style="width: 100%" id="table">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column type="index" width="60px">
                    <template scope="scope">
                        <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="typeName" label="产品类型"></el-table-column>
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="spec" label="规格"></el-table-column>
                <el-table-column prop="number" label="销售数量"></el-table-column>
                <el-table-column prop="notOutNumber" label="未出货数量"></el-table-column>
                <el-table-column prop="price" label="销售单价"></el-table-column>
                <el-table-column prop="code" label="单号"></el-table-column>
                <el-table-column prop="initDate" label="下单日期" sortable></el-table-column>
                <el-table-column prop="realName" label="客户来自"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                        <el-tag v-if="scope.row.status=='CWSH'" type="warning" size="mini" effect="dark">财务审核</el-tag>
                        <el-tag v-if="scope.row.status=='OUT'"  color="#7b1fa2" size="mini" effect="dark">出库中...</el-tag>
                        <el-tag v-if="scope.row.status=='DESTROY'"  type="info" size="mini" effect="dark">已作废</el-tag>
                        <el-tag v-if="scope.row.status=='FINISHED'"  type="success" size="mini" effect="dark">订单完成</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ctime" label="创建时间" sortable></el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>

    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import ProductDialog from "@/components/dialog/ProductDialog";
    export default {
        name: "SellStatistics",
        components: {FileSaver, XLSX, ProductDialog},
        data() {
            return {
                exportSellStatistics: [],
                loading: false,
                keywords: '',
                sort:'ctime',
                order:'desc',
                searchViewVisible: false,
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                currentPage: 1,
                totalCount: -1,
                pageSize: 10,
                sellStatisticses: [],
                multipleSelection: [],
                dialogVisible: false,
                dialogTitle: '',
                searchData: {
                    productName:'',
                    ctime: '',
                    initDate: '',
                    code:'',
                    status: '',
                    productCode:'',
                    customerName: ''
                },
                searchDate:[],
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
        mounted() {
            this.initData();
        },
        methods: {
            sizeChange(size){
                this.pageSize = size;
                this.searchSs();
            },
            keywordsChange(val){
                if(val==''){
                    this.searchSs();
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
                this.searchSs();
            },
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.searchSs();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptySearchData();
                    this.searchSs();
                }
            },
            emptySearchData() {
                this.searchData={
                    productName:'',
                    ctime: '',
                    initDate: '',
                    code:'',
                    status: '',
                    customerName: ''
                }
            },
            /*reset() {
                this.searchData = {
                    productId:'',
                        code:'',
                        status: '',
                        customerName: '',
                };
                this.searchDate = [];
            },*/
            selectProduct() {
                this.dialogVisible = true;
                this.dialogTitle = '选择产品';
            },
            searchSs() {
                this.initData();
            },
            dblclick(row) {
                //this.searchData.productName = row.name + ' | 规格：' + row.spec + ' | 重量：' + row.weight + ' | 颜色：' + row.color;
                this.searchData.productName = row.name;
                this.searchData.productId = row.id;
                this.dialogVisible = false;
            },
            closeProductDialog() {
                this.dialogVisible = false;
            },
            currentChange(page) {
                this.searchData.currentPage = page;
                this.initData();
            },
            exportExcel() {
                // 导出的内容只做解析，不进行格式转换
                let xlsxParam = { raw: true }
                let wb = null
                let tableName = ''
                let randomString = this.randomString(6)
                wb = XLSX.utils.table_to_book(
                    document.querySelector('#table'),
                    xlsxParam
                )
                // 这里的randomString非必须，只是生成一串随机码
                // 便于下载多个文件而不重名
                tableName = `销售明细统计表-${randomString}.xlsx`

                /* get binary string as output */
                let wbout = XLSX.write(wb, {
                    bookType: 'xlsx',
                    bookSST: true,
                    type: 'array'
                })
                try {
                    // eslint-disable-next-line no-undef
                    FileSaver.saveAs(new Blob([wbout], {
                        type: 'application/octet-stream'
                    }), tableName)
                } catch (e) {
                    if (typeof console !== 'undefined') {
                        console.log(e, wbout)
                    }
                }
                this.$message.success('导出成功')
                return wbout
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            initData() {
                this.loading = true;
                let start_initDate='',end_initDate='',start_ctime='',end_ctime='';
                if(this.searchData.initDate&&this.searchData.initDate.length>0){
                    start_initDate = this.searchData.initDate[0];
                    end_initDate=this.searchData.initDate[1];
                }
                if(this.searchData.ctime&&this.searchData.ctime.length>0){
                    start_ctime = this.searchData.ctime[0];
                    end_ctime = this.searchData.ctime[1];
                }
                this.getRequest('/erp/sellStatistics/page?page=' + this.currentPage +
                    '&size=' + this.pageSize +
                    '&sort=' + this.sort +
                    '&order=' + this.order +
                    '&keywords=' + this.keywords +
                    '&code=' + this.searchData.code +
                    '&productName=' + this.searchData.productName +
                    '&customerName=' +this.searchData.customerName +
                    "&start_initDate="+start_initDate+
                    "&end_initDate="+end_initDate+
                    "&start_ctime="+start_ctime+
                    "&end_ctime="+end_ctime+"&status="+this.searchData.status).then(resp => {
                    this.sellStatisticses = resp.data.sellStatisticses;
                    this.exportSellStatistics = resp.data.exportSellStatistics;
                    this.totalCount = resp.data.count;
                    this.loading = false;
                })
            },
            // 生成len位随机码
            randomString (len) {
                len = len || 32
                // 屏蔽了容易让人混淆的字符，比如数字1和字母l,，数字0和字母o……
                var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
                var maxPos = chars.length
                var str = ''
                for (let i = 0; i < len; i++) {
                    str += chars.charAt(Math.floor(Math.random() * maxPos))
                }
                return str
            }
        }
    }
</script>

<style scoped>

</style>