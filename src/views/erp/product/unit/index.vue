<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddUnitView">
                        添加单位
                    </el-button>
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过单位名称搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              @keyup.enter.native="loadUnits"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="loadUnits" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table
                        :data="units"
                        size="mini"
                        style="width:100%" @row-dblclick="rowDblclick">
                    <el-table-column
                        type="selection"
                        align="left"
                        width="50">
                    </el-table-column>
                    <el-table-column prop="name" align="left" label="名称">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.name)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showEditUnitView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" @click="deleteUnit(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
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
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="77%">
            <unit-from :is-edit="isEdit" :oldUnit="oldUnit" @close="closeDetailDialog" @callback="callbackForm"></unit-from>
        </el-dialog>
    </div>
</template>

<script>
    import UnitFrom from "./UnitFrom";
    export default {
        name: "index",
        components: {UnitFrom},
        data() {
            return {
                dialogVisible: false,
                dialogTitle: '',
                units: [],
                isEdit: false,
                oldUnit: {
                    name:''
                },
                keywords:'',
                pageSize: 10,
                currentPage: 1,
                totalCount: -1
            }
        },
        mounted() {
            this.loadUnits();
        },
        methods: {
            showData(val) {
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            closeDetailDialog() {
                this.loadUnits();
                this.dialogVisible = false;
            },
            callbackForm() {
                this.closeDetailDialog();
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadUnits();
            },
            sizeChange(size) {
                this.pageSize = size;
                this.loadUnits();
            },
            showAddUnitView() {
                this.oldUnit = {
                    name: ''
                };
                this.dialogVisible = true;
                this.dialogTitle = '添加产品单位'
            },
            showEditUnitView(row) {
                this.isEdit = true;
                this.getRequest('/product/unit/getUnitById?id=' + row.id).then(resp => {
                    if (resp.status == 200 && resp.data) {
                        this.oldUnit = resp.data;
                    }
                });
                this.dialogVisible = true;
                this.dialogTitle = '编辑产品单位'
            },
            deleteUnit(row) {
                this.$confirm('确定删除数据吗，删除后不可恢复？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText:'取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest('/product/unit/delete?ids=' + row.id).then(resp => {
                        if (resp.data && resp.data.status == "200") {
                            this.$message.success('删除成功');
                            this.loadUnits();
                        }else {
                            this.$message.error(resp.data.msg);
                        }
                    })
                })
            },
            loadUnits() {
                this.getRequest("/product/unit/page?page=" + this.currentPage + '&size=' + this.pageSize + '&keywords=' + this.keywords).then(resp => {
                    if (resp.data && resp.data.status == "200") {
                        this.units = resp.data.units;
                        this.totalCount = resp.data.count;
                    }else {
                        this.$message.error(resp.data.msg);
                    }
                })
            },
            keywordsChange(val){
                if(val==''){
                    this.loadUnits();
                }
            },
            rowDblclick(row){
                this.showDetails(row);
            }
        }
    }
</script>

<style scoped>

</style>