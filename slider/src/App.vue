<template>
<section id="home-slider">
    <article>
        <section class="entry-body">
            <h3 class="section-title">Destacados</h3>
            <div class="rotation-slider">
                <div
                    class="slide"
                    v-for="(post, key) in posts"
                    v-show="key <= 2"
                    :style="background(key)">
                    <h3>{{ post.title }}</h3>
                    <div class="content" v-html="post.content"></div>
                </div>
                <button
                    class="flickity-prev-next-button previous"
                    type="button"
                    aria-label="previous"
                    @click="goBack"><svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow"></path></svg></button>
                <button
                    class="flickity-prev-next-button next"
                    type="button"
                    aria-label="next"
                    @click="goNext"><svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>
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
            posts: []
        }
    },
    methods: {
        goBack() {
            let temp = this.posts.shift();
            this.posts.push(temp);
        },
        goNext() {
            let temp = this.posts.pop()
            this.posts.unshift(temp);
        },
        background(key) {
            if (this.posts[key].bg) {
                return {'background-image': "url('" + this.posts[key].bg +"')"}
            }
        }
    },
    created() {
        this.$http.get('/api/wp-json/wp/v2/eventos_cepei?tags=331&_embed')
            .then(response => {
                for (let i = 0, l = response.data.length; i < l; i++) {
                    let data = {
                        title: response.data[i].title.rendered,
                        bg: response.data[i]._embedded["wp:featuredmedia"] && response.data[i]._embedded["wp:featuredmedia"][0].source_url,
                        content: response.data[i].excerpt.rendered
                    }
                    this.posts.push(data)
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
</style>

