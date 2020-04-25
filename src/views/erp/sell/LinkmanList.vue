<template>
    <div>
        <el-button size="mini" type="primary" @click="showAddLinkmanView"  style="float: left">添加联系人</el-button>
        <el-table :data="linkmans">
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column prop="realName" label="姓名" ></el-table-column>
            <el-table-column prop="nikeName" label="称呼"> </el-table-column>
            <el-table-column label="性别">
                <template slot-scope="scope">
                    <span v-if="scope.row.sex==1">男</span>
                    <span v-else>女</span>
                </template>
            </el-table-column>
            <el-table-column prop="job" label="职位"></el-table-column>
            <el-table-column prop="telphone" label="座机"></el-table-column>
            <el-table-column prop="cellphone" label="手机"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="birthday" label="生日"></el-table-column>
            <el-table-column prop="description" label="备注"></el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="showEditLinkmanView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">编辑</el-button>
                    <el-button @click="deleteLinkman(scope.row)" type="danger"  size="mini"  style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加联系人" :visible.sync="linkmanDialogVisible" :append-to-body="true" :close-on-click-modal="false">
            <linkman-form :isEdit="isEdit" @editLinkman="editLinkman" :oldLinkman="oldLinkman" @addLinkman="addLinkman"></linkman-form>
        </el-dialog>
    </div>
</template>

<script>
    import LinkmanForm from "@/views/erp/sell/LinkmanForm";
    export default {
        name: "LinkmanList",
        components: {LinkmanForm},
        props:{
            linkmans:{
                type:Array,
                default:()=>[]
            },
            customerId:{
                type:String,
                default:''
            }
        },
        methods:{
            deleteLinkman(row){
                this.linkmans.some((item,i)=>{
                    if(item==row){
                        this.linkmans.splice(i,1);
                        return true;
                    }
                })
            },
            editLinkman(linkman){
                let _this = this;
                if(_this.customerId){
                    _this.putNoEnCodeRequest('/customer/linkman/updateLinkman',linkman).then((resp)=>{
                        if(resp.data.status=="200"){
                            _this.linkmans.some((item,i)=>{
                                if(item==_this.oldLinkman){
                                    _this.linkmans.splice(i,1,linkman);
                                }
                            })
                            _this.linkmanDialogVisible = false;
                            _this.$message.success("更新成功");
                        }else{
                            _this.$message.error("更新失败")
                        }
                    })
                }else{
                    _this.linkmans.some((item,i)=>{
                        if(item==_this.oldLinkman){
                            _this.linkmans.splice(i,1,linkman);
                        }
                    })
                    this.linkmanDialogVisible = false;
                }



            },
            addLinkman(linkman){
                if(this.customerId){
                    Object.assign(linkman,{customerId:this.customerId});
                    this.postNoEnCodeRequest('/customer/linkman/addLinkman',linkman).then((resp)=>{
                        if(resp.data.status==200){
                            linkman = resp.data.linkman;
                            this.linkmans.push(linkman);
                            this.linkmanDialogVisible = false;
                            this.$message.success("添加成功");
                        }else{
                            this.$message.error("添加失败")
                        }
                    })
                }else{
                    this.linkmans.push(linkman);
                    this.linkmanDialogVisible = false;
                }

            },
            showEditLinkmanView(row){
                this.isEdit = true;
                this.oldLinkman = row;
                this.linkmanDialogVisible = true;
            },
            showAddLinkmanView(){
                this.isEdit = false;
                this.oldLinkman={
                    realName:'',
                    nikeName:'',
                    sex:1,
                    job:'',
                    telphone:'',
                    cellphone:'',
                    email:'',
                    birthday:'',
                    description:''
                }
                this.linkmanDialogVisible = true;
            }
        },
        data(){
            return{
                isEdit:false,
                oldLinkman:{
                    realName:'',
                    nikeName:'',
                    sex:'1',
                    job:'',
                    telphone:'',
                    cellphone:'',
                    email:'',
                    birthday:'',
                    description:''
                },
                linkmanDialogVisible:false,

                //日期选择器
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }
            }
        }
    }
</script>

<style scoped>

</style>