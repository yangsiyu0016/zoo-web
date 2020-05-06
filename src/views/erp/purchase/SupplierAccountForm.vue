<template>
    <div>
        <el-form ref="supplierAccountForm" :model="supplierAccount" :rules="rules" label-width="120px">
            <el-form-item prop="bankNumber" label="开户账号:">
                <el-input size="mini" v-model="supplierAccount.bankNumber"></el-input>
            </el-form-item>
            <el-form-item prop="bankName" label="开户名称:">
                <el-input size="mini" v-model="supplierAccount.bankName"></el-input>
            </el-form-item>
            <el-form-item prop="accountName" label="开户人:">
                <el-input size="mini" v-model="supplierAccount.accountName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="submitForm('supplierAccountForm')">保存</el-button>
                <el-button size="mini" @click="resetForm('supplierAccountForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import {getRequest} from "@/utils/api";

    export default {
        name: "SupplierAccountForm",
        props: {
            oldSupplierAccount: {
                type: Object,
                default: () => {}
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            oldSupplierAccount: {
                handler(val) {
                    this.supplierAccount = JSON.parse(JSON.stringify(val));
                },
                deep: true,
                immediate: true

            }
        },
        data() {
            return {
                supplierAccount: {
                    bankNumber: '',
                    bankName: '',
                    accountName: ''
                },

                props: {
                    label:'name',
                    lazy:true,
                    value:'id',
                    lazyLoad(node,resolve){

                        let parentId=0;
                        if(node.level!=0) parentId=node.data.id;
                        getRequest('/area/getDataByParentId?parentId='+parentId).then((resp)=>{
                            const nodes = resp.data
                                .map(item => ({
                                    name:item.name,
                                    id: item.id,
                                    leaf: item.leaf
                                }));
                            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                            resolve(nodes);
                        })
                    }
                },

                rules:{
                    bankNumber:[{required:true,message:'开户号不能为空',trigger:'blur'}],
                    bankName:[{required:true,message:'开户行名称不能为空',trigger:'blur'}],
                    accountName:[{required:true,message:'开户人名称不能为空',trigger:'blur'}]
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        if (this.isEdit) {
                            this.$emit('editSupplierAccount', this.supplierAccount);
                        }else {
                            this.$emit('addSupplierAccount', this.supplierAccount);
                        }

                        this.supplierAccount = {
                            bankNumber: '',
                            bankName: '',
                            accountName: ''
                        }

                    }else {
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>