<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{ profile.username }}</h4>
          <p>
            {{profile.bio}}
          </p>

          <nuxt-link 
            class="btn btn-sm btn-outline-secondary action-btn"
            :to="{
              name: 'settings'
            }"
            v-if="user.username === $route.params.username"
          >
            <i class="ion-gear-a"></i>
            &nbsp;
            Edit Profile Settings
          </nuxt-link>
          <button class="btn btn-sm btn-outline-secondary action-btn" v-else @click="onFollow(profile)" :disabled="profile.followDisabled">
            <i class="ion-plus-round"></i>
            &nbsp;
            {{profile.following ? 'Unfollow' : 'Follow'}} {{$route.params.username}} 
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link 
                :class="[!!favorited ? '' : 'active', 'nav-link']"
                exact
                :to="{
                  name: 'profile',
                  params: {
                    username: $route.params.username
                  }
                }"
              >My Articles</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link 
                class="nav-link "
                :class="{
                  active: favorited
                }" 
                exact
                :to="{
                  name: 'profile',
                  params: {
                    username: $route.params.username,
                  },
                  query: {
                    favorited: $route.params.username
                  }
                }"
              >Favorited Articles</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="article-preview" v-for="article in articles" :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{
              name: 'profile',
              params: {
                username: article.author.username
              }
            }">
              <img :src="article.author.image" />
            </nuxt-link>
            <div class="info">
              <nuxt-link class="author" :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                {{ article.author.username }}
              </nuxt-link>
              <span class="date">{{ article.createdAt | date }}</span>
            </div>
            <button 
              class="btn btn-outline-primary btn-sm pull-xs-right" 
              :class="{
                active: article.favorited
              }"
              @click="onFavorite(article)"
              :disabled="article.favoriteDisabled"
            >
              <i class="ion-heart"></i> {{ article.favoritesCount }}
            </button>
          </div>
          <nuxt-link
            class="preview-link"
            :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }"
          >
            <h1>{{ article.title }}</h1>
            <p>{{ article.description }}</p>
            <span>Read more...</span>
            <ul class="tag-list" v-for="(item, index) in article.tagList" :key="index">
              <li class="tag-default tag-pill tag-outline">{{item}}</li>
            </ul>
          </nuxt-link>
        </div>

        <!-- 分页列表 -->
        <nav>
          <ul class="pagination">
            <li
              v-for="item in totalPage"
              :key="item"
              class="page-item"
              :class="{
                active: page == item
              }"
            >
              <nuxt-link
                class="page-link"
                :to="{
                  name: 'profile',
                  params: {
                    username: $route.params.username
                  },
                  query: {
                    page: item,
                    favorited
                  }
                }"
              >{{item}}</nuxt-link>
            </li>
          </ul>
        </nav>
        <!-- /分页列表 -->
      </div>

    </div>
  </div>

</div>

</template>

<script>
import { mapState } from 'vuex'
import { 
  getProfile, 
  getArticles,
  addFavorite,
  deleteFavorite,
  followUser,
  unfollowUser
  } from '@/api'
export default {
  middleware: 'authenticated',
  name: "ProfileIndex",
  async asyncData ({params, query}) {
    let limit = 20
    let page = query.page || 1
    let favorited = query.favorited
    const { username } = params
    const [proData, artData] = await Promise.all([
      getProfile(username), 
      getArticles({
        limit,
        offset: (page - 1) * limit,
        favorited: favorited || undefined,
        author: favorited ? undefined : username
      })])
    console.log(proData.data, artData.data)
    const {profile} = proData.data
    const {articles, articlesCount} = artData.data
    articles.forEach(article => article.favoriteDisabled = false)
    profile.followDisabled = false
    return {
      profile,
      favorited,
      articles,
      articlesCount,
      limit,
      page
    }
  },
  watchQuery: ['favorited','page'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
      // 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
    }
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onFollow (profile) {
      profile.followDisabled = true
      if (profile.following) {
        await unfollowUser(profile.username)
        profile.following = false
      } else {
        await followUser(profile.username)
        profile.following = true
      }
      profile.followDisabled = false
    }
  }
}
</script>

<style>

</style>