<template>
    <div>
        <el-button @click="showAddReceivingView" size="mini" type="primary"  style="float: left">添加收货信息</el-button>
        <el-table :data="receivings">
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column prop="area" label="区域" width="400px">
                <template slot-scope="scope">
                    <el-cascader :disabled="true" size="mini" v-model="scope.row.area" :props="props" style="float: left;width: 300px">

                    </el-cascader>
                </template>

            </el-table-column>
            <el-table-column prop="address" label="收货地址"></el-table-column>
            <el-table-column prop="consignee" label="收货人"></el-table-column>
            <el-table-column prop="cellphone" label="联系电话"></el-table-column>
            <el-table-column prop="description" label="备注"></el-table-column>
            <el-table-column
                    label="操作">
                <template  slot-scope="scope">
                    <el-button @click="showEditReceivingView(scope.row)"  type="primary"  size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                    <el-button @click="deleteReceiving(scope.row)" type="danger"  size="mini"   style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true">
            <receiving-form :isEdit="isEdit" :oldReceiving="oldReceiving" @editReceiving="editReceiving" @addReceiving="addReceiving"></receiving-form>
        </el-dialog>
    </div>
</template>

<script>
    import ReceivingForm from "@/views/erp/sell/ReceivingForm";
    import {getRequest} from "@/utils/api";
    export default {
        name: "ReceivingList",
        components: {ReceivingForm},
        props:{
            receivings:{
                type:Array,
                default:()=>[]
            },
            customerId:{
                type:String,
                default:''
            }
        },
        methods:{
            deleteReceiving(row){
                this.receivings.some((item,i)=>{
                    if(item==row){
                        this.receivings.splice(i,1);
                        return true;
                    }
                })
            },
            editReceiving(receiving){
                let _this = this;
                if(_this.customerId){
                    _this.putNoEnCodeRequest('/customer/receiving/updateReceiving',receiving).then((resp)=>{
                        if(resp.data.status=="200"){
                            _this.receivings.some((item,i)=>{
                                if(item==_this.oldReceiving){
                                    _this.receivings.splice(i,1,receiving);
                                }
                            })
                            _this.dialogVisible = false;
                            _this.$message.success("更新成功");
                        }else{
                            _this.$message.error("更新失败")
                        }
                    })
                }else{
                    _this.receivings.some((item,i)=>{
                        if(item==_this.oldReceiving){
                            _this.receivings.splice(i,1,receiving);
                        }
                    })

                    this.dialogVisible = false;
                }


            },
            addReceiving(receiving){
                if(this.customerId){
                    Object.assign(receiving,{customerId:this.customerId});
                    this.postNoEnCodeRequest('/customer/receiving/addReceiving',receiving).then((resp)=>{
                        if(resp.data.status==200){
                            receiving = resp.data.receiving;
                            this.receivings.push(receiving);
                            this.dialogVisible = false;
                            this.$message.success("添加成功");
                        }else{
                            this.$message.error("添加失败")
                        }
                    })
                }else{
                    this.receivings.push(receiving);
                    this.dialogVisible = false;
                }

            },
            showEditReceivingView(row){
                this.isEdit = true;
                this.oldReceiving = row;
                this.dialogTitle = "编辑收货信息";
                this.dialogVisible = true;
            },
            showAddReceivingView(){
                this.isEdit = false;
                this.oldReceiving={
                    area:[],
                    address:'',
                    consignee:'',
                    cellphone:'',
                    description:''
                };
                this.dialogTitle="添加收货信息";
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                props:{
                    disabled:true,
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
                isEdit:false,
                dialogTitle:'',
                dialogVisible:false,
                oldReceiving:{}
            }
        }
    }
</script>

<style scoped>

</style>