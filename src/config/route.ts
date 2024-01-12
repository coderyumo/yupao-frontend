// 定义一些路由
import Index from "../pages/IndexPage.vue";
import Team from "../pages/TeamPage.vue";
import MyTeamPage from "../pages/MyTeamPage.vue";
import MyCreateTeamPage from "../pages/MyCreateTeamPage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import Search from "../pages/SearchPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import UserTagsPage from "../pages/UserTagsPage.vue";
import MyFriendPage from "../pages/MyFriendPage.vue";
import UserRegisterPage from "../pages/UserRegisterPage.vue";
import MessagePage from "../pages/MessagePage.vue";
import UserPage from "../pages/UserPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import QRCode from "../pages/QRCode.vue";

const routes = [
    {path: '/', component: Index},
    {path: '/team',title:'队伍',  component: Team},
    {path: '/team/my/join', title:'我加入的队伍',component: MyTeamPage},
    {path: '/team/my/create',title:'我创建的队伍', component: MyCreateTeamPage},
    {path: '/team/add',title:'添加队伍', component: TeamAddPage},
    {path: '/team/update',title:'修改队伍', component: TeamUpdatePage},
    {path: '/team/qrcode', title:'二维码',component: QRCode},
    {path: '/user', title:'我的信息',component: UserPage},
    {path: '/search',title:'搜索队伍', component: Search},
    {path: '/user/list', component: SearchResultPage},
    {path: '/user/login',title:'用户登录', component: UserLoginPage},
    {path: '/user/my/friend',title:'好友列表', component: MyFriendPage},
    {path: '/user/register',title:'用户注册', component: UserRegisterPage},
    {path: '/user/edit',title:'编辑信息', component: UserEditPage},
    {path: '/user/tags',title:'我的标签', component: UserTagsPage},
    {path: '/user/update', title:'用户信息',component: UserUpdatePage},
    {path: '/message', title:'好友申请',component: MessagePage},
]

export default routes;