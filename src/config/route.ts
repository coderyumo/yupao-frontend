// 定义一些路由
import Index from "../pages/IndexPage.vue";
import Team from "../pages/TeamPage.vue";
import MyTeamPage from "../pages/MyTeamPage.vue";
import User from "../pages/UserPage.vue";
import Search from "../pages/SearchPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import DoPassword from "../pages/DoPassword.vue";

const routes = [
    {path: '/', component: Index},
    {path: '/team', component: Team},
    {path: '/myteam', component: MyTeamPage},
    {path: '/team/add', component: TeamAddPage},
    {path: '/team/update', component: TeamUpdatePage},
    {path: '/team/dopassword', component: DoPassword},
    {path: '/user', component: User},
    {path: '/search', component: Search},
    {path: '/user/list', component: SearchResultPage},
    {path: '/user/login', component: UserLoginPage},
    {path: '/user/edit', component: UserEditPage},
]

export default routes;