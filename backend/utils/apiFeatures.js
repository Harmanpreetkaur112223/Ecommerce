export default class ApiFeatures{
    constructor(query , queryStr)
    {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        let keyword = this.queryStr.keyword ? {
          name:{
            $regex:this.queryStr.keyword,
            $options:'i'
          }  
        }:{}
        console.log(keyword)
        this.query = this.query.find({...keyword})
        return this;
    }

    filter(){
      let queryCopy = {...this.queryStr};
      let removeFields = ['keyword','page','limit'];
      removeFields.forEach(element => {
        delete queryCopy[element]
      });
      // for filter as price and ratings
      let newqueryStr = JSON.stringify(queryCopy)
      // console.log(newqueryStr)
      // console.log(queryCopy)
      newqueryStr = newqueryStr.replace(/\b(lt|lte|gt|gte)\b/g,(val)=>`$${val}`)
      // console.log(newqueryStr)
      
      this.query = this.query.find(JSON.parse(newqueryStr));
      // console.log(newqueryStr)
      return this;
    }

    pagination(resultPerPage){
      let currentPage = Number(this.queryStr.page)||1;
      let skip = resultPerPage*(currentPage-1);
      this.query = this.query.limit(resultPerPage).skip(skip)
      return this

    }
}