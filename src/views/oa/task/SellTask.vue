<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div></div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="通过单号搜索，记得回车呦..."
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"

                              @keyup.enter.native="searchTask"
                              v-model="keywords"
                              @change="keywordsChange"
                    ></el-input>
                    <el-button @click="searchTask" type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search">搜索</el-button>
                </div>
            </el-header>
            <el-main>
                <el-table v-loading="loading" @sort-change="sortChange" :data="tasks" size="mini" @row-dblclick="showDetailView">
                    <el-table-column
                            type="index"
                            align="left"
                            width="80">
                        <template scope="scope">
                            <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showDetailView(scope.row)" type="primary" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="code" align="left"  label="单号">
                        <template slot-scope="scope">
                            <span v-html="showData(scope.row.code)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="name" align="left"  label="当前步骤"></el-table-column>
                    <el-table-column prop="originatorName" align="left" label="任务发起人"></el-table-column>
                    <el-table-column label="流程状态">
                        <template slot-scope="scope">
                            <el-tag size="mini" v-if="!scope.row.assigneeName" type="info">未签收</el-tag>
                            <el-tag size="mini" v-else type="warning">处理中【{{scope.row.assigneeName}}】</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="left" label="创建时间" sortable ></el-table-column>
                    <el-table-column prop="stateTime" align="left" label="停留时间" :formatter="getDuration" sortable></el-table-column>

                </el-table>
                <div style="display: flex;justify-content: space-between;margin: 2px">
                    <el-pagination
                            background
                            :page-sizes="[10,20,50,100,200]"
                            :page-size="pageSize"
                            :current-page="currentPage"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            layout="total,sizes,prev,pager,next,jumper"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="77%">
            <sell-task-details @refresh="refresh" @close="closeWin" :task="currentTask" :rejectVisible="rejectVisible" :canEdit="canEdit"></sell-task-details>
        </el-dialog>
    </div>
</template>

<script>
    import SellTaskDetails from "@/views/oa/task/SellTaskDetails";
    export default {
        name: "PurchaseTask",
        components: {SellTaskDetails},
        mounted(){
            this.loadTask();
        },
        methods:{
            sizeChange(size){
                this.pageSize = size;
                this.loadTask();
            },
            currentChange(page) {
                this.currentPage = page;
                this.loadTask();
            },
            keywordsChange(val){
                if(val==''){
                    this.loadTask();
                }
            },
            searchTask(){
                this.loadTask();
            },
            showData(val){
                val = val+'';
                if(val.indexOf(this.keywords)!==-1&&this.keywords!==''){
                    return val.replace(this.keywords,'<font color="red">' + this.keywords + '</font>')
                }else{
                    return val;
                }
            },
            sortChange(column){
                this.sort=column.prop;
                if(column.order==='descending'){
                    this.order = "desc";
                }else{
                    this.order = "asc";
                }
                this.loadTask();
            },
            refresh(){
                this.loadTask();
            },
            closeWin(){
                this.dialogVisible = false;
            },
            //显示任务办理页面
            showDetailView(row){
                this.getRequest('/flow/task/getSellTaskById?taskId='+row.id).then((resp)=>{
                    if(resp&&resp.status==200){
                        this.currentTask = resp.data;
                        this.dialogVisible = true;
                        this.dialogTitle="任务办理";
                        if(this.currentTask.taskKey === 'sellcwreceive' && row.assigneeName != null) {
                            this.rejectVisible = true;
                        }else {
                            this.rejectVisible = false;
                        }
                        //console.log(this.rejectVisible)
                        //console.log(row)
                        if (this.currentTask.taskKey === 'sellreject') {
                            this.canEdit = true;
                        }else {
                            this.canEdit = false;
                        }
                    }else{
                        this.$message.error("获取任务失败");
                    }
                })
            },
            //加载任务列表
            loadTask(){
                this.loading = true;
                this.getRequest('/flow/task/getSellTask?page='+this.currentPage+
                    '&size='+this.pageSize+"&sort="+this.sort+"&order="+this.order+"&keywords="+this.keywords).then((resp)=>{
                    this.tasks = resp.data.tasks;
                    this.totalCount = resp.data.count;
                    this.loading = false;
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
                loading:false,
                keywords:'',
                tasks:[],
                currentPage:1,
                totalCount:-1,
                pageSize:10,
                currentTask:[],
                dialogVisible:false,
                dialogTitle:'',
                rejectVisible: false,
                canEdit: false,
                sort:'createTime',
                order:'desc'
            }
        }
    }
</script>

<style scoped>

</style>