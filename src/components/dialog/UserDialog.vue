<template>
    <div>
        <el-dialog :title="title"  :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" :show-on-press-escape="false" :show-close="false">
            <div>
                <el-table :data="users" @row-dblclick="dblclick">
                    <el-table-column type="index" width="30"></el-table-column>
                    <el-table-column prop="realName" align="left"></el-table-column>
                </el-table>
            </div>
            <el-divider></el-divider>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="info" @click="closeWin">关闭</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UserDialog",
        props:{
            title:{
                type:String,
                default: "用户列表"
            },
            visible:{
                type:Boolean,
                default:false
            }
        },
        mounted:function(){
            this.loadUser();
        },
        methods:{
            loadUser(){
                this.getRequest('/user/all').then((resp)=>{
                    this.users = resp.data;
                })
            },
            dblclick(row){
                this.$emit("dblclick",row);
            },
            closeWin(){
                this.$emit("closeWin");
            }
        },
        data(){
            return{
                users:[]
            }
        }
    }
</script>

<style scoped>

</style>