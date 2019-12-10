/*global axios */
/*global Vue */
var app = new Vue({
  el: '#voting',
  data: {
    products: [],
    product: '',
    price: '',
    url:'',
    ballot: [],
  },
  created: function() {
    this.getall();
  },
  methods: {
    addProduct() {
      console.log("In add Product")
      var url = "http://web.nathantannerallen.com:4204/voting";
      axios.post(url, {
          Name: this.product,
          price: this.price,
          url: this.url,
          votes: 0
        })
        .then(response => {
          console.log("Post Response ");
          console.log(response.data);
          this.products.push(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      console.log(this.products);
      this.product = "";
    },
    deleteproduct(product) {
      var index = this.products.indexOf(product);
      if (index > -1) {
        var url = "http://web.nathantannerallen.com:4204/voting/" + product._id;
        axios.delete(url)
          .then(response => {
            console.log(response.data.votes);
            this.getall();
          })
          .catch(e => {
            console.log(e);
          });
        console.log("URL " + url);
      }
    },
    upvote(product) {
      var url = "http://web.nathantannerallen.com:4204/voting/" + product._id + "/upvote";
      console.log("upvote URL " + url);
      axios.put(url)
        .then(response => {
          console.log(response.data.votes);
          product.votes = response.data.votes;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getall() {
      console.log("get all");
      var url = "http://web.nathantannerallen.com:4204/voting"; // This is the route we set up in index.js
      try {
        let response = await axios.get(url);
        this.products = response.data; // Assign array to returned response
        console.log(this.products);
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    dovote() {
      console.log("In Dovote");
      for(var product of this.products) {
        if (product.selected) {
          this.upvote(product);
          this.ballot.push(product);
        }
      }
    },
  }
});

