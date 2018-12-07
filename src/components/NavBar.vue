<template>
    <v-toolbar dark color="primary">
        <v-menu offset-y>
            <v-btn flat slot="activator">
                <v-toolbar-side-icon></v-toolbar-side-icon>
            </v-btn>

            <v-list>
                <v-list-tile v-bind:to="{ name: 'schedule' }">
                    <v-list-tile-title>Schedule</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-bind:to="{ name: 'teams' }">
                    <v-list-tile-title>Teams</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-bind:to="{ name: 'notifications' }">
                    <v-list-tile-title>Notifications</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-on:click="SignOut">
                    <!-- <v-list-tile-title>Reset-Password</v-list-tile-title> -->
                    <v-list-tile-title>Logout</v-list-tile-title>
                </v-list-tile>
                
            </v-list>
        </v-menu>

        <router-link v-bind:to="{ name: 'home-page' }">
            <v-toolbar-title class="white--text">
                Tous Les Memes
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn flat v-bind:to="{ name: 'login' }">Login</v-btn>

        <!-- <v-btn v-on:click="fakeSignOut">Fake Sign Out</v-btn> -->
        <!-- <v-btn v-on:click="fakeSignIn">Fake Sign In</v-btn> -->

        <v-menu offset-y>
            <v-btn flat slot="activator">
                <span>Admin</span>
                <v-icon dark>arrow_drop_down</v-icon>
            </v-btn>

            <v-list>
                <v-list-tile v-bind:to="{ name: 'accounts' }">
                    <v-list-tile-title>Accounts</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-toolbar>
</template>

<script>
    export default {
        name: "SignIn",
        methods: {
            SignIn: function () {
                this.$root.currentUser = 'A User';
            },
            SignOut: function () {
                this.$root.currentUser = null;
            }
        },
        computed: {
            currentUser: function() {
                if (this.$root.currentUser) {
                    return this.$root.currentUser;
                } else {
                    return "No one logged in";
                }
            }
        }
    }
</script>