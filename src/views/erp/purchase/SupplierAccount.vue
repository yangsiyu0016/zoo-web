<template>
    <div>
        <el-button @click="showAddSupplierAccountView" size="mini" type="primary"  style="float: left">添加供货信息</el-button>
        <el-table :data="supplierAccounts">
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.type=='PUBLIC'" type="warning">对公</el-tag>
                    <el-tag size="mini" v-else type="success">个人</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="bankNumber" label="开户账号"></el-table-column>
            <el-table-column prop="bankName" label="开户银行"></el-table-column>
            <el-table-column prop="accountName" label="开户人"></el-table-column>
            <el-table-column
                    label="操作">
                <template  slot-scope="scope">
                    <el-button @click="showEditSupplierAccountView(scope.row)"  type="primary"  size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                    <el-button @click="deleteSupplierAccount(scope.row)" type="danger"  size="mini"   style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true">
            <supplierAccount-form :isEdit="isEdit" :oldSupplierAccount="oldSupplierAccount" @editSupplierAccount="editSupplierAccount" @addSupplierAccount="addSupplierAccount"></supplierAccount-form>
        </el-dialog>
    </div>
</template>

<script>

    import SupplierAccountForm from "@/views/erp/purchase/SupplierAccountForm";
    import {getRequest} from "../../../utils/api";

    export default {
        name: "SupplierAccount",

        components:{SupplierAccountForm},

        props: {
            supplierAccounts: {
                type: Array,
                default: () => {}
            },
            supplierId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                props : {
                    disabled: true,
                    label: 'name',
                    lazy: true,
                    value: 'id',
                    lazyLoad(node, resolve) {
                        let  parentId = 0;
                        if (node.level != 0) {
                            parentId = node.data.id;
                        }
                        getRequest('/area/getDataByParentId?parentId=' + parentId).then((resp) => {
                            const  nodes = resp.data.map(item => ({
                                name: item.name,
                                id: item.id,
                                leaf: item.leaf
                            }))
                            resolve(nodes);
                        })
                    }
                },
                isEdit: false,
                dialogTitle: '',
                dialogVisible: false,
                oldSupplierAccount: {}
            }
        },

        methods:{
            showAddSupplierAccountView() {
                this.isEdit = false;
                this.oldSupplierAccount = {
                    bankNumber: '',
                    bankName: '',
                    accountName: '',
                    type:'PUBLIC'
                };
                this.dialogVisible = true;
                this.dialogTitle = '添加开户信息';
            },
            showEditSupplierAccountView(row) {
                this.isEdit = true;
                this.oldSupplierAccount = row;
                this.dialogVisible = true;
                this.dialogTitle = '编辑开户信息';
            },
            deleteSupplierAccount(row) {
                this.supplierAccounts.some((item, i) => {
                    if(item == row) {
                        this.supplierAccounts.splice(i, 1);
                        return true;
                    }
                })
            },
            editSupplierAccount(supplierAccount) {

                let _this = this;
                if(_this.supplierId) {
                    _this.putNoEnCodeRequest('/erp/supplierAccount/updateSupplierAccount', supplierAccount).then((resp) => {
                        if (resp.data.status == '200' ) {
                            _this.supplierAccounts.some((item, i) => {
                                if(item == _this.oldSupplierAccount) {
                                    _this.supplierAccounts.splice(i, 1, supplierAccount);
                                }
                            })
                            _this.dialogVisible = false;
                            _this.$message.success('更新成功');
                        }else {
                            _this.$message.error('更新失败');
                        }
                    })
                } else {
                    _this.supplierAccounts.some((item, i) => {
                        if(item == _this.oldSupplierAccount) {
                            _this.supplierAccounts.splice(i, 1, supplierAccount);
                        }
                    })
                    _this.dialogVisible = false;
                }

            },
            addSupplierAccount(supplierAccount) {
                if(this.supplierId) {
                    Object.assign(supplierAccount, {supplierId: this.supplierId});
                    this.postNoEnCodeRequest('/erp/supplierAccount/addSupplierAccount', supplierAccount).then((resp) => {
                        if(resp.data.status == '200') {
                            supplierAccount = resp.data.supplierAccount;
                            this.supplierAccounts.push(supplierAccount);
                            this.dialogVisible = false;
                            this.$message.success('添加成功');
                        }else {
                            this.$message.error('添加失败');
                        }
                    })
                }else {
                    console.log(this.supplierAccounts);
                    this.supplierAccounts.push(supplierAccount);
                    this.dialogVisible = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>