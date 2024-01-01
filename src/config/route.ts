// 定义一些路由
import Index from "../pages/index/IndexPage.vue";
import Team from "../pages/team/TeamPage.vue";
import MyTeamPage from "../pages/team/MyTeamPage.vue";
import MyCreateTeamPage from "../pages/team/MyCreateTeamPage.vue";
import UserUpdatePage from "../pages/user/UserUpdatePage.vue";
import Search from "../pages/search/SearchPage.vue";
import UserEditPage from "../pages/user/UserEditPage.vue";
import SearchResultPage from "../pages/search/SearchResultPage.vue";
import UserLoginPage from "../pages/user/UserLoginPage.vue";
import UserTagsPage from "../pages/user/UserTagsPage.vue";
import UserRegisterPage from "../pages/user/UserRegisterPage.vue";
import UserPage from "../pages/user/UserPage.vue";
import TeamAddPage from "../pages/team/TeamAddPage.vue";
import TeamUpdatePage from "../pages/team/TeamUpdatePage.vue";

const routes = [
    {path: '/', component: Index},
    {path: '/team',title:'队伍',  component: Team},
    {path: '/team/my/join', title:'我加入的队伍',component: MyTeamPage},
    {path: '/team/my/create',title:'我创建的队伍', component: MyCreateTeamPage},
    {path: '/team/add',title:'添加队伍', component: TeamAddPage},
    {path: '/team/update',title:'修改队伍', component: TeamUpdatePage},
    {path: '/user', title:'我的信息',component: UserPage},
    {path: '/search',title:'搜索队伍', component: Search},
    {path: '/user/list', component: SearchResultPage},
    {path: '/user/login',title:'用户登录', component: UserLoginPage},
    {path: '/user/register',title:'用户注册', component: UserRegisterPage},
    {path: '/user/edit',title:'编辑信息', component: UserEditPage},
    {path: '/user/tags',title:'我的标签', component: UserTagsPage},
    {path: '/user/update', title:'用户信息',component: UserUpdatePage},
]

export default routes;