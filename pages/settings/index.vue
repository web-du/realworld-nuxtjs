<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <form @submit.prevent="onSubmit">
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="user.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="user.email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="New Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
          </fieldset>
        </form>
        <hr>
        <button class="btn btn-outline-danger" @click="logOut">
          Or click here to logout.
        </button>
      </div>

    </div>
  </div>
</div>

</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import {
  getCurrentUser,
  updateUser
} from '@/api'
import { mapMutations } from 'vuex'
export default {
  middleware: 'authenticated',
  name: "SettingsIndex",
  async asyncData () {
    const {data} = await getCurrentUser()
    return {
      user: data.user
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async onSubmit () {
      let user = this.user
      await updateUser({
        ...user
      })
      this.$router.push({
        name: 'profile',
        params: {
          username: user.username
        }
      })
    },
    logOut () {
      Cookie.remove('user');
      this.setUser(null)
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>