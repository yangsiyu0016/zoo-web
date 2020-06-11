<template>
    <div>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" :append-to-body="true" :show-close="false">
            <el-container>
                <el-main>
                    <el-table size="mini" :data="directorys" @row-dblclick="dblclick">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="目录名称" prop="name"></el-table-column>
                        <el-table-column label="序号" prop="orderNumber"></el-table-column>
                        <el-table-column label="上级目录" prop="parent.name"></el-table-column>
                    </el-table>
                </el-main>
                <el-footer>
                    <el-button size="mini" type="info" @click="close">取消</el-button>
                </el-footer>
            </el-container>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DirectoryDialog",
        props:{
            dialogVisible:{
                type:Boolean,
                defalut:false
            },
            dialogTitle:{
                type:String,
                default:''
            }
        },
        mounted(){
            this.loadDirectory();
        },
        methods:{
            dblclick(row) {
              this.$emit("callback",row);
            },
            loadDirectory(){
                this.getRequest('/system/parameterDirectory/list').then(resp=>{
                    this.directorys = resp.data;
                })
            },
            close(){
                this.$emit("close");
            }
        },
        data(){
            return{
                directorys:[]
            }
        }
    }
</script>

<style scoped>

</style>