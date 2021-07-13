<template>
  <div>
    <form class="card comment-form" @submit.prevent="onSubmit">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="comment.body"></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
        Post Comment
        </button>
      </div>
    </form>

    <div
      class="card"
      v-for="(comment,index) in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
        <span class="mod-options" v-if="comment.author.username === user.username">
          <i class="ion-trash-a" @click="deleteCb(article.slug, comment, index)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      comments: [], // 文章列表
      comment: {
        body: ''
      },
    }
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    async onSubmit () {
      if (this.comment.body) {
        const {data} = await addComment({
          comment: {
            ...this.comment
          }
        },this.article.slug)
        this.comments.splice(0,0,data.comment)
        this.comment.body = ''
      }
    },
    async deleteCb(slug, comment, index) {
      await deleteComment(slug, comment.id)
      this.comments.splice(index, 1)

    }
  }
}
</script>

<style>

</style>
