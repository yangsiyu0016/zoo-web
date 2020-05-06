<template>
    <div>
        <el-form ref="supplierForm" :model="supplier" :rules="rules" label-width="120px" :label-position="labelPosition" style="margin-top: 10px;padding: 0px;">
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float:left">基本信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="获取时间:" prop="gtime">
                                <el-date-picker size="mini"
                                                align="right"
                                                type="date"
                                                v-model="supplier.gtime"
                                                placeholder="选择日期"
                                                :picker-options="pickerOptions">

                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="拥有人:" prop="owner.realName" >
                                <el-input size="mini" class="input-with-select"  disabled v-model="supplier.owner.realName"  style="float:left;width:400px;padding-top: 7px">
                                    <el-button size="mini" slot="append" icon="el-icon-search" @click="selectOwner" ></el-button>
                                </el-input>
                            </el-form-item >
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">供货商信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="供货商名称:" prop="supplierName">
                                <el-input size="mini" v-model="supplier.supplierName"></el-input>
                            </el-form-item>

                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="区域:" prop="area" >
                                <el-cascader clearable filterable :props="props" size="mini"  v-model="supplier.area" style="float: left;width: 400px;padding-top:7px" placeholder="请选择国家/省/市/区">

                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item label="详细地址:">
                                <el-input size="mini" v-model="supplier.supplierAddress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-form-item label="简介:">
                            <el-input type="textarea" size="mini" v-model="supplier.remarks"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
            </el-card>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">联系人</span>
                </div>
                <contact :supplierId="supplier.id" :contacts="supplier.contacts"></contact>
            </el-card>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="float: left;">开户信息</span>
                </div>
                <supplierAccount :supplierId="supplier.id" :supplierAccounts="supplier.supplierAccounts"></supplierAccount>
            </el-card>
            <el-card>
                <el-button @click="saveSupplier('supplierForm')" type="primary" size="mini" >保存</el-button>
                <el-button @click="cancel" type="info" size="mini" >取消</el-button>
            </el-card>
        </el-form>
        <user-dialog @dblclick="userDblclick" @closeWin="closeUserDialog" v-if="userDialogVisible" :visible.sync="userDialogVisible">

        </user-dialog>
    </div>

</template>

<script>
    import UserDialog from "@/components/dialog/UserDialog";
    import Contact from "@/views/erp/purchase/Contact";
    import SupplierAccount from "@/views/erp/purchase/SupplierAccount";
    import {getRequest} from "@/utils/api";

    export default {
        name: "SupplierForm",
        components: {UserDialog, Contact, SupplierAccount},
        props: {
            oldSupplier: {
                type: Object,
                default: () => {}
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            oldSupplier: {
                handler(val) {
                    this.supplier = JSON.parse(JSON.stringify(val));
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            cancel() {
                this.$emit("close");
            },
            saveSupplier(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        if(this.isEdit) {
                            this.putNoEnCodeRequest('/erp/supplier/update', this.supplier).then((resp) => {
                                if(resp.data.status == '200') {
                                    this.$message.success("更新成功");
                                    this.$emit("editSuccess");
                                }else {
                                    this.$message.error("更新失败");
                                }
                            })
                        }else {
                            this.postNoEnCodeRequest('/erp/supplier/add', this.supplier).then((resp) => {
                                if (resp.data.status == '200') {
                                    this.$message.success('保存成功');
                                    this.$emit("editSuccess");
                                }else {
                                    this.$message.error("保存失败");
                                }
                            })
                        }
                    }else {
                        return false;
                    }
                })
            },
            userDblclick(row) {
                this.supplier.owner = row;
                this.userDialogVisible = false;
            },
            closeUserDialog() {
                this.userDialogVisible = false;
            },
            selectOwner() {
                this.userDialogVisible = true;
            }
        },
        data() {
            let  validArea = (rule, value, callback) => {
                if (value.length > 0 && value.length != 4) {
                    callback(new Error('格式： 国家/省份/城市/地区'));
                }else {
                    callback();
                }
            };
            return{
                props: {
                    label: 'name',
                    lazy: true,
                    value: 'id',

                    lazyLoad(node, resolve) {
                        let parentId = 0;
                        if (node.level != 0) {
                            parentId = node.data.id;
                        }
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
                userDialogVisible: false,
                labelPosition: 'rigth',
                rules:{
                    gtime:[{required:true,message:'选择获取时间',trigger:'blur'}],
                    'owner.realName':[{required:true,message:'选择拥有人',trigger:'blur'}],
                    name:[{required:true,message:'名称不能为空',trigger:'blur'}],
                    area:[{required:false,message:'选择区域',trigger:'blur'},{validator:validArea,trigger: 'blur'}],
                },
                supplier: {
                    name: '',
                    area: [],
                    gtime: '',
                    owner : {
                        realName: ''
                    },
                    contacts: [],
                    supplierAccounts: []
                },
                //日期选择器
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }
            }
        }
    }
</script>

<style scoped>

</style>