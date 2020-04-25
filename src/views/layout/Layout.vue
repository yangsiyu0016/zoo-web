<template>
    <div>
        <el-container class="home-container">
            <el-header class="home-header">
                <span class="home_title">牧疆南北办公系统</span>
                <div style="display: flex;align-items: center;margin-right: 7px">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
                            {{user.realName}}
                            <i><img style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人中心</el-dropdown-item>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="220px" class="home-aside">
                    <div style="justify-content: flex-start;text-align: left;">
                        <sidebar></sidebar>
                    </div>

                </el-aside>
                <el-container>
                    <el-main>
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item v-text="this.$router.currentRoute.meta.title"></el-breadcrumb-item>
                        </el-breadcrumb>
                        <router-view></router-view>
                    </el-main>

                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import sidebar from './sidebar/'

    export default {
        components:{sidebar},
        name: "Layout",
        methods:{
            handleCommand(cmd){
                if(cmd=="logout"){
                    this.$confirm('注销登录,是否继续？','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.getRequest("/logout");
                        this.$store.commit('LOGOUT');
                        this.$router.push({path: '/login'}).catch(()=>{});
                    }).catch(()=>{
                        this.$message({
                            type: 'info',
                            message: '取消'
                        });

                    })
                }
            }
        },
        computed:{
            user(){
                return this.$store.state.user.user;
            }
        }
    }
</script>

<style>
    .home-container {
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
    }
    .home-header {
        background-color: #20a0ff;
        color: #333;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: content-box;
        padding: 0px;
    }
    .home_title {
        color: #fff;
        font-size: 22px;
        display: inline;
        margin-left: 8px;
    }
    .home_userinfo{
        color:#fff;
        cursor: pointer;
    }
    .home_userinfoContainer {
        display: inline;
        margin-right: 20px;
    }
    .home-aside {
        background-color: #ECECEC;
    }
</style>