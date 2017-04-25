<template>
  <div id="archive">
    <h3 class="section-title">{{ title }}</h3>
    <div class="filter">
      <div class="label">
        FILTRAR POR:
      </div>
      <input type="text" v-model="search" v-if="inCategory">
      <select name="pais" id="pais" v-model="tagSelected" @change="updateTags">
        <option v-for="tag in tags" :value="tag.value">{{ tag.name }}</option>
      </select>
      <select name="tema" id="tema" v-model="temaSelected" @change="updateTemas">
        <option v-for="tema in temas" :value="tema.value">{{ tema.name }}</option>
      </select>
      <select name="fecha" id="fecha" v-model="fechaSelected" @change="updateFechas">
        <option v-for="fecha in fechas" :value="fecha.value">{{ fecha.name }}</option>
      </select>
      <button @click="searchTerm" v-if="inCategory">BUSCAR</button>
      <div v-if="!inCategory" class="main-img">
        <img :src="imgSelected" alt="">
      </div>
    </div>
    <ul class="content-wrapper">
      <li v-for="(post, key) in posts" class="post">
        <div class="img-wrapper">
          <img :src="post.bg " alt="">
        </div>
        <a :href="post.link"><h3>{{post.title}}</h3></a>
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
        { name: "CIUDAD", value: "" },
        { name: "colombia", value: "&tags=218" }
      ],
      paisesIMG: {
        "218": "http://a3d.db3.myftpupload.com/wp-content/uploads/2017/04/mapa-eventos-bogota.png"
      },
      temas: [
        {
          name: "TEMAS",
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
        },
        {
          name: "Todos",
          value: "&type[]=eventos_cepei&type[]=gobernanzas&type[]=bibliotecas&type[]=datos"
        }
      ],
      fechas: [
        {
          name: "FECHAS",
          value: ""
        },
        {
          name: "Ascendente",
          value: "&order=asc",
        },
        {
          name: "Descendente",
          value: "&order=desc",
        }
      ],
      categorias: [
        {
          name: "Eventos",
          value: "?categories=325"
        },
        {
          name: "Gobernanza",
          value: "?categories=322"
        },
        {
          name: "Multimedia",
          value: "?categories=326"
        }
      ],
      temaSelected: "",
      imgSelected: "",
      tagSelected: "",
      fechaSelected: "",
      categorySelected: "",
      search: "",
      inCategory: false,
      title: "ARCHIVO"
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
        this.categorySelected = this.categorias[0].value
        this.inCategory = true
        return
      }

      if (this.getParameterByName("post_type") == "eventos_cepei") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[0].value
      }

      if (window.location.pathname == "/category/gobernanza-del-desarrollo/") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[1].value
        this.inCategory = true
        this.title = "ARCHIVO DE GOBERNANZA"
      }

      if (window.location.pathname == "/category/publicaciones-y-multimedia/") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[2].value
        this.inCategory = true
        this.title = "ARCHIVO DE MULTIMEDIA"
      }
        
    },
    showMore(pageNum) {
      this.updateData(this.url + 
                      this.categorySelected + 
                      "&page=" + pageNum +
                      this.consult.perPage +
                      this.fechaSelected +
                      this.tagSelected + 
                      this.temaSelected +
                      this.checkSearch() +
                      this.embed)
    },
    updateTags() {
      this.updateData(this.url + 
                      this.categorySelected + 
                      this.consult.page +
                      this.consult.perPage +
                      this.fechaSelected +
                      this.tagSelected + 
                      this.temaSelected +
                      this.checkSearch() +
                      this.embed)
      this.imgSelected = this.paisesIMG[this.tagSelected]
    },
    updateTemas() {
      this.updateData(this.url + 
                      this.categorySelected + 
                      this.consult.page +
                      this.consult.perPage +
                      this.fechaSelected +
                      this.tagSelected + 
                      this.temaSelected +
                      this.checkSearch() +
                      this.embed)
    },
    updateFechas() {
      this.updateData(this.url + 
                      this.categorySelected + 
                      this.consult.page +
                      this.consult.perPage +
                      this.fechaSelected +
                      this.tagSelected +
                      this.temaSelected +
                      this.checkSearch() +
                      this.embed)
    },
    searchTerm() {
      this.updateData(this.url + 
                      this.categorySelected + 
                      this.consult.page +
                      this.consult.perPage +
                      this.fechaSelected +
                      this.tagSelected + 
                      this.temaSelected +
                      this.checkSearch() +
                      this.embed)
    },
    checkSearch() {
      return this.search ? "&search=" + this.search : ""
    },
    updateData(url) {
      this.$http.get(url)
          .then(response => {
              this.posts = []

              for (let i = 0, l = response.data.length; i < l; i++) {
                  let data = {
                      title: response.data[i].title.rendered,
                      bg: response.data[i]._embedded["wp:featuredmedia"] && response.data[i]._embedded["wp:featuredmedia"][0].source_url,
                      content: response.data[i].excerpt.rendered,
                      link: response.data[i].link
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
      this.tagSelected = this.tags[0].value
      this.fechaSelected = this.fechas[0].value

      this.updateData(this.url + 
                      this.categorySelected + 
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

#archive .filter {
  background: #f2f2f2;
  border: 2px solid #BFBFBF;
}

#archive .filter img {
  width: 100%;
}

#archive .filter .label {
  display: inline-block;
}

</style>

