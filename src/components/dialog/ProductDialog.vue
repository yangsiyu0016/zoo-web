<template>
    <div>
        <el-dialog width="77%" :title="title"  :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" :show-on-press-escape="false" :show-close="false">
            <div>
                <el-input size="mini" class="input-with-select" placeholder="输入产品名称" v-model="search.key">
                    <el-button slot="append"  icon="el-icon-search" @click="searchProduct"></el-button>
                </el-input>
            </div>
            <el-table :data="products" size="mini" @row-dblclick="dblclick">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="imageUrl" label="图片">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="code" align="left"  label="产品编号" width="200"  ></el-table-column>
                <el-table-column prop="name" align="left"  label="产品名称"  ></el-table-column>
                <el-table-column prop="typeName" align="left" width="100" label="分类"></el-table-column>
                <el-table-column prop="productBrand.name" align="left"  label="品牌" ></el-table-column>

                <el-table-column prop="spec" align="left" label="规格"></el-table-column>
                <el-table-column prop="unit.name" align="left" label="单位"></el-table-column>
                <el-table-column prop="weight" align="left" label="重量"></el-table-column>
                <el-table-column prop="color" align="left" label="颜色"></el-table-column>
                <el-table-column prop="puse" align="left" label="用途"></el-table-column>
                <el-table-column prop="description" align="left" label="备注"></el-table-column>
            </el-table>
            <div style="display: flex;justify-content: space-between;margin: 2px">
                <el-pagination
                        background
                        :page-size="10"
                        :current-page="currentPage"
                        layout="total,prev,pager,next"
                        @current-change="currentChange"
                        :total="totalCount">
                </el-pagination>
            </div>
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
            currentChange(page){
                this.currentPage = page;
                this.searchProduct();
            },
            dblclick(row){
                this.$emit("dblclick",row);
            },
            searchProduct(){
                this.getRequest('/product/page?page='+this.currentPage+"&size=10&key="+this.search.key).then((resp)=>{
                    this.products = resp.data.products;
                    this.totalCount = resp.data.count;
                })
            },
            closeWin(){
                //alert('123');
                this.$emit("closeWin");
            }
        },
        data(){
            return{
                search:{
                    key:''
                },
                products:[],
                currentPage:1,
                totalCount:-1
            }
        }
    }
</script>

<style scoped>

</style>