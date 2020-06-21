<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="display: inline">
                    <el-input size="mini" placeholder="通过产品名称搜索，记得回车呦..." clearable style="width: 300px;margin: 0px;padding: 0px;" prefix-icon="el-icon-search"></el-input>
                    <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                               @click="showSearchView">
                        <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                    </el-button>

                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddView">添加</el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <transition name="slide-fade">
                    <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="6">
                                拆分单编号：<el-input size="mini" style="width: 200px" placeholder="拆分单编号" ></el-input>
                            </el-col>
                            <el-col :span="6">
                                产品编号：<el-input size="mini" style="width: 200px" placeholder="产品编号" ></el-input>
                            </el-col>
                            <el-col :span="6">
                                产品名称：<el-input size="mini" style="width: 200px" placeholder="产品名称" ></el-input>
                            </el-col>
                            <el-col :span="6">
                                拆分仓库：<el-input size="mini" style="width: 200px" placeholder="拆分仓库" ></el-input>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="6">
                                拆分日期：<el-input size="mini" style="width: 200px" placeholder="拆分日期" ></el-input>
                            </el-col>
                            <el-col :span="6">
                                创建日期：<el-input size="mini" style="width: 200px" placeholder="创建日期" ></el-input>
                            </el-col>
                            <el-col :span="5">
                                <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                                <el-button icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </transition>
                <el-table :data="productSplits" tooltip-effect="dark" ref="multipleTable" style="width: 100%" id="table" >
                    <el-table-column
                            type="selection"
                            width="35">
                    </el-table-column>
                    <el-table-column type="index" width="5px">
                        <template slot-scope="scope" >
                            <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="拆分单编号"></el-table-column>
                    <el-table-column prop="" label="拆分仓库"></el-table-column>
                    <el-table-column prop="" label="拆分日期"></el-table-column>
                    <el-table-column prop="" label="商品编号"></el-table-column>
                    <el-table-column prop="" label="商品名称"></el-table-column>
                    <el-table-column prop="" label="商品类型"></el-table-column>
                    <el-table-column prop="" label="拆分数量"></el-table-column>
                    <el-table-column prop="" label="批号"></el-table-column>
                    <el-table-column prop="" label="拆分人"></el-table-column>
                    <el-table-column prop="" label="创建时间"></el-table-column>
                    <el-table-column prop="" label="结束时间"></el-table-column>
                    <el-table-column prop="" label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status=='WTJ'" type="info" size="mini" effect="dark">未提交</el-tag>
                            <el-tag v-if="scope.row.status=='DESTROY'"  type="info" size="mini" effect="dark">已作废</el-tag>
                            <el-tag v-if="scope.row.status=='FINISHED'"  type="success" size="mini" effect="dark">订单完成</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="备注" :show-tooltip-when-overflow="true"></el-table-column>
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
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" :append-to-body="true" width="77%">
            <product-split-form   @close="closeDialog" :isEdit="isEdit" @callback="callback" :oldProductSplit="oldProductSplit"></product-split-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductSplitForm from "./ProductSplitForm";
    export default {
        name: "List",
        components: {ProductSplitForm},
        data() {
            return {
                isEdit:false,
                oldProductSplit:{

                },
                searchViewVisible:false,
                dialogVisible:false,
                dialogTitle: '',
                productSplits: [],
                currentPage: 1,
                totalCount: -1,
                searchDate:[],
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
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
            cancelSearch(){
                this.searchViewVisible = false;
            },
            showSearchView() {
                this.searchViewVisible = !this.searchViewVisible;
            },
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
                    splitMaterials:[],
                    codeGeneratorType:"AUTO",
                    number:1
                };
                this.dialogVisible = true;
                this.dialogTitle = "添加拆分单";
            }
        }
    }
</script>

<style scoped>

</style>