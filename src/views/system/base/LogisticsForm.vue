<template>
    <el-form ref="expressForm"  label-width="80px" label-position="right">
        <el-form-item label="名称" >
            <el-input size="mini" v-model="express.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
            <el-select size="mini" style="float: left" v-model="express.type">
                <el-option label="物流" value="LOGISTICS"></el-option>
                <el-option label="快递" value="EXPRESS"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input size="mini" v-model="express.phone"></el-input>
        </el-form-item>
        <el-form-item label="始发地址">
            <el-input size="mini" v-model="express.startAddress"></el-input>
        </el-form-item>
        <el-button size="mini" @click="saveExpress" type="primary">保存</el-button>
        <el-button size="mini" @click="close" type="info">取消</el-button>
    </el-form>
</template>

<script>
    export default {
        name: "LogisticsForm",
        props:{
            oldExpress:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldExpress: {
                handler(val){
                    this.express = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                express:{
                    name:'',
                    phone:'',
                    startAddress:'',
                    type:'LOGISTICS'
                }
            }
        }
    }
</script>

<style scoped>

</style>