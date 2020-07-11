<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div>
                    <el-input clearable prefix-icon="el-icon-search" style="width: 300px;margin: 0px;padding: 0px;" size="mini" placeholder="通过客户名称搜索客户,记得回国呦……"></el-input>
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddCustomerView">添加客户</el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="customers" size="mini" style="width:100%">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="gtime" label="获取时间"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column label="区域">
                        <el-table-column prop="country.name" label="国家"></el-table-column>
                        <el-table-column prop="province.name" label="省份"></el-table-column>
                        <el-table-column prop="city.name" label="城市"></el-table-column>
                        <el-table-column prop="county.name" label="地区"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="owner.realName" label="拥有人"></el-table-column>
                    <el-table-column prop="cuser.realName" label="创建人"></el-table-column>
                    <el-table-column prop="created" label="创建时间"></el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope" >
                            <el-button @click="showEditCustomerView(scope.row)"  type="primary"  size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" @click="deleteCustomer(scope.row)"  size="mini"   style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="80%">
            <customer-form :isEdit="isEdit" :oldCustomer="oldCustomer" @close="closeWin" @editSuccess="editSuccess"></customer-form>
        </el-dialog>
    </div>
</template>

<script>
    import CustomerForm from "@/views/erp/sell/CustomerForm";
    export default {
        name: "Customer",
        components: {CustomerForm},
        mounted(){
            this.loadCustomer();
        },
        data(){
            return{
                keywords:'',
                searchData:{
                    customerName:'',
                    linkman:'',
                    owner:'',
                    gtime:'',
                    created:''
                },
                customers:[],
                currentPage:1,
                totalCount:-1,
                dialogVisible:false,
                dialogTitle:'',
                oldCustomer:{},
                isEdit:false,
                pageSize:10,
                sort:'created',
                order:'desc'
            }
        },
        methods:{
            deleteCustomer(customer){
                this.$message.info("暂时不考虑实现删除")
            },
            editSuccess(){
                this.closeWin();
                this.loadCustomer();
            },
            closeWin(){
                this.dialogVisible = false;
            },
            loadCustomer(){
                let start_gtime='',end_gtime='',start_created='',end_created='';
                if(this.searchData.gtime&&this.searchData.gtime.length>0){
                    start_gtime = this.searchData.gtime[0];
                    end_gtime = this.searchData.gtime[1];
                }
                if(this.searchData.created&&this.searchData.created.length>0){
                    start_created = this.searchData.created[0];
                    end_created = this.searchData.created[1];
                }
                this.getRequest('/crm/customer/page?page='+this.currentPage+"&size="+this.pageSize+
                    "&keywords="+this.keywords+
                    "&customerName="+this.searchData.customerName+
                    "&linkman="+this.searchData.linkman+
                    "&owner="+this.searchData.owner+
                    "&start_gtime="+start_gtime+
                    "&end_gtime="+end_gtime+
                    "&start_created="+start_created+
                    "&end_created="+end_created+"&sort="+this.sort+"&order="+this.order).then((resp)=>{
                    this.customers = resp.data.customers;
                    this.totalCount = resp.data.count;
                })
            },
            showEditCustomerView(customer){
                this.oldCustomer = customer;
                this.dialogTitle="编辑客户";
                this.dialogVisible = true;
                this.isEdit = true;
            },
            showAddCustomerView(){
                this.oldCustomer = {
                    name:'',
                    area:[],
                    gtime:'',
                    owner:{
                        realName:''
                    },
                    linkmans:[],
                    receivings:[]
                };
                this.isEdit = false;
                this.dialogTitle="新增客户";
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>