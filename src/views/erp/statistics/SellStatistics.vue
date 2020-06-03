<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div class="export">
                    <el-button @click="exportExcel" style="margin-top: 2px;" size="medium" type="success">导出</el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
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
                    <el-table-column prop="name" label="产品类型"></el-table-column>
                    <el-table-column prop="productName" label="产品名称"></el-table-column>
                    <el-table-column prop="genericSpec" label="通用参数"></el-table-column>
                    <el-table-column prop="ownSpec" label="特殊参数"></el-table-column>
                    <el-table-column prop="number" label="销售数量"></el-table-column>
                    <el-table-column prop="notOutNumber" label="未出货数量"></el-table-column>
                    <el-table-column prop="price" label="销售单价"></el-table-column>
                    <el-table-column prop="code" label="单号"></el-table-column>
                    <el-table-column prop="initDate" label="下单日期"></el-table-column>
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

        </el-container>
    </div>
</template>

<script>

    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

    export default {
        name: "SellStatistics",
        components: {FileSaver, XLSX},
        data() {
            return {
                currentPage: 1,
                totalCount: -1,
                sellStatisticses: [],
                multipleSelection: []
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            currentChange(page) {
                this.currentPage = page;
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
                this.getRequest('/erp/sellStatistics/page?page=' + this.currentPage + "&size=10").then(resp => {
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