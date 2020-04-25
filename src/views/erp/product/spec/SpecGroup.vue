<template>
    <div>
        <el-button @click="showAddGroupView" style="float: left" type="primary" size="mini">新增分组</el-button>
        <el-table size="mini" :data="groups" highlight-current-row @current-change="handleCurrentChange">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="组名"></el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button @click="showEditGroudView(scope.row)" type="primary" size="mini">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
            <sepc-group-form :isEdit="isEdit" :oldGroup="oldGroup" :typeId="typeId" @close="closeWin" @callback="callback"></sepc-group-form>
        </el-dialog>
    </div>
</template>

<script>
    import SepcGroupForm from "@/views/erp/product/spec/SepcGroupForm";
    export default {
        name: "SpecGroup",
        components: {SepcGroupForm},
        props:{
            typeId:{
                type:String,
                default:''
            }
        },
        watch:{
            typeId(){
                this.loadData();
            }
        },
        methods:{
            handleCurrentChange(row){
                if(row==null) row={};
                this.$emit("setCurrentGroup",row);
            },
            closeWin(){
                this.dialogVisible = false;
            },
            callback(){
                this.loadData();
                this.dialogVisible = false;
            },
            showEditGroudView(group){
                this.isEdit = true;
                this.oldGroup = group;
                this.dialogTitle="编辑分组";
                this.dialogVisible = true;
            },
            showAddGroupView(){
                this.isEdit = false;
                this.oldGroup={
                    name:''
                }
                this.dialogTitle="添加分组";
                this.dialogVisible = true;
            },
            loadData(){
                this.getRequest('/product/spec/group?typeId='+this.typeId).then((resp)=>{
                    this.groups = resp.data;
                })
            }
        },
        data(){
            return{
                groups:[],
                dialogVisible:false,
                dialogTitle:'',
                oldGroup:{},
                isEdit:false
            }
        }
    }
</script>

<style scoped>

</style>