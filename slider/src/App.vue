<template>
<section id="home-slider">
    <article>
        <section class="entry-body">
            <h3 class="section-title">Destacados</h3>
            <div class="rotation-slider" :class="{'hide-custom': !activateFade}">
                <div
                    class="slide"
                    v-for="(post, key) in posts"
                    v-show="key <= 2"
                    :style="background(key)">
                    <div class="content">
                        <h3><a :href="post.link">{{ post.title }}</a></h3>
                        <div class="date">{{ post.date }}</div>
                        <div class="content" v-html="post.content"></div>
                    </div>
                </div>
                <button
                    class="flickity-prev-next-button previous"
                    type="button"
                    aria-label="previous"
                    @click="goBack(true)"><svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow"></path></svg></button>
                <button
                    class="flickity-prev-next-button next"
                    type="button"
                    aria-label="next"
                    @click="goNext(true)"><svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>

                <ol class="dots">
                    <li
                        v-for="(dot, key) in posts"
                        @click="centerArray(key)"
                        :key="key"
                        :class="{'active': active == 'key-' + key ? true : false}"></li>
                </ol>
            </div>
        </section>
        <div class="clearfix"></div>
    </article>
</section>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {
            posts: [],
            ordered: [],
            active: "key-0",
            key: 0,
            activateFade: true
        }
    },
    methods: {
        goBack(check) {
            let goBack = () => {
                this.posts.push(this.posts.shift())
            }

            if (check) {
              let index = parseInt(this.active.split("-")[1])

              if (index > 0) {
                index--
                this.active = 'key-' + index
              } else {
                let x = this.posts.length - 1
                this.active = 'key-' + x
              }
            }

            this.fadeEffect(goBack)
        },
        goNext(check) {
            let goNext = () => {
                this.posts.unshift(this.posts.pop())
            }

            if (check) {
              let index = parseInt(this.active.split("-")[1])

              if (index < this.posts.length - 1) {
                index++
                this.active = 'key-' + index
              } else {
                this.active = 'key-0'
              }
            }

            this.fadeEffect(goNext)
        },
        background(key) {
            if (this.posts[key].bg) {
                return {'background-image': "url('" + this.posts[key].bg +"')"}
            }
        },
        centerArray(key) {
            let centerArray = () => {
                this.posts = this.ordered.slice()
                this.active = 'key-' + key

                for (let i = 0; i < key; i++) {
                    this.goBack(false)
                }
            }

            this.fadeEffect(centerArray)

        },
        fadeEffect(callback) {
            this.activateFade = false
            this.callback = callback

            let myFunction = function () {
                this.activateFade = true
                this.callback();
            }.bind(this)

            setTimeout(myFunction, 500);
        },
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
                return "/api/wp-json/wp/v2/eventos_cepei?tags=331&_embed"
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
                    let bg = response.data[i] &&
                        response.data[i]._embedded["wp:featuredmedia"] &&
                        response.data[i]._embedded["wp:featuredmedia"][0].source_url &&
                        response.data[i]._embedded["wp:featuredmedia"][0].source_url;

                    let content = response.data[i] &&
                        response.data[i].excerpt &&
                        response.data[i].excerpt.rendered;

                    let data = {
                        title: response.data[i].title.rendered,
                        bg: bg,
                        link: response.data[i].link,
                        date: moment(response.data[i].date).format("MMMM DD, YYYY"),
                        content: content
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

<style>
    #home-slider .rotation-slider .slide:first-child {
        width: 70%;
        height: 400px;
        background: yellow;
        float: left;
    }

    #home-slider .rotation-slider .slide:nth-child(n+2) {
        width: 30%;
        height: 200px;
        float: right;
    }

    #home-slider .rotation-slider .slide:nth-child(2) {
        background: red;
    }

    #home-slider .rotation-slider .slide:nth-child(3) {
        background: green;
    }

    #home-slider .slide {
        transition: opacity .5s;
        opacity: 1;
    }

    #home-slider .hide-custom .slide {
        opacity: 0.2;
    }
</style>

