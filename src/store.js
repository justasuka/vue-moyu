import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        token: '',
        perms:[],
        themecolor:'red'
    },
    getters:{

        getPermByIdentify: (state) => (identify) => {
            if(state.perms.length===0&&!sessionStorage.getItem('perms')){
                return null;
            }
            if(state.perms.length===0){
                state.perms=JSON.parse(sessionStorage.getItem('perms'));
            }
            return state.perms.find(perm => perm.identify === identify);
        },
        getToken(state){
            if(!state.token&&!sessionStorage.getItem('token')){
                return null;
            }
            if(!state.token){
                state.token=sessionStorage.getItem('token');
            }
            return state.token;
        },
        getEducationBureauId:(state)=>()=>{
            if(!state.educationBureauId&&!sessionStorage.getItem('educationBureauId')){
                console.log('2');
                return null;
            }
            if(!state.educationBureauId){
                state.educationBureauId=sessionStorage.getItem('educationBureauId');
            }
            return state.educationBureauId;
        }
    },
    mutations: {
        setToken(state,token){
            state.token=token;
            sessionStorage.setItem('token',token);
        },
        setPerms(state,perms){
            state.perms=perms;
            sessionStorage.setItem('perms',JSON.stringify(perms));
        },
        clearStore(state){
            state.token='';
            state.perms=[];
            state.educationBureauId='';
            sessionStorage.clear();
        },
        setEducationBureauId(state,id){
            state.educationBureauId=id;
            sessionStorage.setItem('educationBureauId',id);
        },
        setAdmin(state,admin){
            state.admin=admin;
            sessionStorage.setItem('admin',JSON.stringify(admin));
        },
        setColor(state,color){
            state.themecolor=color;
        }
    },
    actions: {
        setToken({commit},token){
            commit('setToken',token);
            sessionStorage.setItem('token',token);
        },
        setPerms({commit},perms){
            commit('setPerms',perms);
            sessionStorage.setItem('perms',JSON.stringify(perms));
        },
        setEducationBureauId({commit},id){
            commit('setEducationBureauId',id);
            sessionStorage.setItem('educationBureauId',id);
        },
        setAdmin({commit},admin){
            commit('setAdmin',admin);
        }
    }
})
