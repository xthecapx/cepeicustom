<template>
  <div id="archive">
    <div class="filter">
    </div>
    <ul class="content-wrapper">
      <li v-for="(post, key) in posts" class="post">
        <div class="img-wrapper">
          <img :src="post.bg " alt="">
        </div>
        <h3>{{post.title}}</h3>
        <div class="content" v-html="post.content"></div>
        <div class="clearfix" v-if="key%4 == 0"></div>
      </li>
    </ul>
    <paginate
      :page-count="pagination.totalpages"
      :click-handler="showMore"
      :prev-text="'<'"
      :next-text="'>'"
      :container-class="'pagination'">
    </paginate>
  </div>
</template>

<script>
export default {
  name: 'archive',
  data() {
    return {
      posts: [],
      pagination: {
        totalpages: 0
      },
      consult: {
        default: "per_page=8&categories=325&type[]=eventos_cepei&type[]=gobernanzas&type[]=bibliotecas&type[]=datos",
        page: "page=1",
      },
      url: "",
      queryParams: "",
      filter: {
        page: 1
      }
    }
  },
  methods: {
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    defineUrl() {
      let a = document.createElement('a')
      a.href = window.location.href

      if (a.hostname == "localhost") {
        this.url = "/api/wp-json/wp/v2/multiple-post-type?_embed"
        return
      }
      
      if (!this.getParameterByName("post_type")) {
        this.url = "/wp-json/wp/v2/destacados_home?_embed"
      }

      if (this.getParameterByName("post_type") == "eventos_cepei") {
        this.url = "/wp-json/wp/v2/eventos_cepei?tags=331&_embed"
      }

      if (this.getParameterByName("post_type") == "bibliotecas") {
        this.url = "/wp-json/wp/v2/bibliotecas?tags=331&_embed"
      }          
    },
    doSearch() {
      let url = ""

      this.queryParams = "&page=" + this.filter.page + "&" + this.consult.default
      url = this.url + this.queryParams

      this.$http.get(url)
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
    },
    showMore(pageNum) {
      let url = ""

      this.queryParams = "&page=" + pageNum + "&" + this.consult.default
      url = this.url + this.queryParams

      this.$http.get(url)
          .then(response => {
              this.posts = []

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
    },
  },
  created() {
      let url = ""

      this.queryParams = "&categories=325&type[]=eventos_cepei&type[]=gobernanzas&type[]=bibliotecas&type[]=datos"
      this.defineUrl()
      
      url = this.url + this.queryParams

      this.$http.get(url)
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
              
              this.pagination['total'] = parseInt(response.headers.map['x-wp-total'][0])
              this.pagination['totalpages'] = parseInt(response.headers.map['x-wp-totalpages'][0])

          }, response => {
              // error callback
              console.log("e")
          });
  }
}
</script>

<style>
#archive .content-wrapper {
  display: block;
  padding: 0;
  margin: 0;
}

#archive .content-wrapper:after {
  content: "";
  display: table;
  clear: both;
}

#archive .content-wrapper .post {
  float: left;
  width: 25%;
  list-style-type: none;
  height: 300px;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

#archive .content-wrapper .post .img-wrapper {
  width: 100%;
  height: 150px;
}

#archive .content-wrapper .post img {
  width: auto;
  height: 100%
}

</style>

