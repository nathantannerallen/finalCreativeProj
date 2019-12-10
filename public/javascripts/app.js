/*global axios */
/*global Vue */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

var app = new Vue({
  el: '#voting',
  data: {
    products: [],
    product: '',
    price: '',
    url: '',
    ballot: [],
    done: false,
    searchText: '',
    currentTicker: {
      price: '',
      revenue: '',
      revenueGrowth: '',
      COGS: '',
      NetIncome: '',
      NetProfitMargin: '',
      EPS: '',
    },
  },
  created: function() {
    this.getall();
  },
  methods: {
    async grabStockInfo() {
      console.log("inStockInfo");
      await this.grabPriceInfo();
      await this.grabIncomeInfo();
      this.done = true;
    },
    async grabPriceInfo() {
      console.log("inPriceInfo");
      try {
        const url = "https://financialmodelingprep.com/api/v3/stock/real-time-price/" + this.searchText;
        const response = await axios.get(url);
        console.log(response);
        this.currentTicker.price = formatter.format(response.data.price)
        console.log(this.currentTicker.price);
      }
      catch (error) {
        console.log(error);
      }
    },
    async grabIncomeInfo() {
      console.log("inIncomeInfo");
      try {
        const url = "https://financialmodelingprep.com/api/v3/financials/income-statement/" + this.searchText;
        const response = await axios.get(url);
        console.log(response);
        this.currentTicker.revenue = formatter.format(response.data.financials[0].Revenue)
        this.currentTicker.revenueGrowth = parseFloat(response.data.financials[0]["Revenue Growth"] * 100).toFixed(2) + "%"
        this.currentTicker.COGS = formatter.format(response.data.financials[0]["Cost of Revenue"])
        this.currentTicker.NetIncome = formatter.format(response.data.financials[0]["Net Income"])
        this.currentTicker.NetProfitMargin = parseFloat(response.data.financials[0]["Net Profit Margin"] * 100).toFixed(2) + "%"
        this.currentTicker.EPS = formatter.format(response.data.financials[0].EPS)

        console.log(this.currentTicker.revenue);
        console.log(this.currentTicker.revenueGrowth);
        console.log(this.currentTicker.COGS);
        console.log(this.currentTicker.NetIncome);
        console.log(this.currentTicker.NetProfitMargin);
        console.log(this.currentTicker.EPS);

      }
      catch (error) {
        console.log(error);
      }
    },
    addProduct() {
      console.log("In add Product")
      var url = "http://web.nathantannerallen.com:4202/voting";
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
        var url = "http://web.nathantannerallen.com:4202/voting/" + product._id;
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
      var url = "http://web.nathantannerallen.com:4202/voting/" + product._id + "/upvote";
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
      var url = "http://web.nathantannerallen.com:4202/voting"; // This is the route we set up in index.js
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
      for (var product of this.products) {
        if (product.selected) {
          this.upvote(product);
          this.ballot.push(product);
        }
      }
    },
  }
});
