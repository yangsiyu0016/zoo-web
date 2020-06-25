<template>
    <div>
        <el-table :data="tasks" size="mini" @row-dblclick="showDetailView">
            <el-table-column
                    type="index"
                    align="left"
                    width="30"></el-table-column>
            <el-table-column  prop="code" align="left"  label="单号"></el-table-column>
            <el-table-column  prop="name" align="left"  label="当前步骤"></el-table-column>
            <el-table-column prop="originatorName" align="left" label="任务发起人"></el-table-column>
            <el-table-column label="流程状态">
                <template slot-scope="scope">
                    <el-tag size="mini" v-if="!scope.row.assigneeName" type="info">未签收</el-tag>
                    <el-tag size="mini" v-else type="warning">处理中【{{scope.row.assigneeName}}】</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" align="left" label="创建时间" ></el-table-column>
            <el-table-column prop="stateTime" align="left" label="停留时间" :formatter="getDuration"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="showDetailView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-pagination
                    background
                    :page-size="10"
                    :current-page="currentPage"
                    layout="prev,pager,next"
                    :total="totalCount">
            </el-pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="77%">
            <assembled-task-details @refresh="refresh" @close="closeWin" :task="currentTask"></assembled-task-details>
        </el-dialog>
    </div>
</template>

<script>
    import AssembledTaskDetails from "@/views/oa/task/assembled/AssembledTaskDetails";
    export default {
        name: "AssembledTask",
        components: {AssembledTaskDetails},
        mounted(){
            this.loadTask();
        },
        methods:{
            refresh(){
                this.loadTask();
            },
            closeWin(){
                this.dialogVisible = false;
            },
            //显示任务办理页面
            showDetailView(row){
                this.getRequest('/flow/task/getAssembledTaskById?taskId='+row.id).then((resp)=>{
                    if(resp&&resp.status==200){
                        this.currentTask = resp.data;
                        this.dialogVisible = true;

                        /*if ((this.currentTask.taskKey === 'purchasecw' || this.currentTask.taskKey === 'purchasecgjl') && row.assigneeName != null) {
                            this.rejectVisible = true;
                        }else {
                            this.rejectVisible = false;
                        }
                        if (this.currentTask.taskKey === 'purchasereject') {
                            this.canEdit = true;
                        }else {
                            this.canEdit = false;
                        }*/
                        this.dialogTitle="任务办理";
                    }else{
                        this.$message.error("获取任务失败");
                    }
                })
            },
            //加载任务列表
            loadTask(){
                this.getRequest('/flow/task/getAssembledTask?page='+this.currentPage+'&size=10').then((resp)=>{
                    this.tasks = resp.data.tasks;
                    this.totalCount = resp.data.count;
                })
            },
            getDuration(row){
                let time = row.stateTime*60*1000;
                let days    = time / 1000 / 60 / 60 / 24;
                let daysRound = Math.floor(days);
                let hours = time / 1000 / 60 / 60 - (24 * daysRound);
                let hoursRound = Math.floor(hours);
                let minutes = time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
                let minutesRound = Math.floor(minutes);
                let seconds = time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
                return daysRound + '天'+hoursRound + '时'+minutesRound + '分';
                //time = hoursRound + ':' + minutesRound + ':' + seconds
                // return time;
            }
        },
        data(){
            return{
                tasks:[],
                currentPage:1,
                totalCount:-1,
                currentTask:[],
                dialogVisible:false,
                dialogTitle:'',
                rejectVisible: false,
                canEdit: false
            }
        }
    }
</script>

<style scoped>

</style>