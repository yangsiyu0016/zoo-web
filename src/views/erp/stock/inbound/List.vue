<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div>
                    <el-input clearable prefix-icon="el-icon-search" style="width: 300px;margin: 0px;padding: 0px;" size="mini" placeholder="通过供应商名称搜索客户,记得回国呦……"></el-input>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="inbounds" size="mini" style="width:100%">
                    <el-table-column type="index"  width="50">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="入库单号"></el-table-column>
                    <el-table-column prop="name" label="供应商名称"></el-table-column>
                    <el-table-column prop="ctime" label="入库时间"></el-table-column>
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
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return{
                inbounds: [],
                currentPage: 1,
                totalCount: -1,
            }
        },
        mounted() {
            this.loadInbounds();
        },
        methods: {
            currentChange(page) {
                this.currentPage = page;
                this.loadInbounds();
            },
            loadInbounds() {
                this.getRequest('/erp/inbound/page?page=' + this.currentPage + '&size=10').then(resp => {
                    if (resp.data.status == '200') {
                        this.inbounds = resp.data.inbounds;
                        this.totalCount = resp.data.count;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>