<template>
    <div>
        <el-button size="mini" type="primary" @click="showAddContactView"  style="float: left">添加联系人</el-button>
        <el-table :data="contacts">
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column prop="name" label="姓名" ></el-table-column>
            <el-table-column prop="supplyCall" label="称呼"> </el-table-column>
            <el-table-column label="性别">
                <template slot-scope="scope">
                    <span v-if="scope.row.sex==1">男</span>
                    <span v-else>女</span>
                </template>
            </el-table-column>
            <el-table-column prop="position" label="职位"></el-table-column>
            <el-table-column prop="telephone" label="座机"></el-table-column>
            <el-table-column prop="callphone" label="手机"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="birthday" label="生日"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="showEditContactView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                    <el-button @click="deleteContact(scope.row)" type="danger"  size="mini"  style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加联系人" :visible.sync="contactDialogVisible" :append-to-body="true" :close-on-click-modal="false">
            <contact-form :isEdit="isEdit" @editCo
                          ntact="editContact" :oldContact="oldContact" @addContact="addContact"></contact-form>
        </el-dialog>
    </div>
</template>

<script>
    import ContactForm from "@/views/erp/purchase/ContactForm";
    export default {
        name: "Contact",
        components: {ContactForm},
        props: {
            contacts: {
                type: Array,
                default: () => {}
            },
            supplierId: {
                type: String,
                default: ''
            }
        },
        methods: {
            deleteContact(row){
                this.contact.some((item, i) => {
                    if (item == row) {
                        this.contact.splice(i, 1);
                        return true;
                    }
                })
            },
            editContact(contact) {
                console.log(contact)
                let  _this = this;
                if (_this.supplierId) {
                    _this.putNoEnCodeRequest('/erp/contact/updateContact', contact).then((resp) => {
                        if(resp.data.status == '200') {
                            _this.contacts.some((item, i) => {
                                if (item == _this.oldContact) {
                                    _this.contacts.splice(i, 1, contact);
                                }
                            })
                            _this.contactDialogVisible = false;
                            _this.$message.success("更新成功");
                        }else {
                            _this.$message.error("更新失败");
                        }
                    })
                }else {
                    _this.contacts.some((item, i) => {
                        if(item == _this.oldContact) {
                            _this.contacts.splice(i, 1, contact);
                        }
                    })
                    this.contactDialogVisible = false;
                }
            },
            addContact(contact){
                if(this.supplierId){
                    Object.assign(contact,{supplierId: this.supplierId});
                    this.postNoEnCodeRequest('/erp/contact/addContact', contact).then((resp) => {
                        if(resp.data.status == '200') {
                            contact = resp.data.contact;
                            this.contacts.push(contact);
                            this.contactDialogVisible = false;
                            this.$message.success("添加成功");
                        }else {
                            this.$message.error("添加失败");
                        }
                    })
                }else {
                    this.contacts.push(contact);
                    this.contactDialogVisible = false;
                }
            },

            showEditContactView(row) {
                this.isEdit = true;
                this.oldContact = row;
                this.contactDialogVisible = true;
            },

            showAddContactView() {
                this.isEdit = false;
                this.oldContact = {
                    name: '',
                    supplyCall: '',
                    sex: '1',
                    position: '',
                    telephone: '',
                    callphone: '',
                    email: '',
                    birthday: '',
                    remarks: ''
                };
                this.contactDialogVisible = true;
            }
        },
        data(){
            return{
                isEdit:false,
                oldContact:{
                    name: '',
                    supplyCall: '',
                    sex: '1',
                    position: '',
                    telephone: '',
                    callphone: '',
                    email: '',
                    birthday: '',
                    remarks: ''
                },
                contactDialogVisible:false,

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