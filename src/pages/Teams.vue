<template>
    <div>
        <h4 class="display-1">Teams</h4>

        <instructions details="Create Teams here!" />

            <v-text-field
                v-model="name"
                v-bind:rules="rules.required"
                error-count="10"
                type="text"
                label="Team Name"
                required
            ></v-text-field>
            <v-text-field
                v-model="description"
                v-bind:rules="rules.required"
                error-count="10"
                type="text"
                label="Description"
                required
            ></v-text-field>
            <v-btn v-on:click="handleSubmit"
                >Create Team
            </v-btn>

        <div class="text-xs-center">
            <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        {{ dialogHeader }}
                    </v-card-title>

                    <v-card-text> {{ dialogText }} </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat v-on:click="hideDialog"
                            >Okay</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import Instructions from "../components/Instructions.vue";
import axios from "axios";

export default {
    name: "TeamsPage",
    components: {
        Instructions
    },
    data: function() {
        return {
            valid: false,
            name: "",
            description: "",

            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            rules: {
                required: [
                    val => val.length > 0 || 'Required'
                ]
            }
        };
    },
    methods: {
        handleSubmit: function() {
            axios
                .post("/api/teams", {
                    name: this.name,
                    description: this.description,
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },
        showDialog: function(header, text) {
            this.dialogHeader = header;
            this.dialogText = text;
            this.dialogVisible = true;
        },
        hideDialog: function() {
            this.dialogVisible = false;
            // this.$router.push({ name: "home-page" });
        }
    },

};
</script>

