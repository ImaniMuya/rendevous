import Vue from "vue";

Vue.config.productionTip = false;

import Vuetify from "vuetify";

Vue.use(Vuetify);
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import Home from "./pages/Home.vue";
import SignUp from "./pages/SignUp.vue";
import Login from "./pages/Login.vue";
import ResetPassword from "./pages/ResetPassword.vue";
import Accounts from "./pages/Accounts.vue";
import Notifications from "./pages/Notifications.vue";
import Teams from "./pages/Teams.vue";
import Schedule from "./pages/Schedule.vue";

import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {name: "home-page", path: "/", component: Home},
        {name: "sign-up", path: "/sign-up", component: SignUp},
        {name: "login", path: "/login", component: Login},
        {name: "reset-password", path: "/reset-password", component: ResetPassword},
        {name: "accounts", path: "/accounts", component: Accounts},
        {name: "notifications", path: "/notification", component: Notifications},
        {name: "teams", path: "/teams", component: Teams},
        {name: "schedule", path: "/schedule", component: Schedule},
    ]
});

import App from "./App.vue";

new Vue({
    el: "#app",
    router,
    render: h => h(App)
});
