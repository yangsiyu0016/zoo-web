<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddExpressView">
                        添加
                    </el-button>
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-form @submit.native.prevent>
                        <el-input size="mini" placeholder="通过名称、始发地，记得回车呦..."
                                  clearable
                                  style="width: 350px;margin: 0px;padding: 0px;"
                                  prefix-icon="el-icon-search"
                                  :disabled="searchViewVisible"
                                  @keyup.enter.native="searchExpress"
                                  v-model="keywords"
                                  @change="keywordsChange"
                        ></el-input>
                        <el-button @click="searchExpress" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                        <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                                   @click="showSearchView">
                            <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                        </el-button>
                    </el-form>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <transition name="slide-fade">
                    <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-col :span="8">
                                名称：<el-input v-model="express.name" size="mini" style="width: 400px" placeholder="物流名称" ></el-input>
                            </el-col>
                            <el-col :span="8">
                                类型：
                                <el-select size="mini" style="width: 400px" v-model="express.type" clearable>
                                    <el-option label="物流" value="LOGISTICS"></el-option>
                                    <el-option label="快递" value="EXPRESS"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8">
                                始发地：<el-input v-model="express.startAddress" size="mini" style="width: 400px" placeholder="始发地" ></el-input>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20" style="margin-top: 20px">
                            <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                            <el-button @click="searchExpress" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                        </el-row>
                    </div>
                </transition>
            </el-main>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <div>
                    <el-table :data="expresses" size="mini" @selection-change="handleSelectionChange">

                        <el-table-column type="index" width="50px">
                            <template scope="scope">
                                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作" width="150px">
                            <template slot-scope="scope">
                                <el-button @click="showEditExpressView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-edit">编辑</el-button>
                                <el-button @click="deleteExpress(scope.row)" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px" icon="el-icon-close">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="名称" prop="name">
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.name)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.type=='LOGISTICS'">物流</span>
                                <span v-else>快递</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="联系电话" prop="phone"></el-table-column>
                        <el-table-column label="始发地址" prop="startAddress">
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.startAddress)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="description"></el-table-column>
                    </el-table>
                    <div style="display: flex;justify-content: space-between;margin: 2px">

                        <el-pagination
                                background
                                :page-sizes="[10,20,50,100,200]"
                                :page-size="pageSize"
                                :current-page="currentPage"
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="total,sizes,prev,pager,next,jumper"
                                :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
            <logistics-form :isEdit="isEdit" :oldExpress="oldExpress"  @close="onClose" @callback="callback"></logistics-form>
        </el-dialog>
    </div>
</template>

<script>
    import LogisticsForm from "@/views/system/base/LogisticsForm";
    export default {
        name: "Logistics",
        components: {LogisticsForm},
        mounted() {
            this.loadExpresses();
        },
        methods:{
            handleSelectionChange(val) {
                this.deleteIds = '';
               val.forEach((item, i) => {
                   if (i == 0) {
                       this.deleteIds += item.id;
                   }else {
                       this.deleteIds += ',';
                       this.deleteIds += item.id;
                   }
               });
            },
            cancelSearch() {
                this.searchViewVisible = false;
                this.emptyExpressData();
                this.loadExpresses();
            },

            searchExpress() {
                this.loadExpresses();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptyExpressData();
                    this.loadExpresses();
                }
            },
            emptyExpressData() {
                this.express = {
                    name: '',
                    phone: '',
                    startAddress: '',
                    type: ''
                }
            },
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val=='undefined'?'':val;
                }
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadExpresses();
            },
            keywordsChange(val){
                if(val==''){
                    this.loadExpresses();
                }
            },
            sizeChange(size){
                this.pageSize = size;
                this.loadExpresses();
            },
            deleteExpresses(){
                this.$confirm('你确定要删除数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest('/system/express/delete?ids=' + this.deleteIds).then(resp => {
                        if (resp.data && resp.data.status == "200") {
                            this.$message.success('删除成功');
                            this.loadExpresses();
                        }else {
                            this.$message.error(resp.data.msg);
                            this.loadExpresses();
                        }
                    })
                })
            },
            deleteExpress(row){
                this.$confirm('你确定要删除数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest('/system/express/delete?ids=' + row.id).then(resp => {
                        if (resp.data && resp.data.status == "200") {
                            this.$message.success('删除成功');
                            this.loadExpresses();
                        }else {
                            this.$message.error(resp.data.msg);
                            this.loadExpresses();
                        }
                    })
                })
            },
            callback(){
                this.dialogVisible = false;
                this.loadExpresses();
            },
            onClose(){
                this.dialogVisible = false;
            },
            currentChange(currentChange){
                this.currentPage = currentChange;
                this.loadExpresses();
            },
            showEditExpressView(row){
                this.getRequest('/system/express/getExpressById?id='+row.id).then((resp)=>{
                    if(resp&&resp.data){
                        this.isEdit = true;

                        this.oldExpress = resp.data;
                        this.dialogVisible = true;
                    }else{
                        this.$message.error("获取数据失败");
                    }
                })

            },
            showAddExpressView(){
                this.isEdit = false;
                this.dialogVisible = true;
                this.dialogTitle="添加物流信息";
                this.oldExpress = {
                    name:'',
                    phone:'',
                    startAddress:'',
                    type:'LOGISTICS'
                };
            },
            loadExpresses(){
                this.loading = true;
                this.getRequest('/system/express/page?page='+this.currentPage+
                    "&size=" + this.pageSize+
                    "&keywords=" + this.keywords +
                    "&expressName=" + this.express.name +
                    "&expressType=" + this.express.type +
                    "&startAddress=" + this.express.startAddress).then((resp)=>{
                    this.expresses = resp.data.expresses;
                    this.totalCount = resp.data.count;
                    this.loading = false;
                })
            }
        },
        data(){
            return{
                isDelMany: false,
                deleteIds:'',
                pageSize: 10,
                loading:false,
                keywords:'',
                searchViewVisible:false,
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                multipleSelection:[],
                dialogVisible:false,
                dialogTitle:'',
                expresses:[],
                currentPage:1,
                totalCount:-1,
                isEdit:false,   //是否是编辑
                oldExpress:{}, //即将被编辑的物流数据
                express: {
                    name: '',
                    phone: '',
                    startAddress: '',
                    type: ''
                }
            }
        }
    }
</script>

<style scoped>

</style>