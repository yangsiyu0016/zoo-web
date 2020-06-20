<template>
    <div>
        <el-form>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">查询条件</span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="单号:">
                            <el-input
                                    style="width: 300px; float: left"
                                    size="mini"
                                    placeholder="请输入单号"
                                    v-model="searchData.code">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" >
                        <el-form-item label="订单状态:" prop="status">
                            <el-select size="mini" v-model="searchData.status" style="float: left">
                                <el-option key="WTJ" label="未提交" value="WTJ"></el-option>
                                <el-option key="CWSH" label="财务审核" value="CWSH"></el-option>
                                <el-option key="IN" label="入库中..." value="IN"></el-option>
                                <el-option key="DESTROY" label="已作废" value="DESTROY"></el-option>
                                <el-option key="FINISHED" label="已完成" value="FINISHED"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户:">
                            <el-input
                                    style="width: 300px; float: left"
                                    size="mini"
                                    placeholder="请输入客户名称"
                                    v-model="searchData.customerName">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="产品名称:">
                            <el-input
                                    style="width: 300px; float: left"
                                    size="mini"
                                    v-model="searchData.productName">
                            </el-input>
                            <el-button style="margin-top: 6px;float: left" size="mini" type="success" @click="selectProduct">选择</el-button>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8"  v-show="isShow" v-for="(val,j) in specs">
                        <el-form-item :label="val.key">
                            <el-select size="mini" v-model="property[j]" style="float: left">
                                <el-option v-for="(item,i) in val.value" :key="i" :label="item" :value="i + ','  + val.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8" >
                        <el-form-item prop="startDate"  label="下单日期:">
                            <el-date-picker
                                    style="float: left"
                                    align="right"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    size="mini"
                                    v-model="searchDate"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy 年 MM 月 dd 日"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-button style="margin-top: 6px;float: left" size="mini" type="success" @click="search">查询</el-button>
                <el-button style="margin-top: 6px;float: left" size="mini" type="success" @click="reset">重置</el-button>
            </el-card>
        </el-form>
        <el-card shadow="hover">
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div class="export" style="float: right">
                    <el-button @click="exportExcel" style="margin-top: 2px;" size="medium" type="success">导出</el-button>
                </div>
                <el-table :data="sellStatisticses" tooltip-effect="dark" ref="multipleTable" style="width: 100%" id="table" @selection-change="handleSelectionChange">
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
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
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
                    <el-table-column prop="ctime" label="创建时间"></el-table-column>

                </el-table>
                <el-pagination
                        background
                        :page-size="10"
                        @current-change="currentChange"
                        :current-page="currentPage"
                        layout="prev,pager,next"
                        :total="totalCount">
                </el-pagination>
            </el-main>
        </el-card>
        <product-dialog @closeWin="closeProductDialog" :visible="dialogVisible" :title="dialogTitle" @dblclick="dblclick"></product-dialog>
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
                currentPage: 1,
                totalCount: -1,
                sellStatisticses: [],
                multipleSelection: [],
                dialogVisible: false,
                dialogTitle: '',
                searchData: {
                    productId:'',
                    code:'',
                    status: '',
                    customerName: '',
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
            reset() {
                this.searchData = {
                    productId:'',
                        code:'',
                        status: '',
                        customerName: '',
                };
                this.searchDate = [];
            },
            selectProduct() {
                this.dialogVisible = true;
                this.dialogTitle = '选择产品';
            },
            search() {
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
                if (this.searchDate.length > 0) {
                    this.searchData.startDate = this.searchDate[0];
                    this.searchData.endDate = this.searchDate[1];
                }
                this.searchData.page = this.currentPage;
                this.searchData.size = 10;
                this.postNoEnCodeRequest('/erp/sellStatistics/page', this.searchData).then(resp => {
                    if (resp && resp.data) {
                        this.sellStatisticses = resp.data.sellStatisticses;
                        this.totalCount = resp.data.count;
                    }
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