
const branchSelector = Vue.createApp({
    data() {
        return {
            orgList: []
        }
    },
    methods: {
        getOrgs() {
            // Fetch orgList data from the server
        },
        selectBranch(orgID) {
            this.$emit('branch-selected', orgID);
        }
    },
    mounted() {
        this.getOrgs();
    }
}).mount('header');
