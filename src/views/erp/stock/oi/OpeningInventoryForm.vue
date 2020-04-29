<template>
    <div >
        <el-form size="mini" label-width="120px" :rules="rules" :model="oi" ref="oiForm">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">单据基本信息</span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item prop="initDate" label="单据日期">
                            <el-date-picker
                                    align="right"
                                    type="date"
                                    v-model="oi.initDate"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">

                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单号录入方式">
                            <el-select v-model="oi.codeGeneratorType">
                                <el-option key="AUTO" label="自动生成" value="AUTO"></el-option>
                                <el-option key="SELF" label="手动录入" value="SELF"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "OpeningInventoryForm",
        data(){
            return{
                oi:{
                    initDate:'',
                    codeGeneratorType:"AUTO"
                },
                rules:{

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