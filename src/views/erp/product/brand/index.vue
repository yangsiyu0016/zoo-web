<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddBrandView">
                        添加品牌
                    </el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table
                        :data="brands"
                        size="mini"
                        style="width:100%">
                    <el-table-column
                            type="selection"
                            align="left"
                            width="30">
                    </el-table-column>
                    <el-table-column prop="name" align="left"  label="名称" ></el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showEditBrandView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
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
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" >
            <brand-from @callback="callback" :oldBrand="oldBrand" @close="closeWin" :isEdit="isEdit"></brand-from>
        </el-dialog>
    </div>
</template>

<script>
    import BrandFrom from "@/views/erp/product/brand/BrandFrom";
    export default {
        name: "index",
        components: {BrandFrom},
        mounted(){
            this.loadBrands();
        },
        methods:{
            callback(){
                this.loadBrands();
                this.dialogVisible = false;
            },
            closeWin(){
                this.dialogVisible = false;
            },
            showEditBrandView(brand){
                this.oldBrand = brand;
                this.isEdit = true;
                this.dialogTitle="编辑品牌";
                this.dialogVisible = true;
            },
            showAddBrandView(){
                this.isEdit = false;
                this.oldBrand={
                    name:'',
                    typeIds:[]
                }
                this.dialogTitle="添加品牌";
                this.dialogVisible = true;
            },
            loadBrands(){
                this.getRequest('/product/brand/page?page='+this.currentPage+"&size=10").then((resp)=>{
                    if(resp&&resp.status==200){
                        let data = resp.data;
                        this.brands = data.brands;
                        this.totalCount = data.count;
                    }
                })
            }
        },
        data(){
            return{
                dialogTitle:'',
                dialogVisible:false,
                brands:[],
                totalCount:-1,
                currentPage:1,
                isEdit:false,
                oldBrand:{}
            }
        }
    }
</script>

<style scoped>

</style>