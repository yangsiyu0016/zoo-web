<template>
    <div>
        <el-dialog :title="title" :visible.sync="visible" :append-to-body="true" :show-close="false" :close-on-click-modal="false" width="77%">
            <el-table :data="suppliers" size="mini" style="width:100%"  @row-dblclick="rowDblclick">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="gtime" label="获取时间"></el-table-column>
                <el-table-column prop="supplierName" label="名称"></el-table-column>
                <el-table-column label="区域">
                    <el-table-column prop="country.name" label="国家"></el-table-column>
                    <el-table-column prop="province.name" label="省份"></el-table-column>
                    <el-table-column prop="city.name" label="城市"></el-table-column>
                    <el-table-column prop="county.name" label="地区"></el-table-column>
                </el-table-column>
                <el-table-column prop="owner.realName" label="拥有人"></el-table-column>
                <el-table-column prop="systemUser.realName" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
            </el-table>
            <el-divider></el-divider>
            <el-button @click="close" type="info" size="mini">关闭</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SupplierDialog",
        props:{
           visible:{
               type:Boolean,
               default:false
           },
            title:{
               type:String,
                default: ''
            }
        },
        mounted(){
            this.loadSupplier();
        },
        methods:{
            //列表双击事件
            rowDblclick(row){
                this.$emit("callback",row);
            },
            //加载供应商
            loadSupplier() {
                this.getRequest('/erp/supplier/page?page=' + this.currentPage + '&size=10').then((resp) => {
                    this.suppliers = resp.data.suppliers;
                    this.totalCount = resp.data.count;
                })
            },
            //关闭窗口
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                suppliers:[],
                currentPage:1,
                totalCount:-1
            }
        }
    }
</script>

<style scoped>

</style>