<template>
    <div>
        <el-tree
                :data="resources"
                show-checkbox
                node-key="id"
                :props="props"
                :default-expand-all="true"
                :check-strictly="true"
                ref="resourcesTree"
                :default-checked-keys="defaultCheckedsKeys">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" @click="saveResource" type="primary" >确 定</el-button>
        </span>
    </div>

</template>

<script>
    export default {
        name: "ResourceTree",
        props:{
            typeId:{
                type:String,
                default:""
            }
        },
        watch:{
            typeId:{
                handler(val){
                    this.loadResources();
                    this.getRequest("/company/type/getResource?typeId="+val).then(resp=>{
                        this.defaultCheckedsKeys = resp.data;
                    })
                },
                deep:true,
                immediate:true
            }
        },
        mounted(){

        },
        methods:{

            saveResource(){
                const tree = this.$refs['resourcesTree'];
                const menuIds = tree.getCheckedKeys();
                this.putRequest("/company/type/updateResource",{
                    typeId:this.typeId,
                    menuIds:menuIds
                }).then(resp=>{
                    if(resp&&resp.status==200){
                        this.$message({type:resp.status,message:resp.data.msg});
                    }else{
                        this.$message.error("更新失败")
                    }
                })
            },
            cancel(){
                this.$emit("close");
            },
            loadResources(){
                let _this = this;
                this.getRequest("/menu/getAllMenu").then(resp=>{
                    _this.resources = resp.data;
                });
            },
        },
        data(){
            return{
                props:{
                    label:'title',
                    children:'children'
                },
                resources:[],
                defaultCheckedsKeys:[]
            }
        }
    }
</script>

<style scoped>

</style>