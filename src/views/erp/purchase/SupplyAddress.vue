<template>
    <div>
        <el-button @click="showAddSupplyAddressView" size="mini" type="primary"  style="float: left">添加供货信息</el-button>
        <el-table :data="supplyAddresses">
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column prop="area" label="区域" width="400px">
                <template slot-scope="scope">
                    <el-cascader :disabled="true" size="mini" v-model="scope.row.area" :props="props" style="float: left;width: 300px">

                    </el-cascader>
                </template>

            </el-table-column>
            <el-table-column prop="address" label="供货地址"></el-table-column>
            <el-table-column prop="supply" label="供货人"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column
                    label="操作">
                <template  slot-scope="scope">
                    <el-button @click="showEditSupplyAddressView(scope.row)"  type="primary"  size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                    <el-button @click="deleteSupplyAddress(scope.row)" type="danger"  size="mini"   style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true">
            <supplyAddress-form :isEdit="isEdit" :oldSupplyAddress="oldSupplyAddress" @editSupplyAddress="editSupplyAddress" @addSupplyAddress="addSupplyAddress"></supplyAddress-form>
        </el-dialog>
    </div>
</template>

<script>

    import SupplyAddressForm from "@/views/erp/purchase/SupplyAddressForm";
    import {getRequest} from "../../../utils/api";

    export default {
        name: "SupplyAddress",
        components: {SupplyAddressForm},

        props: {
            supplyAddresses: {
                type: Array,
                default: () => {}
            },
            supplierId: {
                type: String,
                default: ''
            }
        },
        methods: {
            editSupplyAddress(supplyAddress) {
                let _this = this;
                if (_this.supplierId) {
                    _this.putNoEnCodeRequest("/erp/supplyAddress/updateSupplyAddress", supplyAddress).then((resp) => {
                        if(resp.data.status == '200'){
                            _this.supplyAddresses.some((item, i) => {
                                if (item == _this.oldSupplyAddress) {
                                    _this.supplyAddresses.splice(i, 1, supplyAddress);
                                }
                            })
                            _this.dialogVisible = false;
                            _this.$message.success("更新成功");
                        }else {
                            _this.$message.error("更新失败");
                        }
                    })
                }else {
                    _this.supplyAddresses.some((item, i) => {
                        if(item == _this.oldSupplyAddress) {
                            _this.supplyAddresses.splice(i, 1, supplyAddress);
                        }
                    })
                    this.dialogVisible = false;
                }
            },
            deleteSupplyAddress(row) {
                this.supplyAddresses.some((item, i) => {
                    if (item == row) {
                        this.supplyAddresses.splice(i, 1);
                        return true;
                    }
                })
            },
            addSupplyAddress(supplyAddress) {
                console.log(supplyAddress)
                if (this.supplierId) {
                    Object.assign(supplyAddress, {supplierId: this.supplierId});
                    this.postNoEnCodeRequest("/erp/supplyAddress/addSupplyAddress", supplyAddress).then((resp) => {
                        if (resp.data.status == '200'){
                            supplyAddress = resp.data.supplyAddress;
                            this.supplyAddresses.push(supplyAddress);
                            this.dialogVisible = false;
                            this.$message.success("添加成功");
                        }else {
                            this.$message.error("添加失败");
                        }
                    })
                } else {
                    this.supplyAddresses.push(supplyAddress);
                    this.dialogVisible = false;
                }
            },
            showEditSupplyAddressView(row) {
                this.isEdit = true;
                this.oldSupplyAddress = row;
                this.dialogTitle = '编辑供货信息';
                this.dialogVisible = true;
            },
            showAddSupplyAddressView() {
                this.isEdit = false;
                this.oldSupplyAddress = {
                    area: [],
                    address: '',
                    supply: '',
                    phone: '',
                    remarks: ''
                };
                this.dialogTitle = '添加供货信息';
                this.dialogVisible = true;
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
                oldSupplyAddress: {}
            }
        }
    }
</script>

<style scoped>

</style>