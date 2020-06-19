<template>
    <div>
        <el-form>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">查询条件</span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8" >
                        <el-form-item prop=""  label="组装日期:">
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
            </el-card>
        </el-form>
        <el-card>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div class="export" style="float: left">
                    <el-button @click="showAddProductComposeViews" style="margin-top: 2px;" size="medium" type="success">添加</el-button>
                </div>
                <el-table :data="productComposes" tooltip-effect="dark" ref="multipleTable" style="width: 100%" id="table" >
                    <el-table-column
                            type="selection"
                            width="35">
                    </el-table-column>
                    <el-table-column type="index" width="5px">
                        <template slot-scope="scope" >
                            <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="组装单编号"></el-table-column>
                    <el-table-column prop="" label="组装仓库"></el-table-column>
                    <el-table-column prop="" label="组装日期"></el-table-column>
                    <el-table-column prop="" label="商品编号"></el-table-column>
                    <el-table-column prop="" label="商品名称"></el-table-column>
                    <el-table-column prop="" label="商品类型"></el-table-column>
                    <el-table-column prop="" label="组装后数量"></el-table-column>
                    <el-table-column prop="" label="批号"></el-table-column>
                    <el-table-column prop="" label="组装人"></el-table-column>
                    <el-table-column prop="" label="创建时间"></el-table-column>
                    <el-table-column prop="" label="结束时间"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-if="scope.row.status=='DESTROY'"  type="info" size="mini" effect="dark">已作废</el-tag>
                            <el-tag v-if="scope.row.status=='FINISHED'"  type="success" size="mini" effect="dark">订单完成</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="备注"></el-table-column>
                    <el-table-column prop="" label="总金额"></el-table-column>
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
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-compose-form   @close="closeDialog" @callback="callback"></product-compose-form>
        </el-dialog>
    </div>
</template>

<script>

    import ProductComposeForm from "@/views/erp/stock/productcompose/ProductComposeForm"

    export default {
        name: "List",
        components: {ProductComposeForm},
        data() {
            return {
                dialogVisible:false,
                dialogTitle: '',
                productComposes: [],
                currentPage: 1,
                totalCount: -1,
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
                }
            }
        },
        methods: {
            callback() {
                this.dialogVisible = false;
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            search() {

            },
            currentChange() {

            },
            showAddProductComposeViews() {
                this.dialogVisible = true;
                this.dialogTitle = "添加商品组装";
            }
        }
    }
</script>

<style scoped>

</style>