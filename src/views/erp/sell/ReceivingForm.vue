<template>
    <div>
        <el-form ref="receivingForm" :model="receiving" :rules="rules" label-width="120px">
            <el-form-item prop="area" label="区域:">
                <el-cascader filterable :props="props" size="mini"  v-model="receiving.area" style="float: left;width: 400px;padding-top:7px" placeholder="请选择国家/省/市/区">

                </el-cascader>
            </el-form-item>
            <el-form-item prop="address" label="收货地址:">
                <el-input size="mini" v-model="receiving.address"></el-input>
            </el-form-item>
            <el-form-item prop="consignee" label="收货人:">
                <el-input size="mini" v-model="receiving.consignee"></el-input>
            </el-form-item>
            <el-form-item prop="cellphone" label="联系电话:">
                <el-input size="mini" v-model="receiving.cellphone"></el-input>
            </el-form-item>
            <el-form-item prop="description" label="备注:">
                <el-input size="mini" v-model="receiving.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="submitForm('receivingForm')">保存</el-button>
                <el-button size="mini" @click="resetForm('receivingForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {getRequest} from "@/utils/api";

    export default {
        name: "ReceivingForm",
        props: {
            oldReceiving:{
                type:Object,
                default:()=>{}
            },
            isEdit:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            oldReceiving: {
                handler(val){
                    this.receiving = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            submitForm(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.$emit("editReceiving",this.receiving);
                        }else{
                            this.$emit("addReceiving",this.receiving);
                        }

                        this.receiving={
                            area:[],
                            address:'',
                            consignee:'',
                            cellphone:'',
                            description:''
                        }
                    }else{
                        return false;
                    }
                })
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            }
        },
        data(){
            let validArea = (rule,value,callback)=>{
                if(value.length!=4){
                    callback(new Error("格式：国家/省份/城市/地区"));
                }else {
                    callback();
                }
            };
            return{
                props:{
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
                    area:[{required:true,message:'选择区域',trigger:'blur'},{validator:validArea,trigger: 'blur'}],
                    address:[{required:true,message:'地址不能为空',trigger:'blur'}],
                    consignee:[{required:true,message:'联系人不能为空',trigger:'blur'}],
                    cellphone:[{required:true,message:'联系电话不能为空',trigger:'blur'}]
                },
                receiving:{
                    area:[],
                    address:'',
                    consignee:'',
                    cellphone:'',
                    description:''
                }
            }
        }
    }
</script>

<style scoped>

</style>