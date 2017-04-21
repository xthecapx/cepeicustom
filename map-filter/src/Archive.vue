<template>
  <div id="archive">
    <h3 class="section-title">ARCHIVO</h3>
    <div class="filter">
      <div class="label">
        FILTRAR POR:
      </div>
      <select name="pais" id="pais" v-model="tagSelected" @change="updateTags">
        <option v-for="tag in tags" :value="tag.value">{{ tag.name }}</option>
      </select>
      <select name="tema" id="tema" v-model="temaSelected" @change="updateTemas">
        <option v-for="tema in temas" :value="tema.value">{{ tema.name }}</option>
      </select>
      <div class="main-img">
        <img :src="imgSelected" alt="">
      </div>
    </div>
    <ul class="content-wrapper">
      <li v-for="(post, key) in posts" class="post">
        <div class="img-wrapper">
          <img :src="post.bg " alt="">
        </div>
        <h3>{{post.title}}</h3>
        <div class="content" v-html="post.content"></div>
      </li>
    </ul>
    <paginate
      v-if="pagination.totalpages > 1"
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
        default: "&type[]=eventos_cepei&type[]=gobernanzas&type[]=bibliotecas&type[]=datos&_embed",
        page: "&page=1",
        perPage: "&per_page=8"
      },
      embed: "&_embed",
      url: "",
      queryParams: "",
      filter: {
        page: 1
      },
      headers: {
        total: "X-WP-Total",
        totalPages: "X-WP-TotalPages"
      },
      tags: [
        {name: "colombia", value: "218"}
      ],
      paisesIMG: {
        "218": "http://a3d.db3.myftpupload.com/wp-content/uploads/2017/04/mapa-eventos-bogota.png"
      },
      temas: [
        {
          name: "Todos",
          value: "&type[]=eventos_cepei&type[]=gobernanzas&type[]=bibliotecas&type[]=datos"
        },
        {
          name: "Eventos",
          value: "&type[]=eventos_cepei"
        },
        {
          name: "Gobernanza",
          value: "&type[]=gobernanzas"
        },
        {
          name: "Multimedia",
          value: "&type[]=bibliotecas"
        },
        {
          name: "Datos",
          value: "&type[]=datos"
        }
      ],
      categorias: [
        {
          name: "Eventos",
          value: "?categories=325"
        }
      ],
      temaSelected: "",
      imgSelected: "",
      tagSelected: "",
      filteredTag: "",
      filteredTema: ""
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
        this.url = "/api/wp-json/wp/v2/multiple-post-type"
        this.headers = {
          total: "x-wp-total",
          totalPages: "x-wp-totalpages"
        }
        return
      }

      if (this.getParameterByName("post_type") == "eventos_cepei") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
      }
        
    },
    showMore(pageNum) {
      this.updateData(this.url + 
                      this.categorias[0].value + 
                      "&page=" + pageNum +
                      this.consult.perPage +
                      this.temas[0].value +
                      this.embed)
    },
    updateTags() {
      this.filteredTag = "&tags=" + this.tagSelected

      this.updateData(this.url + 
                      this.categorias[0].value + 
                      this.consult.page +
                      this.consult.perPage +
                      this.filteredTag + 
                      this.temaSelected +
                      this.embed)
      this.imgSelected = this.paisesIMG[this.tagSelected]
    },
    updateTemas() {
      this.updateData(this.url + 
                      this.categorias[0].value + 
                      this.consult.page +
                      this.consult.perPage +
                      this.temaSelected +
                      this.embed)
    },
    updateData(url) {
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
              }

              this.pagination['total'] = parseInt(response.headers.map[this.headers.total][0])
              this.pagination['totalpages'] = parseInt(response.headers.map[this.headers.totalPages][0])
          }, response => {
              // error callback
              console.log("e")
          });
    },
  },
  created() {
      this.defineUrl()
      this.imgSelected = this.paisesIMG["218"]
      this.temaSelected = this.temas[0].value
      this.updateData(this.url + 
                      this.categorias[0].value + 
                      this.consult.page +
                      this.consult.perPage +
                      this.temaSelected +
                      this.embed)
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

