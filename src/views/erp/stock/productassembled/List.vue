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
                                    组装日期：<el-input size="mini" style="width: 200px" placeholder="组装日期"></el-input>
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
                    <el-table size="mini" :data="productAssembleds"  @row-dblclick="dblclick">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="组装单编号" prop="code" width="200px" ></el-table-column>
                        <el-table-column label="组装仓库" prop="warehouse.name"></el-table-column>
                        <el-table-column label="组装日期" prop="assembledTime"></el-table-column>
                        <el-table-column label="产品编号" prop="product.code"></el-table-column>
                        <el-table-column prop="product.imageUrl" label="图片">
                            <template slot-scope="scope">
                                <el-image v-if="scope.row.product.imageUrl" :src="scope.row.product.imageUrl" :preview-src-list="[scope.row.product.imageUrl]"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品名称" prop="product.name"></el-table-column>
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
                        <el-table-column label="创建日期" prop="ctime"  width="200px" ></el-table-column>
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
                currentPage: 1,
                totalCount: -1,
                dialogVisible:false,
                dialogTitle:'',
                isEdit:false,
                oldProductAssembled:{},
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                detailsDialogVisible:false,
                detailsDialogTitle:"",
                isReception:false
            }
        },
        mounted(){
            this.loadData();
        },
        methods: {
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
                this.getRequest('/erp/assembled/page?page='+this.currentPage+"&size=10").then(resp=>{
                    this.productAssembleds = resp.data.productAssembleds;
                    this.totalCount = resp.data.count;
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
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
            },
            currentChange() {

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
        }
    }
</script>

<style scoped>

</style>