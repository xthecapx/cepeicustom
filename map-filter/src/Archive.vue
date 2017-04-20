<template>
  <div id="archive">
    <ul>
      <li v-for="post in posts">{{post.title}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'archive',
  data() {
    return {
      posts: [],
      pagination: {}
    }
  },
  methods: {
    defineUrl() {
      let a = document.createElement('a')
      a.href = window.location.href

      if (a.hostname == "localhost") {
        return "/api/wp-json/wp/v2/multiple-post-type?categories=325&_embed&type[]=eventos_cepei&type[]=gobernanzas&type[]=bibliotecas&type[]=datos"
      }

      if (!this.getParameterByName("post_type")) {
        return "/wp-json/wp/v2/destacados_home?_embed"
      }

      if (this.getParameterByName("post_type") == "eventos_cepei") {
        return "/wp-json/wp/v2/eventos_cepei?tags=331&_embed"
      }

      if (this.getParameterByName("post_type") == "bibliotecas") {
        return "/wp-json/wp/v2/bibliotecas?tags=331&_embed"
      }          
    }
  },
  created() {
      this.$http.get(this.defineUrl())
          .then(response => {
              for (let i = 0, l = response.data.length; i < l; i++) {
                  let data = {
                      title: response.data[i].title.rendered,
                      bg: response.data[i]._embedded["wp:featuredmedia"] && response.data[i]._embedded["wp:featuredmedia"][0].source_url,
                      content: response.data[i].excerpt.rendered
                  }
                  this.posts.push(data)
                  this.ordered = this.posts.slice()
              }
          }, response => {
              // error callback
              console.log("e")
          });
  }
}
</script>

