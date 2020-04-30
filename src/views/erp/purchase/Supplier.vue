<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div>
                    <el-input clearable prefix-icon="el-icon-search" style="width: 300px;margin: 0px;padding: 0px;" size="mini" placeholder="通过供应商名称搜索客户,记得回国呦……"></el-input>
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddSupplierView">添加供应商</el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-table :data="suppliers" size="mini" style="width:100%">
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
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope" >
                            <el-button @click="showEditSupplierView(scope.row)"  type="primary"  size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button type="danger" @click="deleteSupplier(scope.row)"  size="mini"   style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="80%">
            <supplier-form :isEdit="isEdit" :oldSupplier="oldSupplier" @close="closeWin" @editSuccess="editSuccess"></supplier-form>
        </el-dialog>
    </div>
</template>

<script>

    import SupplierForm from "@/views/erp/purchase/SupplierForm";
    export default {
        name: "Supplier",
        components: {SupplierForm},
        mounted() {
            this.loadSupplier();
        },
        data() {
            return {
                suppliers: [],
                currentPage: 1,
                totalCount: -1,
                dialogVisible: false,
                dialogTitle: '',
                oldSupplier: {},
                isEdit: false
            }
        },
        methods: {
            //s删除功能
            deleteSupplier(supplier){
                console.log(supplier.id);
                this.$message.info("暂时不考虑实现删除")
            },
            editSuccess() {
                this.closeWin();
                this.loadSupplier();
            },
            closeWin(){
                this.dialogVisible = false;
            },
            //加载供货商管理页面数据
            loadSupplier() {
                this.getRequest('/erp/supplier/page?page=' + this.currentPage + '&size=10').then((resp) => {
                    this.suppliers = resp.data.suppliers;
                    this.totalCount = resp.data.count;
                })
            },
            //数据编辑页
            showEditSupplierView(supplier) {
                this.oldSupplier = supplier;
                this.dialogTitle = '编辑供货商';
                this.dialogVisible = true;
                this.isEdit = true;
            },
            showAddSupplierView(supplier) {
                this.oldSupplier = {
                    supplierName: '',
                    area: [],
                    gtime: '',
                    owner: {
                        realName: ''
                    },
                    contacts: [],
                    supplyAddresses: []
                };
                this.isEdit = false;
                this.dialogTitle = '新增供货商';
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>