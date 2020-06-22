<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="display: inline">
                    <el-input size="mini" placeholder="通过单号、产品编码、产品名称搜索，记得回车呦..."
                              clearable
                              style="width: 300px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              :disabled="searchViewVisible"
                              @keyup.enter.native="searchProductAssembled"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="searchProductAssembled" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
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
                                <el-col :span="8">
                                    组装单编号：<el-input v-model="productAssembled.code" size="mini" style="width: 400px" placeholder="组装单编号" ></el-input>
                                </el-col>
                                <el-col :span="8">
                                    产品编号：<el-input v-model="productAssembled.productCode" size="mini" style="width: 400px" placeholder="产品编号" ></el-input>
                                </el-col>
                                <el-col :span="8">
                                    产品名称：<el-input v-model="productAssembled.productName" size="mini" style="width: 400px" placeholder="产品名称" ></el-input>
                                </el-col>


                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-col :span="8">
                                    组装仓库：
                                    <el-select clearable  size="mini" v-model="productAssembled.warehouseId" style="width: 400px">
                                        <el-option v-for="(item,i) in warehouses" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    组装日期：
                                    <el-date-picker
                                        v-model="productAssembled.assembledTime"
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
                                            v-model="productAssembled.ctime"
                                            size="mini"
                                            type="datetimerange"
                                            align="right"
                                            unlink-panels
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-col :span="8">
                                    订单状态:
                                    <el-select size="mini" style="width: 400px" v-model="productAssembled.status" clearable>
                                        <el-option label="未提交" value="WTJ"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px">
                                <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                                <el-button @click="searchProductAssembled" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                            </el-row>
                        </div>
                    </transition>
                    <el-table @sort-change="sortChange" v-loading="loading" size="mini" :data="productAssembleds"  @row-dblclick="dblclick">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="组装单编号"  width="200px" >
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.code)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="组装仓库" prop="warehouse.name"></el-table-column>
                        <el-table-column label="组装日期" prop="assembledTime" sortable="custom" width="150px"></el-table-column>
                        <el-table-column label="产品编号" width="150px">
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.product.code)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product.imageUrl" label="图片">
                            <template slot-scope="scope">
                                <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品名称" >
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.product.name)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="组装数量" prop="number"></el-table-column>
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
                        <el-table-column label="操作人" prop="cuser.realName"></el-table-column>
                        <el-table-column label="创建日期" prop="ctime" sortable="custom"  width="200px" ></el-table-column>
                        <el-table-column label="完成日期" prop="etime" width="200px" ></el-table-column>
                        <el-table-column label="备注" prop="description" :show-tooltip-when-overflow="true"></el-table-column>
                        <el-table-column width="200px"
                                         label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showDetails(scope.row)" size="mini" type="warning" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                                <el-button v-show="scope.row.status=='WTJ'" @click="startFlow(scope.row)" size="mini" type="success" style="padding: 3px 4px 3px 4px;margin: 2px">启动流程</el-button>
                                <el-button v-show="scope.row.status=='WTJ'"  type="primary" @click="showEditView(scope.row)" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                                <el-button v-show="scope.row.status=='WTJ'||scope.row.status=='DESTROY'" @click="deleteProductAssembled(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
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
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="77%">
            <product-assembled-form @close="closeDialog" @callback="callback" :isEdit="isEdit" :oldProductAssembled="oldProductAssembled"></product-assembled-form>
        </el-dialog>
        <el-dialog :title="detailsDialogTitle" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" width="77%">
            <product-assembled-details @close="closeDetailDialog" :productAssembled="oldProductAssembled"></product-assembled-details>
        </el-dialog>
    </div>
</template>

<script>
    import ProductAssembledForm from "@/views/erp/stock/productassembled/ProductAssembledForm";
    import ProductAssembledDetails from "@/views/erp/stock/productassembled/ProductAssembledDetails";
    export default {
        name: "List",
        components: {ProductAssembledDetails, ProductAssembledForm},
        data() {
            return {
                searchViewVisible:false,
                productAssembleds:[],
                loading:false,
                currentPage: 1,
                totalCount: -1,
                pageSize:10,
                sort:'ctime',
                order:'desc',
                dialogVisible:false,
                dialogTitle:'',
                isEdit:false,
                oldProductAssembled:{},
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                detailsDialogVisible:false,
                detailsDialogTitle:"",
                isReception:false,
                keywords:'',
                productAssembled:{
                    code:'',
                    assembledTime:'',
                    ctime:'',
                    productCode:'',
                    productName:'',
                    warehouseId:'',
                    status:''
                },
                warehouses:[],
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
        },
        mounted(){
            this.loadWarehouse();
            this.loadData();
        },
        methods: {
            searchProductAssembled(){
                this.loadData();
            },
            keywordsChange(val){
                if(val==''){
                    this.loadData();
                }
            },
            //显示订单详情
            showDetails(row){
                this.dblclick(row);
            },
            deleteProductAssembled(row){
                this.$confirm("确定要删除吗？删除后不可恢复！","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/erp/assembled/'+row.id).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("删除成功");
                            this.loadData();
                        }else {
                            this.$message.error("删除失败");
                        }
                    })
                })
            },
            callback(){
                this.closeDialog();
                this.loadData();
            },
            closeDetailDialog(){
                this.detailsDialogVisible = false;
            },
            closeDialog(){
                this.dialogVisible = false;
            },
            loadData(){
                this.loading = true;
                let start_assembledTime ='',
                    end_assembledTime='',
                    start_ctime='',
                    end_ctime='';
                if(this.productAssembled&&this.productAssembled.assembledTime.length>0){
                    start_assembledTime = this.productAssembled.assembledTime[0];
                    end_assembledTime=this.productAssembled.assembledTime[1];
                }
                if(this.productAssembled&&this.productAssembled.ctime.length>0){
                    start_ctime = this.productAssembled.ctime[0];
                    end_ctime = this.productAssembled.ctime[1];
                }
                this.getRequest('/erp/assembled/page?page='+this.currentPage+
                    "&size="+this.pageSize+
                    "&keywords="+this.keywords+
                    "&code="+this.productAssembled.code+
                    "&productCode="+this.productAssembled.productCode+
                    "&productName="+this.productAssembled.productName+
                    "&warehouseId="+this.productAssembled.warehouseId+
                    "&status="+this.productAssembled.status+
                    "&start_assembledTime="+start_assembledTime+
                    "&end_assembledTime="+end_assembledTime+
                    "&start_ctime="+start_ctime+
                    "&end_ctime="+end_ctime+
                    "&sort="+this.sort+
                    "&order="+this.order).then(resp=>{
                    this.productAssembleds = resp.data.productAssembleds;
                    this.totalCount = resp.data.count;
                    this.loading = false;
                });
            },
            showEditView(row){
                this.isEdit = true;
                this.oldProductAssembled = row;
                this.dialogVisible = true;
                this.dialogTitle="编辑组装单"
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
                this.emptyProductAssembledData();
                this.loadData();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptyProductAssembledData();
                    this.loadData();
                }
            },
            emptyProductAssembledData(){
                this.productAssembled={
                    code:'',
                    assembledTime:'',
                    ctime:'',
                    productCode:'',
                    productName:'',
                    warehouseId:'',
                    status:''
                }
            },
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.loadData();
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadData();
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadData();
            },
            //列表双击事件
            dblclick(row){
                this.getRequest('/erp/assembled/'+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.oldProductAssembled = resp.data;
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
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            loadWarehouse() {
                this.getRequest('/erp/warehouse/all').then(resp=> {
                    if (resp &&resp.data) {
                        this.warehouses = resp.data;
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>