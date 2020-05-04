<template>
    <div>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="float: left;">单据基本信息</span>
            </div>
            <div>
                <el-row  :gutter="20">
                    <el-col :span="8"><span>单据日期:{{oi.initDate}}</span></el-col>
                    <el-col :span="8"><span>单号：{{oi.code}}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><span>仓库:{{oi.warehouse.name}}</span></el-col>
                </el-row>
            </div>
        </el-card>
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="float: left;">产品清单</span>
            </div>
            <div>
                <el-table :data="oi.details" size="mini">
                    <el-table-column type="index" align="left" width="60"></el-table-column>
                    <el-table-column label="产品名称" prop="productSku.product.name" ></el-table-column>
                    <el-table-column label="产品编号" prop="productSku.code" width="200" ></el-table-column>
                    <el-table-column prop="productSku.product.productDetail.genericSpec" align="left" width="300"  label="通用规格参数" ></el-table-column>
                    <el-table-column prop="productSku.ownSpec" align="left"  label="特殊规格参数" width="400"  ></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>
                    <el-table-column label="成本价" prop="costPrice" v-if="oi.status=='CWSH'" width="300">
                        <template slot-scope="scope">
                            <el-input-number @change="priceChange(scope.row)" v-if="handleVisible" :min="0" :precision="4" size="mini" v-model="scope.row.costPrice"></el-input-number>
                            <span v-else>{{scope.row.costPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总额" prop="totalMoney" v-if="oi.status=='CWSH'"></el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card shadow="hover" v-show="handleVisible">
            <div slot="header" class="clearfix">
                <span style="float: left;">审批意见</span>
            </div>
            <el-input type="textarea" v-model="comment"></el-input>
        </el-card>
        <el-card shadow="hover">
            <el-button v-show="handleVisible" @click="handle" type="primary" size="mini">办理</el-button>
            <el-button v-show="claimVisible" @click="claim" type="primary" size="mini">签收</el-button>
            <el-button @click="close" type="info" size="mini">关闭</el-button>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "OpeningInventoryTaskDetails",
        props:{
            task:{
                type:Object,
                default:()=>{}
            }
        },
        watch:{
            task:{
                handler(val){
                    if(val.assignee){
                        this.handleVisible = true;
                        this.claimVisible = false;
                    }else{
                        this.handleVisible = false;
                        this.claimVisible = true;
                    }
                    this.getRequest('/oi/getOiById?id='+val.businessKey).then((resp)=>{
                        if(resp&&resp.status==200){
                            this.oi = resp.data;

                        }else{
                            this.$message.error("获取表单信息失败");
                        }
                    })
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            //入库价格更新
            priceChange(row){
                let m = 0,s1=row.costPrice.toString(),s2=row.number.toString();
                try{m+=s1.split(".")[1].length}catch(e){}
                try{m+=s2.split(".")[1].length}catch(e){}
                row.totalMoney = Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
                this.putRequest('/oi/detail/updatePrice',{id:row.id,costPrice:row.costPrice,totalMoney:row.totalMoney}).then((resp)=>{

                })
            },
            //办理
            handle(){
                this.$confirm("确定要完成任务吗？完成后暂时不可取回！","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.oi.status=='CWSH'){
                        this.oi.details.forEach((detail)=>{
                            if(!detail.costPrice){
                                this.$message.error('有产品未设置成本价');
                                return false;
                            }else{
                                if(detail.costPrice==0){
                                    this.$message.error('成本价不能为0');
                                    return false;
                                }else{
                                    this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment).then((resp)=>{
                                        this.$emit("close");
                                        this.$emit("refresh");
                                    })
                                }
                            }
                        })
                    }else{
                        this.postRequest('/flow/task/complete?taskId='+this.task.id+"&comment="+this.comment).then((resp)=>{
                            this.$emit("close");
                            this.$emit("refresh");
                        })
                    }

                })
            },
            //签收
            claim() {
                this.$confirm("签收后只能由签收人处理该任务，确定要签收吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.postRequest('/flow/task/claim?taskId='+this.task.id).then((resp)=>{
                        if(resp.data.status==200){
                            this.claimVisible = false;
                            this.handleVisible = true;
                            this.$emit("refresh");
                        }
                    })
                })
            },
            //关闭窗口
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                oi:{
                    warehouse:{
                        name:''
                    }
                },
                claimVisible:false,
                handleVisible:false,
                comment:''
            }
        }
    }
</script>

<style scoped>

</style>