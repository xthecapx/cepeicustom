<template>
  <div id="archive" :class="{'category': inCategory}">
    <h3 class="section-title custom-blue">{{ title }}</h3>
    <div class="loader-custom" v-if="loading">Loading...</div>
    <div v-if="!loading" class="filter">
      <div class="label" v-if="!inCategory">
        FILTRAR POR:
      </div>
      <div class="label" v-if="inCategory">
        PALABRA CLAVE
      </div>
      <input type="text" v-model="search" v-if="inCategory">
      <div class="label" v-if="inCategory">
        FILTRAR POR:
      </div>
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
    <ul v-if="!loading" class="content-wrapper" :class="{'publicaciones': publicaciones}">
      <li v-for="(post, key) in posts" class="post">
        <div class="img-wrapper">
          <img :src="post.bg " alt="">
        </div>
        <a :href="post.link"><h3>{{post.title}}</h3></a>
        <div class="content" v-html="post.content"></div>
      </li>
    </ul>
    <div class="no-data" v-if="noData">
      <p>No se encontro información</p>
    </div>
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
      noData: false,
      posts: [],
      loading: false,
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
      imageURL: "/wp-content/themes/domino/img/map/",
      queryParams: "",
      filter: {
        page: 1
      },
      headers: {
        total: "X-WP-Total",
        totalPages: "X-WP-TotalPages"
      },
      tags: [
        { name: "PAISES", value: "" },
        { name: "Alemania", value: "&tags=338" },
        { name: "Chile", value: "&tags=339" },
        { name: "Colombia", value: "&tags=218" },
        { name: "Costa Rica", value: "&tags=340" },
        { name: "Dinamarca", value: "&tags=341" },
        { name: "EE-UU", value: "&tags=343" },
        { name: "El Salvador", value: "&tags=344" },
        { name: "Francia", value: "&tags=345" },
        { name: "Ghana", value: "&tags=346" },
        { name: "Guatemala", value: "&tags=347" },
        { name: "Italia", value: "&tags=348" },
        { name: "Kenia", value: "&tags=349" },
        { name: "Korea del Sur", value: "&tags=350" },
        { name: "Mexico", value: "&tags=351" },
        { name: "Panama", value: "&tags=352" },
        { name: "Peru", value: "&tags=353" },
        { name: "Reino Unido", value: "&tags=354" },
        { name: "Sudafria", value: "&tags=355" },
        { name: "Turquia", value: "&tags=356" },
        { name: "Uruguay", value: "&tags=357" }
      ],
      paisesIMG: {
        "&tags=218": "Colombia.png",
        "&tags=338": "Alemania.png",
        "&tags=339": "Chile.png",
        "&tags=340": "Costa-Rica.png",
        "&tags=341": "Dinamarca.png",
        "&tags=342": "EE-UU.png",
        "&tags=343": "Ecuador.png",
        "&tags=344": "El-Salvador.png",
        "&tags=345": "Francia.png",
        "&tags=346": "Ghana.png",
        "&tags=347": "Guatemala.png",
        "&tags=348": "Italia.png",
        "&tags=349": "kenia.png",
        "&tags=350": "Korea-del-Sur.png",
        "&tags=351": "Mexico.png",
        "&tags=352": "Panama.png",
        "&tags=353": "Peru.png",
        "&tags=354": "Reino-Unido.png",
        "&tags=355": "Sudafrica.png",
        "&tags=356": "Turquia.png",
        "&tags=357": "Uruguay.png"
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
          name: "Multimedia",
          value: "?categories=330"
        },
        {
          name: "Publicaciones",
          value: "?categories=332"
        },
        {
          name: "Infografías",
          value: "?categories=333"
        },
        {
          name: "Publicaciones y Multimedia",
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
      title: "ARCHIVO",
      publicaciones: false,
      urlTag: ""
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
        this.imageURL = "http://a3d.db3.myftpupload.com/wp-content/themes/domino/img/map/"
        this.headers = {
          total: "x-wp-total",
          totalPages: "x-wp-totalpages"
        }
        this.categorySelected = this.categorias[0].value
        this.inCategory = false
        return
      }

      if (this.getParameterByName("post_type") == "eventos_cepei") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[0].value
      }

      if (window.location.pathname == "/category/eventos/") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[0].value
        this.inCategory = true
        this.title = "ARCHIVO DE EVENTOS"
      }

      if (window.location.pathname == "/category/archivos-multimedia/") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[1].value
        this.inCategory = true
        this.title = "ARCHIVO DE MULTIMEDIA"
      }

      if (window.location.pathname == "/category/publicaciones/") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[2].value
        this.inCategory = true
        this.title = "ARCHIVO DE PUBLICACIONES"
        this.publicaciones = true
      }

      if (window.location.pathname == "/category/infografias/") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[3].value
        this.inCategory = true
        this.title = "ARCHIVO DE INFOGRAFIAS"
      }

      if (window.location.pathname == "/category/publicaciones-y-multimedia/") {
        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = this.categorias[4].value
        this.inCategory = true
        this.title = "ARCHIVO DE PUBLICACIONES Y MULTIMEDIA"
      }

      if (window.location.pathname == "/custom-search/") {
        let urlSearch = this.getParameterByName("term")
        let urlTag = this.getParameterByName("tags")

        this.url = "/wp-json/wp/v2/multiple-post-type"
        this.categorySelected = "?"
        this.inCategory = true
        this.title = "BUSQUEDA"

        if (urlSearch) {
          this.search = urlSearch
        }

        if (urlTag) {
          this.urlTag = "&tags=" + urlTag;
          console.log("The tag id: ", this.urlTag)
        }
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
                      this.embed);

      if (this.tagSelected != "PAISES") {
        this.imgSelected = this.imageURL + this.paisesIMG[this.tagSelected]
      } else {
        this.imgSelected = this.imageURL + this.paisesIMG["&tags=218"]
      }
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
      this.loading = true
      this.$http.get(url)
          .then(response => {
              if (response.data.length > 0) {
                this.posts = []

                for (let i = 0, l = response.data.length; i < l; i++) {
                    let data = {
                        title: response.data[i].title.rendered,
                        bg: response.data[i].better_featured_image && response.data[i].better_featured_image.media_details && response.data[i].better_featured_image.media_details.sizes.loop.source_url,
                        content: response.data[i].excerpt.rendered,
                        link: response.data[i].link
                    }

                    this.posts.push(data)
                    this.loading = false
                }

                let total = response.headers.map["X-WP-Total"] || response.headers.map["x-wp-total"];
                let totalPages = response.headers.map["X-WP-TotalPages"] || response.headers.map["x-wp-totalpages"];

                this.pagination['total'] = parseInt(total[0])
                this.pagination['totalpages'] = parseInt(totalPages[0])
              } else {
                this.loading = false
                this.noData = true
              }

          }, response => {
              // error callback
              console.log("e");
              this.loading = false
              this.noData = true
          });
    },
    viewport() {
        var e = window,
                a = 'inner';

        if ( !( 'innerWidth' in window ) ) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
    }
  },
  created() {
      this.defineUrl()
      this.imgSelected = this.imageURL + this.paisesIMG["&tags=218"]
      this.temaSelected = this.temas[0].value
      this.tagSelected = this.urlTag ? this.urlTag : this.tags[0].value
      this.fechaSelected = this.fechas[0].value

      if (this.viewport().width <= 980) {
        this.consult.perPage = "&per_page=3"
      }

      this.updateData(this.url +
                      this.categorySelected +
                      this.consult.page +
                      this.consult.perPage +
                      this.temaSelected +
                      this.checkSearch() +
                      this.tagSelected +
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
    overflow: hidden;
  }

  #archive .content-wrapper .post img {
    width: 100%;
    height: auto;
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

  .loader,
  .loader:before,
  .loader:after {
    border-radius: 50%;
  }
  .loader {
    color: #e84e1b;
    font-size: 11px;
    text-indent: -99999em;
    margin: 55px auto;
    position: relative;
    width: 10em;
    height: 10em;
    box-shadow: inset 0 0 0 1em;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .loader:before,
  .loader:after {
    position: absolute;
    content: '';
  }
  .loader:before {
    width: 5.2em;
    height: 10.2em;
    background: #f8fdff;
    border-radius: 10.2em 0 0 10.2em;
    top: -0.1em;
    left: -0.1em;
    -webkit-transform-origin: 5.2em 5.1em;
    transform-origin: 5.2em 5.1em;
    -webkit-animation: load2 2s infinite ease 1.5s;
    animation: load2 2s infinite ease 1.5s;
  }
  .loader:after {
    width: 5.2em;
    height: 10.2em;
    background: #f8fdff;
    border-radius: 0 10.2em 10.2em 0;
    top: -0.1em;
    left: 5.1em;
    -webkit-transform-origin: 0px 5.1em;
    transform-origin: 0px 5.1em;
    -webkit-animation: load2 2s infinite ease;
    animation: load2 2s infinite ease;
  }
  @-webkit-keyframes load2 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load2 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

</style>

