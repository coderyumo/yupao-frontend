import myAxios from "../plugins/myAxios";
import {useRouter} from "vue-router";

const router = useRouter();

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (token == null) {
        await router.push('/user/login')
    } else {
        const userAccount = token.split('-')[0];
        const uuid = token.split('-')[1];
        const url = '/user/current?userAccount=' + userAccount + '&uuid=' + uuid;
        return await myAxios.get(url);
    }
}

