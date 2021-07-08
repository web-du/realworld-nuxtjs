<template>
  <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li v-if="user" class="nav-item">
              <nuxt-link
                class="nav-link"
                :class="{
                  active: tab === 'your_feed'
                }"
                exact
                :to="{
                  name: 'home',
                  query: {
                    tab: 'your_feed'
                  }
                }"
              >Your Feed</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                :class="{
                  active: tab === 'global_feed'
                }"
                exact
                :to="{
                  name: 'home'
                }"
              >Global Feed</nuxt-link>
            </li>
            <li v-if="tag" class="nav-item">
              <nuxt-link
                class="nav-link"
                :class="{
                  active: tab === 'tag'
                }"
                exact
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: tag
                  }
                }"
              ># {{ tag }}</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="article-preview" v-for="article in articles"
            :key="article.slug">
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
                  path: '/',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: tab
                  }
                }"
              >{{item}}</nuxt-link>
            </li>
          </ul>
        </nav>
        <!-- /分页列表 -->
      </div>

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list">
            <nuxt-link 
              class="tag-pill tag-default" 
              :to="{
                path: '/',
                query: {
                  tab: 'tag',
                  tag
                }
              }" 
              v-for="(tag, index) in tags" 
              :key="index">{{tag}}</nuxt-link>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import {
  getArticles,
  getTags,
  getYourFeedArticles,
  addFavorite,
  deleteFavorite
} from '@/api/index'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  async asyncData ({query}) {
    let limit = 20
    let page = query.page || 1
    const tab = query.tab || 'global_feed'
    const tag = query.tag
    const loadArticles = tab === 'global_feed'
      ? getArticles
      : getYourFeedArticles
    const [articleRes, tagRes] = await Promise.all([loadArticles({
      limit,
      offset: (page - 1) * limit,
      tag: query.tag
    }), getTags()])
    const {articles, articlesCount} = articleRes.data
    const { tags } = tagRes.data
    articles.forEach(article => article.favoriteDisabled = false)
    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tab,
      tag
    }
  },
  watchQuery: ['page','tag', 'tab'],
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
    }
  }
}
</script>

<style>

</style>