<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <ul class="error-messages">
          <template
            v-for="(messages, field) in errors"
          >
            <li
              v-for="(message, index) in messages"
              :key="index"
            >{{ field }} {{ message }}</li>
          </template>
        </ul>
        <!-- <form @submit.prevent="onSubmit"> -->
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Article Title" v-model="article.title">
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" v-model="article.description">
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" v-model="article.body"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" @keyup.enter="createTags">
                <input type="hidden">
                <div class="tag-list">
                  <span class="tag-default tag-pill" v-for="(tag, index) in article.tagList" :key="index">
                    <i class="ion-close-round" @click="deleteTag(index)"></i>
                    {{tag}}
                  </span>
                </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" @click="onSubmit">
                Publish Article
            </button>
          </fieldset>
        <!-- </form> -->
      </div>

    </div>
  </div>
</div>



</template>

<script>
import {
  createArticle,
  getArticle,
  updateArticle
} from '@/api/index'
export default {
  middleware: 'authenticated',
  name: "EditorIndex",
  data () {
    return {
      article: {
        title: "",
        description: "",
        body: "",
        tagList: []
      },
      errors: {}
    }
  },
  async asyncData ({query}) {
    console.log(query)
    const slug = query.slug
    let article = {
      title: "",
      description: "",
      body: "",
      tagList: []
    }
    
    try {
      if (slug) {
        const { data } = await getArticle(slug)
        article = data.article
      }
    } catch (error) {
      console.log(error, 'getArticle')
    }
    return {
      article,
      slug
    }
  },
  methods: {
    createTags ($event) {
      this.article.tagList.push($event.target.value)
      $event.target.value = ''
    },
    deleteTag (index) {
      this.article.tagList.splice(index, 1)
    },
    async onSubmit () {
      try {
        const loadArticle = this.slug ? updateArticle : createArticle
        
        const { data } = await loadArticle({
          article: {
            ...this.article
          }
        })
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          }
        })
      } catch (error) {
        this.errors = error.response.data.errors
      }
    }
  }
}
</script>

<style>

</style>