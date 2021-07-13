<template>
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
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <template v-if="user.username !== article.author.username">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
        :disabled="isFollowUserButton"
        @click="isFollowUser(article)"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following ? 'Unfollow' : 'Follow'}} {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        @click="isFavorited(article)"
        :disabled="isFavoritedButton"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{article.favorited ? 'Unfavorite Article' : 'Favorite Post'}} <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
    <template v-else>
      <span class="ng-scope">
        <nuxt-link 
          class="btn btn-outline-secondary btn-sm" 
          :to="{
            name: 'editor',
            query: {
              slug: article.slug
            }
          }"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>

        <button 
          class="btn btn-outline-danger btn-sm" ng-class="{disabled: $ctrl.isDeleting}"
          @click="deleteArticle(article.slug)"
        >
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  deleteArticle,
  followUser,
  unfollowUser,
  addFavorite,
  deleteFavorite
} from '@/api/index'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFollowUserButton: false,
      isFavoritedButton: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async deleteArticle (slug) {
      await deleteArticle(slug)
      this.$router.replace({
        name: 'home',
        query: {
          tab:'your_feed'
        }
      })
    },
    async isFollowUser (article) {
      this.isFollowUserButton = true
      if (article.author.following) {
        await unfollowUser(article.author.username)
        article.author.following = false
      } else {
        await followUser(article.author.username)
        article.author.following = true
      }
      this.isFollowUserButton = false
    },
    async isFavorited (article) {
      this.isFavoritedButton = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount --
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount ++
      }
      this.isFavoritedButton = false
    }
  }
}
</script>

<style>

</style>
