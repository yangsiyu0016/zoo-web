<template>
    <div>
        <el-dialog width="77%" :title="title"  :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" :show-on-press-escape="false" :show-close="false">
            <el-container >
                <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                    <div></div>
                    <div style="margin-left: 5px;margin-right: 20px;display: inline">
                        <el-input size="mini" placeholder="通过产品编码、产品名称搜索，记得回车呦..."
                                  clearable
                                  style="width: 350px;margin: 0px;padding: 0px;"
                                  prefix-icon="el-icon-search"
                                  @keyup.enter.native="searchProduct"
                                  v-model="keywords"
                                  @change="keywordsChange"
                        ></el-input>
                        <el-button  @click="searchProduct" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                    </div>
                </el-header>
                <el-main>
                    <el-container style="border: 1px">
                        <el-aside width="230px">
                            <el-container >
                                <el-header height="30px">
                                    产品分类
                                </el-header>
                                <el-main>
                                    <el-tree :data="types" :props="props" :default-expand-all="defaultExpandAll" @node-click="selectProductByTypeId"></el-tree>
                                </el-main>
                            </el-container>
                        </el-aside>
                        <el-container>
                            <el-main>
                                <el-table :data="products" size="mini" @row-dblclick="dblclick">
                                    <el-table-column type="index" width="50"></el-table-column>
                                    <el-table-column prop="imageUrl" label="图片">
                                        <template slot-scope="scope">
                                            <el-image v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]"></el-image>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="code" align="left"  label="产品编号" width="200"  >
                                        <template slot-scope="scope">
                                            <span v-html="showData(scope.row.code)"></span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" align="left"  label="产品名称"  >
                                        <template slot-scope="scope">
                                            <span v-html="showData(scope.row.name)"></span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="mnemonic" align="left"  label="助记码"  >
                                        <template slot-scope="scope">
                                            <span v-html="showData(scope.row.mnemonic)"></span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="typeName" align="left" width="100" label="分类"></el-table-column>
                                    <el-table-column prop="productBrand.name" align="left"  label="品牌" ></el-table-column>

                                    <el-table-column prop="spec" align="left" label="规格"></el-table-column>
                                    <el-table-column prop="unit.name" align="left" label="单位"></el-table-column>
                                    <el-table-column prop="weight" align="left" label="重量"></el-table-column>
                                    <el-table-column prop="color" align="left" label="颜色"></el-table-column>
                                    <el-table-column prop="puse" align="left" label="用途"></el-table-column>
                                    <el-table-column prop="description" align="left" label="备注" :show-overflow-tooltip='true'></el-table-column>
                                </el-table>
                                <div style="display: flex;justify-content: space-between;margin: 2px">
                                    <el-pagination
                                            background
                                            :page-sizes="[10,20,50,100,200]"
                                            :page-size="pageSize"
                                            :current-page="currentPage"
                                            layout="total,prev,pager,next,jumper"
                                            @current-change="currentChange"
                                            :total="totalCount">
                                    </el-pagination>
                                </div>
                            </el-main>
                        </el-container>
                    </el-container>
                </el-main>
            </el-container>
            <div slot="footer" style="text-align: center">
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
        mounted() {
            this.loadType();
            this.searchProduct();
        },
        methods:{
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val=='undefined'?'':val;
                }
            },
            keywordsChange(val){
                if(val==''){
                    this.searchProduct();
                }
            },
            currentChange(page){
                this.currentPage = page;
                this.searchProduct();
            },
            dblclick(row){
                this.$emit("dblclick",row);
            },
            searchProduct(){
                this.loading = true;
                this.getRequest('/product/page?page='+this.currentPage+
                    "&size="+this.pageSize+"&sort="+this.sort+"&order="+this.order+
                    "&keywords="+this.keywords+"&typeId="+this.typeId+"&brandId="+this.searchData.brandId+"&name="+this.searchData.name+"&code="+this.searchData.code+"&mnemonic="+this.searchData.mnemonic).then((resp)=>{
                    this.products = resp.data.products;
                    this.totalCount = resp.data.count;
                    //this.defaultExpandAll = false;
                    this.loading = false;
                })
            },
            selectProductByTypeId(data) {
                this.typeId = data.id;
                this.searchProduct();
            },
            loadType() {
                this.getRequest('/product/type/tree').then(resp => {
                    this.types[0].children = resp.data;
                })
            },
            closeWin(){
                this.$emit("closeWin");
            }
        },
        data(){
            return{
                loading:false,
                keywords:'',
                searchData:{
                    name:'',
                    code:'',
                    brandId:'',
                    mnemonic:''
                },
                typeId: '',
                props:{
                    label:'name'
                },
                types: [{
                    name:'全部类型',
                    id:'',
                    children: []
                }],
                defaultExpandAll:true,
                products:[],
                currentPage:1,
                totalCount:-1,
                pageSize:10,
                sort:'ctime',
                order:'desc'
            }
        }
    }
</script>

<style lang="css">
    .el-tooltip__popper{font-size: 15px; max-width:40%} /*设置显示隐藏部分内容，按40%显示*/
</style>