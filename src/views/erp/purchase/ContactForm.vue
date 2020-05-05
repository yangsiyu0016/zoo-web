<template>
    <div>
        <el-form :rules="rules" ref="contactForm" :model="contact" label-width="120px">
            <el-form-item label="姓名:" prop="name">
                <el-input size="mini"  v-model="contact.name" ></el-input>
            </el-form-item>
            <el-form-item label="称呼:" prop="supplyCall">
                <el-input size="mini" v-model="contact.supplyCall"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
                <el-select size="mini" v-model="contact.sex">
                    <el-option v-for="item in sexs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职位:" prop="position">
                <el-input size="mini" v-model="contact.position"></el-input>
            </el-form-item>
            <el-form-item label="座机:" prop="telephone">
                <el-input size="mini" v-model="contact.telephone" ></el-input>
            </el-form-item>
            <el-form-item label="手机:" prop="callphone">
                <el-input size="mini" v-model="contact.callphone" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input size="mini" v-model="contact.email" ></el-input>
            </el-form-item>
            <el-form-item label="生日:" prop="birthday">
                <el-date-picker size="mini"
                                align="right"
                                type="date"
                                v-model="contact.birthday"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions">

                </el-date-picker>
            </el-form-item>
            <el-form-item label="备注:" prop="remarks">
                <el-input type="textarea" size="mini" v-model="contact.remarks" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="submitForm('contactForm')">保存</el-button>
                <el-button size="mini" @click="resetForm('contactForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "ContactForm",
        props: {
            oldContact: {
                type: Object,
                default: () => {}
            },
            isEdit: {
                type: Boolean,
                default: false,
            }
        },
        watch: {
            oldContact: {
                handler(val) {
                    if (val) {
                        this.contact = JSON.parse(JSON.stringify(val));
                    }else {
                        this.contact = {
                            name: '',
                            supplyCall: '',
                            sex: 1,
                            position: '',
                            telephone: '',
                            callphone: '',
                            email: '',
                            birthday: '',
                            remarks: ''
                        }
                    }
                },
                deep: true,
                immediate:true
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isEdit) {
                            this.$emit("editContact", this.contact);
                        }else {
                            this.$emit("addContact", this.contact);
                        }

                        this.contact = {
                            name: '',
                            supplyCall: '',
                            sex: 1,
                            position: '',
                            telephone: '',
                            callphone: '',
                            email: '',
                            birthday: '',
                            remarks: ''
                        }
                    }else {
                        return false;
                    }
                })
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        data() {
            return {
                sexs: [{
                    value: 1,
                    label: '男'
                }, {
                    value: 0,
                    label: '女'
                }],


                rules: {
                    name:[{required:true,message:'必填:姓名', trigger: 'blur'}]
                },

                contact: {
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