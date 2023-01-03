import {createStore} from 'vuex'
import menu from "@/store/modules/menu";
import tabs from "@/store/modules/tabs";

export default createStore({
    state: {
        token: ''
    },
    getters: {
        GET_TOKEN: state => {
            state.token = sessionStorage.getItem("token")
            return state.token
        }
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
            sessionStorage.setItem("token", token)
        }
    },
    actions: {},
    modules: {
        menu,
        tabs
    }
})
