import myAxios from "../plugins/myAxios";
import {useRouter} from "vue-router";

const router = useRouter();

export const getCurrentUser = async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken == null) {
        await router.push('/user/login')
    } else {
        const userAccount = currentToken.split('-')[0];
        const uuid = currentToken.split('-')[1];
        const url = '/user/current?userAccount=' + userAccount + '&uuid=' + uuid;
        return await myAxios.get(url);
    }
}
