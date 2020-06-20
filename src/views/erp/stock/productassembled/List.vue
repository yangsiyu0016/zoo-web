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
                <div>
                    <transition name="slide-fade">
                        <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-col :span="6">
                                    组装单编号：<el-input size="mini" style="width: 200px" placeholder="组装单编号" ></el-input>
                                </el-col>
                                <el-col :span="6">
                                    产品编号：<el-input size="mini" style="width: 200px" placeholder="产品编号" ></el-input>
                                </el-col>
                                <el-col :span="6">
                                    产品名称：<el-input size="mini" style="width: 200px" placeholder="产品名称" ></el-input>
                                </el-col>
                                <el-col :span="6">
                                    组装仓库：<el-input size="mini" style="width: 200px" placeholder="组装仓库" ></el-input>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-col :span="6">
                                    组装日期：<el-input size="mini" style="width: 200px" placeholder="组装日期" ></el-input>
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
                    <el-table>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="组装单编号"></el-table-column>
                        <el-table-column label="组装仓库"></el-table-column>
                        <el-table-column label="组装日期"></el-table-column>
                        <el-table-column label="产品编号"></el-table-column>
                        <el-table-column label="产品图片"></el-table-column>
                        <el-table-column label="产品名称"></el-table-column>
                        <el-table-column label="组装数量"></el-table-column>
                        <el-table-column label="操作人"></el-table-column>
                        <el-table-column label="创建日期"></el-table-column>
                        <el-table-column label="完成日期"></el-table-column>
                        <el-table-column label="备注" :show-tooltip-when-overflow="true"></el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: space-between;margin: 2px">
                        <el-pagination
                                background
                                :page-size="10"
                                @current-change="currentChange"
                                :current-page="currentPage"
                                layout="prev,pager,next"
                                :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="77%">
            <product-assembled-form @close="closeDialog" :isEdit="isEdit" :oldProductAssembled="oldProductAssembled"></product-assembled-form>
        </el-dialog>
    </div>
</template>

<script>
    import ProductAssembledForm from "@/views/erp/stock/productassembled/ProductAssembledForm";
    export default {
        name: "List",
        components: {ProductAssembledForm},
        data() {
            return {
                searchViewVisible:false,
                currentPage: 1,
                totalCount: -1,
                dialogVisible:false,
                dialogTitle:'',
                isEdit:false,
                oldProductAssembled:{},
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
            }
        },
        methods: {
            closeDialog(){
                this.dialogVisible = false;
            },
            showAddView(){
                this.isEdit = false;
                this.oldProductAssembled={
                    assembledTime:'',
                    product: {
                        code: ''
                    },
                    warehouse:{
                        name:''
                    },
                    assembledMaterials:[],
                    codeGeneratorType:"AUTO",
                    number:1
                };
                this.dialogVisible = true;
                this.dialogTitle="添加组装单"
            },
            cancelSearch(){
                this.searchViewVisible = false;
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
            },
            currentChange() {

            }
        }
    }
</script>

<style scoped>

</style>