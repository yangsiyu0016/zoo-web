<template>
    <div>
        <el-dialog width="77%" :title="title"  :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" :show-on-press-escape="false" :show-close="false">
            <div>
                <el-input class="input-with-select" v-model="search.key">
                    <el-button slot="append" icon="el-icon-search" @click="searchCustomer"></el-button>
                </el-input>
            </div>
            <el-table
                    :data="customers"
                    border
                    size="mini"
                    style="width:100%" @row-dblclick="dblclick">
                <el-table-column type="index" width="30"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="areaPath" label="区域"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="owner.realName" label="拥有人"></el-table-column>
            </el-table>
            <div style="display: flex;justify-content: space-between;margin: 2px">
                <el-pagination
                        background
                        :page-size="10"
                        :current-page="currentPage"
                        layout="prev,pager,next"
                        :total="totalCount">
                </el-pagination>
            </div>
            <el-divider></el-divider>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="info" @click="closeWin">关闭</el-button>
            </div>
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
        methods:{
            dblclick(row){
                this.$emit("callback",row);
            },
            //搜索
            searchCustomer(){
                this.getRequest('/crm/customer/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    this.customers=resp.data.customers;
                    this.totalCount = resp.data.count;
                })
            },
            //关闭
            closeWin(){
                this.$emit("closeWin");
            }
        },
        data(){
            return{
                customers:[],
                currentPage:1,
                totalCount:-1,
                search:{
                    key:''
                }
            }
        }
    }
</script>

<style scoped>

</style>