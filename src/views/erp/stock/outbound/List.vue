<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div>
                    <el-input clearable prefix-icon="el-icon-search" style="width: 300px;margin: 0px;padding: 0px;" size="mini" placeholder="通过供应商名称搜索客户,记得回国呦……"></el-input>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table v-loading="loading" :data="outbounds" size="mini" style="width:100%">
                    <el-table-column type="index"  width="50">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * 10 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="来自">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.type=='CF'" size="mini" type="warning" effect="dark">拆分单</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="出库单号"></el-table-column>
                    <el-table-column prop="warehouse.name" label="仓库"></el-table-column>
                    <el-table-column prop="name" label="客户名称"></el-table-column>
                    <el-table-column prop="ctime" label="出库时间"></el-table-column>
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
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return{
                loading:false,
                outbounds: [],
                currentPage: 1,
                totalCount: -1,
                pageSize:10,
                sort:'ctime',
                order:'desc',
                keywords:'',
                searchData:{
                    code:'',
                    productCode:'',
                    productName:'',
                    type:'',
                    warehouseId:'',
                    ctime:''
                }
            }
        },
        mounted() {
            this.loadOutbounds();
        },
        methods: {
            sizeChange(size){
                this.size = size;
                this.loadOutbounds();
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadOutbounds();
            },
            loadOutbounds() {
                this.loading = true;
                let start_ctime='',end_ctime='';
                if(this.searchData.ctime&&this.searchData.ctime.length>0){
                    start_ctime = this.searchData.ctime[0];
                    end_ctime = this.searchData.ctime[1];
                }
                this.getRequest('/erp/outbound/page?page=' + this.currentPage +
                    '&size='+this.pageSize+
                    "&sort="+this.sort+
                    "&order="+this.order+
                    "&keywords="+this.keywords+
                    "&code="+this.searchData.code+
                    "&productCode="+this.searchData.productCode+
                    "&productName="+this.searchData.productName+
                    "&type="+this.searchData.type+
                    "&warehouseId="+this.searchData.warehouseId+"&start_ctime="+start_ctime+"&end_ctime="+end_ctime).then(resp => {
                    if (resp.data.status == '200') {
                        this.outbounds = resp.data.outbounds;
                        this.totalCount = resp.data.count;
                        this.loading = false;
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>