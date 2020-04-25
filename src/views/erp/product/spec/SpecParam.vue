<template>
    <div>
        <el-button @click="showAddParamView" style="float: left" type="primary" size="mini">新增参数</el-button>
        <el-table size="mini" :data="params" >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="参数名称"></el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button @click="showEditParamView(scope.row)" type="primary" size="mini">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
            <spec-param-form :isEdit="isEdit" :oldParam="oldParam" :typeId="typeId" :groupId="groupId" @callback="callback" @close="closeWin"></spec-param-form>
        </el-dialog>
    </div>
</template>

<script>
    import SpecParamForm from "@/views/erp/product/spec/SpecParamForm";
    export default {
        name: "SpecParam",
        components:{SpecParamForm},
        props:{
            groupId:{
                type:String,
                default:''
            },
            typeId:{
                typeId:String,
                default: ''
            }
        },
        watch:{
            groupId(){
                this.loadData();
            }
        },
        methods:{
            callback(){
                this.loadData();
                this.dialogVisible = false;
            },
            loadData(){
                this.getRequest('/product/spec/getParamsByGroupId?groupId='+this.groupId).then((resp)=>{
                    this.params= resp.data;
                })
            },
            closeWin(){
                this.dialogVisible = false;
            },
            showEditParamView(param){
                this.isEdit = true;
                this.oldParam = param;
                this.dialogVisible = true;
                this.dialogTitle="编辑参数";
            },
            showAddParamView(){
                this.isEdit = false;
                this.oldParam={
                    name:'',
                    generic:true
                };
                this.dialogVisible = true;
                this.dialogTitle="新增参数";
            }
        },
        data(){
            return{
                dialogVisible:false,
                dialogTitle:'',
                params:[],
                oldParam:{},
                isEdit:false
            }
        }
    }
</script>

<style scoped>

</style>