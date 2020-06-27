<template>
    <div>
        <el-dialog width="77%" :title="title"  :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" :show-on-press-escape="false" :show-close="false">
            <el-container>
                <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                    <div></div>
                    <div style="margin-left: 5px;margin-right: 20px;display: inline">
                        <el-input size="mini" placeholder="通过客户名称、联系人搜索，记得回车呦..."
                                  clearable
                                  style="width: 350px;margin: 0px;padding: 0px;"
                                  prefix-icon="el-icon-search"
                                  :disabled="searchViewVisible"
                                  @keyup.enter.native="searchCustomer"
                                  v-model="keywords"
                                  @change="keywordsChange"
                        ></el-input>
                        <el-button :disabled="searchViewVisible" @click="searchCustomer" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                        <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                                   @click="showSearchView">
                            <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[searchViewVisible ? faangledoubleup:faangledoubledown]"></i>高级搜索
                        </el-button>
                    </div>
                </el-header>
                <el-main style="padding-left: 0px;padding-top: 0px">
                    <transition name="slide-fade">
                        <div v-show="searchViewVisible" style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
                            <el-row :gutter="20" style="margin-top: 20px;margin-left: 40px">
                                <el-col :span="8" >
                                    客户名称：<el-input v-model="searchData.customerName" size="mini" style="width: 400px" placeholder="客户名称" ></el-input>
                                </el-col>
                                <el-col :span="8">
                                    联系人：<el-input v-model="searchData.linkman" size="mini" style="width: 400px" placeholder="联系人" ></el-input>
                                </el-col>
                                <el-col :span="8">
                                    拥有人：
                                    <el-select v-model="searchData.owner" size="mini" style="width: 400px" placeholder="选择拥有人">
                                        <el-option v-for="item in users" :label="item.realName" :value="item.id">

                                        </el-option>
                                    </el-select>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px;margin-left: 40px">
                                <el-col :span="8" >
                                    下单日期：
                                    <el-date-picker
                                            v-model="searchData.gtime"
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
                                            v-model="searchData.created"
                                            size="mini"
                                            type="datetimerange"
                                            align="right"
                                            unlink-panels
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20" style="margin-top: 20px;text-align: center">
                                <el-button icon="el-icon-zoom-out" size="mini" @click="cancelSearch">取消</el-button>
                                <el-button @click="searchCustomer" icon="el-icon-search" type="primary" size="mini" >搜索</el-button>
                            </el-row>
                        </div>
                    </transition>
                    <el-table
                            @sort-change="sortChange"
                            :data="customers"
                            border
                            size="mini"
                            style="width:100%" @row-dblclick="dblclick">
                        <el-table-column type="index" width="80">
                            <template scope="scope">
                                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称">
                            <template slot-scope="scope">
                                <span v-html="showData(scope.row.name)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gtime" label="获取时间" sortable></el-table-column>
                        <el-table-column prop="areaPath" label="区域"></el-table-column>
                        <el-table-column prop="address" label="地址"></el-table-column>
                        <el-table-column prop="owner.realName" label="拥有人"></el-table-column>
                        <el-table-column prop="created" label="创建时间" sortable></el-table-column>
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
                <el-footer>
                    <div style="text-align: center">
                        <el-button size="mini" type="info" @click="closeWin">关闭</el-button>
                    </div>
                </el-footer>
            </el-container>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "CustomerDialog",
        props:{
            title:{
                type:String,
                default:'客户列表'
            },
            visible:{
                type:Boolean,
                default: false
            }
        },
        mounted(){
            this.searchCustomer();
            this.loadUser();
        },
        methods:{
            cancelSearch(){
                this.searchViewVisible = false;
                this.emptySearchData();
                this.searchCustomer();
            },
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.searchCustomer();
            },
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            sizeChange(size){
                this.pageSize = size;
                this.searchCustomer();
            },
            currentChange(page) {
                this.currentPage = page;
                this.searchCustomer();
            },
            showSearchView(){
                this.searchViewVisible = !this.searchViewVisible;
                this.keywords = '';
                if(!this.searchViewVisible){
                    this.emptySearchData();
                    this.searchCustomer();
                }
            },
            emptySearchData(){
              this.searchData={
                  customerName:'',
                  linkman:'',
                  owner:'',
                  gtime:'',
                  created:''
              }
            },
            keywordsChange(val){
                if(val==''){
                    this.searchCustomer();
                }
            },
            dblclick(row){
                this.$emit("callback",row);
            },
            //搜索
            searchCustomer(){
                this.loading = true;
                let start_gtime='',end_gtime='',start_created='',end_created='';
                if(this.searchData.gtime&&this.searchData.gtime.length>0){
                    start_gtime = this.searchData.gtime[0];
                    end_gtime = this.searchData.gtime[1];
                }
                if(this.searchData.created&&this.searchData.created.length>0){
                    start_created = this.searchData.created[0];
                    end_created = this.searchData.created[1];
                }
                this.getRequest('/crm/customer/page?page='+this.currentPage+
                    "&size="+this.pageSize+
                    "&keywords="+this.keywords+
                    "&customerName="+this.searchData.customerName+
                    "&linkman="+this.searchData.linkman+
                    "&owner="+this.searchData.owner+
                    "&start_gtime="+start_gtime+
                    "&end_gtime="+end_gtime+
                    "&start_created="+start_created+
                    "&end_created="+end_created+"&sort="+this.sort+"&order="+this.order).then((resp)=>{
                    this.customers=resp.data.customers;
                    this.totalCount = resp.data.count;
                    this.loading = false;
                })
            },
            //关闭
            closeWin(){
                this.$emit("closeWin");
            },
            loadUser(){
                this.getRequest('/user/all').then((resp)=>{
                    this.users = resp.data;
                })
            },
        },
        data(){
            return{
                users:[],
                faangledoubleup: 'fa-angle-double-up',
                faangledoubledown: 'fa-angle-double-down',
                loading:false,
                keywords:'',
                searchViewVisible:false,
                customers:[],
                currentPage:1,
                totalCount:-1,
                pageSize:10,
                sort:'created',
                order:'desc',
                searchData:{
                    customerName:'',
                    linkman:'',
                    owner:'',
                    gtime:'',
                    created:''
                },
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
        }
    }
</script>

<style scoped>

</style>