<template>
    <div>
        <el-form :rules="rules" ref="warehouseForm" :model="warehouse" size="mini" label-width="120px">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">仓库信息</span>
                </div>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="warehouse.name" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="地址:" prop="address">
                    <el-input v-model="warehouse.address" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="管理员:">
                    <el-select style="float: left" v-model="warehouse.managers" value-key="id" size="mini" multiple placeholder="请选择">
                        <el-option v-for="item in userOptions" :key="item.id" :label="item.realName" :value="item">

                        </el-option>
                    </el-select>
                </el-form-item>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float: left;">货位信息</span>
                </div>
                <el-button style="float: left" type="primary" size="mini" icon="el-icon-plus"
                           @click="showAddGaView">
                    添加货位
                </el-button>
                <el-table :data="warehouse.goodsAllocations">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column label="名称" prop="name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showEditGaView(scope.row)" type="primary"  size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                            <el-button v-show="!isEdit" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card>
                <el-button @click="saveWarehouse('warehouseForm')" type="primary" size="mini" >保存</el-button>
                <el-button @click="cancel" type="info" size="mini" >取消</el-button>
            </el-card>
        </el-form>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true">
            <goods-allocation-form :gaEdit="gaEdit" :oldGa="oldGa" @editGa="editGa" @addGa="addGa" @close="closeWin"></goods-allocation-form>
        </el-dialog>
    </div>
</template>

<script>
    import GoodsAllocationForm from "@/views/erp/stock/warehouse/GoodsAllocationForm";
    export default {
        name: "WarehouseForm",
        components: {GoodsAllocationForm},
        props:{
          oldWarehouse:{
              type:Object,
              default:()=>{}
          },
            isEdit:{
              type:Boolean,
                default:false
            }
        },
        watch:{
            oldWarehouse: {
                handler(val){
                    this.warehouse=JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){
            this.initData();
        },
        methods:{
            saveWarehouse(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(this.isEdit){
                            this.putNoEnCodeRequest('/erp/warehouse/update',this.warehouse).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("更新成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("保存失败");
                                }
                            })
                        }else{
                            this.postNoEnCodeRequest('/erp/warehouse/add',this.warehouse).then((resp)=>{
                                if(resp&&resp.data.status=="200"){
                                    this.$message.success("保存成功");
                                    this.$emit("callback");
                                }else{
                                    this.$message.error("保存失败");
                                }
                            })
                        }

                    }else{
                        return false;
                    }
                })
            },
            cancel(){
                this.$emit("close");
            },
            editGa(ga){
                if(this.isEdit){
                    this.putNoEnCodeRequest('/warehouse/ga/update',ga).then((resp)=>{
                        if(resp.data.status=="200"){
                            this.warehouse.goodsAllocations.some((item,i)=>{
                                if(item==this.oldGa){
                                    this.warehouse.goodsAllocations.splice(i,1,ga);
                                }
                            })
                            this.dialogVisible = false;
                            this.$message.success("更新成功");
                        }else{
                            this.$message.error("更新失败")
                        }
                    })
                }else{
                    this.warehouse.goodsAllocations.some((item,i)=>{
                        if(item==this.oldGa){
                            this.warehouse.goodsAllocations.splice(i,1,ga);
                        }
                    })
                    this.dialogVisible = false;
                }
            },
            addGa(ga){
                if(this.isEdit){
                    Object.assign(ga,{warehouseId:this.warehouse.id});
                    this.postNoEnCodeRequest('/warehouse/ga/add',ga).then((resp)=>{
                        if(resp.data.status==200){
                            this.$message.success("添加成功");
                            this.dialogVisible = false;
                            this.warehouse.goodsAllocations.push(resp.data.ga);
                        }else{
                            this.$message.error("添加失败");
                        }
                    })
                }else{
                    this.warehouse.goodsAllocations.push(ga);
                    this.dialogVisible = false;
                }

            },
            closeWin(){
                this.dialogVisible = false;
            },
            showEditGaView(ga){
                this.gaEdit = true;
                this.oldGa = ga;
                this.dialogVisible=true;
                this.dialogTitle="编辑货位";
            },
            showAddGaView(){
                this.gaEdit = false;
                this.oldGa = {name:''};
                this.dialogVisible=true;
                this.dialogTitle="添加货位";
            },
            initData(){
                var _this = this;
                _this.getRequest('/user/all').then(resp=>{
                    _this.userOptions = resp.data;
                })
            }
        },
        data(){
            return{
                dialogTitle:"",
                dialogVisible:false,
                userOptions:[],
                rules:{
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}]
                },
                warehouse:{
                    name:'',
                    managers:[],
                    goodsAllocations:[]
                },
                gaEdit:false,
                oldGa:{}
            }
        }
    }
</script>

<style scoped>

</style>