<template>
    <div>
        <el-dialog width="77%" :title="title"  :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" :show-on-press-escape="false" :show-close="false">
            <div>
                <el-input size="mini" class="input-with-select" placeholder="输入产品名称" v-model="search.key">
                    <el-button slot="append"  icon="el-icon-search" @click="searchProduct"></el-button>
                </el-input>
            </div>
            <el-table :data="skus" size="mini" @row-dblclick="dblclick">
                <el-table-column type="index" width="30"></el-table-column>
                <el-table-column prop="code" align="left"  label="产品编号" width="200"  ></el-table-column>
                <el-table-column prop="product.name" align="left"  label="产品名称"  ></el-table-column>
                <el-table-column prop="product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                <el-table-column prop="ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>
                <el-table-column prop="product.typeName" align="left" width="100" label="分类"></el-table-column>
                <el-table-column prop="product.productBrand.name" align="left"  label="品牌" ></el-table-column>

                <el-table-column prop="product.productDetail.packageList" align="left" label="包装清单"></el-table-column>
                <el-table-column prop="product.productDetail.afterService" align="left" label="售后服务"></el-table-column>
                <el-table-column prop="product.productDetail.description" align="left" width="500" label="描述"></el-table-column>
            </el-table>
            <el-divider></el-divider>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="info" @click="closeWin" >关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ProductDialog",
        props:{
            title:{
                type:String,
                default:'产品列表'
            },
            visible:{
                type: Boolean,
                default: false
            }
        },
        methods:{
            dblclick(row){
                this.$emit("dblclick",row);
            },
            searchProduct(){
                this.getRequest('/sku/page?page='+this.currentPage+"&size=10&key="+this.search.key).then((resp)=>{
                    this.skus = resp.data.skus;
                    this.totalCount = resp.data.count;
                })
            },
            closeWin(){
                this.$emit("closeWin");
            }
        },
        data(){
            return{
                search:{
                    key:''
                },
                skus:[],
                currentPage:1,
                totalCount:-1
            }
        }
    }
</script>

<style scoped>

</style>